# Changelog

All notable changes to the football coaching app prototype will be documented in this file.

## [Unreleased]

### Added
- Created technical-foundation spec using design-first workflow
  - Completed comprehensive design document covering architecture, database schema, API layer, state management, offline sync, routing, layouts, error handling, testing, security, and deployment
  - Created requirements document with 27 requirements derived from the technical design
  - Mapped all 17 correctness properties to specific requirements for validation
  - Established 12-week implementation roadmap
- Set up Supabase project and database
  - Created Supabase account and project (pikrxkxpizdezazlwxhb.supabase.co)
  - Added environment configuration files (.env.development, .env.production)
  - Created database migration files (001_initial_schema.sql, 002_rls_policies.sql)
  - Database schema includes 13 tables with relationships, indexes, and initial data
  - Row-Level Security policies enforce role-based access control
  - Executed migration files in Supabase SQL Editor to create complete database schema
  - All tables, indexes, RLS policies, and initial skill categories now live in production database
- Implemented Phase 1: Core Infrastructure
  - Installed and configured Supabase JavaScript client (@supabase/supabase-js)
  - Created base API client with type-safe CRUD operations (src/lib/api-client.ts)
  - Defined complete TypeScript type definitions for all database models (src/types/database.ts)
  - Implemented authentication system with AuthContext and AuthProvider
  - Created login page with password reset functionality
  - Built ProtectedRoute component with role-based access control
  - Created usePermissions hook for permission checking throughout app
  - Implemented state management with Zustand (3 stores: app, offline, content)
  - Created online/offline status monitoring hook
  - Created responsive layout detection hook
  - Built sync status indicator component
  - Configured React Router with role-based protected routes
  - Created MainLayout for mobile with bottom navigation (full and lite versions)
  - Created DesktopLayout for admin with collapsible sidebar
  - Created placeholder pages for all routes (mobile and desktop)
  - Integrated all components in App.tsx with AuthProvider
  - Updated main.tsx entry point
  - ✅ Phase 1 complete and tested - authentication working, app rendering
- Created CLUB-QUESTIONS.md document for requirements gathering
- Added 10 question sections covering:
  - Skills terminology and structure
  - Team structure and tagging system
  - Friendly Manager API integration
  - Data synchronization and edit management
  - Player and team feedback management
  - Feedback model and framework
  - AI-powered session builder
  - AI session adaptation and rewriting
  - Adding caregivers and players user management
  - Game scheduling and communication
- Documented team classification structure with Type, Technical Level, Gender, Age Group, and Team Name attributes
- Added casual competition scenario with proposed "Lite" user model (CoachLite, ManagerLite, PlayerLite, CaregiverLite)
- Proposed email-based invitation system for self-managed teams
- Created PROJECT-ROLLOUT.md document outlining phased rollout strategy
- Documented Version 1.0 trial plan: 10-week trial with <20 Junior Community teams
- Defined success criteria for all user roles and features
- Outlined post-trial decision points and risk management strategy
- Created KIRO_HANDOVER.md from Figma export with complete UI/UX specifications
- Created ALIGNMENT-ANALYSIS.md comparing requirements vs Figma handover
- Added Requirement 22: Admin Reporting Dashboard to requirements document
  - Usage statistics by role and feature
  - Lesson delivery tracking and trends
  - Coach activity reports
  - Player/team participation metrics
  - Feedback summaries and ratings
  - Filtering and export capabilities

### Updated
- Question 2 (Team Structure & Tagging System) marked as ANSWERED with complete classification details
- Team types defined: First Kicks (U4-U6), Fun Football (U7-U8), Junior Football (U9-U12), Youth Football (U13-U17), Senior Football
- Technical levels: Community and Academy/Development
- Gender categories: Mixed and Female
- Unique team identifier established as Age Group + Team Name combination
- Clarified that sessions/lessons are tagged with Type, Technical Level, Gender, Age Group (NOT specific Team Names)
- Sessions/lessons support multiple tags for flexibility
- Question 10 (Game Scheduling & Communication) marked as PARTIALLY ANSWERED with current Sporty system workflow
- Documented Friday midday lockoff process and manual distribution workflow
- Identified automation opportunity with home field allocation check requirement
- Documented field allocation issue: Sporty defaults to Field #1, requires manual reallocation
- Proposed automated workflow: Pull from Sporty → Manual review/edit → Post button → Targeted messaging
- Added Requirement 22 (Admin Reporting Dashboard) to requirements document with comprehensive metrics and filtering

### Fixed
- Figma asset import paths (changed from figma:asset URLs to actual file paths)
- Netlify SPA routing (added _redirects file)
- RLS policy circular dependencies (migration 003 and 004)
  - Removed recursive policy checks that caused 500 errors
  - Simplified to allow all authenticated users to view users table
  - Fixed user profile fetching after authentication
- Supabase client multiple instance issue
  - Implemented singleton pattern to prevent lock timeouts
  - Added PKCE flow type and explicit storage configuration
  - Resolved "Lock was not released within 5000ms" errors
  - Login now works reliably in browser environment

## [2026-03-02] - Netlify Deployment Setup

### Changed
- Updated `vite.config.ts`: Changed base path from `/coaching-app-prototype/` to `/` for Netlify compatibility
- Updated `index.html`: Replaced hard-coded built asset references with source entry point `/src/main.tsx`

### Fixed
- Fixed Vite build failures on Netlify caused by GitHub Pages configuration
- Fixed asset resolution issues during production build

### Deployment
- Successfully deployed to Netlify
- Repository: https://github.com/Mikebrooke65/coaching-app-prototype
- Branch: main
- Build command: `npm run build`
- Publish directory: `dist`

---

## Instructions for Maintaining This File

When making updates:
1. Add new entries under `[Unreleased]` section
2. When deploying, move unreleased items to a new dated section
3. Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
4. Include commit hashes when relevant
