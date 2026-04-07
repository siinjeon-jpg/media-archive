import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { getViewerContext } from "@/lib/data";

export const metadata: Metadata = {
  title: "Aftertaste Archive",
  description:
    "A personal media tracking app for manga, anime, movies, dramas, and novels."
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <SiteChrome viewer={viewer}>{children}</SiteChrome>
      </body>
    </html>
  );
}
