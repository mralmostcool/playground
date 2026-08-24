# Maritime Training Platform — Frontend Implementation Plan

> **Scope**: `frontend/app/(public)` · `frontend/app/(home)` only.
> **Backend**: SpringBoot API at `/api/*` via Nginx proxy.
> **Stack**: Next.js 15 · TypeScript · Vanilla CSS (design tokens from `DESIGN.md`) · `lib/apiClient.ts`

> [!IMPORTANT]
> **Backend Pagination is a hard prerequisite for Phase 0.2 and Phase 7.7.** Several endpoints currently return full unbounded collections. The SpringBoot backend **must** add `Page<T>` / `Pageable` support for these endpoints before the frontend performance work can be completed. See the **Backend Pagination Prerequisites** section below.

---

## Domain Model (from DB migrations)

```
institute  ──< pre_sea_courses ──< enrollment >── indos_master (seafarer)
                                                        │
company ──< vessel ──< berth_allocation >── berth       │
                             │                          │
                   berth_seafarer_allocation ───────────┘
                             │
                          contract
```

**Key DB constraints:**
- Berth cannot have two overlapping `berth_allocation` windows (gist exclude)
- Seafarer cannot have two overlapping `berth_seafarer_allocation` windows (gist exclude)
- `contract` requires a **COMPLETED** `enrollment` (trigger)
- Vessel carries `company_id` FK (added V9)

---

## Current State Audit

### Done

| Route | File | Status |
|-------|------|--------|
| `/home` | `(home)/home/page.tsx` | Portal landing, 4 cards |
| `/seafarer` | `(public)/seafarer/page.tsx` | Paginated list + create modal |
| `/seafarer/[indos]` | `(public)/seafarer/[indos]/page.tsx` | Profile + enrollments + contracts tabs |
| `/courses` | `(public)/courses/page.tsx` | Institutes + courses dual-tab |
| `/courses/[instSlug]` | `(public)/courses/[instSlug]/page.tsx` | Institute detail |
| `/courses/[instSlug]/[courseSlug]` | page file may be stub | Needs verification |
| `/companies` | `(public)/companies/page.tsx` | Company list + create |
| `/companies/[companySlug]` | `(public)/companies/[companySlug]/page.tsx` | Company detail + vessels |
| `/vessels` | `(public)/vessels/page.tsx` | Vessel list, localStorage hack |
| `/vessels/[vesselSlug]` | `(public)/vessels/[vesselSlug]/page.tsx` | Vessel detail |

### Known Issues / Gaps

1. **Vessel↔Company is a localStorage hack** — DB has `vessel.company_id` but DTO does not expose it; workaround uses name-prefix + localStorage.
2. **`/courses/[instSlug]/[courseSlug]`** — directory exists, page status unknown.
3. **No berth / berth-allocation / berth-seafarer-allocation UI** in public section.
4. **Contract creation wizard absent** — contracts viewable in seafarer detail only.
5. **`getAllEnrollments()` / `getAllContracts()`** fetch entire tables and filter client-side.
6. **No loading skeletons / empty states** — raw "Loading…" strings throughout.
7. **Design inconsistency** — no shared card/modal/tab components.
8. **`/home`** missing Berths/Contracts cards and live stats.
9. **`VesselResponseDTO`** missing `companyId` field.
10. **No 404 / error boundary** pages.

---

## Phase 0 — Hotfixes & Foundation Stabilisation

### 0.1 — Fix `apiClient.ts` DTO Alignment
- Add `companyId?: string` to `VesselResponseDTO`
- Remove all localStorage name-prefix hacks from vessel pages
- Replace with `vessel.companyId` direct FK lookup

**Files:**
- MODIFY `lib/apiClient.ts`
- MODIFY `(public)/vessels/page.tsx`
- MODIFY `(public)/vessels/[vesselSlug]/page.tsx`
- MODIFY `(public)/companies/[companySlug]/page.tsx`

### 0.2 — Client-side Filter → Scoped API Calls
- Seafarer detail: add `getEnrollmentsByIndosId()` and `getContractsByIndosId()` helpers
- Replaces full-table fetches + client filter

**Files:**
- MODIFY `lib/apiClient.ts`
- MODIFY `(public)/seafarer/[indos]/page.tsx`

### 0.3 — Complete `[instSlug]/[courseSlug]` Page
- Build course detail:
  - Course header (name, institute, start date, status badge)
  - Enrolled seafarers list
  - Enroll action → POST `/enrollments`

**Files:**
- NEW/MODIFY `(public)/courses/[instSlug]/[courseSlug]/page.tsx`

---

## Phase 1 — Shared Component Library

### 1.1 — Design Token Enforcement
- Ensure all DESIGN.md tokens present in `globals.css` as CSS variables
- Add missing: `--color-accent-amber`, `--color-success`, `--color-warning`, `--color-error`

### 1.2 — New Shared Components

| Component | Purpose |
|-----------|---------|
| `StatusBadge.tsx` | ENROLLED/COMPLETED/ACTIVE/DRAFT/TERMINATED with colour |
| `PageHeader.tsx` | Title + subtitle + action button slot |
| `SearchBar.tsx` | Debounced input with clear button |
| `Pagination.tsx` | Prev/Next + page indicator |
| `LoadingSkeleton.tsx` | Animated placeholder rows |
| `EmptyState.tsx` | Icon + message + optional CTA |
| `Modal.tsx` | Accessible overlay, focus trap, ESC close |
| `ConfirmDialog.tsx` | Delete confirmation |
| `EntityCard.tsx` | List item card (icon, title, subtitle, meta, actions) |
| `TabBar.tsx` | Horizontal tab navigation |
| `InfoRow.tsx` | Label + value row for sidebars |
| `ToastNotification.tsx` | Auto-dismiss toast |

**Files:**
- NEW `components/ui/StatusBadge.tsx`
- NEW `components/ui/PageHeader.tsx`
- NEW `components/ui/SearchBar.tsx`
- NEW `components/ui/Pagination.tsx`
- NEW `components/ui/LoadingSkeleton.tsx`
- NEW `components/ui/EmptyState.tsx`
- NEW `components/ui/Modal.tsx`
- NEW `components/ui/ConfirmDialog.tsx`
- NEW `components/ui/EntityCard.tsx`
- NEW `components/ui/TabBar.tsx`
- NEW `components/ui/InfoRow.tsx`
- NEW `components/ui/ToastNotification.tsx`
- NEW `components/ui/index.ts` (barrel export)

### 1.3 — Refactor Existing Pages
Roll shared components into all existing pages, eliminating duplicated HTML patterns.

---

## Phase 2 — Seafarer Module Polish

### 2.1 — Seafarer List (`/seafarer`)
- `LoadingSkeleton` / `EmptyState` replacements
- `Modal.tsx` for create form
- Rank filter dropdown
- Active/inactive toggle filter
- `Pagination` component
- Rank `StatusBadge` on each card

### 2.2 — Seafarer Detail (`/seafarer/[indos]`)

**Overview tab:**
- `InfoRow` components for all fields
- INDOS number as copyable pill
- Active/Inactive `StatusBadge`
- Inline edit `firstName` / `rankId`

**Courses tab:**
- `StatusBadge` per enrollment (ENROLLED / COMPLETED / CANCELLED)
- Institute name, course name, dates
- Status update: ENROLLED → COMPLETED or CANCELLED
- Delete enrollment with `ConfirmDialog`

**Add Courses tab:**
- Institute filter → course filter two-step picker
- Prevent duplicate enrollment (client-side check before POST)

**Training tab (currently basic — expand):**
- All contracts for this seafarer
- Contract card: company, vessel, planned/actual sign-on/off, status badge
- "Record Sign On" / "Record Sign Off" actions → PATCH contract actual fields

### 2.3 — Seafarer Delete
- `ConfirmDialog` before `deleteIndos`
- Redirect to `/seafarer` on success

**Files:**
- MODIFY `(public)/seafarer/page.tsx`
- MODIFY `(public)/seafarer/[indos]/page.tsx`

---

## Phase 3 — Courses & Institutes Module Polish

### 3.1 — Courses/Institutes List (`/courses`)
- Refactor dual tab with `TabBar`
- Institute cards: course count badge
- Course cards: institute name, start date, enrolled count, status badge
- Institute delete with `ConfirmDialog`
- Course activate/deactivate toggle

### 3.2 — Institute Detail (`/courses/[instSlug]`)
- `PageHeader` component
- Courses grid with `EntityCard`
- Pre-filled "Add Course" form with `instituteId`
- Enrolled seafarers count per course
- Inline institute name edit

### 3.3 — Course Detail (`/courses/[instSlug]/[courseSlug]`)
- Course header: name, institute, start date, active status
- **Enrolled Seafarers tab:**
  - List: INDOS, name, rank, enrollment status badge
  - Link to seafarer profile
  - Bulk "Mark Completed"
- **Enroll Seafarer action:** search by INDOS/name → POST `/enrollments`
- Course Edit modal

**Files:**
- MODIFY `(public)/courses/page.tsx`
- MODIFY `(public)/courses/[instSlug]/page.tsx`
- NEW/MODIFY `(public)/courses/[instSlug]/[courseSlug]/page.tsx`

---

## Phase 4 — Companies & Vessels Module Polish

### 4.1 — Companies List (`/companies`)
- `Modal.tsx` for create form
- Company cards: vessel count, registration number, active status
- Active/inactive filter
- Delete with `ConfirmDialog`

### 4.2 — Company Detail (`/companies/[companySlug]`)
**Fix vessel-company link**: use `vessel.companyId === company.id` (remove localStorage hacks).

**Tabs:**
- **Fleet tab:** vessels grid with `EntityCard`, link to `/vessels/[vesselSlug]`, Add Vessel form
- **Berths tab (NEW):**
  - All `berth_allocations` for company's vessels
  - Per-allocation: berth name, vessel name, start/end window
  - Seafarers currently on each berth (from `berth_seafarer_allocations`)

### 4.3 — Vessels List (`/vessels`)
- Fix company lookup (remove localStorage hack, use `companyId`)
- Vessel cards: IMO, flag, company name (linked), active badge
- Company filter dropdown
- Flag filter dropdown

### 4.4 — Vessel Detail (`/vessels/[vesselSlug]`)
- Vessel header: name, IMO, flag, company (linked)
- **Berths tab:**
  - `berth_allocations` for this vessel → berth list
  - Each berth: name, allocation window, current trainee
  - Simple visual timeline of berth occupancy
- **Crew Timeline tab:**
  - All seafarers via contracts → berth_seafarer_allocations
  - Name, INDOS, rank, sign-on, sign-off, contract status
- Edit vessel modal
- Deactivate vessel action

**Files:**
- MODIFY `(public)/companies/page.tsx`
- MODIFY `(public)/companies/[companySlug]/page.tsx`
- MODIFY `(public)/vessels/page.tsx`
- MODIFY `(public)/vessels/[vesselSlug]/page.tsx`

---

## Phase 5 — Berth & Contract Workflow Module

### 5.1 — Berth Management (NEW)

**New page: `/berths`** — global berth registry
- List all berths, active/inactive status
- Create berth form
- Link to berth detail

**New page: `/berths/[berthName]`** — berth detail
- Berth info header
- Allocation history: `berth_allocations` (vessel + date window)
- Trainee history: `berth_seafarer_allocations` (seafarer + date window)
- **Allocate Berth to Vessel:** vessel picker + date range → POST `/berth-allocations`
- **Assign Trainee to Berth:** seafarer picker + date range → POST `/berth-seafarer-allocations`
  - Show existing windows visually (gantt-style bar)
  - Surface DB exclusion constraint errors clearly

**Files:**
- NEW `(public)/berths/page.tsx`
- NEW `(public)/berths/[berthName]/page.tsx`

### 5.2 — Contract Creation Wizard (NEW)

**New page: `/contracts/new`** — 4-step wizard

| Step | Fields |
|------|--------|
| 1. Select Seafarer | Search INDOS/name → show completed enrollments |
| 2. Select Company & Vessel | Company dropdown → vessel dropdown |
| 3. Select Berth & Slot | Available berths for vessel; date window picker |
| 4. Contract Dates & Ports | Sign-on/off dates + ports + remarks |

- POST `/berth-seafarer-allocations` then POST `/contracts`
- Surface enrollment-not-completed error gracefully
- Success → redirect to seafarer profile → Training tab

**New page: `/contracts/[contractId]`** — contract detail
- Full contract fields with `InfoRow`
- Status badge + lifecycle actions:
  - DRAFT → ACTIVE
  - Record actual sign-on
  - Record actual sign-off
  - Mark COMPLETED or TERMINATED
- Linked: seafarer, company, vessel, enrollment

**Files:**
- NEW `(public)/contracts/new/page.tsx`
- NEW `(public)/contracts/[contractId]/page.tsx`

### 5.3 — apiClient.ts Extensions

New helpers:
- `getContractsByIndosId(id)` — filtered fetch
- `getContractsByCompanyId(id)` — filtered fetch
- `getBerthAllocationsByVesselId(id)` — filtered fetch
- `getBerthSeafarerAllocationsByBerthId(id)` — filtered fetch
- `patchContract(id, partial)` — PATCH for status/actual dates
- `patchIndos(id, partial)` — PATCH for inline edits
- `patchVessel(id, partial)` — PATCH for inline edits

**Files:**
- MODIFY `lib/apiClient.ts`

---

## Phase 6 — Home Dashboard Enhancement

### 6.1 — Live Stats Bar
Parallel fetch on mount:
- Total active seafarers
- Active courses
- Registered companies
- Active vessels
- Open training berths
- Active contracts

Show `LoadingSkeleton` while fetching, animate numbers on mount.

### 6.2 — Portal Cards Audit
Ensure all 6 domain areas have a card: Seafarer, Courses, Companies, Vessels, Berths, Contracts.

### 6.3 — Recent Activity Feed
- Fetch `getAllAuditLogs()` (last 10 entries)
- Show table name as domain label, operation icon, relative timestamp, `changedBy`

### 6.4 — Global Quick Search
- Debounced search bar
- Type INDOS → jump to `/seafarer/[indos]`
- Type IMO → jump to `/vessels/[vesselSlug]`
- Type company name → jump to `/companies/[companySlug]`
- Suggestions dropdown

**Files:**
- MODIFY `(home)/home/page.tsx`

---

## Phase 7 — UX Polish & Production Readiness

### 7.1 — Error Boundaries & 404 Pages
- NEW `app/not-found.tsx` — custom 404
- NEW `app/error.tsx` — global error boundary
- Per-section retry buttons
- Slug-not-found graceful redirects

### 7.2 — Loading UX
- `LoadingSkeleton` everywhere in place of "Loading…" strings
- Optimistic UI for status changes

### 7.3 — Toast Notification System
- NEW `components/ui/ToastContext.tsx` — context provider at layout level
- Replace all `formSuccess`/`formError` inline state with toast calls
- Auto-dismiss 4s; stackable

### 7.4 — Responsive Mobile Layout
- Public layout sidebar collapses to top panel on mobile
- Modal full-screens on mobile
- Berth timeline degrades to list view on mobile

### 7.5 — Accessibility Pass
- All modals: focus trap, ARIA roles, ESC close
- Form inputs: `label htmlFor`, error `aria-describedby`
- Interactive cards: keyboard-navigable
- WCAG AA colour contrast verification

### 7.6 — SEO & Metadata
- Per-page `metadata` exports (title, description)
- `robots.txt`
- NEW `public/robots.txt`

### 7.7 — Performance
- Replace full-table fetches with paginated/filtered calls everywhere
- Memoize static data (ranks, institutes) with `useMemo`
- Add Next.js `revalidate` cache hints to static fetches

---

## Phase Summary

| Phase | Focus | New Files | Modified Files |
|-------|-------|-----------|----------------|
| 0 — Hotfixes | DTO fix, localStorage removal, course stub | 1 | 4 |
| 1 — Components | Shared UI library, design tokens | 13 | 8+ |
| 2 — Seafarer | Full seafarer module polish | 0 | 2 |
| 3 — Courses | Full course/institute lifecycle | 1 | 2 |
| 4 — Companies & Vessels | Fleet management, FK fix | 0 | 4 |
| 5 — Berths & Contracts | Core operational workflows | 4 | 1 |
| 6 — Home Dashboard | Stats, activity, global search | 0 | 1 |
| 7 — Polish | Errors, a11y, SEO, performance | 3 | All |

---

## Target Route Map

```
/home                            → portal landing + stats + activity feed
/seafarer                        → paginated seafarer list
/seafarer/[indos]                → profile: overview / courses / training
/courses                         → institutes + courses dual-tab
/courses/[instSlug]              → institute detail + courses
/courses/[instSlug]/[courseSlug] → course detail + enrolled seafarers
/companies                       → company list
/companies/[companySlug]         → company: fleet + berths
/vessels                         → vessel list (all companies)
/vessels/[vesselSlug]            → vessel: berths + crew timeline
/berths                          → berth registry  ← NEW
/berths/[berthName]              → berth: allocations + trainee timeline  ← NEW
/contracts/new                   → multi-step contract wizard  ← NEW
/contracts/[contractId]          → contract detail + lifecycle actions  ← NEW
```

---

## Design Constraints

- **Color palette**: strictly from `DESIGN.md` (primary `#cc785c`, canvas `#faf9f5`, ink `#141413`)
- **Typography**: Copernicus/Tiempos serif for display; StyreneB/Inter sans for body
- **No new npm dependencies** unless absolutely necessary
- **No authentication** — public-facing portal
- **API base**: `/api` proxied via Nginx (`docker-compose.yml`)

---

## Backend Pagination Prerequisites

> [!IMPORTANT]
> The frontend currently calls full-collection endpoints for several large tables and filters client-side.
> This is a **scalability blocker**. The following SpringBoot controllers need `Pageable` / `Page<T>` response variants added **before** Phase 7.7 (Performance) can be executed.
> The `/indos/page` endpoint already exists as the reference implementation — replicate the same pattern.

### Endpoints Requiring Paginated Variants

| Endpoint | Current | Required | Used By |
|----------|---------|----------|---------|
| `GET /api/enrollments` | returns `List<T>` | add `GET /api/enrollments/page?page=&size=&indosId=&courseId=&status=` | Seafarer detail, Course detail |
| `GET /api/contracts` | returns `List<T>` | add `GET /api/contracts/page?page=&size=&indosId=&companyId=&status=` | Seafarer detail, Contract list |
| `GET /api/berth-allocations` | returns `List<T>` | add `GET /api/berth-allocations/page?page=&size=&vesselId=&berthId=` | Vessel detail, Berth detail |
| `GET /api/berth-seafarer-allocations` | returns `List<T>` | add `GET /api/berth-seafarer-allocations/page?page=&size=&berthId=&indosId=` | Berth detail, Seafarer training tab |
| `GET /api/audit-logs` | returns `List<T>` | add `GET /api/audit-logs/page?page=&size=&tableName=` | Home dashboard activity feed |
| `GET /api/vessels` | returns `List<T>` | add `GET /api/vessels/page?page=&size=&companyId=&isActive=` | Vessels list, Company fleet tab |
| `GET /api/pre-sea-courses` | returns `List<T>` | add `GET /api/pre-sea-courses/page?page=&size=&instituteId=&isActive=` | Courses list |
| `GET /api/companies` | returns `List<T>` | add `GET /api/companies/page?page=&size=&isActive=` | Companies list |

### Reference Implementation
The `/indos/page` endpoint (already built) is the reference:
```
GET /api/indos/page?page=0&size=10&search=John
Response: { content: [...], totalPages: N, totalElements: N, size: 10, number: 0, first: true, last: false }
```
All new paginated endpoints should return the same `Page<T>` Spring Data projection shape.

### Frontend Impact
Until paginated variants exist, the frontend workaround is:
- Keep full `getAll*()` calls but memoize results in component state
- Implement **client-side pagination** (slice the array, no extra round-trips)
- Accept the cost on large datasets — flag with a `// TODO: replace with paginated endpoint` comment

Once backend pagination is added:
1. Add new `get*Paginated(page, size, filters)` helpers to `lib/apiClient.ts`
2. Swap out the full-fetch calls in affected pages
3. Remove client-side slicing logic

---

*Last updated: 2026-08-24*
