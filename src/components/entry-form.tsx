import { CATEGORIES, STATUSES, type MediaEntry } from "@/lib/types";
import {
  CATEGORY_META,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  shellCardClass,
  STATUS_META,
  textareaClassName
} from "@/lib/media-config";
import { saveEntryAction } from "@/app/actions";

export function EntryForm({
  entry,
  error,
  disabled = false
}: {
  entry?: MediaEntry;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <form action={saveEntryAction} className={`${shellCardClass} space-y-8 p-6 md:p-8`}>
      <input type="hidden" name="entryId" value={entry?.id ?? ""} />
      <input type="hidden" name="currentSlug" value={entry?.slug ?? ""} />
      <input
        type="hidden"
        name="returnTo"
        value={entry ? `/archive/${entry.slug}/edit` : "/archive/new"}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">제목</span>
          <input
            required
            name="title"
            disabled={disabled}
            defaultValue={entry?.title}
            className={inputClassName}
            placeholder="작품 제목을 적어주세요"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">카테고리</span>
          <select
            required
            name="category"
            disabled={disabled}
            defaultValue={entry?.category ?? "anime"}
            className={inputClassName}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_META[category].label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">상태</span>
          <select
            required
            name="status"
            disabled={disabled}
            defaultValue={entry?.status ?? "planned"}
            className={inputClassName}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_META[status].label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">평점</span>
          <input
            name="rating"
            type="number"
            min="1"
            max="10"
            disabled={disabled}
            defaultValue={entry?.rating ?? ""}
            className={inputClassName}
            placeholder="1~10"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">
            국가
          </span>
          <input
            name="country"
            disabled={disabled}
            defaultValue={entry?.country}
            className={inputClassName}
            placeholder="일본, 한국, 미국..."
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">
            한 줄 감상
          </span>
          <input
            name="review"
            maxLength={180}
            disabled={disabled}
            defaultValue={entry?.review}
            className={inputClassName}
            placeholder="짧게 남기고 싶은 첫인상을 적어주세요"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">
            메모
          </span>
          <textarea
            name="memo"
            disabled={disabled}
            defaultValue={entry?.memo}
            className={textareaClassName}
            placeholder="인상 깊었던 장면, 좋았던 이유, 아쉬웠던 점을 편하게 남겨보세요"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">
            태그
          </span>
          <input
            name="tags"
            disabled={disabled}
            defaultValue={entry?.tags.join(", ")}
            className={inputClassName}
            placeholder="판타지, 여운, 미스터리"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.24em] text-muted">
            날짜
          </span>
          <input
            name="consumedOn"
            type="date"
            disabled={disabled}
            defaultValue={entry?.consumedOn ?? ""}
            className={inputClassName}
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <input
            type="checkbox"
            name="isWishlist"
            disabled={disabled}
            defaultChecked={entry?.isWishlist}
            className="h-4 w-4 rounded border-white/20 bg-transparent"
          />
          <span className="text-sm text-foreground">
            위시리스트에도 함께 표시
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={disabled} className={primaryButtonClassName}>
          {disabled ? "여기서는 수정할 수 없어요" : entry ? "저장하기" : "기록 만들기"}
        </button>
        <a
          href={entry ? `/archive/${entry.slug}` : "/archive"}
          className={secondaryButtonClassName}
        >
          취소
        </a>
      </div>
    </form>
  );
}
