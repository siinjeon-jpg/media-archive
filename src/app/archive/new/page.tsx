import { EntryForm } from "@/components/entry-form";
import { getViewerContext } from "@/lib/data";
import { shellCardClass } from "@/lib/media-config";
import { getFirstParam } from "@/lib/utils";

export default async function NewEntryPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const viewer = await getViewerContext();
  const error = getFirstParam(searchParams?.error);

  return (
    <div className="space-y-6">
      <section className={`${shellCardClass} p-8`}>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">새 기록</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          새 기록 추가
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
          작품 정보와 간단한 감상을 남겨보세요.
        </p>
        {viewer.mode === "demo" ? (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            지금은 샘플 모드라 저장할 수 없어요. 로그인 후 내 기록을 추가해 보세요.
          </div>
        ) : null}
      </section>

      <EntryForm error={error} disabled={viewer.mode === "demo"} />
    </div>
  );
}
