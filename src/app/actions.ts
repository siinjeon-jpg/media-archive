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
const resetPasswordSchema = z.object({
  email: emailSchema
});
const updatePasswordSchema = z
  .object({
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

type AuthMode = "signin" | "signup";
type AuthErrorContext = "signin" | "signup" | "reset-request" | "reset-update";

function setOptionalEmail(
  params: URLSearchParams,
  email: string | undefined
) {
  if (email) {
    params.set("email", email);
  }
}

function getLoginPath(
  mode: AuthMode,
  key: "error" | "message",
  value: string,
  email?: string
) {
  const params = new URLSearchParams();

  if (mode === "signup") {
    params.set("mode", "signup");
  }

  params.set(key, value);
  setOptionalEmail(params, email);
  return `/login?${params.toString()}`;
}

function redirectLoginError(
  message: string,
  mode: AuthMode = "signin",
  email?: string
): never {
  redirect(getLoginPath(mode, "error", message, email));
}

function redirectLoginMessage(
  message: string,
  mode: AuthMode = "signin",
  email?: string
): never {
  redirect(getLoginPath(mode, "message", message, email));
}

function getResetRequestPath(
  key: "error" | "message",
  value: string,
  email?: string
) {
  const params = new URLSearchParams([[key, value]]);
  setOptionalEmail(params, email);
  return `/reset-password?${params.toString()}`;
}

function redirectResetRequestError(message: string, email?: string): never {
  redirect(getResetRequestPath("error", message, email));
}

function redirectResetRequestMessage(message: string, email?: string): never {
  redirect(getResetRequestPath("message", message, email));
}

function redirectResetUpdateError(message: string): never {
  redirect(`/reset-password/update?error=${encodeURIComponent(message)}`);
}

function getAuthRedirectUrl() {
  const origin = headers().get("origin");

  return process.env.NODE_ENV !== "production" ? getSiteUrl() : origin || getSiteUrl();
}

function mapAuthErrorMessage(
  errorMessage: string,
  context: AuthErrorContext
) {
  const normalized = errorMessage.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 맞지 않아요. 비밀번호가 기억나지 않으면 재설정을 이용해 주세요.";
  }

  if (normalized.includes("email not confirmed")) {
    return "이메일 인증이 아직 끝나지 않았어요. 메일함의 인증 링크를 확인해 주세요.";
  }

  if (
    normalized.includes("user already registered") ||
    normalized.includes("already been registered")
  ) {
    return "이미 가입된 이메일입니다. 로그인하거나 비밀번호 재설정을 이용해 주세요.";
  }

  if (
    normalized.includes("password should be at least") ||
    normalized.includes("password is too short") ||
    normalized.includes("weak password") ||
    normalized.includes("password length")
  ) {
    return "비밀번호는 6자 이상 입력해 주세요.";
  }

  if (normalized.includes("same password")) {
    return "이전과 다른 새 비밀번호를 입력해 주세요.";
  }

  if (normalized.includes("signup is disabled")) {
    return "현재 회원가입을 사용할 수 없어요.";
  }

  if (
    normalized.includes("rate limit") ||
    normalized.includes("too many requests") ||
    normalized.includes("over_email_send_rate_limit") ||
    normalized.includes("security purposes")
  ) {
    return context === "reset-request"
      ? "요청이 많아 재설정 메일을 바로 보낼 수 없어요. 잠시 후 다시 시도해 주세요."
      : "요청이 많아요. 잠시 후 다시 시도해 주세요.";
  }

  if (
    normalized.includes("failed to fetch") ||
    normalized.includes("network") ||
    normalized.includes("timeout") ||
    normalized.includes("unexpected_failure") ||
    normalized.includes("server error")
  ) {
    return "일시적인 문제가 발생했어요. 잠시 후 다시 시도해 주세요.";
  }

  if (context === "reset-request") {
    return "재설정 메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  if (context === "reset-update") {
    return "비밀번호를 변경하지 못했어요. 다시 시도해 주세요.";
  }

  if (context === "signup") {
    return "회원가입을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  return "로그인하지 못했어요. 잠시 후 다시 시도해 주세요.";
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
  const email = sanitizeText(formData.get("email"));

  if (!isSupabaseConfigured()) {
    redirectLoginError("Supabase 환경 변수를 먼저 설정해 주세요.", "signin", email);
  }

  const parsed = signInSchema.safeParse({
    email,
    password: sanitizeText(formData.get("password"))
  });

  if (!parsed.success) {
    redirectLoginError(
      parsed.error.issues[0]?.message ?? "입력한 내용을 다시 확인해 주세요.",
      "signin",
      email
    );
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (error) {
    redirectLoginError(
      mapAuthErrorMessage(error.message, "signin"),
      "signin",
      parsed.data.email
    );
  }

  redirect("/dashboard");
}

export async function signUpWithPasswordAction(formData: FormData) {
  const email = sanitizeText(formData.get("email"));

  if (!isSupabaseConfigured()) {
    redirectLoginError("Supabase 환경 변수를 먼저 설정해 주세요.", "signup", email);
  }

  const parsed = signUpSchema.safeParse({
    email,
    password: sanitizeText(formData.get("password")),
    confirmPassword: sanitizeText(formData.get("confirmPassword"))
  });

  if (!parsed.success) {
    redirectLoginError(
      parsed.error.issues[0]?.message ?? "입력한 내용을 다시 확인해 주세요.",
      "signup",
      email
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
      mapAuthErrorMessage(error.message, "signup"),
      "signup",
      parsed.data.email
    );
  }

  if (Array.isArray(data.user?.identities) && data.user.identities.length === 0) {
    redirectLoginError(
      "이미 가입된 이메일입니다. 로그인하거나 비밀번호 재설정을 이용해 주세요.",
      "signup",
      parsed.data.email
    );
  }

  if (data.session) {
    redirect("/dashboard");
  }

  redirectLoginMessage(
    "가입 확인 메일을 보냈어요. 메일 인증 후 로그인해 주세요.",
    "signup",
    parsed.data.email
  );
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = sanitizeText(formData.get("email"));

  if (!isSupabaseConfigured()) {
    redirectResetRequestError("Supabase 환경 변수를 먼저 설정해 주세요.", email);
  }

  const parsed = resetPasswordSchema.safeParse({
    email
  });

  if (!parsed.success) {
    redirectResetRequestError(
      parsed.error.issues[0]?.message ?? "올바른 이메일 주소를 입력해 주세요.",
      email
    );
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getAuthRedirectUrl()}/auth/callback?next=/reset-password/update`
  });

  if (error) {
    redirectResetRequestError(
      mapAuthErrorMessage(error.message, "reset-request"),
      parsed.data.email
    );
  }

  redirectResetRequestMessage(
    "재설정 메일을 보냈어요. 가입된 계정이 있다면 메일을 확인해 주세요.",
    parsed.data.email
  );
}

export async function updatePasswordAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirectResetUpdateError("Supabase 환경 변수를 먼저 설정해 주세요.");
  }

  const parsed = updatePasswordSchema.safeParse({
    password: sanitizeText(formData.get("password")),
    confirmPassword: sanitizeText(formData.get("confirmPassword"))
  });

  if (!parsed.success) {
    redirectResetUpdateError(
      parsed.error.issues[0]?.message ?? "입력한 내용을 다시 확인해 주세요."
    );
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirectResetUpdateError("재설정 링크가 유효하지 않아요. 메일을 다시 요청해 주세요.");
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password
  });

  if (error) {
    redirectResetUpdateError(mapAuthErrorMessage(error.message, "reset-update"));
  }

  redirect(
    `/dashboard?message=${encodeURIComponent("비밀번호를 변경했어요.")}`
  );
}

export async function signOutAction() {
  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  redirect("/");
}
