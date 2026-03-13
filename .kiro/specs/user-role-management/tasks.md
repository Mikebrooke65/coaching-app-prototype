# Implementation Plan: User Role Management

## Overview

Incremental implementation of the user role management feature across seven areas: database migration, type definitions, AuthContext fix, permissions system, API services, new pages (competitions, lite landing, caregiver approval), and desktop Users page modifications. Each task builds on the previous, starting with schema and types, then core auth/permissions logic, then API services, then UI pages, and finally wiring everything together.

## Tasks

- [x] 1. Database migration and type definitions
  - [x] 1.1 Create the database migration file `supabase/migrations/036_user_role_management.sql`
  - [x] 1.2 Add new TypeScript types and update existing types in `src/types/database.ts`

- [x] 2. Fix AuthContext to use team_members
  - [x] 2.1 Modify `src/contexts/AuthContext.tsx` to load from team_members
  - [ ]* 2.2 Write property test for profile loading includes all team memberships

- [x] 3. Update permissions system with team-level checks
  - [x] 3.1 Extend `src/hooks/usePermissions.ts` with team-level permission functions
  - [ ]* 3.2 Write property test for navigation variant determined by App_Role
  - [ ]* 3.3 Write property test for team-level permissions determined by Team_Role
  - [ ]* 3.4 Write property test for App_Role and Team_Role independence

- [x] 4. Checkpoint — Core auth and permissions ✅

- [x] 5. Roles API service
  - [x] 5.1 Create `src/lib/roles-api.ts` extending ApiClient
  - [ ]* 5.2-5.5 Property tests (optional)

- [x] 6. Competitions API service
  - [x] 6.1 Create `src/lib/competitions-api.ts` extending ApiClient
  - [ ]* 6.2-6.4 Property tests (optional)

- [x] 7. Invites API service
  - [x] 7.1 Create `src/lib/invites-api.ts` extending ApiClient
  - [ ]* 7.2-7.7 Property tests (optional)

- [x] 8. Caregivers API service
  - [x] 8.1 Create `src/lib/caregivers-api.ts` extending ApiClient
  - [ ]* 8.2-8.6 Property tests (optional)

- [x] 9. Checkpoint — API services ✅

- [x] 10. Competitions management page (desktop)
  - [x] 10.1 Create `src/pages/desktop/CompetitionsPage.tsx`
  - [x] 10.2 Register CompetitionsPage route in app router

- [x] 11. Lite Landing Page
  - [x] 11.1 Create `src/pages/LiteLandingPage.tsx`
  - [ ]* 11.2 Write property test for privacy consent
  - [x] 11.3 Register LiteLandingPage route in app router

- [x] 12. Caregiver Approval Page
  - [x] 12.1 Create `src/pages/CaregiverApprovalPage.tsx`
  - [ ]* 12.2 Write property test for caregiver registration
  - [x] 12.3 Register CaregiverApprovalPage route in app router

- [x] 13. Checkpoint — New pages ✅

- [x] 14. Desktop Users page — team assignment management
  - [x] 14.1 Modify the desktop Users page to display team assignments and user_type
  - [x] 14.2 Add team assignment management UI (add/change role/remove)
  - [x] 14.3 Add lite user management features (promote to full, user_type filter)
  - [ ]* 14.4-14.5 Property tests (optional)

- [x] 15. Caregiver-player relationship management on desktop
  - [x] 15.1 Caregiver API supports player-caregiver CRUD (via caregivers-api.ts)
  - [ ]* 15.2-15.3 Property tests (optional)

- [x] 16. Wire navigation and integrate all components
  - [x] 16.1 Navigation uses App_Role for visibility (unchanged — already correct)
  - [x] 16.2 Add desktop navigation link for Competitions
  - [x] 16.3 Update CHANGELOG.md and CONVERSATION-HISTORY.md

- [x] 17. Final checkpoint — Full feature integration ✅ Build passes

## Notes

- Tasks marked with `*` are optional property-based tests — skipped for MVP speed
- All core implementation tasks complete
- Migration 036 has been run in Supabase
- Build passes with no errors
