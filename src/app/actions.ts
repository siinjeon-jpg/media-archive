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
const passwordSchema = z.string().min(6, "비밀번호는 6자 이상 입력해 주세요.");
const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "비밀번호를 입력해 주세요.")
});
const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해 주세요.")
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "비밀번호가 서로 다릅니다.",
        path: ["confirmPassword"]
      });
    }
  });

function redirectWithError(path: string, message: string): never {
  const divider = path.includes("?") ? "&" : "?";
  redirect(`${path}${divider}error=${encodeURIComponent(message)}`);
}

function redirectLoginError(message: string): never {
  redirect(`/login?error=${encodeURIComponent(message)}`);
}

function redirectLoginMessage(message: string): never {
  redirect(`/login?message=${encodeURIComponent(message)}`);
}

function getAuthRedirectUrl() {
  const origin = headers().get("origin");

  return process.env.NODE_ENV !== "production" ? getSiteUrl() : origin || getSiteUrl();
}

function mapAuthErrorMessage(errorMessage: string, fallback: string) {
  const normalized = errorMessage.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호를 확인해 주세요.";
  }

  if (normalized.includes("email not confirmed")) {
    return "이메일 인증을 먼저 완료해 주세요.";
  }

  if (normalized.includes("user already registered")) {
    return "이미 가입된 이메일입니다. 로그인해 주세요.";
  }

  if (
    normalized.includes("password should be at least") ||
    normalized.includes("password is too short")
  ) {
    return "비밀번호는 6자 이상 입력해 주세요.";
  }

  if (normalized.includes("signup is disabled")) {
    return "현재 회원가입을 사용할 수 없어요.";
  }

  return fallback;
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
    redirectLoginError("기록을 저장하려면 로그인해 주세요.");
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
    redirectLoginError("기록을 삭제하려면 로그인해 주세요.");
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

export async function signInWithPasswordAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirectLoginError("Supabase 환경 변수를 먼저 설정해 주세요.");
  }

  const parsed = signInSchema.safeParse({
    email: sanitizeText(formData.get("email")),
    password: sanitizeText(formData.get("password"))
  });

  if (!parsed.success) {
    redirectLoginError(
      parsed.error.issues[0]?.message ?? "입력한 내용을 다시 확인해 주세요."
    );
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (error) {
    redirectLoginError(
      mapAuthErrorMessage(
        error.message,
        "로그인하지 못했어요. 이메일과 비밀번호를 확인해 주세요."
      )
    );
  }

  redirect("/dashboard");
}

export async function signUpWithPasswordAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirectLoginError("Supabase 환경 변수를 먼저 설정해 주세요.");
  }

  const parsed = signUpSchema.safeParse({
    email: sanitizeText(formData.get("email")),
    password: sanitizeText(formData.get("password")),
    confirmPassword: sanitizeText(formData.get("confirmPassword"))
  });

  if (!parsed.success) {
    redirectLoginError(
      parsed.error.issues[0]?.message ?? "입력한 내용을 다시 확인해 주세요."
    );
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${getAuthRedirectUrl()}/auth/callback?next=/dashboard`
    }
  });

  if (error) {
    redirectLoginError(
      mapAuthErrorMessage(
        error.message,
        "회원가입을 완료하지 못했어요. 잠시 후 다시 시도해 주세요."
      )
    );
  }

  if (Array.isArray(data.user?.identities) && data.user.identities.length === 0) {
    redirectLoginError("이미 가입된 이메일입니다. 로그인해 주세요.");
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirectLoginMessage("가입 확인 메일을 보냈어요. 메일 인증 후 로그인해 주세요.");
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
