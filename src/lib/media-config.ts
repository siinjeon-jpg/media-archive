import { type Category, type EntryStatus } from "@/lib/types";

export const CATEGORY_META: Record<
  Category,
  {
    label: string;
    icon: string;
    gradient: string;
    tint: string;
    accent: string;
    hint: string;
  }
> = {
  manga: {
    label: "만화",
    icon: "컷",
    gradient: "from-orange-400/25 via-amber-500/10 to-transparent",
    tint: "bg-orange-500/10",
    accent: "text-orange-200",
    hint: "오래 품게 되는 장면과 감정이 또렷하게 남는 만화들."
  },
  anime: {
    label: "애니",
    icon: "프레임",
    gradient: "from-cyan-400/25 via-sky-500/10 to-transparent",
    tint: "bg-cyan-500/10",
    accent: "text-cyan-200",
    hint: "움직임과 분위기, 감정의 여운이 오래 이어지는 작품들."
  },
  movie: {
    label: "영화",
    icon: "시네마",
    gradient: "from-rose-400/25 via-pink-500/10 to-transparent",
    tint: "bg-rose-500/10",
    accent: "text-rose-200",
    hint: "한 번의 몰입으로 깊게 남는 세계와 연출의 결."
  },
  drama: {
    label: "드라마",
    icon: "에피소드",
    gradient: "from-emerald-400/25 via-lime-500/10 to-transparent",
    tint: "bg-emerald-500/10",
    accent: "text-emerald-200",
    hint: "서서히 스며드는 감정선과 인물의 결이 좋은 이야기들."
  },
  novel: {
    label: "소설",
    icon: "페이지",
    gradient: "from-violet-400/25 via-fuchsia-500/10 to-transparent",
    tint: "bg-violet-500/10",
    accent: "text-violet-200",
    hint: "문장과 사유, 내면의 결이 오래 남는 작품들."
  }
};

export const STATUS_META: Record<
  EntryStatus,
  {
    label: string;
    className: string;
  }
> = {
  planned: {
    label: "예정",
    className: "border-white/10 bg-white/5 text-foreground"
  },
  watching: {
    label: "보는 중",
    className: "border-cyan-400/25 bg-cyan-400/10 text-foreground"
  },
  completed: {
    label: "완료",
    className: "border-emerald-400/25 bg-emerald-400/10 text-foreground"
  },
  dropped: {
    label: "중단",
    className: "border-rose-400/25 bg-rose-400/10 text-foreground"
  }
};

export const shellCardClass =
  "rounded-[2rem] border border-border/40 bg-surface/80 shadow-glow backdrop-blur-xl";

export const subtleCardClass =
  "rounded-[1.75rem] border border-border/40 bg-surface/65 backdrop-blur-xl";

export const inputClassName =
  "w-full rounded-2xl border border-border/40 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-cyan-300/40 focus:bg-background/70";

export const textareaClassName = `${inputClassName} min-h-[160px] resize-y`;

export const primaryButtonClassName =
  "inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-medium text-slate-950 transition hover:translate-y-[-1px] hover:bg-white disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-border/40 bg-surface/70 px-5 py-3 text-sm font-medium text-foreground transition hover:border-white/20 hover:bg-white/10";

export const ghostButtonClassName =
  "inline-flex items-center justify-center rounded-full border border-transparent px-4 py-2 text-sm text-muted transition hover:bg-white/5 hover:text-foreground";
