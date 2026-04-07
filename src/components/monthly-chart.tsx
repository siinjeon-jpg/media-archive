import { subtleCardClass } from "@/lib/media-config";
import { type MonthlyStat } from "@/lib/types";

export function MonthlyChart({ stats }: { stats: MonthlyStat[] }) {
  const highest = Math.max(...stats.map((stat) => stat.count), 1);

  return (
    <div className={`${subtleCardClass} p-5`}>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">월별 기록</p>
          <h3 className="mt-2 font-display text-3xl text-foreground">
            최근 6개월
          </h3>
        </div>
        <p className="text-sm text-muted">기록 수</p>
      </div>

      <div className="grid grid-cols-6 items-end gap-3">
        {stats.map((stat) => (
          <div key={stat.key} className="flex flex-col items-center gap-3">
            <div className="flex h-48 w-full items-end rounded-3xl bg-black/20 p-2">
              <div
                className="w-full rounded-2xl bg-gradient-to-t from-cyan-300 via-cyan-200 to-white transition-all"
                style={{
                  height: `${Math.max((stat.count / highest) * 100, stat.count > 0 ? 14 : 4)}%`
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-lg text-foreground">{stat.count}</p>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
