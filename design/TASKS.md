# Rollout Tasks — Claude Code Prompt Library

Each task below is a **ready-to-paste prompt for Claude Code**. Copy the block under each heading and send it to Claude Code. They are ordered by ROI. Do Phase 1 first, in order, one task per commit. No skipping.

---

## PHASE 1 — Apply the design system (no structural changes)

### Task 01 — Install new tokens

> Read `design/CLAUDE.md` first, then replace the `:root { ... }` block at the top of `css/styles.css` with the contents of `design/tokens.css`. Remove the `@import url('...Barlow+Condensed...')` line at the very top of `styles.css` — it is replaced in Task 02. Do not change any other rules in this commit. Open every HTML file locally and verify nothing is broken. Commit as `design: swap color tokens to Modern Muscle v1`.

### Task 02 — Install new type system

> Append the contents of `design/type.css` to the top of `css/styles.css` (directly after the `:root` block). Then delete or comment out the old `h1-h6, .headline { font-family: 'Barlow Condensed' ... }` rules and the base `html { font-family: 'Helvetica Neue' ... }` rule so the new ones take effect. Do not change any HTML. Commit as `design: Anton + Inter + JetBrains Mono typography`.

### Task 03 — Install component overrides

> Append the contents of `design/components.css` to `css/styles.css`. Open every HTML file locally and scroll through to verify buttons, kit cards, gateway rows, pull quote, and the marquee all render correctly. Commit as `design: button + component overrides`.

### Task 04 — Retire the gold color

> Grep `css/styles.css` for every use of `var(--gold)` and `--gold:`. Replace `var(--gold)` with `var(--accent-deep)` where used for text, or `var(--text-mute)` where used as a subdued label color. Remove the `--gold` CSS variable declaration from `:root`. Verify visually on the Kit Detail page (it was used on submodel years) and Warranty (doc__tag). Commit as `design: retire gold accent, fold into new palette`.

### Task 05 — Swap hero treatment

> In `index.html`, remove the `.hero__logo-wrap` block from the hero — the nav already shows the logo, so it's redundant. In `css/styles.css`, replace the `.hero__media--image` background with:
> ```
> background:
>   linear-gradient(90deg, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.35) 55%, rgba(10,10,11,0) 100%),
>   url('../images/hero.jpg') center/cover no-repeat,
>   #0A0A0B;
> ```
> (If `images/hero.jpg` doesn't exist yet, temporarily point it at whatever is in the images folder that shows a real trike — NOT the logo, NOT a flame texture.) Commit as `design: cleaner hero — remove redundant logo, real trike bg`.

### Task 06 — Replace film-grain noise with subtle dot grid (optional)

> In `css/styles.css`, find the `body::after` film-grain rule. Leave it, but change `opacity: 0.05` to `opacity: 0.03`. Commit as `design: soften film grain`.

---

## PHASE 2 — The Kit Finder (the one interaction that pays off)

### Task 07 — Copy Kit Finder assets into the project

> Copy `design/kit-finder.js` to `js/kit-finder.js`. Copy only the `.kit-finder`, `.kit-finder__*`, `.badge`, and `.util-bar` rules from `design/components.css` — these are already appended in Task 03, so this is a no-op in most cases. Verify by grepping `css/styles.css` for `.kit-finder`.

### Task 08 — Mount the Kit Finder on the homepage

> In `index.html`, after the `<section class="hero ...">` and BEFORE `<section class="section">` (the About section), insert a new section:
> ```
> <section class="section section--tight">
>   <div class="container">
>     <div class="kit-finder ticked" data-kit-finder><span class="tick-b"></span></div>
>   </div>
> </section>
> ```
> Add `<script src="js/kit-finder.js" defer></script>` before `</body>`. Verify year/make/model selects work and a match renders with the correct `kit-detail.html?id=...` link. Commit as `feat: Kit Finder on homepage`.

### Task 09 — Mount the Kit Finder on Trike Kits index

> In `trike-kits.html`, at the top of `<main>` (right after the page-header), insert the same `<section>` block as Task 08. Add the `<script src="js/kit-finder.js" defer></script>` before `</body>`. Commit as `feat: Kit Finder on trike-kits.html`.

### Task 10 — Use the saved bike across the site

> In `js/main.js`, add a small module that reads `localStorage.getItem('frankenstein.bike')` on page load. If a bike is saved, prepend a `.util-bar` element inside `<header class="site-header">` before `<nav class="nav">` with text: `◆ FOR YOUR {year} {make} {model} — CHANGE BIKE →`. Clicking "CHANGE BIKE" scrolls to the Kit Finder if present, or links to `index.html#kit-finder` otherwise. Commit as `feat: persistent bike selection utility bar`.

---

## PHASE 3 — Photography + polish (do not start until Phase 2 merged)

### Task 11 — Placeholder swap for kit cards

> Every kit card image in `data/*.json` or `kit-detail.html` that currently uses a stock or missing image should be replaced with a labeled placeholder div using the `.ph` class. In `kit-detail.html`, find the `.kit-hero__media > img` and wrap/replace with `<div class="ph" style="aspect-ratio:4/3"><div class="ph-tag">// PRODUCT SHOT NEEDED — {kit name} · 3/4 REAR</div></div>` when `img.src` is missing or returns 404. This makes gaps in the photo library obvious instead of hidden. Commit as `design: honest placeholders for missing product photos`.

### Task 12 — Add a "phone CTA" in red

> On `contact.html` and in the `.cta-band` section of `index.html`, add a `.btn--danger` as the FIRST button in the `.btn-row`. Label: "CALL (913) 352-6788". Link: `tel:+19133526788`. This is the ONLY place on the site that uses red. Commit as `feat: prominent phone CTA on contact + home`.

### Task 13 — Stat strip upgrade

> In `index.html`, inside each `.stats__item`, wrap the numeric portion of `.stats__value` in `<span class="num">...</span>` and wrap the unit/suffix in `<span class="unit">`. Example: `<div class="stats__value"><span class="num">1995</span><span class="unit">.</span></div>` for "Since 1995", `<span class="num">13</span><span class="unit">×</span>` for "13 Models", etc. Commit as `design: Anton + mono stat treatment`.

### Task 14 — Convert pull quote to Anton display

> The `.pullquote__text` rule is already updated in Task 03. Verify on `index.html` that the quote renders in Anton uppercase and has a left accent bar. No HTML changes needed — this is a visual QA task.

### Task 15 — Real photography brief

> Create `design/PHOTO-BRIEF.md` with a shot list: one hero shot per kit (13), one portrait of Frank Pedersen, one wide shop shot, one install sequence (4-6 frames), one customer rider cluster (5-8 photos). Each with lighting notes: hard rim light, near-black background, warm off-white bounce. Commit as `docs: photography brief for shop day`.

---

## How to work with this list

- Each task is small enough for one Claude Code session.
- NEVER batch Phase 1 tasks together. Commit per task so visual regressions are bisectable.
- If Claude Code asks "should I also…" — the answer is no. Stick to the task.
- When Phase 1 is fully merged and deployed, verify on staging, then start Phase 2.
- Re-read `design/CLAUDE.md` if any task feels ambiguous.

---

## Bugs this rollout fixes

- Logo duplicated in nav + hero (Task 05)
- Barlow Condensed reads generic "moto blog" rather than muscle-shop (Task 02)
- No differentiation between primary red CTA and warning-red (Tasks 01 + 12)
- Kit Detail page links exist but no way to find WHICH kit fits YOUR bike (Tasks 08–10)
- Gold accent color unused/inconsistent (Task 04)
