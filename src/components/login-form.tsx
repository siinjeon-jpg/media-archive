"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  inputClassName,
  primaryButtonClassName
} from "@/lib/media-config";
import { getBrowserSupabaseClient } from "@/lib/supabase/browser";

type AuthMode = "signin" | "signup";

function mapErrorMessage(message: string, mode: AuthMode) {
  const normalized = message.toLowerCase();

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
    normalized.includes("weak password")
  ) {
    return "비밀번호는 6자 이상 입력해 주세요.";
  }

  if (
    normalized.includes("rate limit") ||
    normalized.includes("too many requests") ||
    normalized.includes("over_email_send_rate_limit") ||
    normalized.includes("security purposes")
  ) {
    return mode === "signup"
      ? "요청이 많아 지금은 가입을 바로 진행할 수 없어요. 잠시 후 다시 시도해 주세요."
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

  return mode === "signup"
    ? "회원가입을 완료하지 못했어요. 잠시 후 다시 시도해 주세요."
    : "로그인하지 못했어요. 잠시 후 다시 시도해 주세요.";
}

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isSignUp = mode === "signup";
  const resetHref = email
    ? `/reset-password?email=${encodeURIComponent(email)}`
    : "/reset-password";

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    setMessage(null);
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      setError("Supabase 환경 변수가 설정되지 않았습니다.");
      return;
    }

    if (isSignUp && password.length < 6) {
      setError("비밀번호는 6자 이상 입력해 주세요.");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("비밀번호가 서로 다릅니다.");
      return;
    }

    setIsSubmitting(true);

    const supabase = getBrowserSupabaseClient();

    if (isSignUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
        }
      });

      if (signUpError) {
        setError(mapErrorMessage(signUpError.message, "signup"));
        setIsSubmitting(false);
        return;
      }

      if (Array.isArray(data.user?.identities) && data.user.identities.length === 0) {
        setError("이미 가입된 이메일입니다. 로그인하거나 비밀번호 재설정을 이용해 주세요.");
        setIsSubmitting(false);
        return;
      }

      if (data.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setMessage("가입 확인 메일을 보냈어요. 메일 인증 후 로그인해 주세요.");
      setMode("signin");
      setPassword("");
      setConfirmPassword("");
      setIsSubmitting(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      setError(mapErrorMessage(signInError.message, "signin"));
      setIsSubmitting(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <div className="inline-flex rounded-full border border-border/40 bg-black/10 p-1">
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={
            isSignUp
              ? "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-muted transition hover:text-foreground"
              : "inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-slate-950"
          }
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={
            isSignUp
              ? "inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-slate-950"
              : "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-muted transition hover:text-foreground"
          }
        >
          회원가입
        </button>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-2xl text-foreground md:text-3xl">
          {isSignUp ? "새 계정 만들기" : "로그인"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-muted">
          {isSignUp
            ? "이메일과 비밀번호만 입력하면 바로 시작할 수 있어요."
            : "가입한 이메일과 비밀번호를 입력해 주세요."}
        </p>
      </div>

      {message ? (
        <p className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">
            이메일 주소
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClassName}
            placeholder="name@example.com"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">
            비밀번호
          </span>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClassName}
            placeholder={isSignUp ? "6자 이상" : "비밀번호"}
          />
        </label>

        {isSignUp ? (
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-muted">
              비밀번호 확인
            </span>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={inputClassName}
              placeholder="비밀번호 다시 입력"
            />
          </label>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${primaryButtonClassName} w-full`}
        >
          {isSubmitting
            ? isSignUp
              ? "가입 중..."
              : "로그인 중..."
            : isSignUp
              ? "회원가입"
              : "로그인"}
        </button>
      </form>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
        {isSignUp ? (
          <>
            <span>이미 계정이 있나요?</span>
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="font-medium text-foreground transition hover:text-cyan-100"
            >
              로그인
            </button>
          </>
        ) : (
          <>
            <span>비밀번호가 기억나지 않나요?</span>
            <Link
              href={resetHref}
              className="font-medium text-foreground transition hover:text-cyan-100"
            >
              비밀번호 재설정
            </Link>
          </>
        )}
        <span className="text-muted/60">·</span>
        <button
          type="button"
          onClick={() => switchMode(isSignUp ? "signin" : "signup")}
          className="transition hover:text-foreground"
        >
          {isSignUp ? "로그인으로 돌아가기" : "새 계정 만들기"}
        </button>
      </div>
    </div>
  );
}
