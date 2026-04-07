import { redirect } from "next/navigation";

import {
  signInWithPasswordAction,
  signUpWithPasswordAction
} from "@/app/actions";
import {
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  shellCardClass,
  subtleCardClass
} from "@/lib/media-config";
import { getViewerContext } from "@/lib/data";
import { getFirstParam } from "@/lib/utils";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const viewer = await getViewerContext();
  const error = getFirstParam(searchParams?.error);
  const message = getFirstParam(searchParams?.message);

  if (viewer.user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center">
      <section className={`${shellCardClass} w-full p-8 md:p-10`}>
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">계정</p>
          <h1 className="mt-3 font-display text-5xl text-foreground">
            로그인 또는 회원가입
          </h1>
          <p className="mt-4 text-base leading-8 text-muted">
            이메일과 비밀번호로 내 아카이브를 이어서 사용할 수 있어요.
          </p>
        </div>

        {message ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className={`${subtleCardClass} p-6`}>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">로그인</p>
              <h2 className="mt-2 font-display text-3xl text-foreground">
                기존 계정으로 계속하기
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                가입한 이메일과 비밀번호를 입력해 주세요.
              </p>
            </div>

            <form action={signInWithPasswordAction} className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.24em] text-muted">
                  이메일 주소
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
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
                  autoComplete="current-password"
                  className={inputClassName}
                  placeholder="비밀번호"
                />
              </label>

              <button type="submit" className={`${primaryButtonClassName} w-full`}>
                로그인
              </button>
            </form>
          </section>

          <section className={`${subtleCardClass} p-6`}>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">회원가입</p>
              <h2 className="mt-2 font-display text-3xl text-foreground">
                새 계정 만들기
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                가입 후 바로 로그인되거나, 설정에 따라 메일 인증이 필요할 수 있어요.
              </p>
            </div>

            <form action={signUpWithPasswordAction} className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.24em] text-muted">
                  이메일 주소
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
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
                  autoComplete="new-password"
                  className={inputClassName}
                  placeholder="6자 이상"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs uppercase tracking-[0.24em] text-muted">
                  비밀번호 확인
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  className={inputClassName}
                  placeholder="비밀번호 다시 입력"
                />
              </label>

              <button type="submit" className={`${secondaryButtonClassName} w-full`}>
                회원가입
              </button>
            </form>
          </section>
        </div>
      </section>
    </div>
  );
}
