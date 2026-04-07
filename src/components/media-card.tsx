import Link from "next/link";

import { CategoryBadge } from "@/components/category-badge";
import { StatusPill } from "@/components/status-pill";
import { CATEGORY_META, subtleCardClass } from "@/lib/media-config";
import { type MediaEntry } from "@/lib/types";
import { cn, formatShortDate } from "@/lib/utils";

export function MediaCard({
  entry,
  priority = false
}: {
  entry: MediaEntry;
  priority?: boolean;
}) {
  const meta = CATEGORY_META[entry.category];

  return (
    <Link
      href={`/archive/${entry.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/80 p-5 shadow-glow transition duration-300 hover:-translate-y-1 hover:border-white/20",
        priority ? "lg:col-span-2" : ""
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90",
          meta.gradient
        )}
      />
      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={entry.category} />
              <StatusPill status={entry.status} />
              {entry.isWishlist ? (
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground">
                  위시리스트
                </span>
              ) : null}
              {entry.rating ? (
                <span className={subtleCardClass + " rounded-full px-3 py-1 text-xs"}>
                  {entry.rating}/10
                </span>
              ) : null}
            </div>
            <div>
              <h3 className="font-display text-3xl text-foreground">{entry.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                {entry.review || meta.hint}
              </p>
            </div>
          </div>

          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted">
            {meta.icon}
          </span>
        </div>

        <div className="mt-auto space-y-4">
          {entry.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {entry.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-foreground/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm text-muted">
            <span>{entry.country || "미상"}</span>
            <span>{formatShortDate(entry.consumedOn)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
