import Link from "next/link";
import { redirect } from "next/navigation";

import {
  primaryButtonClassName,
  secondaryButtonClassName,
  shellCardClass,
  subtleCardClass
} from "@/lib/media-config";
import { getViewerContext } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const viewer = await getViewerContext();

  if (viewer.user) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <section
        className={`${shellCardClass} relative overflow-hidden px-8 py-14 sm:px-12 sm:py-16`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/16 via-transparent to-rose-300/10" />
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-rose-400/10 blur-3xl" />

        <div className="relative max-w-3xl animate-fade-rise">
          <p className="text-xs uppercase tracking-[0.28em] text-muted">
            개인 미디어 아카이브
          </p>
          <h1 className="mt-5 font-display text-5xl text-foreground sm:text-7xl">
            애프터테이스트 아카이브
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            애니, 만화, 영화, 드라마, 소설을 한곳에 정리하는 개인 미디어
            아카이브입니다. 평점, 짧은 감상, 메모와 태그를 차분하게 남길 수
            있어요.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {["애니", "만화", "영화", "드라마", "소설"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/archive" className={`${primaryButtonClassName} min-w-36`}>
              아카이브 둘러보기
            </Link>
            <Link href="/login" className={`${secondaryButtonClassName} min-w-36`}>
              로그인
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <article className={`${subtleCardClass} p-6`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">기록</p>
          <h2 className="mt-3 font-display text-3xl text-foreground">
            좋아한 작품을 한곳에
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            제목과 평점, 짧은 감상과 메모를 남기며 취향의 흐름을 정리할 수 있어요.
          </p>
        </article>

        <article className={`${subtleCardClass} p-6`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">
            위시리스트
          </p>
          <h2 className="mt-3 font-display text-3xl text-foreground">
            다음 작품도 가볍게 저장
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            나중에 보고 싶은 작품을 따로 모아두고, 아카이브와 자연스럽게 이어서
            관리할 수 있어요.
          </p>
        </article>

        <article className={`${subtleCardClass} p-6`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">통계</p>
          <h2 className="mt-3 font-display text-3xl text-foreground">
            기록의 흐름을 한눈에
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            카테고리와 월별 기록, 자주 남긴 태그를 통해 취향의 패턴을 편하게 볼
            수 있어요.
          </p>
        </article>
      </section>
    </div>
  );
}
