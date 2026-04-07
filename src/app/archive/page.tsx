import Link from "next/link";

import { FilterBar } from "@/components/filter-bar";
import { MediaCard } from "@/components/media-card";
import {
  primaryButtonClassName,
  shellCardClass,
  subtleCardClass
} from "@/lib/media-config";
import { getArchiveData } from "@/lib/data";
import { getFirstParam } from "@/lib/utils";

export default async function ArchivePage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const filters = {
    category: getFirstParam(searchParams?.category),
    status: getFirstParam(searchParams?.status),
    tag: getFirstParam(searchParams?.tag),
    search: getFirstParam(searchParams?.search),
    minRating: Number(getFirstParam(searchParams?.minRating) || 0) || undefined
  };
  const { filteredEntries, summary, tags } = await getArchiveData(filters);
  const saved = getFirstParam(searchParams?.saved);
  const deleted = getFirstParam(searchParams?.deleted);

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          기록을 저장했어요.
        </div>
      ) : null}

      {deleted ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          기록을 삭제했어요.
        </div>
      ) : null}

      <section className={`${shellCardClass} flex flex-col gap-6 p-8 lg:flex-row lg:items-end lg:justify-between`}>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-muted">
            아카이브
          </p>
          <h1 className="font-display text-5xl text-foreground">기록 둘러보기</h1>
          <p className="max-w-2xl text-base leading-8 text-muted">
            카테고리, 상태, 태그, 평점으로 정리해보면 취향의 흐름이 더 또렷하게 보여요.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/10 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">현재 보기</p>
            <p className="mt-2 font-display text-3xl text-foreground">
              {filteredEntries.length}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/10 px-5 py-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">완료</p>
            <p className="mt-2 font-display text-3xl text-foreground">
              {summary.completedCount}
            </p>
          </div>
          <Link
            href="/archive/new"
            className={`${primaryButtonClassName} h-full min-h-[104px] rounded-[1.5rem] text-center`}
          >
            새 기록 남기기
          </Link>
        </div>
      </section>

      <FilterBar filters={filters} tags={tags} />

      {filteredEntries.length > 0 ? (
        <section className="grid gap-6 xl:grid-cols-3">
          {filteredEntries.map((entry) => (
            <MediaCard key={entry.id} entry={entry} />
          ))}
        </section>
      ) : (
        <section className={`${subtleCardClass} p-10 text-center`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">검색 결과 없음</p>
          <h2 className="mt-3 font-display text-4xl text-foreground">
            조건에 맞는 기록이 없어요
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted">
            검색 범위를 조금 넓히거나 필터를 초기화해보세요.
          </p>
        </section>
      )}
    </div>
  );
}
