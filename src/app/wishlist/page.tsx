import Link from "next/link";

import { MediaCard } from "@/components/media-card";
import {
  primaryButtonClassName,
  shellCardClass,
  subtleCardClass
} from "@/lib/media-config";
import { getArchiveData } from "@/lib/data";

export default async function WishlistPage() {
  const { entries } = await getArchiveData();
  const wishlistEntries = entries.filter((entry) => entry.isWishlist);

  return (
    <div className="space-y-6">
      <section className={`${shellCardClass} p-8`}>
        <p className="text-xs uppercase tracking-[0.24em] text-muted">위시리스트</p>
        <h1 className="mt-3 font-display text-5xl text-foreground">
          나중에 볼 작품
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
          보고 싶은 작품만 따로 모아둘 수 있어요.
        </p>
        <div className="mt-6">
          <Link href="/archive/new" className={primaryButtonClassName}>
            새 기록 추가
          </Link>
        </div>
      </section>

      {wishlistEntries.length > 0 ? (
        <section className="grid gap-6 xl:grid-cols-3">
          {wishlistEntries.map((entry) => (
            <MediaCard key={entry.id} entry={entry} />
          ))}
        </section>
      ) : (
        <section className={`${subtleCardClass} p-10 text-center`}>
          <p className="text-xs uppercase tracking-[0.24em] text-muted">
            아직 비어 있어요
          </p>
          <h2 className="mt-3 font-display text-4xl text-foreground">
            담아둔 작품이 없어요
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted">
            나중에 보고 싶은 작품이 있다면 위시리스트로 표시해 보세요.
          </p>
        </section>
      )}
    </div>
  );
}
