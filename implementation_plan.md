# Build Remaining Admin Dashboard Pages

## Goal Description
Create full CRUD UI for all remaining internal entities defined in the OpenAPI spec: Ranks, Courses, Institutes, Indos, Enrollments, Contracts, Companies, Berths, Allocations, Audit Logs. Follow the design guidelines in `frontend/DESIGN.md` and maintain the current aesthetic (dark mode, glassmorphism, micro‑animations). The pages should use the existing `apiClient` wrappers, share the layout and sidebar, and provide list, create, edit, and delete functionality.

## User Review Required
[!IMPORTANT]
- Confirm if any entities should be excluded from the admin UI at this stage.
- Approve the use of generic form components (similar to `VesselForm`) for all entities, or specify custom fields.
- Confirm the desired pagination approach (currently none – will load full collections).

## Open Questions
[!WARNING]
- Do you want any additional validation or UI hints for specific fields (e.g., dates, numeric ranges)?
- Should the audit logs page be read‑only with search/filter capabilities?

## Proposed Changes
---
### Components
#### [NEW] [components/GenericForm.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/components/GenericForm.tsx)
Create a reusable form component that receives field definitions and handles submit for create/update.

#### [NEW] [components/EntityTable.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/components/EntityTable.tsx)
Reusable data table with edit/delete actions.
---
### Pages
#### [NEW] [app/(internal)/ranks/page.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/app/(internal)/ranks/page.tsx)
List and manage ranks.

#### [NEW] [app/(internal)/courses/page.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/app/(internal)/courses/page.tsx)
List and manage pre‑sea courses.

#### [NEW] [app/(internal)/institutes/page.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/app/(internal)/institutes/page.tsx)
List and manage institutes.

#### [NEW] [app/(internal)/indos/page.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/app/(internal)/indos/page.tsx)
List and manage indos.

#### [NEW] [app/(internal)/enrollments/page.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/app/(internal)/enrollments/page.tsx)
List and manage enrollments.

#### [NEW] [app/(internal)/contracts/page.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/app/(internal)/contracts/page.tsx)
List and manage contracts.

#### [NEW] [app/(internal)/companies/page.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/app/(internal)/companies/page.tsx)
List and manage companies.

#### [NEW] [app/(internal)/berths/page.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/app/(internal)/berths/page.tsx)
List and manage berths.

#### [NEW] [app/(internal)/allocations/page.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/app/(internal)/allocations/page.tsx)
List and manage berth allocations.

#### [NEW] [app/(internal)/audit-logs/page.tsx](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/app/(internal)/audit-logs/page.tsx)
Read‑only audit log viewer with simple filters.
---
### Styling
#### [MODIFY] [frontend/app/globals.css](file:///c:/Users/Neeraj%20Gupta/Projects/mralmostcool/playground/frontend/app/globals.css)
Add CSS variables for primary accent, dark mode background, and glass‑morphism utilities used by new components.
---
### Verification Plan
- Run `npm run dev` inside the `frontend` container and manually browse each new page to ensure CRUD actions work against the backend API.
- Verify that list pages load full collections without pagination.
- Ensure the sidebar highlights the active section and navigation works.
- Commit after each entity implementation (5 commits total) as per earlier instruction.
