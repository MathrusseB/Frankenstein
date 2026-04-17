# Frankenstein Trikes — Design System
## Claude Code: Read Me First

You are working on the Frankenstein Trikes site rebuild. This file is the source of truth for all design decisions. Read it every session before making visual changes.

The full visual reference is in `design/design-system.html`. The interactive preview is at `design-system.pdf`.

---

## The System: "Modern Muscle"

Near-black workshop backgrounds, warm off-white foregrounds, one loud accent (Monster Green), condensed display type, industrial monospace labels, zero gradients, zero glass, zero SaaS roundness.

## Six Principles — non-negotiable

1. **Weight over light.** Heavy condensed type. Hard edges. Radii never above 4px.
2. **Hard light.** Near-black backgrounds. Warm off-white foregrounds. No moody grey mid-tones.
3. **Frank's voice stays.** Owner's Promise, "Create Your Own Monster," Pleasanton Kansas references — never rewrite.
4. **Show the iron.** Every kit and component gets a real photo. If missing, use a labeled striped placeholder — NEVER invent an icon or SVG illustration.
5. **One loud color.** Monster Green for CTAs, active states, key numbers. Red ONLY for urgency (phone CTA, warnings). No rainbow palettes.
6. **One interaction that pays off.** The Kit Finder (Year → Make → Model). Everything else stays simple.

---

## Token Mapping — what changed in `:root`

Your existing tokens keep the same names. Only values change. This means zero refactor of HTML class names.

| Variable | Old value | New value | Note |
|---|---|---|---|
| `--bg` | `#0A0A0A` | `#0A0A0B` | Slightly warmer |
| `--surface` | `#1c1c1c` | `#141416` | Panel color |
| `--text` | `#F0F0F0` | `#F4F1EA` | Warm paper tone |
| `--text-secondary` | `rgba(255,255,255,0.5)` | `#CFCBC1` | Solid warm |
| `--accent` | `#B22222` (red) | `oklch(82% 0.22 135)` Monster Green | **Primary change** |
| `--gold` | `#D4A84B` | **RETIRE** | Replaced by `--mon-deep` or removed |
| `--border` | `rgba(255,255,255,0.08)` | `#2A2A2F` | Solid hairline |

New additions:
- `--accent-dim` — hover green
- `--danger` — `oklch(62% 0.22 28)` — stoplight red, reserved for phone CTAs and warnings
- `--paper-mute` — `#8C8A82` — for monospace labels

See `design/tokens.css` for the drop-in block.

---

## Type System — what to swap

Remove: `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed...')`

Add:
```
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

| Role | Old | New |
|---|---|---|
| Display (h1–h4, `.headline`, kit titles) | Barlow Condensed 800 | **Anton 400**, letter-spacing 0.005em |
| Body | Helvetica Neue | **Inter 400** |
| Eyebrow / labels / specs | Helvetica 12px | **JetBrains Mono 11px**, letter-spacing 0.18em |

See `design/type.css` for the drop-in.

---

## Class-name rules — don't rename

Your BEM classes (`.nav__brand`, `.kit-card__title`, `.faq-item__head`, `.gateway__num`) stay exactly as they are. Only the properties change. This keeps HTML untouched across all 11 pages.

**Exception:** Add these new utility classes (see `design/components.css`):
- `.btn--danger` — red, urgency-only (phone CTAs)
- `.ticked` — decorative corner ticks on panels
- `.mono` — apply JetBrains Mono to a span
- `.kit-finder` and children — the new Year/Make/Model selector

---

## Hard rules

**NEVER:**
- Add gradients (linear, radial, conic). The only acceptable "gradient" is the hero overlay, and that's a flat opacity ramp over a photo.
- Use icons to carry meaning. If a label is needed, use a word.
- Round corners above 4px.
- Tint cards or buttons with Monster Green as a fill — it's a highlighter, not a surface.
- Rewrite Frank's copy. Never invent a testimonial.
- Draw SVG illustrations of trikes, motors, or tools. Use the `.ph` placeholder treatment from `components.css` until real photography exists.
- Stack more than two accent colors on a page.

**ALWAYS:**
- Leave `--accent` as the ONE green per view (primary CTA or a single data point).
- Use hairline `1px solid var(--border)` rules between sections instead of card shadows.
- Use JetBrains Mono for all numbers, spec values, part numbers, timestamps.
- Keep every page on Ink (`--bg`) background. Only the "Our Story" long-form section may use `--text` as background (inverted).
- Leave a trailing `Version` comment at the top of any CSS file you edit:
  `/* Edited against design/CLAUDE.md vN — YYYY-MM-DD */`

---

## File watchlist

These files must stay in sync with this design system. If you edit any of them, re-read this doc first:

- `css/styles.css`
- Any hero block in `index.html`
- `kit-detail.html` (Kit Finder lives here too)
- Any new component files under `css/components/`

---

## Rollout — see `design/TASKS.md`

Phase 1 (one session): swap tokens + fonts. No structural changes. Ships 80% of the visual lift.
Phase 2: Kit Finder on index + kit-detail.
Phase 3: Photography refresh + hero rebuild.

Do NOT do Phase 2 or 3 until Phase 1 is merged and deployed.

---

## Visual reference

Open `design/design-system.html` in a browser — or the PDF — to see every component rendered. That file is the final arbiter. If this markdown and the HTML disagree, the HTML wins.
