# Surface brief — propflow-web (whole app + demo)

## Scope & mode

The entire authenticated app (shell, dashboard, leads funnel, productivity tracker, properties, units, tenants, contracts, payments, maintenance) plus auth screens and the GitHub Pages demo. Mode: **Operate** — the visitor completes property-management tasks; recruiters judge the craft.

## Audience & job

Recruiters first: the demo must impress in minutes, unattended. Working users: landlords/agents running portfolio operations. Success: every CRUD loop works against both the demo backend and the real API.

## Chosen direction & memorable moment

**The Field Planner** (position 6 of 7, seed key `f27deac5`, mode operate). The agent's working planner, printed and inked. Memorable moment: the **goal-vs-actual inked meter** — every target-bearing number (collection rate, occupancy, funnel stages, daily activity) renders as an inked stroke to actual with a dashed goal tick and a stamped state.

## Direction contract

THESIS: PropFlow is the agent's working planner, printed and inked — operational discipline made visible — refusing the generic white-card admin the category (and this app's incumbent) ships.

OWN-WORLD: warm stationery paper ground (#f4efe4), carbon ink (#1c1a17) text, four ink roles doing real jobs — vermilion red (#c2402a) urgent/action, ledger green (#2e6b4f) success/won, ballpoint blue (#2f4d8a) selection/links, amber (#b98a2f) pending; ruled lines and graph dots as material; one stationery hue per feature section, carried through tab rail, section headers, and stamps.

STORY: a recruiter sees a complete operating product with unmistakable craft; a landlord sees today's posture — what's collected, what's overdue, who's in the funnel, what needs attention — and acts in one click.

FIRST VIEWPORT (dashboard): left tab rail inked as manila tabs (one hue per section); today header with date stamp + red-ink primary action "Record payment"; four ruled KPI cells with ticker figures and goal-vs-actual meters; revenue trend inked on graph dots; occupancy ring; leads funnel as inked rows; stamped "needs attention".

FORM: position 6 of the grounded list (KW time-block planner stationery), seed key f27deac5, assigned by the roll and confirmed by the user.

Signature interaction: goal-vs-actual inked meters everywhere a target exists, state in form (solid to actual, dashed goal tick, dashed stroke = overdue, half-height = pending, doubled = won). Motion: blur-fade reveals on section entry, number tickers on money, one orchestrated spring on the meters; nothing bounces.

## Constraints

Build vocabulary: Magic UI components on Tailwind v4 + motion (user-pinned). TypeScript strict, React 19, TanStack Query, React Router; all API clients and the demo backend keep working. Best-effort accessibility. Restructuring freedom granted, but every core capability stays reachable.

## Unresolved decisions

None blocking.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
