---
name: PropFlow
description: The Field Planner — a property-management system styled as an agent's working stationery planner
colors:
  paper: "#f3eee2"
  paper-raised: "#faf6ec"
  paper-deep: "#eae2cf"
  paper-well: "#efe9da"
  carbon: "#201d18"
  carbon-soft: "#57503f"
  carbon-faint: "#6e6454"
  rule: "#ddd2ba"
  rule-strong: "#c0b394"
  ink-red: "#b13a25"
  ink-red-bright: "#c2402a"
  ink-red-deep: "#8f2e1d"
  ink-green: "#2c6a4e"
  ink-green-deep: "#20503a"
  ink-blue: "#2c4a86"
  ink-blue-deep: "#22396a"
  ink-amber: "#8a6516"
  ink-amber-stroke: "#b98a2f"
  hue-leads: "#bf5426"
  hue-productivity: "#55753c"
  hue-properties: "#2c4a86"
  hue-units: "#23707f"
  hue-tenants: "#7a4668"
  hue-contracts: "#8a6516"
  hue-payments: "#2c6a4e"
  hue-maintenance: "#a03428"
typography:
  display:
    fontFamily: "'Bricolage Grotesque Variable', 'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "30px–36px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Bricolage Grotesque Variable', 'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px–18px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "0.09em"
  figure:
    fontFamily: "'Spline Sans Mono', ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: "24px–27px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
rounded:
  sheet: "14px"
  control: "9px"
  chip: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink-red}"
    textColor: "#fdf8ec"
    rounded: "{rounded.control}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.control}"
    padding: "10px 20px"
  button-danger:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink-red}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
  panel:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.sheet}"
    padding: "20px 24px"
  input:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.ink-red}"
    rounded: "4px"
    padding: "2px 8px"
  badge:
    backgroundColor: "{colors.ink-green}"
    textColor: "{colors.ink-green-deep}"
    rounded: "{rounded.chip}"
    padding: "3px 10px"
---

# Design System: PropFlow

## Overview

**Creative North Star: "The Field Planner"**

PropFlow looks like an agent's working stationery planner that learned to run a portfolio. The surface is warm paper, never white; text is carbon ink; and exactly four ballpoint inks do real state jobs — vermilion red for anything urgent or actionable, ledger green for anything won or settled, ultramarine blue for selection and links, amber for anything pending or awaiting. Ruled hairlines and faint graph dots supply the material; rubber stamps and dashed strokes carry state; figures are set in a tabular mono like entries in a rent roll. The category's generic white-card admin is the anti-reference: cards become ruled sheets, KPI rows become ledger strips, and every number that has a target renders against it.

**Key Characteristics:**
- Warm paper ground (#f3eee2) with raised sheets (#faf6ec) and 1px rule borders — depth comes from tone and hairlines first, shadow second
- Four working inks + one stationery hue per app section (tab rail, accents) — color always means something
- Goal-vs-actual inked meters everywhere a target exists; state carried in stroke form (solid / dashed / half-height / doubled), never hue alone
- Rubber-stamp badges for loud states, quiet ink chips for routine ones
- Tabular mono figures on every amount, date, and count

## Colors

A warm stationery palette: paper grounds, carbon text, and ink roles that never decorate — each one flags a state or an action.

### Primary
- **Vermilion Ink** (#b13a25, bright #c2402a, deep #8f2e1d): the action color — primary buttons, urgent states, overdue strokes, the caret. Reserved strictly for things that demand action or attention.
- **Ledger Green** (#2c6a4e, deep #20503a): success, won deals, paid, occupied, collected figures.

### Secondary
- **Ultramarine Ballpoint** (#2c4a86, deep #22396a): links, selection, available units, informational badges, focus rings.

### Tertiary
- **Amber Ink** (#8a6516 text, #b98a2f stroke): pending, expiring, in-progress waiting states. The lighter stroke value is for meter fills and stamps only, never small text.

### Neutral
- **Paper** (#f3eee2): the page ground. **Paper Raised** (#faf6ec): panels, cards, inputs. **Paper Deep** (#eae2cf): the rail and wells. **Paper Well** (#efe9da): chart fields, quiet wells.
- **Carbon** (#201d18): primary text. **Carbon Soft** (#57503f): secondary text, labels. **Carbon Faint** (#6e6454): timestamps, footnotes, placeholders — never below 4.5:1 on paper.
- **Rule** (#ddd2ba) / **Rule Strong** (#c0b394): hairline borders, meter tracks, dashed ticks.
- **Section hues** (leads #bf5426, productivity #55753c, properties #2c4a86, units #23707f, tenants #7a4668, contracts #8a6516, payments #2c6a4e, maintenance #a03428): one per app area, carried only through the tab rail, column tabs, and section accents.

### Named Rules
**The Four-Ink Rule.** Red, green, blue, and amber are the only data colors. A hue that carries no state doesn't ship.
**The Action-Red Rule.** Red appears on actionable or urgent elements only; if nothing can be done and nothing is wrong, it isn't red.
**The Section-Hue Rule.** A section's stationery hue lives in its rail tab and section accents — it never recolors data inks.

### Night rendition (`.dark`)
The same planner under a desk lamp: `html.dark` overrides the theme variables in place — charcoal ground (#201d18), raised sheets (#292520), bone text (#ece5d3, soft #b3ab97, faint #908874), rules (#4a443a / #6a6250), and the four inks brightened for dark contrast (red #d9755f, green #7cb89a, blue #8aa3d0, amber #d1a755, deep variants flipped lighter). Section hues brighten in step. Shadows go deeper black. No component carries dark-specific markup — the Magic UI AnimatedThemeToggler flips the class with a circular view-transition reveal from the button, persists to `localStorage("theme")`, and an inline script applies the saved or system theme before first paint.

**The Lamp Rule.** Night mode re-inks the same planner; it never redesigns it. All color flows from theme variables — only the token values change under `.dark`.

## Typography

**Display Font:** Bricolage Grotesque Variable (self-hosted via Fontsource)
**Body Font:** Hanken Grotesk Variable (self-hosted via Fontsource)
**Label/Figure Font:** Spline Sans Mono (figures, IDs, dates — always `tabular-nums`)

**Character:** A characterful grotesk stamps the headlines; a warm humanist sans does the reading; a workhorse mono keeps the books. No serif, no system display faces.

### Hierarchy
- **Display** (700, 30–36px, -0.02em, balanced): page titles ("Good morning, Alex.") — one per page.
- **Headline** (600, 17–18px): panel titles, card names.
- **Body** (400, 15.5px, 1.55): copy, list text; 62–75ch measure on prose.
- **Label** (650, 11px, 0.09em, uppercase): ledger-cell labels, table headers, stamp text.
- **Figure** (600, 24–27px, Spline Mono): KPI values; smaller mono (13–15px) for table figures, amounts, dates.

### Named Rules
**The Ledger Rule.** Every number a user might compare — money, dates, counts, IDs — is set in Spline Mono with tabular numerals. Prose never goes mono.

## Layout

Desktop carries a fixed left tab rail (236px) of manila section tabs; content sits in a centered 1180px column on the paper ground with a faint graph-dot pattern (radial-gradient dots, 20px cell) fading from the top. Mobile swaps the rail for a top bar plus a five-slot bottom bar with a "More" bottom sheet. Rhythm: 20–24px gaps between panels (space-y-5/6), 20–24px panel padding, hairline `border-rule` dividers inside panels instead of nested cards. Breakpoints follow Tailwind defaults; the app is usable from 390px up.

## Elevation & Depth

Hybrid: tone first, shadow second. Separation is normally a 1px rule border on a raised sheet; shadow appears on genuinely lifted surfaces only. All shadows are warm and offset — never zero-offset halos.

### Shadow Vocabulary
- **Sheet** (`0 1px 2px rgb(62 52 32 / 0.05), 0 10px 28px -10px rgb(62 52 32 / 0.14)`): resting panels and cards.
- **Sheet Lift** (`0 2px 4px rgb(62 52 32 / 0.06), 0 16px 36px -12px rgb(62 52 32 / 0.18)`): modals, dragged cards.
- **Tab** (`0 1px 2px rgb(62 52 32 / 0.08)`): the active rail tab and small raised chips.

### Named Rules
**The Ruled-Sheet Rule.** If a hairline border can do the separating, no shadow ships.

## Shapes

Two radii only: 14px for sheets (panels, cards, modals, the board columns), 9px for controls (buttons, inputs, wells). Chips go full-pill; stamps are near-square (4px) with a 1.5px ink border and a −1.2° rotation. The active rail tab clips one top-outer corner (`clip-path` 9px diagonal) — the manila tab's cut corner. Meter tracks are full-rounded hairlines; dashed strokes are `repeating-linear-gradient`, never border-style dashed, so the dash rides any shape.

## Components

### Buttons
- **Shape:** 9px radius, 44px min height (touch), semibold 15px.
- **Primary:** Vermilion Ink fill (#b13a25), paper-cream text (#fdf8ec), 1px deep-red border; press nudges 1px down. The demo's hero action uses the Magic UI ShimmerButton in the same red with a paper shimmer.
- **Secondary:** Paper Raised fill, carbon text, rule-strong border.
- **Danger:** Paper fill, ink-red text and border — quiet until hovered.
- **Ghost / Link:** carbon-soft on hover-paper; links in ultramarine with 3px underline offset.
- **Focus:** 2px ultramarine outline, 2px offset, page-wide.

### Stamps & Badges
- **Stamp:** uppercase 11px bold, 0.11em tracking, 1.5px ink border, 4px radius, −1.2° rotation — loud states only (OVERDUE, URGENT, HIGH, DEMO).
- **Badge:** pill, tinted ink background at 10–15%, 1px tinted border; a leading 12px stroke carries state — solid = settled, dashed = waiting.

### Cards / Containers
- **Corner Style:** 14px sheet radius.
- **Background:** Paper Raised on Paper ground; wells at Paper Well / Paper Deep.
- **Shadow Strategy:** Sheet at rest; Sheet Lift only when truly floating.
- **Border:** 1px rule; hover deepens to rule-strong.
- **Internal Padding:** 20–24px; lists compress to hairline-divided rows.

### Inputs / Fields
- **Style:** Paper Raised fill, rule-strong 1px border, 9px radius, 15px text; red caret.
- **Focus:** ultramarine border + 2px 25% ring.
- **Error:** ink-red border + 13px red message under the field; number spinners removed.

### Navigation
- **Desktop:** fixed manila tab rail — one stationery hue per section, active tab raised on paper with the cut corner and hue dot; user block pinned bottom.
- **Mobile:** top bar with compact brand; bottom bar (Today / Leads / Productivity / More) + spring-animated More sheet; active icons take the section hue.

### Ink Meter (signature)
A 3–6px ruled track (rule/70) with an animated spring fill to the actual value and a dashed goal tick at the target. State rides the stroke: solid = live, dashed = overdue/waiting, half-opacity = stale, doubled (second offset stroke) = won. Every target-bearing number on the app renders one.

## Do's and Don'ts

### Do:
- **Do** set every money figure, date, and count in Spline Mono tabular.
- **Do** render a goal-vs-actual Ink Meter wherever a number has a target — collection rate, occupancy, funnel stages, daily goals.
- **Do** keep one stationery hue per section, confined to the rail and section accents.
- **Do** use lucide icons at 16–20px, one stroke weight, currentColor.
- **Do** theme the browser: ultramarine selection, red caret, thin rule-strong scrollbars, visible focus rings.

### Don't:
- **Don't** use white backgrounds, gray-100 admin neutrals, or Tailwind's default blue anywhere.
- **Don't** ship emoji as icons or decorative glyphs.
- **Don't** put a kicker or eyebrow label above a heading; the heading carries its own weight.
- **Don't** use border-style dashed borders or hard offset (4px 4px 0) shadows — dashes come from gradient strokes, depth from the warm shadow vocabulary.
- **Don't** color data with section hues; they wayfind, they don't measure.
