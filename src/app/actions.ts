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
  title: z.string().min(1, "제목을 입력해 주세요."),
  category: z.enum(CATEGORIES),
  status: z.enum(STATUSES),
  rating: z.number().int().min(1).max(10).nullable(),
  review: z.string().max(180, "한 줄 감상은 180자 이내로 적어 주세요."),
  memo: z.string(),
  tags: z.array(z.string()).max(20, "태그가 너무 많아요."),
  country: z.string().max(60, "국가 이름은 짧게 적어 주세요."),
  consumedOn: z.string().optional(),
  isWishlist: z.boolean()
});

const emailSchema = z.string().email("올바른 이메일 주소를 입력해 주세요.");

function redirectWithError(path: string, message: string): never {
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
      "아직 Supabase가 설정되지 않았어요. 저장 기능을 쓰려면 환경 변수를 먼저 추가해 주세요."
    );
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent("기록을 저장하려면 로그인해 주세요.")}`
    );
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
      parsed.error.issues[0]?.message ?? "입력한 내용을 다시 확인해 주세요."
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
    redirectWithError(returnTo, "기록을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
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
    redirectWithError(returnTo, "기록 정보가 올바르지 않아요.");
  }

  if (!isSupabaseConfigured()) {
    redirectWithError(
      returnTo,
      "아직 Supabase가 설정되지 않았어요. 삭제 기능을 쓰려면 먼저 연결해 주세요."
    );
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent("기록을 삭제하려면 로그인해 주세요.")}`
    );
  }

  const { error } = await supabase
    .from("media_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) {
    redirectWithError(returnTo, "기록을 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
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
      `/login?error=${encodeURIComponent(
        "Supabase 환경 변수를 먼저 설정해 주세요."
      )}`
    );
  }

  const emailResult = emailSchema.safeParse(sanitizeText(formData.get("email")));

  if (!emailResult.success) {
    redirect(
      `/login?error=${encodeURIComponent(
        emailResult.error.issues[0]?.message ?? "올바른 이메일 주소를 입력해 주세요."
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
    redirect(
      `/login?error=${encodeURIComponent(
        "매직 링크를 보내지 못했어요. 잠시 후 다시 시도해 주세요."
      )}`
    );
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
