import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteEntryAction } from "@/app/actions";
import { MediaCard } from "@/components/media-card";
import { CategoryBadge } from "@/components/category-badge";
import { StatusPill } from "@/components/status-pill";
import {
  STATUS_META,
  primaryButtonClassName,
  secondaryButtonClassName,
  shellCardClass,
  subtleCardClass
} from "@/lib/media-config";
import { getEntryBySlug } from "@/lib/data";
import { getFirstParam, formatShortDate, getConsumptionLabel } from "@/lib/utils";

export default async function EntryDetailPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { entry, related, mode, source } = await getEntryBySlug(params.slug);
  const saved = getFirstParam(searchParams?.saved);
  const error = getFirstParam(searchParams?.error);

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          기록을 저장했어요.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div className={`${shellCardClass} p-8`}>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={entry.category} />
            <StatusPill status={entry.status} />
            {entry.isWishlist ? (
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-sm text-foreground">
                위시리스트
              </span>
            ) : null}
            {entry.rating ? (
              <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-sm text-foreground">
                {entry.rating}/10
              </span>
            ) : null}
          </div>

          <h1 className="mt-6 font-display text-5xl text-foreground">{entry.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
            {entry.review || "한 줄 감상이 없습니다."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">
                {getConsumptionLabel(entry.category)}
              </p>
              <p className="mt-2 text-lg text-foreground">
                {formatShortDate(entry.consumedOn)}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">국가</p>
              <p className="mt-2 text-lg text-foreground">
                {entry.country || "미정"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">위시리스트</p>
              <p className="mt-2 text-lg text-foreground">
                {entry.isWishlist ? "담아둠" : "없음"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">상태</p>
              <p className="mt-2 text-lg text-foreground">
                {STATUS_META[entry.status].label}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">메모</p>
            <div className="rounded-[1.75rem] border border-white/10 bg-black/10 p-5">
              <p className="whitespace-pre-line text-base leading-8 text-foreground/90">
                {entry.memo || "메모가 없습니다."}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {mode === "live" && source === "user" ? (
              <>
                <Link
                  href={`/archive/${entry.slug}/edit`}
                  className={primaryButtonClassName}
                >
                  수정
                </Link>
                <form action={deleteEntryAction}>
                  <input type="hidden" name="entryId" value={entry.id} />
                  <input type="hidden" name="returnTo" value={`/archive/${entry.slug}`} />
                  <button type="submit" className={secondaryButtonClassName}>
                    삭제
                  </button>
                </form>
              </>
            ) : mode === "live" && source === "seed" ? (
              <Link href="/archive/new" className={primaryButtonClassName}>
                새 기록 추가
              </Link>
            ) : (
              <Link href="/login" className={primaryButtonClassName}>
                로그인
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className={`${subtleCardClass} p-6`}>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">태그</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.length > 0 ? (
                entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-black/10 px-3 py-2 text-sm text-foreground"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted">아직 태그가 없어요.</p>
              )}
            </div>
          </section>

          {related.length > 0 ? (
            <section className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted">더 보기</p>
                <h2 className="mt-2 font-display text-3xl text-foreground">
                  같은 카테고리
                </h2>
              </div>
              <div className="space-y-4">
                {related.map((item) => (
                  <MediaCard key={item.id} entry={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}
