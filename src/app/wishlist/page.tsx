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
          언젠가 꼭 꺼내볼 작품들
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-muted">
          지금 당장은 아니어도 마음 한켠에 오래 남아 있는 작품들을 모아두는
          자리예요.
        </p>
        <div className="mt-6">
          <Link href="/archive/new" className={primaryButtonClassName}>
            위시리스트에 담기
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
            위시리스트가 비어 있어요
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted">
            지금은 아니어도 나중에 꼭 보고 싶은 작품이 있다면 위시리스트로
            표시해보세요.
          </p>
        </section>
      )}
    </div>
  );
}
