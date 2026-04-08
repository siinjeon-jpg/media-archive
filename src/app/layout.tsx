import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { AppShell } from "@/components/app-shell";
import { getViewerContext } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: "애프터테이스트 아카이브",
    template: "%s | 애프터테이스트 아카이브"
  },
  description:
    "애니, 만화, 영화, 드라마, 소설을 정리하는 개인 미디어 아카이브"
};

const themeScript = `
  (() => {
    const key = 'aftertaste-theme';
    const stored = localStorage.getItem(key);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', useDark);
  })();
`;

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const viewer = await getViewerContext();

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <AppShell viewer={viewer}>{children}</AppShell>
      </body>
    </html>
  );
}
