import { type Category, type EntryStatus } from "@/lib/types";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function titleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatShortDate(value: string | null) {
  if (!value) {
    return "기록 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function formatMonthLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short"
  }).format(new Date(`${value}-01`));
}

export function truncateText(value: string, maxLength: number) {
  const normalized = value.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return "";
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function average(numbers: number[]) {
  if (numbers.length === 0) {
    return 0;
  }

  return Number(
    (numbers.reduce((sum, current) => sum + current, 0) / numbers.length).toFixed(
      1
    )
  );
}

export function dedupeNormalized(values: string[]) {
  const seen = new Set<string>();

  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

export function parseCommaSeparatedList(value: string) {
  return dedupeNormalized(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

export function getConsumptionLabel(category: Category) {
  return category === "manga" || category === "novel" ? "읽은 날짜" : "본 날짜";
}

export function sanitizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function isCategory(value: string): value is Category {
  return ["manga", "anime", "movie", "drama", "novel"].includes(value);
}

export function isStatus(value: string): value is EntryStatus {
  return ["planned", "watching", "completed", "dropped"].includes(value);
}

export function getFirstParam(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}
