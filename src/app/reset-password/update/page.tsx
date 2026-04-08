import Link from "next/link";

import { updatePasswordAction } from "@/app/actions";
import {
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  shellCardClass
} from "@/lib/media-config";
import { getViewerContext } from "@/lib/data";
import { getFirstParam } from "@/lib/utils";

export default async function UpdatePasswordPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const viewer = await getViewerContext();
  const error = getFirstParam(searchParams?.error);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center">
      <section className={`${shellCardClass} w-full p-8 md:p-10`}>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">
          비밀번호 재설정
        </p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          새 비밀번호 설정
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
          새 비밀번호를 입력하면 바로 계정에 적용됩니다.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        {viewer.user ? (
          <form action={updatePasswordAction} className="mt-8 space-y-5">
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-muted">
                새 비밀번호
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
                새 비밀번호 확인
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

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className={primaryButtonClassName}>
                비밀번호 변경
              </button>
              <Link href="/dashboard" className={secondaryButtonClassName}>
                대시보드로 이동
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4 text-sm leading-7 text-muted">
              재설정 링크를 통해 들어오지 않았다면 먼저 메일을 요청해 주세요.
            </div>
            <Link href="/reset-password" className={primaryButtonClassName}>
              재설정 메일 다시 받기
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
