import Link from "next/link";

import { primaryButtonClassName, shellCardClass } from "@/lib/media-config";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center">
      <section className={`${shellCardClass} w-full p-8 text-center`}>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">찾을 수 없어요</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted">
          요청한 기록이 없거나 이미 삭제되었어요.
        </p>
        <div className="mt-6">
          <Link href="/archive" className={primaryButtonClassName}>
            아카이브로 이동
          </Link>
        </div>
      </section>
    </div>
  );
}
