import { shellCardClass } from "@/lib/media-config";

export default function Loading() {
  return (
    <div className={`${shellCardClass} p-8`}>
      <p className="text-xs uppercase tracking-[0.24em] text-muted">불러오는 중</p>
      <h1 className="mt-3 font-display text-5xl text-foreground">
        기록을 불러오고 있습니다
      </h1>
      <p className="mt-4 text-base leading-8 text-muted">
        잠시만 기다려 주세요.
      </p>
    </div>
  );
}
