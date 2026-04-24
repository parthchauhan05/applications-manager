# CareerFlow Frontend Style Guide

> **Version:** 1.0 — April 2026
> **Scope:** All pages rendered inside `DashboardLayout` (shell + sidebar + topbar).
> **Stack:** React + PrimeReact + plain CSS (no Tailwind in page-level styles).

---

## 1. Design Tokens

All values live in `:root` inside `src/styles/dashboard.css`. **Never hard-code a colour, radius, shadow, or easing value outside of this block.** Reference tokens via CSS custom properties everywhere.

### 1.1 Colour

```css
:root {
  /* Surfaces */
  --db-bg:           #eef2f7;   /* Page canvas — behind all cards */
  --db-surface:      #ffffff;   /* Primary card / panel surface */
  --db-surface-alt:  #f6f8fc;   /* Nested stat block / inner panel */
  --db-surface-alt-2:#edf2f7;   /* Second-level nested panel / notes */

  /* Borders (alpha-blended — adapts to surface colour) */
  --db-border:       rgba(15, 23, 42, 0.14);   /* Card outer edge */
  --db-border-mid:   rgba(15, 23, 42, 0.20);   /* Input, chip, icon-btn edge */

  /* Text */
  --db-text:         #1e2330;   /* Primary body text — headings, values */
  --db-muted:        #667085;   /* Secondary text — labels, meta */
  --db-faint:        #98a2b3;   /* Placeholder, icon overlays, section headers */

  /* Accent (Indigo) */
  --db-accent:       #4f46e5;
  --db-accent-hover: #4338ca;
  --db-accent-soft:  rgba(79, 70, 229, 0.10);  /* Tinted backgrounds */
}
```

#### Status palette (use only for status badges and pipeline bars)

| Status | Background | Text / Dot |
|---|---|---|
| Saved | `#f1f5f9` | `#475569` |
| Applied | `#eff6ff` | `#3b82f6` |
| Online Assessment | `#fefce8` | `#ca8a04` |
| Interview | `#f0fdf4` | `#16a34a` |
| Offer | `#f0fdf4` | `#15803d` |
| Rejected | `#fef2f2` | `#dc2626` |
| Withdrawn | `#f9fafb` | `#6b7280` |

Do **not** reuse status colours for non-status UI (charts, KPI cards, general badges).

### 1.2 Typography

The app uses the system sans-serif stack for all body copy and UI text. No external font is loaded.

```css
font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
```

| Role | Size | Weight | Colour |
|---|---|---|---|
| Page / board title | `1.15 – 2rem` | 700 | `--db-text` |
| Section / card title | `1rem – 1.05rem` | 600–700 | `--db-text` |
| Body / meta | `0.83 – 0.95rem` | 400–500 | `--db-muted` |
| Uppercase label | `0.72rem` + `letter-spacing: 0.12em` | 500 | `#9aa3b2` (faint) |
| Tiny chip / badge | `0.78 – 0.83rem` | 600–700 | status-specific |

Rules:
- **Minimum rendered size: 12 px.** Nothing smaller, ever.
- Use `letter-spacing: -0.02em` to `-0.04em` on headings ≥ 1rem.
- Keep body line-height at `1.5 – 1.7`.

### 1.3 Spacing

All spacing uses the 4 px base unit. Reference named steps:

| Token | Value |
|---|---|
| `--sp-1` | 4 px |
| `--sp-2` | 8 px |
| `--sp-3` | 12 px |
| `--sp-4` | 16 px |
| `--sp-6` | 24 px |
| `--sp-8` | 32 px |

Never use arbitrary pixel values. If a spacing value is needed that doesn't appear above, check whether the layout can be restructured before adding a new step.

### 1.4 Border Radius

```css
--db-radius-sm:  10px;   /* Inputs, chips, icon buttons, small badges */
--db-radius-md:  16px;   /* Stat blocks, inner panels, KPI cards */
--db-radius-lg:  22px;   /* Board / section containers */
--db-radius-full: 9999px; /* Pills (status badges, filter chips) */
```

**Nested radius rule:** inner element radius = outer radius − gap.  
For example: a `border-radius: 22px` card with `padding: 18px` contains panels at `border-radius: 16px` (not 22px).

### 1.5 Shadows

```css
--db-shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.04);
--db-shadow-md: 0 2px 12px rgba(15, 23, 42, 0.05);
--db-shadow-lg: 0 10px 28px rgba(15, 23, 42, 0.06);
```

Use `--db-shadow-sm` for KPI cards at rest, `--db-shadow-md` for board containers, `--db-shadow-lg` on hover lift. Never use pure-black shadows on the warm/cool surfaces.

### 1.6 Motion

```css
--db-ease:  cubic-bezier(0.16, 1, 0.3, 1);   /* All interactive transitions */
--db-speed: 160ms;
```

Standard `transition` pattern for every interactive element:
```css
transition:
  background  var(--db-speed) var(--db-ease),
  color       var(--db-speed) var(--db-ease),
  border-color var(--db-speed) var(--db-ease),
  box-shadow  var(--db-speed) var(--db-ease),
  transform   var(--db-speed) var(--db-ease);
```

Hover lifts: `transform: translateY(-1px)` for cards, `translateY(-2px)` for KPI cards. Active press: `transform: scale(0.97)` or `translateY(0)`.

---

## 2. Layout & Shell

### 2.1 Page Shell

All authenticated pages render inside `DashboardLayout`, which produces:

```
.shell.shell--app
├── aside.shell-sidebar-rail        ← sticky, 100 vh
│   └── .psb (AppSidebar)
└── .shell-content-area
    ├── AppTopbar (.shell-topbar)    ← sticky, 64 px, backdrop-blur
    └── main.shell-main              ← scroll region
        └── {page content}
```

| State | Sidebar width | Rail width |
|---|---|---|
| `.shell--sidebar-open` | 240 px | 240 px |
| `.shell--sidebar-closed` | collapsed icon-only | 64 px |

**The `main.shell-main` is the one and only scroll region per page.** Never add `overflow: auto` to nested containers.

### 2.2 Page Content Width

Wrap all page content in `.db-root`:

```css
.db-root {
  max-width: 900px;      /* Dashboard */
  max-width: 1120px;     /* Applications (scoped via .ap-page) */
  margin: 0 auto;
  padding: 28px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
```

For future pages: use 900 px for focused single-board views, 1120 px for list/table heavy views.

### 2.3 Topbar

Height is fixed at **64 px**. It is sticky with `z-index: 20` and uses `backdrop-filter: blur(12px)` over a `rgba(255,255,255,0.88)` background. Do not change the topbar height.

The topbar contains:
- Left: hamburger menu toggle + optional page breadcrumb
- Right: `+ New` CTA button + user avatar

---

## 3. Sidebar

Class namespace: `.psb` (persistent sidebar). Never apply dashboard `.db-*` rules to sidebar elements.

### 3.1 Structure

```
.psb
├── .psb__brand                  ← logo + app name
├── .psb__scroll                 ← flex-1, scrollable
│   └── .psb__section (×N)
│       ├── .psb__section-label
│       └── .psb__item (×N)
└── .psb__bottom
    ├── .psb__divider
    ├── .psb__item--util (×N)   ← Settings, Help
    ├── .psb__divider
    └── .psb__account
```

### 3.2 Nav Item States

| State | Background | Text colour | Transform |
|---|---|---|---|
| Default | transparent | `#6b7280` | — |
| Hover | `#f9fafb` | `#111827` | `translateX(2px)` |
| Active | `#eef2ff` | `#4338ca` | — |
| Active icon | `rgba(79,70,229,0.12)` bg | `#4f46e5` | — |
| Soon (disabled) | transparent | `#6b7280` + `opacity: 0.52` | none |

### 3.3 Brand Mark

The `.psb__mark` logo uses a `linear-gradient(135deg, #ede9fe, #ddd6fe)` background with `color: #4f46e5`. The same gradient is applied to all avatar elements (`.psb__avatar`, `.shell-brand__mark`, `.db-item__avatar`, `.db-app-card__avatar`).

### 3.4 "Soon" Chip

```css
.psb__soon-chip {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #a78bfa;
  background: #f5f3ff;
  padding: 2px 7px;
  border-radius: 100px;
  text-transform: uppercase;
}
```

Use the same visual style for any "Coming soon" indicator across the app.

---

## 4. Components

### 4.1 Board Container

The primary content wrapper for any list, table, or data view.

```css
.db-board {
  background: var(--db-surface);
  border: 1px solid var(--db-border);
  border-radius: var(--db-radius-lg);   /* 22px */
  box-shadow: var(--db-shadow-md);
  overflow: hidden;
}
```

Always contains:
1. `.db-board__header` — title, subtitle, action buttons
2. `.db-controls` — search + filter chips (if needed)
3. Content area (`.db-card-list`, `.db-list`, or a table)

### 4.2 KPI / Stat Card

```css
.db-kpi {
  display: flex; align-items: center; gap: 14px;
  padding: 18px 20px;
  background: var(--db-surface);
  border: 1px solid var(--db-border);
  border-radius: var(--db-radius-md);   /* 16px */
  box-shadow: var(--db-shadow-sm);
}
.db-kpi:hover {
  box-shadow: var(--db-shadow-lg);
  transform: translateY(-2px);
}
```

Icon block: 40×40 px, `border-radius: 12px`, `background: var(--db-accent-soft)`, `color: var(--db-accent)`.  
Value: `font-size: 1.65rem`, `font-weight: 700`, `letter-spacing: -0.04em`.  
Label: `font-size: 0.8rem`, `color: var(--db-muted)`.

### 4.3 Application Card (`.db-app-card`)

Used in the Applications page (`.ap-page` scope).

Structure:
```
.db-app-card
├── .db-app-card__top
│   ├── .db-app-card__identity (.db-app-card__avatar + .db-app-card__heading)
│   │   ├── .db-app-card__title-row  (h3 + .db-status-badge)
│   │   └── .db-app-card__company-row (.db-inline-meta ×N)
│   └── .db-app-card__actions (.db-row-icon-btn ×N)
├── .db-app-card__middle  (grid: 3 cols → 1 col on mobile)
│   └── .db-mini-stat ×3
├── .db-app-card__preview  (2-line clamped notes)
└── .db-app-card__expand   (toggled, border-top separated)
    ├── .db-expand-grid (.db-expand-block ×3)
    ├── .db-expand-notes
    └── .db-expand-actions
```

Card background: `#fff`, `border-radius: 22px`, `padding: 18px`.  
Inner panels (`.db-mini-stat`, `.db-expand-block`): `background: var(--db-surface-alt)`, `border-radius: 16px`.

### 4.4 Status Badge

```css
.db-status-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 10px;
  border-radius: 999px;       /* always pill */
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}
.db-status-badge__dot {
  width: 7px; height: 7px; border-radius: 50%;
}
```

Set `background` and `color` from the status palette table in §1.1. Never use coloured left-borders on cards — use the badge instead.

### 4.5 Filter Chip

```css
.db-chip {
  min-height: 34px;
  padding: 0 13px;
  border-radius: 999px;
  border: 1px solid var(--db-border-mid);
  background: var(--db-surface);
  color: var(--db-muted);
  font-size: 0.83rem; font-weight: 600;
}
.db-chip:hover    { border-color: var(--db-accent); color: var(--db-accent); background: var(--db-accent-soft); transform: translateY(-1px); }
.db-chip--active  { border-color: #4338ca; background: rgba(79,70,229,0.14); color: #3730a3; }
```

Include a `.db-chip__dot` for status chips that shows the status colour dot at 7×7 px.

### 4.6 Icon Button (`.db-row-icon-btn`)

34×34 px, `border-radius: 10px`, `border: 1px solid var(--db-border-mid)`, `background: var(--db-surface)`.  
Hover: `background: var(--db-accent-soft)`, `border-color: #4338ca`, `color: #4338ca`.  
Always add `aria-label` — these buttons contain icons only.

### 4.7 Search Input

```css
.db-search__input.p-inputtext {
  min-height: 46px;
  padding: 11px 40px;            /* space for left icon + right clear btn */
  border-radius: 14px;
  border: 1px solid var(--db-border-mid);
  background: #fafafa;
  font-size: 0.95rem;
}
.db-search__input.p-inputtext:focus {
  border-color: #4338ca;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.16);
  outline: none;
}
```

Prepend `.db-search__icon` (absolute, `left: 14px`, `color: var(--db-faint)`).  
Append `.db-search__clear` (absolute, `right: 12px`, 28×28 px) when input has a value.

### 4.8 Primary Button

Used in topbar (`shell-topbar__new`) and board headers (`db-btn-new`):

```css
background: var(--db-accent);        /* #4f46e5 */
border-color: var(--db-accent);
border-radius: var(--db-radius-sm);  /* 10px */
font-size: 0.88rem;
padding: 8px 16px;
```
Hover: `background: #3730a3; box-shadow: 0 4px 14px rgba(79,70,229,0.28); transform: translateY(-1px);`  
Active: `transform: translateY(0) scale(0.97);`

### 4.9 Skeleton Loader

```css
@keyframes db-shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
}
.db-skeleton {
  background: linear-gradient(90deg, #f6f7f9 25%, #eff1f4 50%, #f6f7f9 75%);
  background-size: 600px 100%;
  animation: db-shimmer 1.4s ease-in-out infinite;
  border-radius: var(--db-radius-sm);
}
/* Card skeleton height */
.db-card-skeleton { height: 172px; border-radius: 20px; }
```

Always show skeletons that mirror the real layout shape during loading. Never show a spinner alone for data-heavy views.

### 4.10 Empty State

```css
.db-empty {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 52px 32px; gap: 12px;
}
.db-empty__icon {
  width: 60px; height: 60px; border-radius: 20px;
  background: var(--db-accent-soft); color: var(--db-accent);
  display: grid; place-items: center; font-size: 1.3rem;
}
```

Every empty state **must** include: icon block, heading (`font-size: 1.1rem`, `font-weight: 700`), body copy (max 38 ch), and a primary action button. Never show just "No items."

### 4.11 Dialog (`app-dialog`)

```
.app-dialog
├── .p-dialog-header  (padding: 22px 22px 8px — no bottom border)
│   ├── .app-dialog__eyebrow  (uppercase, 0.74rem, #98a2b3)
│   └── .app-dialog__title   (1.18rem, 700, #111827)
├── .p-dialog-content (padding: 8px 22px)
│   └── .app-dialog__body (.app-dialog__fields)
└── .p-dialog-footer  (padding: 12px 22px 20px — no top border)
    └── .app-dialog__footer (flex, justify-end, gap: 10px)
```

Dialog `border-radius: 22px`. Two-column field rows: `.field-row { grid-template-columns: 1fr 1fr; gap: 14px; }`, collapses to 1-column below 540 px.

---

## 5. Form Fields

All form fields use the `.field` wrapper with PrimeReact inputs.

```css
.field { display: flex; flex-direction: column; gap: 7px; }
.field label { font-size: 0.88rem; font-weight: 600; color: #344054; }

/* All PrimeReact inputs inside .field */
.field .p-inputtext,
.field .p-dropdown,
.field .p-password input {
  width: 100%;
  border-radius: 10px;
  border-color: rgba(15, 23, 42, 0.14);
  background: #fcfcfd;
}
/* Focus ring */
.field .p-inputtext:enabled:focus,
.field .p-dropdown:not(.p-disabled).p-focus,
.field .p-password input:enabled:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.10);
}
```

Required asterisk: `<span class="required">*</span>` — `color: #e11d48`, `margin-left: 2px`.

---

## 6. CSS Class Namespacing

| Scope | Prefix | File |
|---|---|---|
| Shell, topbar, auth | `.shell-`, `.auth-` | `App.css` |
| Sidebar | `.psb__` | `App.css` |
| Dashboard page | `.db-` | `dashboard.css` |
| Applications page | `.ap-page .db-` (scoped) | `applications.css` |
| Dialog | `.app-dialog` | `App.css` |
| Form fields | `.field` | `App.css` |

**Rules:**
- Every new page gets its own page-level scope class (e.g., `.cal-page`, `.analytics-page`) to avoid global bleed.
- Never write bare `.db-*` overrides inside a page-scoped file — always prefix with the page scope.
- PrimeReact component overrides go inside the relevant scope class to avoid polluting the global PrimeReact theme.

---

## 7. Accessibility

### 7.1 Contrast (WCAG 2.2)

| Pair | Min ratio required |
|---|---|
| Body text on any surface | 4.5 : 1 (AA) |
| Large text (≥ 24 px or ≥ 18.67 px bold) | 3 : 1 (AA) |
| UI component boundary against adjacent bg | 3 : 1 (non-text) |
| Status badge text on badge background | 4.5 : 1 |

Check `--db-muted` (`#667085`) on `--db-surface` (`#ffffff`) — ratio is ~4.6 : 1 (passes AA). If surface changes, re-verify.

### 7.2 Interactive Elements

- Every icon-only button (`db-row-icon-btn`, `psb__logout-btn`, `shell-topbar__menu`) **must** have `aria-label`.
- Touch targets: minimum **44 × 44 px** for all clickable elements.
- Keyboard: all interactive elements reachable via Tab; Enter and Space activate buttons.
- Focus ring: `outline: 2px solid var(--db-accent); outline-offset: 3px; border-radius: var(--db-radius-sm);` — never remove focus rings.
- Use `aria-current="page"` on the active sidebar item.

### 7.3 Semantic HTML

- One `<h1>` per page (the board/page title).
- Section headers inside cards use `<h3>`.
- Lists (`<ul>/<li>`) for nav items, card lists, filter chips.
- `<main class="shell-main">` wraps all page content.

---

## 8. Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `≤ 900px` | Sidebar rail hidden; `grid-template-columns: 1fr` on `.shell--app`. Topbar brand shows. |
| `≤ 760px` | Board header becomes column layout; card actions justify-end. |
| `≤ 640px` | Topbar padding tightens; auth card padding tightens. |
| `≤ 540px` | Dialog `.field-row` collapses to 1 column; `db-root` padding tightens. |
| `≤ 860px` | KPI strip goes 2-column; app card middle / expand grid go 1-column. |

Always design mobile-first: start at 375 px, scale up.

---

## 9. Adding a New Page — Checklist

1. **Create a page scope class** (e.g., `.xyz-page`) and wrap the `DashboardLayout` children in a `<div className="xyz-page">`.
2. **Create a scoped CSS file** `src/styles/xyz.css` and import it in the page component.
3. **Reuse existing `.db-*` components** wherever possible (board, chips, status badge, skeleton, empty state). Override within `.xyz-page .db-*` scope only if necessary.
4. **Use status colours only for status** — pick from the palette table in §1.1.
5. **Verify WCAG contrast** at 3:1 for all component boundaries and 4.5:1 for all text.
6. **Add the route and nav item** in `AppSidebar.jsx` `NAV_SECTIONS` with `soon: false`.
7. **Test at 375 px and 1280 px** before marking the page done.
8. **Provide skeleton and empty states** — every data-loading view must handle both.

---

## 10. Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `--db-accent-soft` for icon container backgrounds | Use raw `rgba(79,70,229,0.10)` hard-coded in page CSS |
| Use `border-radius: 999px` for all pill shapes | Mix `border-radius: 50px` and `100px` arbitrarily |
| Scope PrimeReact overrides inside page class | Override `.p-button` globally from a page CSS file |
| Use `var(--db-border-mid)` on input/chip borders | Use `border: 1px solid #e5e7eb` (bypasses token system) |
| Add `aria-label` to all icon-only buttons | Leave icon buttons without accessible labels |
| Use `.db-status-badge` for all status indicators | Use coloured left-borders on cards for status |
| Animate with `var(--db-ease)` and `var(--db-speed)` | Use `transition: all 0.3s ease` |
| Check contrast with WebAIM Contrast Checker before shipping | Assume a colour is accessible because it looks readable |

