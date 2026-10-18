# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The hosted demo's primary audience is recruiters and hiring managers evaluating the author's full-stack skills; the demo must impress within minutes of unattended use (confirmed 2026-10-17). The product's working users are independent landlords and real-estate agents who manage properties, tenants, leases, payments, maintenance, a leads pipeline, and daily productivity.

## Product Purpose

PropFlow is a property-management system: properties and rental units, tenants, contracts, rent payments (multi-currency), maintenance requests, a leads sales funnel, and a Keller Williams–style daily productivity tracker against goals. Success = a recruiter is visibly impressed by the demo, and a landlord/agent can genuinely run these workflows end to end.

## Positioning

A complete, self-authored full-stack product (.NET 10 clean-architecture API + React 19 SPA) presented as an interactive, zero-setup demo with realistic sample data — a working product, not a screenshot gallery.

## Operating Context

- Hosted demo (GitHub Pages): frontend-only, mock data via an in-app demo backend, pre-filled demo credentials (demo@propflow.app / Demo1234!). Auto-deploys on push to `main` via `.github/workflows/deploy-demo.yml`.
- Local evaluation: same frontend against the real .NET API (VITE_API_BASE_URL) with MySQL.
- README.md is the portfolio entry point and must stay consistent with the product.

## Capabilities and Constraints

- Features: auth (login/register), dashboard (stats, occupancy, revenue), properties, rental units, tenants, contracts, payments, maintenance requests, leads funnel, productivity tracker; demo backend (`src/shared/demo`) serves mock data when no API base URL is set.
- React 19 + Vite + TypeScript strict + React Router + TanStack Query. Styling is currently custom CSS; no Tailwind yet.
- Restructuring freedom granted (2026-10-17): pages may merge or drop for a tighter product as long as core capabilities remain reachable; all CRUD must keep working against both the real API and the demo backend.
- Accessibility: best-effort; no formal standard required.

## Brand Commitments

- The name "PropFlow" is binding; README tagline "Modern Property Management Made Simple".
- The published demo credentials above must keep working in the demo.

## Evidence on Hand

- Working app + API in this repo; mock dataset at `propflow-web/src/shared/demo/demo-data.json`; live demo: https://full-stack-dev-johncastrosanabria.github.io/PropFlow/
- No testimonials, customers, benchmarks, or press exist. Do not fabricate any.

## Product Principles

1. First viewport wins: the demo must visibly impress before any click.
2. Real over staged: every screen runs on real app logic and realistic data.
3. Craft as signal: polish and motion demonstrate frontend skill honestly.
4. Complete loops: flows go end to end (capture → track → resolve), not stub screens.
