import { MetricCard } from "@/components/metric-card";
import { MonthlyChart } from "@/components/monthly-chart";
import { CATEGORY_META, STATUS_META } from "@/lib/media-config";
import { getArchiveData } from "@/lib/data";
import { shellCardClass, subtleCardClass } from "@/lib/media-config";

export default async function DashboardPage() {
  const { summary } = await getArchiveData();
  const categoryMax = Math.max(...summary.categoryBreakdown.map((bucket) => bucket.value), 1);
  const statusMax = Math.max(...summary.statusBreakdown.map((bucket) => bucket.value), 1);
  const countryMax = Math.max(...summary.topCountries.map((bucket) => bucket.value), 1);

  return (
    <div className="space-y-6">
      <section className={`${shellCardClass} p-8`}>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">대시보드</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          취향의 흐름 보기
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
          어떤 형식의 작품이 많은지, 얼마나 끝까지 보는지, 어떤 나라의 작품이
          자주 쌓이는지 한눈에 살펴볼 수 있어요.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="전체 기록"
          value={summary.totalEntries}
          helper="지금까지 남긴 모든 작품 기록입니다."
        />
        <MetricCard
          label="평균 평점"
          value={summary.averageRating.toFixed(1)}
          helper="평점을 남긴 작품들의 평균 점수예요."
        />
        <MetricCard
          label="고평점"
          value={summary.highRatedCount}
          helper="9점 이상으로 남긴 작품 수입니다."
        />
        <MetricCard
          label="위시리스트"
          value={summary.wishlistCount}
          helper="나중을 위해 담아둔 작품 수예요."
        />
      </section>

      <MonthlyChart stats={summary.monthlyStats} />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className={`${subtleCardClass} p-6`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">
            카테고리 비율
          </p>
          <h2 className="mt-2 font-display text-3xl text-foreground">
            어떤 형식이 많은지
          </h2>
          <div className="mt-6 space-y-4">
            {summary.categoryBreakdown.map((bucket) => (
              <div key={bucket.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{CATEGORY_META[bucket.label as keyof typeof CATEGORY_META].label}</span>
                  <span className="text-muted">{bucket.value}</span>
                </div>
                <div className="h-2 rounded-full bg-black/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-rose-300 via-orange-300 to-white"
                    style={{
                      width: `${Math.max((bucket.value / categoryMax) * 100, bucket.value > 0 ? 10 : 0)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${subtleCardClass} p-6`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">
            상태 비율
          </p>
          <h2 className="mt-2 font-display text-3xl text-foreground">
            얼마나 끝까지 보는지
          </h2>
          <div className="mt-6 space-y-4">
            {summary.statusBreakdown.map((bucket) => (
              <div key={bucket.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{STATUS_META[bucket.label as keyof typeof STATUS_META].label}</span>
                  <span className="text-muted">{bucket.value}</span>
                </div>
                <div className="h-2 rounded-full bg-black/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-200 to-white"
                    style={{
                      width: `${Math.max((bucket.value / statusMax) * 100, bucket.value > 0 ? 10 : 0)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${subtleCardClass} p-6`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">
            국가별 기록
          </p>
          <h2 className="mt-2 font-display text-3xl text-foreground">
            자주 닿는 작품의 출발지
          </h2>
          <div className="mt-6 space-y-4">
            {summary.topCountries.map((bucket) => (
              <div key={bucket.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{bucket.label}</span>
                  <span className="text-muted">{bucket.value}</span>
                </div>
                <div className="h-2 rounded-full bg-black/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-300 via-lime-200 to-white"
                    style={{
                      width: `${Math.max((bucket.value / countryMax) * 100, bucket.value > 0 ? 10 : 0)}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${subtleCardClass} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">많이 붙인 태그</p>
            <h2 className="mt-2 font-display text-3xl text-foreground">
              반복해서 남기는 취향의 결
            </h2>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {summary.topTags.map((tag) => (
            <div
              key={tag.label}
              className="rounded-full border border-white/10 bg-black/10 px-4 py-3 text-sm text-foreground"
            >
              #{tag.label} · {tag.value}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
