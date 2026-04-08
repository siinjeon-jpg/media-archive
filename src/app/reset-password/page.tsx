import Link from "next/link";
import { redirect } from "next/navigation";

import { requestPasswordResetAction } from "@/app/actions";
import {
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  shellCardClass
} from "@/lib/media-config";
import { getViewerContext } from "@/lib/data";
import { getFirstParam } from "@/lib/utils";

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const viewer = await getViewerContext();
  const error = getFirstParam(searchParams?.error);
  const message = getFirstParam(searchParams?.message);
  const email = getFirstParam(searchParams?.email) ?? "";

  if (viewer.user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center">
      <section className={`${shellCardClass} w-full p-8 md:p-10`}>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">
          비밀번호 재설정
        </p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          재설정 메일 보내기
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
          가입한 이메일을 입력해 주세요. 계정이 있다면 비밀번호를 다시 설정할 수 있는 링크를 보내드릴게요.
        </p>

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

        <form action={requestPasswordResetAction} className="mt-8 space-y-5">
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
              defaultValue={email}
              className={inputClassName}
              placeholder="name@example.com"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className={primaryButtonClassName}>
              재설정 메일 보내기
            </button>
            <Link href="/login" className={secondaryButtonClassName}>
              로그인으로 돌아가기
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
