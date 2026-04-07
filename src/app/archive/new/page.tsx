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
        <p className="text-xs uppercase tracking-[0.24em] text-muted">New entry</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          Log a new piece of media
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
          Capture what you watched or read, what stayed with you, and whether it
          belongs on your wishlist shelf too.
        </p>
        {viewer.mode === "demo" ? (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
            The form is read-only in demo mode. Connect Supabase and sign in to
            start writing to your own archive.
          </div>
        ) : null}
      </section>

      <EntryForm error={error} disabled={viewer.mode === "demo"} />
    </div>
  );
}
