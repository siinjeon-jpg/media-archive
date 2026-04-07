import Link from "next/link";

import { MediaCard } from "@/components/media-card";
import {
  primaryButtonClassName,
  secondaryButtonClassName,
  shellCardClass,
  subtleCardClass
} from "@/lib/media-config";
import { getArchiveData } from "@/lib/data";

export default async function HomePage() {
  const { entries, summary } = await getArchiveData();
  const recentEntries = summary.recentEntries.slice(0, 3);
  const wishlistPreview = entries.filter((entry) => entry.isWishlist).slice(0, 3);

  return (
    <div className="space-y-8">
      <section className={`${shellCardClass} relative overflow-hidden p-8 md:p-10`}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/18 via-transparent to-rose-300/10" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-muted">
              개인 아카이브
            </span>
            <h1 className="font-display text-5xl leading-tight text-foreground sm:text-6xl">
              좋아한 작품을
              <br />
              한곳에 정리하는 아카이브
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted">
              본 작품, 짧은 감상, 나중에 보고 싶은 목록까지 차분하게 쌓아둘 수
              있어요.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/archive" className={primaryButtonClassName}>
              전체 기록 보기
            </Link>
            <Link href="/archive/new" className={secondaryButtonClassName}>
              새 기록 추가
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className={`${shellCardClass} p-5`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">전체 기록</p>
          <p className="mt-3 font-display text-4xl text-foreground">
            {summary.totalEntries}
          </p>
        </div>
        <div className={`${shellCardClass} p-5`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">완료</p>
          <p className="mt-3 font-display text-4xl text-foreground">
            {summary.completedCount}
          </p>
        </div>
        <div className={`${shellCardClass} p-5`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">위시리스트</p>
          <p className="mt-3 font-display text-4xl text-foreground">
            {summary.wishlistCount}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">최근 기록</p>
            <h2 className="mt-2 font-display text-4xl text-foreground">최근에 남긴 작품</h2>
          </div>
          <Link href="/archive" className={secondaryButtonClassName}>
            전체 보기
          </Link>
        </div>

        {recentEntries.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-3">
            {recentEntries.map((entry) => (
              <MediaCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <section className={`${subtleCardClass} p-8 text-center`}>
            <p className="text-sm text-muted">아직 기록이 없습니다.</p>
          </section>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">위시리스트</p>
            <h2 className="mt-2 font-display text-4xl text-foreground">
              다음에 보고 싶은 작품
            </h2>
          </div>
          <Link href="/wishlist" className={secondaryButtonClassName}>
            전체 보기
          </Link>
        </div>

        {wishlistPreview.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-3">
            {wishlistPreview.map((entry) => (
              <MediaCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <section className={`${subtleCardClass} p-8 text-center`}>
            <p className="text-sm text-muted">위시리스트가 비어 있습니다.</p>
          </section>
        )}
      </section>
    </div>
  );
}
