import { shellCardClass } from "@/lib/media-config";

export function MetricCard({
  label,
  value,
  helper
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className={`${shellCardClass} p-5`}>
      <p className="text-xs uppercase tracking-[0.24em] text-muted">{label}</p>
      <p className="mt-4 font-display text-4xl text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted">{helper}</p>
    </div>
  );
}
