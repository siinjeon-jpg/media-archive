import Link from "next/link";

import { primaryButtonClassName, shellCardClass } from "@/lib/media-config";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center">
      <section className={`${shellCardClass} w-full p-8 text-center`}>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">찾을 수 없어요</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          이 기록은 아카이브에서 보이지 않네요
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted">
          찾는 페이지가 없거나 아직 기록이 만들어지지 않았어요.
        </p>
        <div className="mt-6">
          <Link href="/archive" className={primaryButtonClassName}>
            아카이브로 돌아가기
          </Link>
        </div>
      </section>
    </div>
  );
}
