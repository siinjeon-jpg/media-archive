import { unstable_noStore as noStore } from "next/cache";

import {
  CATEGORIES,
  STATUSES,
  type DashboardSummary,
  type EntryFilters,
  type MediaEntry,
  type ViewerContext
} from "@/lib/types";
import { SAMPLE_ENTRIES } from "@/lib/sample-data";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { average, formatMonthLabel } from "@/lib/utils";

function normalizeEntry(row: Record<string, unknown>): MediaEntry {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    category: String(row.category) as MediaEntry["category"],
    status: String(row.status) as MediaEntry["status"],
    rating:
      typeof row.rating === "number"
        ? row.rating
        : row.rating === null
          ? null
          : Number(row.rating),
    review: String(row.review ?? ""),
    memo: String(row.memo ?? ""),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    country: String(row.country ?? ""),
    consumedOn: row.consumed_on ? String(row.consumed_on) : null,
    isWishlist: Boolean(row.is_wishlist),
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString())
  };
}

function sortEntries(entries: MediaEntry[]) {
  return [...entries].sort((left, right) => {
    const leftDate = left.consumedOn ?? left.updatedAt;
    const rightDate = right.consumedOn ?? right.updatedAt;
    return new Date(rightDate).getTime() - new Date(leftDate).getTime();
  });
}

export async function getViewerContext(): Promise<ViewerContext> {
  noStore();

  if (!isSupabaseConfigured()) {
    return {
      mode: "demo",
      source: "demo",
      user: null
    };
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      mode: "demo",
      source: "demo",
      user: null
    };
  }

  const { count, error } = await supabase
    .from("media_entries")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return {
    mode: "live",
    source: error || (count ?? 0) === 0 ? "seed" : "user",
    user: {
      email: user.email ?? null
    }
  };
}

export async function getEntriesSource() {
  noStore();

  if (!isSupabaseConfigured()) {
    return {
      entries: sortEntries(SAMPLE_ENTRIES),
      mode: "demo" as const,
      source: "demo" as const,
      user: null
    };
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      entries: sortEntries(SAMPLE_ENTRIES),
      mode: "demo" as const,
      source: "demo" as const,
      user: null
    };
  }

  const { data, error } = await supabase
    .from("media_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("consumed_on", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to load entries from Supabase", error.message);

    return {
      entries: sortEntries(SAMPLE_ENTRIES),
      mode: "live" as const,
      source: "seed" as const,
      user: {
        email: user.email ?? null
      }
    };
  }

  const normalizedEntries = (data ?? []).map(normalizeEntry);

  if (normalizedEntries.length === 0) {
    return {
      entries: sortEntries(SAMPLE_ENTRIES),
      mode: "live" as const,
      source: "seed" as const,
      user: {
        email: user.email ?? null
      }
    };
  }

  return {
    entries: sortEntries(normalizedEntries),
    mode: "live" as const,
    source: "user" as const,
    user: {
      email: user.email ?? null
    }
  };
}

export function applyEntryFilters(entries: MediaEntry[], filters: EntryFilters) {
  return entries.filter((entry) => {
    if (filters.category && entry.category !== filters.category) {
      return false;
    }

    if (filters.status && entry.status !== filters.status) {
      return false;
    }

    if (
      filters.tag &&
      !entry.tags.some((tag) => tag.toLowerCase() === filters.tag?.toLowerCase())
    ) {
      return false;
    }

    if (filters.minRating && (entry.rating ?? 0) < filters.minRating) {
      return false;
    }

    if (
      filters.search &&
      !entry.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
}

export function getAllTags(entries: MediaEntry[]) {
  return Array.from(
    new Set(entries.flatMap((entry) => entry.tags.map((tag) => tag.trim())))
  ).sort((left, right) => left.localeCompare(right));
}

export function buildDashboardSummary(entries: MediaEntry[]): DashboardSummary {
  const ratings = entries
    .map((entry) => entry.rating)
    .filter((rating): rating is number => typeof rating === "number");

  const monthlyMap = new Map<string, number>();
  const now = new Date();
  const months: string[] = [];

  for (let index = 5; index >= 0; index -= 1) {
    const current = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    months.push(key);
    monthlyMap.set(key, 0);
  }

  entries.forEach((entry) => {
    if (!entry.consumedOn) {
      return;
    }

    const consumed = new Date(entry.consumedOn);
    const key = `${consumed.getFullYear()}-${String(
      consumed.getMonth() + 1
    ).padStart(2, "0")}`;

    if (monthlyMap.has(key)) {
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1);
    }
  });

  const tagCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();

  entries.forEach((entry) => {
    entry.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
    if (entry.country) {
      countryCounts.set(entry.country, (countryCounts.get(entry.country) ?? 0) + 1);
    }
  });

  return {
    totalEntries: entries.length,
    completedCount: entries.filter((entry) => entry.status === "completed").length,
    watchingCount: entries.filter((entry) => entry.status === "watching").length,
    plannedCount: entries.filter((entry) => entry.status === "planned").length,
    droppedCount: entries.filter((entry) => entry.status === "dropped").length,
    wishlistCount: entries.filter((entry) => entry.isWishlist).length,
    averageRating: average(ratings),
    highRatedCount: entries.filter((entry) => (entry.rating ?? 0) >= 9).length,
    categoryBreakdown: CATEGORIES.map((category) => ({
      label: category,
      value: entries.filter((entry) => entry.category === category).length
    })),
    statusBreakdown: STATUSES.map((status) => ({
      label: status,
      value: entries.filter((entry) => entry.status === status).length
    })),
    monthlyStats: months.map((month) => ({
      key: month,
      label: formatMonthLabel(month),
      count: monthlyMap.get(month) ?? 0
    })),
    topTags: [...tagCounts.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value })),
    topCountries: [...countryCounts.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value })),
    recentEntries: sortEntries(entries).slice(0, 4)
  };
}

export async function getArchiveData(filters: EntryFilters = {}) {
  const source = await getEntriesSource();
  const filteredEntries = applyEntryFilters(source.entries, filters);

  return {
    ...source,
    filteredEntries,
    tags: getAllTags(source.entries),
    summary: buildDashboardSummary(source.entries)
  };
}

export async function getEntryBySlug(slug: string) {
  const source = await getEntriesSource();
  const entry = source.entries.find((item) => item.slug === slug);

  return {
    ...source,
    entry,
    related: source.entries
      .filter(
        (item) => item.slug !== slug && item.category === entry?.category
      )
      .slice(0, 3)
  };
}
