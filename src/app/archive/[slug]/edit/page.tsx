import { notFound } from "next/navigation";

import { EntryForm } from "@/components/entry-form";
import { getEntryBySlug } from "@/lib/data";
import { shellCardClass } from "@/lib/media-config";
import { getFirstParam } from "@/lib/utils";

export default async function EditEntryPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { entry, mode, source } = await getEntryBySlug(params.slug);
  const error = getFirstParam(searchParams?.error);

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className={`${shellCardClass} p-8`}>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">기록 수정</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          기록 수정
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
          평점과 감상, 태그를 다시 정리할 수 있어요.
        </p>
        {mode === "demo" || source === "seed" ? (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            샘플 기록은 수정할 수 없어요. 직접 추가한 기록만 수정할 수 있습니다.
          </div>
        ) : null}
      </section>

      <EntryForm
        entry={entry}
        error={error}
        disabled={mode === "demo" || source === "seed"}
      />
    </div>
  );
}
