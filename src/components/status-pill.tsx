import { STATUS_META } from "@/lib/media-config";
import { cn } from "@/lib/utils";
import { type EntryStatus } from "@/lib/types";

export function StatusPill({
  status,
  className
}: {
  status: EntryStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]",
        STATUS_META[status].className,
        className
      )}
    >
      {STATUS_META[status].label}
    </span>
  );
}
