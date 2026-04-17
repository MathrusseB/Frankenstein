# Frankenstein Trikes — Design System

This folder is the source of truth for all visual decisions on the Frankenstein Trikes rebuild.

## For Claude Code

**Start here:** [`CLAUDE.md`](./CLAUDE.md) — you must read this before making any visual change. It contains principles, hard rules, and token mappings.

**Then:** [`TASKS.md`](./TASKS.md) — prompt library. Copy-paste prompts directly into your Claude Code session, one at a time, in order.

## For humans

Open [`design-system.html`](./design-system.html) in a browser. Every color, type scale, component, and page-level pattern is rendered there. It's the final arbiter — if any markdown file disagrees with the HTML, the HTML wins.

## File index

| File | Purpose |
|---|---|
| `CLAUDE.md` | Read-me-first for Claude Code |
| `README.md` | This file |
| `TASKS.md` | Rollout prompts for Claude Code, in order |
| `tokens.css` | Drop-in `:root` replacement |
| `type.css` | Font imports + h1-h6 + label rules |
| `components.css` | Button + component overrides + new `.kit-finder`, `.ticked`, `.ph`, `.badge` |
| `kit-finder.js` | The Year→Make→Model picker — no dependencies |
| `design-system.html` | Visual reference — open in browser |

## How to update

1. Edit the design system **in this folder first**.
2. Update `CLAUDE.md` and `design-system.html` to match.
3. Write a new task in `TASKS.md` telling Claude Code what to change in the actual site code.
4. Bump the version at the top of `CLAUDE.md`.
