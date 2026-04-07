import Link from "next/link";

import { MediaCard } from "@/components/media-card";
import { MetricCard } from "@/components/metric-card";
import {
  CATEGORY_META,
  primaryButtonClassName,
  secondaryButtonClassName,
  shellCardClass,
  subtleCardClass
} from "@/lib/media-config";
import { getArchiveData } from "@/lib/data";

export default async function HomePage() {
  const { entries, summary, source } = await getArchiveData();
  const spotlightCandidates = entries.filter((entry) => (entry.rating ?? 0) >= 9);
  const spotlight =
    spotlightCandidates.length > 0
      ? spotlightCandidates.slice(0, 3)
      : summary.recentEntries;
  const watchingNow = entries.filter((entry) => entry.status === "watching").slice(0, 3);
  const wishlist = entries.filter((entry) => entry.isWishlist).slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <div className={`${shellCardClass} relative overflow-hidden p-8 md:p-10`}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/18 via-transparent to-rose-300/10" />
          <div className="relative space-y-10">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.26em] text-muted">
                개인 취향 아카이브
              </span>
              <div className="space-y-4">
                <h1 className="max-w-4xl font-display text-5xl leading-tight text-foreground sm:text-6xl">
                  오래 남는 이야기와 장면,
                  그때의 취향을 차곡차곡 모아두는 곳.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted">
                  보고 읽은 작품, 오래 남은 감정, 다시 떠오르는 취향의 결을
                  조용히 정리해두는 나만의 기록장입니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/archive" className={primaryButtonClassName}>
                  아카이브 보기
                </Link>
                <Link href="/archive/new" className={secondaryButtonClassName}>
                  기록 추가
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                  전체 기록
                </p>
                <p className="mt-3 font-display text-4xl text-foreground">
                  {summary.totalEntries}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                  평균 평점
                </p>
                <p className="mt-3 font-display text-4xl text-foreground">
                  {summary.averageRating || "0.0"}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                  위시리스트
                </p>
                <p className="mt-3 font-display text-4xl text-foreground">
                  {summary.wishlistCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className={`${subtleCardClass} p-6`}>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">
              취향의 결
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground">
              요즘의 아카이브는 이런 결로 모이고 있어요
            </h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {summary.topTags.map((tag) => (
                <span
                  key={tag.label}
                  className="rounded-full border border-white/10 bg-black/10 px-3 py-2 text-sm text-foreground"
                >
                  #{tag.label} · {tag.value}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-muted">
              인물의 결이 살아 있고, 감정의 잔향이 길며, 만들어진 세계보다
              살아본 세계처럼 느껴지는 작품들이 자꾸 쌓이고 있어요.
            </p>
          </div>

          <div className={`${subtleCardClass} p-6`}>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">
              아카이브 상태
            </p>
            <h2 className="mt-3 font-display text-3xl text-foreground">
              {source === "seed" ? "스타터 아카이브가 열려 있어요" : "내 아카이브가 연결되어 있어요"}
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted">
              {source === "seed"
                ? "아직 실제 기록이 없어서 샘플 항목이 먼저 채워져 있습니다. 첫 작품을 추가하면 곧바로 내 기록으로 바뀌어요."
                : "지금 보이는 카드와 통계는 모두 Supabase에 저장된 내 데이터로부터 불러오고 있습니다."}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {summary.topCountries.map((country) => (
                <span
                  key={country.label}
                  className="rounded-full border border-white/10 bg-black/10 px-3 py-2 text-sm text-foreground"
                >
                  {country.label} · {country.value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="완료"
          value={summary.completedCount}
          helper="끝까지 보고 읽은 뒤 감상을 남긴 작품들."
        />
        <MetricCard
          label="보는 중"
          value={summary.watchingCount}
          helper="지금 한창 따라가고 있는 작품들."
        />
        <MetricCard
          label="위시리스트"
          value={summary.wishlistCount}
          helper="지금은 아니어도 눈에 담아두고 싶은 작품들."
        />
        <MetricCard
          label="중단"
          value={summary.droppedCount}
          helper="내 취향과 맞지 않았다는 걸 알려준 작품들."
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">
              오래 남은 작품
            </p>
            <h2 className="mt-2 font-display text-4xl text-foreground">
              여운이 길게 남은 기록
            </h2>
          </div>
          <Link href="/archive" className={secondaryButtonClassName}>
            전체 아카이브
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {spotlight.map((entry, index) => (
            <MediaCard key={entry.id} entry={entry} priority={index === 0} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className={`${subtleCardClass} p-6`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">
            최근 기록
          </p>
          <h2 className="mt-2 font-display text-3xl text-foreground">
            가장 최근에 남긴 작품들
          </h2>
          <div className="mt-6 space-y-4">
            {summary.recentEntries.map((entry) => (
              <Link
                key={entry.id}
                href={`/archive/${entry.slug}`}
                className="flex items-start justify-between gap-4 rounded-[1.5rem] border border-white/10 bg-black/10 px-4 py-4 transition hover:border-white/20 hover:bg-black/15"
              >
                <div>
                  <p className="text-lg text-foreground">{entry.title}</p>
                  <p className="mt-1 text-sm text-muted">{entry.review}</p>
                </div>
                <span className="text-sm text-muted">{entry.rating ?? "미정"}/10</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className={`${subtleCardClass} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                  지금 보는 중
                </p>
                <h2 className="mt-2 font-display text-3xl text-foreground">
                  요즘 빠져 있는 작품
                </h2>
              </div>
              <Link href="/dashboard" className={secondaryButtonClassName}>
                대시보드
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {watchingNow.length > 0 ? (
                watchingNow.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/archive/${entry.slug}`}
                    className="flex items-center justify-between rounded-[1.35rem] border border-white/10 bg-black/10 px-4 py-4"
                  >
                    <span className="text-foreground">{entry.title}</span>
                    <span className="text-sm text-muted">{CATEGORY_META[entry.category].label}</span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted">
                  아직 진행 중으로 표시된 작품이 없어요. 현재 보고 있는 작품을
                  기록해두면 이곳에 모입니다.
                </p>
              )}
            </div>
          </div>

          <div className={`${subtleCardClass} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                  위시리스트
                </p>
                <h2 className="mt-2 font-display text-3xl text-foreground">
                  언젠가 꼭 꺼내볼 작품
                </h2>
              </div>
              <Link href="/wishlist" className={secondaryButtonClassName}>
                위시리스트 보기
              </Link>
            </div>
            <div className="mt-5 space-y-3">
              {wishlist.length > 0 ? (
                wishlist.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/archive/${entry.slug}`}
                    className="flex items-center justify-between rounded-[1.35rem] border border-white/10 bg-black/10 px-4 py-4"
                  >
                    <span className="text-foreground">{entry.title}</span>
                    <span className="text-sm text-muted">{CATEGORY_META[entry.category].label}</span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted">
                  아직 위시리스트가 비어 있어요. 나중에 보고 싶은 작품을 담아두면
                  아카이브의 다음 페이지가 생깁니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
