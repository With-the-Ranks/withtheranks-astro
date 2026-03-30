# With the Ranks design system

This file is the UI source of truth for the site. If Figma and code disagree, update this doc and the tokens in `tailwind.config.mjs` and `src/styles/main.css` together.

---

## Guidelines

1. **Typography**  
   Headlines use **League Gothic** (open source, [The League of Movable Type](https://www.theleagueofmoveabletype.com/league-gothic)). Body and UI use **Tofino Personal** from [Lost Type](https://www.losttype.com/) (pay what you want; not open source, so keep licensing with the project).

2. **Layout and tone**  
   Clear hierarchy, comfortable spacing, light motion. Let type and color do the work, not extra decoration.

3. **Tokens first**  
   For surfaces and text that follow the site theme, use Tailwind: `bg-background`, `text-foreground`, `accent-green`, `accent-purple`, plus `font-display` and `font-sans`. For one-off marketing colors in components, use normal Tailwind arbitrary values or scoped CSS when needed.

4. **Light and dark**  
   Theme token values swap under `[data-theme="light"]` and `[data-theme="dark"]` via the CSS variables below.

---

## Typography

| Role | Font | In Tailwind |
|------|------|-------------|
| Headings, hero lines, big section titles | League Gothic | `font-display` |
| Paragraphs, lists, forms, nav, buttons | Tofino Personal | `font-sans` (default sans stack) |

**League Gothic** loads from Google Fonts via `@import` at the top of `src/styles/main.css`. No League font files in the repo.

**Tofino Personal** is self-hosted. Add licensed **woff2** files under `public/fonts/tofino/` (see `src/styles/main.css` for paths), or change the `@font-face` URLs to match your filenames:

- `tofino-personal-text-book.woff2` for weight 400  
- `tofino-personal-text-bold.woff2` for weight 700  

If those files are missing, the browser uses the system sans fallback.

**Rough scale:** `text-display-xl`, `text-display-lg`, `text-body`, `text-body-lg` (tune to match Figma later).

---

## Color (theme)

These map to CSS variables in `src/styles/main.css` and Tailwind under `theme.extend.colors`.

| Tailwind | CSS variable | Use |
|----------|--------------|-----|
| `background` | `--main-bg-color` | Page background |
| `foreground` | `--main-text-color` | Main text color |
| `accent-green` | `--stop-one-color` | Primary accent |
| `accent-purple` | `--stop-two-color` | Secondary accent (links, focus, etc.) |

Examples: `bg-background`, `text-foreground`, `text-accent-green`, `border-accent-purple`.

---

## Spacing and radius

- Spacing: default Tailwind scale (one unit = `0.25rem`, 4px).
- Small radius: `rounded-sm` / `rounded-md` / `rounded-lg` from `--radius`.
- Large marketing cards: **`rounded-card`** (32px).

---

## Quick checklist for new UI

- Headlines: `font-display`. Everything else readable: `font-sans`.
- Theme surfaces and type: `background`, `foreground`, `accent-green`, `accent-purple` as appropriate.
- League Gothic: loaded from `main.css`. Tofino: licensed files in `public/fonts/tofino/` per your agreement with Lost Type.
