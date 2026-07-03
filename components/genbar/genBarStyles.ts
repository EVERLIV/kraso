/** Shared generation bar tokens — 6px radius everywhere. */
export const GEN_BAR_R = 'rounded-[6px]';

export const GEN_BAR_FORM =
  `bg-card-light ${GEN_BAR_R} p-5 sm:p-[22px] border border-[var(--border-soft)]`;

export const GEN_BAR_CHIP =
  `inline-flex h-10 items-center justify-center gap-2 ${GEN_BAR_R} border border-[var(--border-soft)] bg-surface-muted px-3 text-xs font-medium text-ink shrink-0 hover:bg-[var(--border-color)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`;

export const GEN_BAR_CHIP_MUTED = 'text-ink-muted';

export const GEN_BAR_DROPDOWN =
  `absolute bottom-full left-0 mb-1.5 z-50 min-w-[8.5rem] ${GEN_BAR_R} border border-[var(--border-color)] bg-card-light shadow-xl p-1`;

/** Opens below the trigger — use when the chip sits near the bottom of a panel. */
export const GEN_BAR_DROPDOWN_DOWN =
  `absolute top-full left-0 right-0 mt-1.5 z-[60] min-w-[8.5rem] ${GEN_BAR_R} border border-[var(--border-color)] bg-card-light shadow-xl p-1`;

/** One row in ratio / quality / model dropdowns — same height. */
export const GEN_BAR_DROPDOWN_ITEM =
  `w-full flex items-center gap-2 px-3 py-2 ${GEN_BAR_R} text-xs transition-colors`;

/** 3D pressed-button style from the design system (see CreditsPage BUTTON_3D) — no glow, solid bevel edge. */
export const GEN_BAR_GENERATE =
  `inline-flex h-10 items-center justify-center gap-1.5 ${GEN_BAR_R} text-on-primary text-xs font-semibold shrink-0
  bg-gradient-to-b from-[#d4ff3a] to-[#9bdd04] border-t border-white/40
  shadow-[0_3px_0_0_#6fa000,0_5px_10px_-3px_rgba(0,0,0,0.5)]
  active:translate-y-[2px] active:shadow-[0_1px_0_0_#6fa000,0_2px_5px_-2px_rgba(0,0,0,0.4)]
  disabled:opacity-50 disabled:pointer-events-none
  transition-all duration-100`;

export const GEN_BAR_ADD_PHOTO =
  `size-8 shrink-0 ${GEN_BAR_R} border border-[var(--border-soft)] bg-surface-muted text-ink-body flex items-center justify-center hover:bg-[var(--border-color)] transition-colors`;
