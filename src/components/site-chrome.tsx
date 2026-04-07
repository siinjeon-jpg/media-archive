import Link from "next/link";
import { type ReactNode } from "react";

import {
  ghostButtonClassName,
  secondaryButtonClassName
} from "@/lib/media-config";
import { signOutAction } from "@/app/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { type ViewerContext } from "@/lib/types";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/archive", label: "아카이브" },
  { href: "/dashboard", label: "대시보드" },
  { href: "/wishlist", label: "위시리스트" }
];

export function SiteChrome({
  children,
  viewer
}: {
  children: ReactNode;
  viewer: ViewerContext;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="archive-noise pointer-events-none fixed inset-0 opacity-80" />
      <div className="pointer-events-none fixed left-0 top-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-rose-500/10 blur-3xl" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="mr-auto flex min-w-[220px] flex-col">
            <span className="font-display text-2xl tracking-[0.08em] text-foreground">
              Aftertaste Archive
            </span>
            <span className="text-xs uppercase tracking-[0.28em] text-muted">
              오래 남은 장면과 취향을 모아두는 개인 아카이브
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={ghostButtonClassName}>
                {item.label}
              </Link>
            ))}
            <Link href="/archive/new" className={secondaryButtonClassName}>
              기록 추가
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted sm:inline-flex">
              {viewer.mode === "live"
                ? viewer.source === "seed"
                  ? "스타터 아카이브"
                  : "내 아카이브"
                : "체험 아카이브"}
            </span>
            <ThemeToggle />
            {viewer.user ? (
              <form action={signOutAction}>
                <button type="submit" className={secondaryButtonClassName}>
                  로그아웃
                </button>
              </form>
            ) : (
              <Link href="/login" className={secondaryButtonClassName}>
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      {viewer.mode === "demo" ? (
        <div className="border-b border-cyan-300/15 bg-cyan-400/10">
          <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-cyan-50 sm:px-6 lg:px-8">
            지금은 샘플 데이터로 둘러보는 체험 모드예요. Supabase를 연결하고 로그인하면
            나만의 기록을 저장할 수 있어요.
          </div>
        </div>
      ) : viewer.source === "seed" ? (
        <div className="border-b border-amber-300/15 bg-amber-300/10">
          <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-amber-50 sm:px-6 lg:px-8">
            아직 실제 기록이 없어서 샘플 항목이 먼저 채워져 있어요. 첫 작품을 추가하면
            바로 내 아카이브로 전환됩니다.
          </div>
        </div>
      ) : null}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
