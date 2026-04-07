import { redirect } from "next/navigation";

import { requestMagicLinkAction } from "@/app/actions";
import {
  inputClassName,
  primaryButtonClassName,
  shellCardClass
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
  const sent = getFirstParam(searchParams?.sent);

  if (viewer.user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center">
      <section className={`${shellCardClass} w-full p-8 md:p-10`}>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">
          Supabase 로그인
        </p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          매직 링크로 로그인
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
          이메일 로그인으로 나만의 아카이브를 열고, 기록 저장과 추가, 수정,
          삭제 기능을 모두 사용할 수 있어요.
        </p>

        {sent ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            매직 링크를 보냈어요. 메일함에서 링크를 눌러 다시 돌아와 주세요.
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <form action={requestMagicLinkAction} className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.24em] text-muted">
              이메일 주소
            </span>
            <input
              type="email"
              name="email"
              required
              className={inputClassName}
              placeholder="name@example.com"
            />
          </label>

          <button type="submit" className={primaryButtonClassName}>
            매직 링크 보내기
          </button>
        </form>
      </section>
    </div>
  );
}
