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
              애프터테이스트 아카이브
            </span>
            <span className="text-xs uppercase tracking-[0.28em] text-muted">
              좋아한 작품을 차분히 정리해 두는 개인 아카이브
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={ghostButtonClassName}>
                {item.label}
              </Link>
            ))}
            <Link href="/archive/new" className={secondaryButtonClassName}>
              새 기록
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted sm:inline-flex">
              {viewer.mode === "live" && viewer.source === "user"
                ? "내 기록"
                : "샘플 보기"}
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
            지금은 샘플 기록을 보여주고 있어요. 로그인하면 내 기록을 저장할 수
            있습니다.
          </div>
        </div>
      ) : viewer.source === "seed" ? (
        <div className="border-b border-amber-300/15 bg-amber-300/10">
          <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-amber-50 sm:px-6 lg:px-8">
            아직 기록이 없어 샘플이 먼저 보입니다. 첫 기록을 추가하면 바로 내
            아카이브로 바뀝니다.
          </div>
        </div>
      ) : null}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
