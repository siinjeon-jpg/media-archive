"use client";

import { useEffect, useState } from "react";

import { ghostButtonClassName } from "@/lib/media-config";

const storageKey = "aftertaste-theme";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const nextIsDark = document.documentElement.classList.contains("dark");
    setMounted(true);
    setIsDark(nextIsDark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(storageKey, next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={ghostButtonClassName}
      aria-label="테마 전환"
    >
      {mounted && !isDark ? "다크 모드" : "라이트 모드"}
    </button>
  );
}
