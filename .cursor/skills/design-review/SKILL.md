---
name: design-review
description: Audit a landing page or web UI for design system compliance and visual consistency. Use this skill whenever the user asks to "check the design", "review the landing", "проверь дизайн", "дизайн ревью", "сверь с дизайн-системой", mentions inconsistent styles/colors/spacing, or asks whether a page follows the design system — even if they don't say "audit" explicitly. Also use it after implementing or significantly changing any UI, before it ships.
---

# Design Review

Audit a page against the project's design system and produce an actionable violations report. Do NOT redesign or express taste opinions — this skill checks compliance and consistency against the project's own rules.

## Step 1 — Load the design system (source of truth)

Find the design system definition, in this priority order:

1. `DESIGN.md` / `design-system.md` / `docs/design*` in the repo root (Video Studio: `docs/design-system/video-studio.md`)
2. Design tokens: `tailwind.config.{js,ts}` (theme section), `tokens.css` / `variables.css` / `globals.css` (`:root` custom properties), `theme.ts`
3. Component library: `components/ui/` (shadcn or custom) — canonical variants of Button, Card, Input, etc.
4. `.cursor/rules` or `CLAUDE.md` design-related rules

Extract into a working checklist: color palette (with allowed usage), type scale (sizes/weights/line-heights), spacing scale, border radii, shadows, breakpoints, component variants. If no design system source is found, STOP and ask the user where it lives — do not invent one.

## Step 2 — Capture the actual page

Prefer a live audit over reading code alone:

- If a browser MCP is available (Chrome DevTools MCP / Playwright MCP): open the target URL, take full-page screenshots at 375px, 768px, and 1440px widths, and read computed styles of key elements (headings, buttons, cards, section containers).
- If no browser tool: statically analyze the page's source files (JSX/HTML/CSS). Collect every literal value: hex/rgb colors, px/rem sizes, font sizes, arbitrary Tailwind values like `p-[13px]`, `text-[#3A3A3A]`, `mt-[27px]`.

## Step 3 — Audit checklist

Check each category and record every violation with file + line (or selector/screenshot region):

1. **Colors** — every color must resolve to a token. Flag: hardcoded hex/rgb not in palette, near-duplicates (#333 vs #2F2F2F vs gray-800), wrong semantic use (brand color as body text, etc.).
2. **Typography** — font sizes/weights/line-heights must come from the type scale. Flag: off-scale sizes, more than 2 font families, inconsistent heading hierarchy (h2 smaller than h3, skipped levels), inconsistent letter-spacing/case on same-level elements.
3. **Spacing** — paddings/margins/gaps must come from the spacing scale. Flag: arbitrary values, inconsistent section vertical rhythm (one section py-16, next py-[72px]), inconsistent gaps in similar grids/lists.
4. **Radii & shadows** — must use defined tokens. Flag: mixed radii on same component type (some cards rounded-xl, some rounded-2xl), one-off shadows.
5. **Components** — same UI role must use the same component/variant. Flag: two visually different "primary" buttons, duplicate ad-hoc implementations of existing components, inconsistent hover/focus states, icon sets mixed (different libraries/stroke widths).
6. **Layout & responsiveness** — consistent max-width container across sections, aligned grid, no horizontal overflow at 375px, touch targets ≥44px on mobile.
7. **Cross-section consistency** — compare sections against each other: heading style, CTA style, card style, image treatment (radius, aspect ratio) should match sitewide.
8. **A11y quick pass** — text/background contrast ≥4.5:1 for body text (compute it, don't eyeball), visible focus states, alt on meaningful images.

## Step 4 — Report

Output a report in the user's language (Russian if they wrote in Russian) in this exact structure:

```
# Design Review: <page/URL>

## Score: N/10  (10 = fully compliant)

## 🔴 Critical (breaks visual consistency, visible to users)
- [colors] Hero CTA uses #FF6B35, token is --color-accent #FF7A00 — src/components/Hero.tsx:42
  Fix: replace with `bg-accent`

## 🟡 Moderate (off-system values, low visual impact)
- ...

## 🟢 Minor / nitpicks
- ...

## ✅ Compliant areas
- (brief, 2-4 bullets)

## Summary table
| Category | Violations | Worst offender |
```

Every violation MUST include: category, actual value vs expected token, exact location, and a one-line fix. No vague findings like "spacing feels inconsistent" — always cite concrete values.

## Step 5 — Offer fixes

After the report, offer to auto-fix. If the user agrees: fix Critical and Moderate items only, one category at a time, replacing literals with tokens/classes from the design system. Never change the visual intent (don't "improve" the design) — only normalize values to the nearest token. After fixing, re-run Step 2–3 on the changed sections to verify.

## Rules

- The design system is the authority. If the design system itself seems wrong, note it separately as "design system feedback" — don't silently deviate.
- If a value is intentionally off-system (e.g. a marketing one-off), flag it anyway and let the user decide.
- Keep the report tight: group identical violations ("#333 hardcoded in 14 places: list of files") instead of 14 separate lines.
