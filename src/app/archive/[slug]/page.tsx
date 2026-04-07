import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteEntryAction } from "@/app/actions";
import { MediaCard } from "@/components/media-card";
import { CategoryBadge } from "@/components/category-badge";
import { StatusPill } from "@/components/status-pill";
import {
  primaryButtonClassName,
  secondaryButtonClassName,
  shellCardClass,
  subtleCardClass
} from "@/lib/media-config";
import { getEntryBySlug } from "@/lib/data";
import { getFirstParam, formatShortDate, getConsumptionLabel, titleCase } from "@/lib/utils";

export default async function EntryDetailPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { entry, related, mode, source } = await getEntryBySlug(params.slug);
  const saved = getFirstParam(searchParams?.saved);
  const error = getFirstParam(searchParams?.error);

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          Entry saved successfully.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div className={`${shellCardClass} p-8`}>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={entry.category} />
            <StatusPill status={entry.status} />
            {entry.isWishlist ? (
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-sm text-foreground">
                Wishlist
              </span>
            ) : null}
            {entry.rating ? (
              <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-sm text-foreground">
                {entry.rating}/10
              </span>
            ) : null}
          </div>

          <h1 className="mt-6 font-display text-5xl text-foreground">{entry.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
            {entry.review || "No one-line review added yet."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">
                {getConsumptionLabel(entry.category)} date
              </p>
              <p className="mt-2 text-lg text-foreground">
                {formatShortDate(entry.consumedOn)}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Country</p>
              <p className="mt-2 text-lg text-foreground">
                {entry.country || "Not specified"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Wishlist</p>
              <p className="mt-2 text-lg text-foreground">
                {entry.isWishlist ? "Saved on your wishlist" : "Not in wishlist"}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Status</p>
              <p className="mt-2 text-lg text-foreground">
                {titleCase(entry.status)}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Detailed memo</p>
            <div className="rounded-[1.75rem] border border-white/10 bg-black/10 p-5">
              <p className="whitespace-pre-line text-base leading-8 text-foreground/90">
                {entry.memo || "No long-form memo yet."}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {mode === "live" && source === "user" ? (
              <>
                <Link
                  href={`/archive/${entry.slug}/edit`}
                  className={primaryButtonClassName}
                >
                  Edit entry
                </Link>
                <form action={deleteEntryAction}>
                  <input type="hidden" name="entryId" value={entry.id} />
                  <input type="hidden" name="returnTo" value={`/archive/${entry.slug}`} />
                  <button type="submit" className={secondaryButtonClassName}>
                    Delete entry
                  </button>
                </form>
              </>
            ) : mode === "live" && source === "seed" ? (
              <Link href="/archive/new" className={primaryButtonClassName}>
                Add your first real entry
              </Link>
            ) : (
              <Link href="/login" className={primaryButtonClassName}>
                Sign in to edit
              </Link>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className={`${subtleCardClass} p-6`}>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Tags</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {entry.tags.length > 0 ? (
                entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-black/10 px-3 py-2 text-sm text-foreground"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted">No tags added yet.</p>
              )}
            </div>
          </section>

          {related.length > 0 ? (
            <section className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted">
                  Related in archive
                </p>
                <h2 className="mt-2 font-display text-3xl text-foreground">
                  More from the same lane
                </h2>
              </div>
              <div className="space-y-4">
                {related.map((item) => (
                  <MediaCard key={item.id} entry={item} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}
