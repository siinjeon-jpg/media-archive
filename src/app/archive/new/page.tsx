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
          새 작품을 남겨보세요
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
          보고 읽은 작품과 오래 남은 감상, 위시리스트에 함께 담아둘지까지 한 번에
          정리할 수 있어요.
        </p>
        {viewer.mode === "demo" ? (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            데모 모드에서는 폼이 읽기 전용이에요. Supabase를 연결하고 로그인하면
            내 아카이브에 직접 기록할 수 있어요.
          </div>
        ) : null}
      </section>

      <EntryForm error={error} disabled={viewer.mode === "demo"} />
    </div>
  );
}
