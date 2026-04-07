import Link from "next/link";

import { CategoryBadge } from "@/components/category-badge";
import { StatusPill } from "@/components/status-pill";
import { CATEGORY_META, subtleCardClass } from "@/lib/media-config";
import { type MediaEntry } from "@/lib/types";
import { cn, formatShortDate, truncateText } from "@/lib/utils";

export function MediaCard({
  entry,
  priority = false
}: {
  entry: MediaEntry;
  priority?: boolean;
}) {
  const meta = CATEGORY_META[entry.category];
  const review = truncateText(entry.review || "한 줄 감상이 없습니다.", 72);

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

      <div className="relative flex h-full flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={entry.category} />
          <StatusPill status={entry.status} />
          {entry.rating ? (
            <span className={subtleCardClass + " rounded-full px-3 py-1 text-xs"}>
              {entry.rating}/10
            </span>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-[1.85rem] leading-tight text-foreground">
            {entry.title}
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-muted">{review}</p>
        </div>

        {entry.tags.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-2">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-foreground/80"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="text-sm text-muted">{formatShortDate(entry.consumedOn)}</div>
      </div>
    </Link>
  );
}
