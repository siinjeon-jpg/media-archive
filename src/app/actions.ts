"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createServerSupabaseClient,
  getSiteUrl,
  isSupabaseConfigured
} from "@/lib/supabase/server";
import { CATEGORIES, STATUSES } from "@/lib/types";
import { parseCommaSeparatedList, sanitizeText, toSlug } from "@/lib/utils";

const entrySchema = z.object({
  title: z.string().min(1, "Title is required."),
  category: z.enum(CATEGORIES),
  status: z.enum(STATUSES),
  rating: z.number().int().min(1).max(10).nullable(),
  review: z.string().max(180, "One-line review should stay under 180 characters."),
  memo: z.string(),
  tags: z.array(z.string()).max(20, "Too many tags."),
  country: z.string().max(60, "Country should stay concise."),
  consumedOn: z.string().optional(),
  isWishlist: z.boolean()
});

const emailSchema = z.string().email("Enter a valid email address.");

function redirectWithError(path: string, message: string) {
  const divider = path.includes("?") ? "&" : "?";
  redirect(`${path}${divider}error=${encodeURIComponent(message)}`);
}

async function createUniqueSlug(
  userId: string,
  baseSlug: string,
  entryId?: string
) {
  const supabase = createServerSupabaseClient();
  const normalizedBase = baseSlug || "untitled-entry";
  let attempt = normalizedBase;
  let suffix = 2;

  while (true) {
    let query = supabase
      .from("media_entries")
      .select("id")
      .eq("user_id", userId)
      .eq("slug", attempt)
      .limit(1);

    if (entryId) {
      query = query.neq("id", entryId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return attempt;
    }

    attempt = `${normalizedBase}-${suffix}`;
    suffix += 1;
  }
}

export async function saveEntryAction(formData: FormData) {
  const returnTo = sanitizeText(formData.get("returnTo")) || "/archive/new";

  if (!isSupabaseConfigured()) {
    redirectWithError(
      returnTo,
      "Supabase is not configured yet. Add your environment variables to enable saving."
    );
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=Sign%20in%20to%20save%20entries.");
  }

  const rawRating = sanitizeText(formData.get("rating"));
  const parsed = entrySchema.safeParse({
    title: sanitizeText(formData.get("title")),
    category: sanitizeText(formData.get("category")),
    status: sanitizeText(formData.get("status")),
    rating: rawRating ? Number(rawRating) : null,
    review: sanitizeText(formData.get("review")),
    memo: sanitizeText(formData.get("memo")),
    tags: parseCommaSeparatedList(sanitizeText(formData.get("tags"))),
    country: sanitizeText(formData.get("country")),
    consumedOn: sanitizeText(formData.get("consumedOn")) || undefined,
    isWishlist: formData.get("isWishlist") === "on"
  });

  if (!parsed.success) {
    redirectWithError(
      returnTo,
      parsed.error.issues[0]?.message ?? "Please check the form and try again."
    );
  }

  const entryId = sanitizeText(formData.get("entryId")) || undefined;
  const currentSlug = sanitizeText(formData.get("currentSlug"));
  const slug = await createUniqueSlug(user.id, toSlug(parsed.data.title), entryId);
  const timestamp = new Date().toISOString();

  const payload = {
    user_id: user.id,
    title: parsed.data.title,
    slug,
    category: parsed.data.category,
    status: parsed.data.status,
    rating: parsed.data.rating,
    review: parsed.data.review,
    memo: parsed.data.memo,
    tags: parsed.data.tags,
    country: parsed.data.country,
    consumed_on: parsed.data.consumedOn ?? null,
    is_wishlist: parsed.data.isWishlist,
    updated_at: timestamp
  };

  const result = entryId
    ? await supabase
        .from("media_entries")
        .update(payload)
        .eq("id", entryId)
        .eq("user_id", user.id)
    : await supabase.from("media_entries").insert({
        ...payload,
        created_at: timestamp
      });

  if (result.error) {
    redirectWithError(returnTo, result.error.message);
  }

  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/dashboard");
  revalidatePath("/wishlist");
  revalidatePath(`/archive/${currentSlug || slug}`);
  revalidatePath(`/archive/${slug}`);

  redirect(`/archive/${slug}?saved=1`);
}

export async function deleteEntryAction(formData: FormData) {
  const entryId = sanitizeText(formData.get("entryId"));
  const returnTo = sanitizeText(formData.get("returnTo")) || "/archive";

  if (!entryId) {
    redirectWithError(returnTo, "The entry id is missing.");
  }

  if (!isSupabaseConfigured()) {
    redirectWithError(
      returnTo,
      "Supabase is not configured yet. Connect it first to enable deletion."
    );
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=Sign%20in%20to%20delete%20entries.");
  }

  const { error } = await supabase
    .from("media_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) {
    redirectWithError(returnTo, error.message);
  }

  revalidatePath("/");
  revalidatePath("/archive");
  revalidatePath("/dashboard");
  revalidatePath("/wishlist");
  redirect("/archive?deleted=1");
}

export async function requestMagicLinkAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(
      "/login?error=Configure%20your%20Supabase%20environment%20variables%20first."
    );
  }

  const emailResult = emailSchema.safeParse(sanitizeText(formData.get("email")));

  if (!emailResult.success) {
    redirect(
      `/login?error=${encodeURIComponent(
        emailResult.error.issues[0]?.message ?? "Enter a valid email address."
      )}`
    );
  }

  const supabase = createServerSupabaseClient();
  const origin = headers().get("origin");
  const siteUrl =
    process.env.NODE_ENV !== "production"
      ? getSiteUrl()
      : origin || getSiteUrl();

  const { error } = await supabase.auth.signInWithOtp({
    email: emailResult.data,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`
    }
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?sent=1");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
