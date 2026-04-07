import { CATEGORIES, STATUSES } from "@/lib/types";
import {
  CATEGORY_META,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  STATUS_META,
  subtleCardClass
} from "@/lib/media-config";

interface FilterValues {
  category?: string;
  status?: string;
  tag?: string;
  search?: string;
  minRating?: number;
}

export function FilterBar({
  filters,
  tags
}: {
  filters: FilterValues;
  tags: string[];
}) {
  return (
    <form
      action="/archive"
      className={`${subtleCardClass} grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-6`}
    >
      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-muted">제목</span>
        <input
          type="search"
          name="search"
          defaultValue={filters.search}
          placeholder="제목으로 찾기"
          className={inputClassName}
        />
      </label>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-muted">카테고리</span>
        <select name="category" defaultValue={filters.category} className={inputClassName}>
          <option value="">전체 카테고리</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_META[category].label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-muted">상태</span>
        <select name="status" defaultValue={filters.status} className={inputClassName}>
          <option value="">전체 상태</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_META[status].label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-muted">태그</span>
        <select name="tag" defaultValue={filters.tag} className={inputClassName}>
          <option value="">전체 태그</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-xs uppercase tracking-[0.24em] text-muted">최소 평점</span>
        <select
          name="minRating"
          defaultValue={filters.minRating ? String(filters.minRating) : ""}
          className={inputClassName}
        >
          <option value="">전체 평점</option>
          {[10, 9, 8, 7, 6, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating}점 이상
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-end gap-3">
        <button type="submit" className={primaryButtonClassName}>
          적용
        </button>
        <a href="/archive" className={secondaryButtonClassName}>
          초기화
        </a>
      </div>
    </form>
  );
}
