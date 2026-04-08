"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { SiteChrome } from "@/components/site-chrome";
import { type ViewerContext } from "@/lib/types";

const minimalRoutes = new Set(["/", "/login"]);

export function AppShell({
  children,
  viewer
}: {
  children: ReactNode;
  viewer: ViewerContext;
}) {
  const pathname = usePathname();

  if (pathname && minimalRoutes.has(pathname)) {
    return <>{children}</>;
  }

  return <SiteChrome viewer={viewer}>{children}</SiteChrome>;
}
