import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { AppShell } from "@/components/app-shell";
import { getViewerContext } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: "JP-Log",
    template: "%s | JP-Log"
  },
  description: "지도를 물들이며 완성하는 나만의 일본 여행기"
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
