export const CATEGORIES = ["manga", "anime", "movie", "drama", "novel"] as const;
export const STATUSES = ["planned", "watching", "completed", "dropped"] as const;

export type Category = (typeof CATEGORIES)[number];
export type EntryStatus = (typeof STATUSES)[number];
export type DataMode = "demo" | "live";
export type DataSource = "demo" | "seed" | "user";

export interface MediaEntry {
  id: string;
  title: string;
  slug: string;
  category: Category;
  status: EntryStatus;
  rating: number | null;
  review: string;
  memo: string;
  tags: string[];
  country: string;
  consumedOn: string | null;
  isWishlist: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EntryFilters {
  category?: string;
  status?: string;
  tag?: string;
  search?: string;
  minRating?: number;
}

export interface ViewerContext {
  mode: DataMode;
  source: DataSource;
  user: {
    email: string | null;
  } | null;
}

export interface MonthlyStat {
  key: string;
  label: string;
  count: number;
}

export interface CountBucket {
  label: string;
  value: number;
}

export interface DashboardSummary {
  totalEntries: number;
  completedCount: number;
  watchingCount: number;
  plannedCount: number;
  droppedCount: number;
  wishlistCount: number;
  averageRating: number;
  highRatedCount: number;
  categoryBreakdown: CountBucket[];
  statusBreakdown: CountBucket[];
  monthlyStats: MonthlyStat[];
  topTags: CountBucket[];
  recentEntries: MediaEntry[];
  topCountries: CountBucket[];
}
