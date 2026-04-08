import Link from "next/link";

import {
  primaryButtonClassName,
  secondaryButtonClassName,
  shellCardClass
} from "@/lib/media-config";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section
        className={`${shellCardClass} relative w-full max-w-3xl overflow-hidden px-8 py-16 text-center sm:px-12`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/18 via-transparent to-rose-300/10" />
        <div className="relative animate-fade-rise">
          <p className="text-sm uppercase tracking-[0.4em] text-muted">Travel Journal</p>
          <h1 className="mt-6 font-display text-5xl text-foreground sm:text-7xl">
            JP-Log
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            지도를 물들이며 완성하는 나만의 일본 여행기
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard" className={`${primaryButtonClassName} min-w-36`}>
              시작하기
            </Link>
            <Link href="/login" className={`${secondaryButtonClassName} min-w-36`}>
              로그인
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
