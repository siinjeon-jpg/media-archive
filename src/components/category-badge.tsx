import { CATEGORY_META } from "@/lib/media-config";
import { cn } from "@/lib/utils";
import { type Category } from "@/lib/types";

export function CategoryBadge({
  category,
  className
}: {
  category: Category;
  className?: string;
}) {
  const meta = CATEGORY_META[category];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground",
        meta.tint,
        className
      )}
    >
      {meta.label}
    </span>
  );
}
