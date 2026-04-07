import { shellCardClass } from "@/lib/media-config";

export default function Loading() {
  return (
    <div className={`${shellCardClass} p-8`}>
      <p className="text-xs uppercase tracking-[0.24em] text-muted">불러오는 중</p>
      <h1 className="mt-3 font-display text-5xl text-foreground">
        아카이브를 불러오고 있어요
      </h1>
      <p className="mt-4 text-base leading-8 text-muted">
        기록과 통계, 최근 메모를 정리하고 있습니다.
      </p>
    </div>
  );
}
