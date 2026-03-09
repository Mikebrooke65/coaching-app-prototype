# Changelog

All notable changes to the football coaching app prototype will be documented in this file.

## [Unreleased]

## [2026-03-10] - User Management Automation with Edge Functions

### Added
- **Automated User Creation System**
  - Created Supabase Edge Function `create-user` for single user creation
  - Created Supabase Edge Function `bulk-create-users` for CSV batch import
  - Both functions handle Supabase Auth + users table creation atomically
  - Automatic team assignment based on team name or ID
  - Random password generation if not provided
  - Admin permission verification for security

- **Updated User Management Page**
  - Individual user creation via form now fully automated
  - CSV bulk import now processes via edge function
  - Password field added to user creation form (optional)
  - Email field disabled when editing (cannot change after creation)
  - Detailed success/failure reporting for bulk imports
  - Error handling with rollback on failures

- **Documentation**
  - Created `USER-MANAGEMENT-SOLUTION.md` - Complete solution overview
  - Created `DEPLOY-EDGE-FUNCTIONS.md` - Step-by-step deployment guide
  - Created `supabase/functions/README.md` - Technical function documentation
  - CSV format examples and troubleshooting guides

### Changed
- User creation no longer requires manual two-step process
- CSV import now creates users in Supabase Auth automatically
- Service role key operations moved to secure server-side functions

### Fixed
- Eliminated manual UUID copying requirement
- Solved scalability issue for 200+ user imports
- Atomic operations prevent orphaned auth users or table records

### Technical Notes
- Edge functions use Deno runtime
- Service role key only used server-side (never exposed to client)
- Functions verify admin role before allowing user creation
- Failed creations automatically rolled back
- Team assignment supports partial name matching

### Deployment Required
To use this feature, admin must deploy edge functions:
```bash
supabase functions deploy create-user
supabase functions deploy bulk-create-users
```

See `DEPLOY-EDGE-FUNCTIONS.md` for complete instructions.

## [2026-03-09] - Session Builder Desktop Page Restructure

### Changed
- **Session Builder Desktop Page**
  - Restructured layout from two-panel (left: library, right: form) to vertical layout
  - Top section: Vertical scrollable list of all sessions (fixed height 320px)
  - Bottom section: Form for creating/editing sessions
  - Clicking a session from the list populates the form with all session data
  - Added "New Session" button to clear form for new session creation
  - Improved filters: Search, Session Type, Age Group
  - Session count display shows filtered vs total sessions
  - Form fields properly mapped to database schema:
    - session_name, title, session_type, duration, age_group
    - organisation, equipment, coaching_points, steps, key_objectives
    - pitch_layout_description
  - Ready for future filter button additions

### Technical Notes
- Vertical list handles hundreds of sessions efficiently with scrolling
- Session selection highlights selected session with blue border
- Form auto-populates when session clicked
- "Clear Form" button resets to new session creation mode
- Save functionality placeholder ready for database integration

## [2026-03-09] - U9 Lesson Generation (Ball Striking and 1v1)

### Added
- **U9 Ball Striking Lessons (2 lessons, 8 sessions)**
  - Migration 018: `018_ball-striking-u9-lessons-01-02.sql`
  - Lesson 01: "Strike It Right: Introduction to Ball Striking"
    - Session 1: Striking Technique (20 min warmup)
    - Session 2: Shooting Accuracy (15 min skill intro)
    - Session 3: Shooting Under Pressure (15 min progressive)
    - Session 4: Shooting Game (15 min game)
  - Lesson 02: "Strike It Clean: Advanced Ball Striking"
    - Session 1: First Time Striking (20 min warmup)
    - Session 2: Power and Placement (15 min skill intro)
    - Session 3: Shooting from Angles (15 min progressive)
    - Session 4: Volleys and Half-Volleys (15 min game)
  - Image prompts: `U9-BALL-STRIKING-LESSON-01-IMAGE-PROMPTS.md` and `U9-BALL-STRIKING-LESSON-02-IMAGE-PROMPTS.md`

- **U9 1v1 Lessons (2 lessons, 8 sessions)**
  - Migration 019: `019_1v1-u9-lessons-01-02.sql`
  - Lesson 01: "Take Them On: Introduction to 1v1"
    - Session 1: 1v1 Basics (20 min warmup)
    - Session 2: 1v1 Moves (15 min skill intro) - Step-over, Drag-back, Chop
    - Session 3: 1v1 Under Pressure (15 min progressive)
    - Session 4: 1v1 Game (15 min game)
  - Lesson 02: "Master the Moves: Advanced 1v1"
    - Session 1: 1v1 Space Creation (20 min warmup)
    - Session 2: 1v1 Advanced Moves (15 min skill intro) - Scissors, Cruyff turn, Elastico
    - Session 3: 1v1 Combination Play (15 min progressive)
    - Session 4: 1v1 Tournament (15 min game)
  - Image prompts: `U9-1V1-LESSON-01-IMAGE-PROMPTS.md` and `U9-1V1-LESSON-02-IMAGE-PROMPTS.md`

### Progress Update
- **Completed**: 12 of 32 lessons (37.5%)
  - U9 Defending: Tackling (2), Marking (2), Pressing (2), Intercepting (2) ✅
  - U9 Attacking: Dribbling (2), Ball Striking (2), 1v1 (2) ✅
- **Remaining**: 20 lessons
  - U9 Attacking: Passing/Receiving (2)
  - U10 All Skills: 8 skills × 2 lessons = 16 lessons

### Technical Notes
- All lessons follow LESSON-CREATION-GUIDE.md format
- All image prompts follow IMAGE-PROMPT-GUIDELINES.md standards
- Each lesson has exactly 4 sessions (warmup, skill_intro, progressive, game)
- Total duration: 65 minutes per lesson
- All lessons are Beginner level for U9
- Metric measurements used throughout (meters, not yards)
- "football (soccer ball)" terminology consistently applied
- Ball possession clearly specified in all pitch layouts

## [2026-03-09] - Lesson System Architecture Refactor

### Added
- **Lesson System Architecture Documentation**
  - Created comprehensive `LESSON-SYSTEM-ARCHITECTURE.md` specification
  - Documented core principles: sessions as globally reusable assets
  - Defined correct database schema with lessons referencing sessions
  - Established session naming conventions
  - Documented media storage structure and requirements
  - Created bulk load process documentation
  - Defined admin UI workflow for future development

- **First Complete Lesson: U9 Tackling Lesson 01**
  - Created `lessons/U9-Tackling-Lesson-01.md` with full content
  - Lesson: "Win It Safely: Block & Poke" (65 minutes total)
  - 4 complete sessions:
    1. Mirror Jockey (20 min) - Warmup
    2. Block Tackle Introduction (15 min) - Skill Intro
    3. 1v1 Tackle Under Pressure (15 min) - Progressive
    4. Tackle Game Application (15 min) - Game
  - Each session includes:
    - Organisation/how it runs
    - Equipment lists
    - Coaching points (5-6 per session)
    - Step-by-step instructions (5-6 steps)
    - Key learning objectives (3 per session)
    - Pitch layout descriptions
    - Media file naming
    - Image generation prompts for pitch diagrams

- **Testing Documentation**
  - Created `TESTING-LESSON-SYSTEM.md` with detailed testing instructions
  - Created `LESSON-TESTING-CHECKLIST.md` with step-by-step checklist
  - Created `LESSON-SYSTEM-SUMMARY.md` with overview of all work
  - Included troubleshooting guides and SQL queries for verification

- **Updated App Component**
  - Created `src/pages/LessonDetail-NEW.tsx` for new schema
  - Fetches lesson with all 4 sessions via JOIN queries
  - Displays all new fields: organisation, steps, key_objectives
  - Shows pitch diagrams if URLs are set
  - Handles session type labels
  - Improved layout with expandable session cards

### Changed
- **Database Schema Refactored (Migration 010)**
  - Sessions are now standalone with unique names as natural identifiers
  - Lessons reference 4 sessions (session_1_id through session_4_id)
  - Sessions can be reused across multiple lessons
  - Deleting a lesson no longer deletes its sessions
  - Added session_type field: warmup, skill_intro, progressive, game
  - Added comprehensive session fields:
    - organisation (how it runs)
    - steps (step-by-step instructions)
    - key_objectives (player learning objectives)
    - pitch_layout_description
    - diagram_url and video_url
  - Lessons now have coaching_focus array
  - Foreign key constraints use ON DELETE RESTRICT for sessions

- **Session Naming Convention**
  - Format: `session-<descriptive-name>-<age-group>`
  - Examples: `session-mirror-jockey-u9`, `session-block-tackle-intro-u9`
  - Must be globally unique
  - Never include lesson numbers
  - Never include session slot numbers

- **Media Storage Structure**
  - Bucket: `lesson-media` (public)
  - Path: `/media/pitch-diagrams/{age-group}/{skill}/{session-name}.png`
  - Videos: `/media/videos/{age-group}/{skill}/{session-name}.mp4`
  - Specs: PNG, 4:5 or 1:1 aspect ratio, 800px min resolution

### Fixed
- Corrected fundamental architecture flaw in original schema
- Sessions were incorrectly tied to lessons (lesson_id FK)
- Now sessions are independent and lessons reference them
- Enables session reusability as originally intended

### Technical Notes
- Migration 010 drops and recreates all lesson/session tables
- Sample data includes complete U9 Tackling Lesson 01
- 4 sessions created with unique names
- 1 lesson created referencing those 4 sessions
- Ready for bulk generation of remaining 31 lessons
- Architecture supports admin UI for Session Builder and Lesson Builder

### Documentation Files Created
- `LESSON-SYSTEM-ARCHITECTURE.md` - Complete architecture spec
- `TESTING-LESSON-SYSTEM.md` - Testing instructions
- `LESSON-TESTING-CHECKLIST.md` - Step-by-step checklist
- `LESSON-SYSTEM-SUMMARY.md` - Overview and summary
- `lessons/U9-Tackling-Lesson-01.md` - First complete lesson

### Next Steps
1. Test migration and verify data
2. Upload pitch diagram images
3. Test lesson display in app
4. Generate remaining 31 lessons (2 per skill × 8 skills × 2 age groups)
5. Build Session Builder UI (admin creates sessions)
6. Build Lesson Builder UI (admin selects 4 sessions)

## [2026-03-08] - Announcement Rich Text Editor Implementation

### Changed
- **Announcements System - Rich Text Editor**
  - Replaced markdown syntax with WYSIWYG rich text editor (React Quill)
  - Admin announcement form now has visual formatting toolbar:
    - Bold, italic, underline buttons
    - Heading 2 and Heading 3 options (H1 removed - reserved for title)
    - Bullet and numbered lists
    - Link insertion
    - Clean formatting button
  - Increased editor height to 300px for better usability
  - Mobile Landing page now renders HTML content with proper styling
  - Removed react-markdown dependency
  
- **Typography Hierarchy**
  - Announcement title: H1 (30px, Inter/Aktiv Grotesk Corp, bold)
  - Content H2: 18px (Exo 2, weight 600)
  - Content H3: 16px (Exo 2, weight 600)
  - Body text: Exo 2
  - Added custom CSS for announcement content styling
  - Enforced font families per brand guidelines (Aktiv Grotesk Corp for headings, Exo 2 for body)

### Fixed
- Fixed announcement content display in admin table (now renders HTML instead of showing raw code)
- Fixed react-markdown className prop error (removed unsupported prop)
- Added `!important` flags to content heading styles to override Quill defaults

### Technical Notes
- Users can now format announcements visually without knowing markdown syntax
- Rich text content stored as HTML in database
- Mobile Landing page uses `dangerouslySetInnerHTML` to render formatted content
- Desktop admin page shows formatted preview in announcement list table

## [2026-03-08] - Resources and Announcements Systems

### Added
- **Resources Management System**
  - Desktop admin page for uploading and managing resource files
  - 4 categories: Rules, Field Setup, Coach Support, General
  - File upload with Supabase Storage integration
  - Mobile Resources page with category filtering
  - Special Rules section with dropdown selector for 4 age-group rule sets:
    - First Kicks (4-6 years)
    - Fun Football (7-8 years)
    - Mini Football (9-10 years)
    - Mini Football (11-12 years)
  - Database migration for resources table and storage bucket

- **Announcements Management System**
  - Desktop admin page for creating and managing announcements
  - Flexible targeting system:
    - User roles (Coach, Manager, Admin, Player, Caregiver)
    - Team types (First Kicks, Fun Football, Junior, Youth, Senior)
    - Divisions (Community, Academy)
    - Age groups (U4-U17)
    - Specific teams
  - Optional image upload for announcements
  - "Ongoing" flag to prevent 7-day auto-expiry
  - Automatic expiry after 7 days for non-ongoing announcements
  - Mobile Landing page displays targeted announcements
  - Database migration for announcements table and storage bucket

- **Lessons and Sessions Database**
  - Created lessons table with 8 sample lessons
  - Created sessions table (4 sessions per lesson)
  - Created lesson_deliveries and session_deliveries tables
  - Lesson template file for bulk lesson creation
  - Seed file for adding lessons via SQL

### Changed
- Updated mobile Landing page to show real data:
  - Users count from database
  - Teams count from database
  - Announcements fetched with targeting logic
- Updated Coaching page to fetch real lessons from database
- Fixed lesson selection behavior (navigate to detail on second click)
- Improved Rules page styling with better visual hierarchy

### Fixed
- Fixed lesson navigation route (changed from `/lesson/:id` to `/lessons/:id`)
- Fixed duplicate stats variable declaration in Landing page
- Fixed bullet point alignment in Rules sections

## [2026-03-06] - Desktop UI Alignment with Figma

### Added
- Colored page headings to Session Builder and Lesson Builder pages
  - Session Builder: Green heading (#22c55e) with description
  - Lesson Builder: Green heading (#22c55e) with description
  - Matches Figma design specifications for coaching tools section

### Fixed
- Session Builder and Lesson Builder pages now have consistent heading style with other desktop pages
- All desktop pages now properly aligned with Figma design specifications

## [2026-03-05] - Desktop Admin Pages Implementation

### Added
- Implemented all 12 desktop admin pages with full functionality:
  1. **Landing Page** - Desktop version of landing page
  2. **Coaching Hub** - Desktop coaching interface
  3. **Games Management** - Desktop games view
  4. **Resources Library** - Desktop resources interface
  5. **Schedule** - Desktop calendar view
  6. **Messaging** - Desktop messaging interface
  7. **Session Builder** - Split-panel layout with sessions library (left) and build form (right)
     - Filter by age group, session type, duration, skill focus
     - Create/edit sessions with objectives, equipment, setup, coaching points, variations
     - Save/publish/draft functionality
     - Mock data with 3 sample sessions
  8. **Lesson Builder** - Split-panel layout with lessons library (left) and 4-block builder (right)
     - 4 FIXED session blocks: Warm-Up & Technical, Skill Introduction, Progressive Development, Game Application
     - Session selection dropdowns filtered by age group and block type
     - Auto-calculated total duration
     - Mock data with 1 sample lesson and 8 available sessions
  9. **Teams Management** - Full CRUD operations for team management
     - Table view with search and filters (Age Group, Division)
     - Add/edit/delete teams with modal forms
     - Coach assignment functionality
     - Mock data with 3 teams and 4 coaches
  10. **User Management** - Complete user administration
      - User table with role management (Player, Caregiver, Coach, Manager, Admin)
      - Status toggle (Active/Inactive)
      - CSV import functionality with example format
      - Add/edit/delete users with modal forms
      - Team assignment
      - Mock data with 5 users
  11. **Reporting Dashboard** - Analytics and metrics
      - Key metrics cards: Active Users, Training Attendance, Lesson Views, Messages Sent
      - Attendance trend chart (6-week bar chart)
      - User engagement by role (progress bars)
      - Most popular lessons table (top 5)
      - Summary stats cards: Total Sessions Created, Total Lessons Built, Active Teams
      - Date range filtering (Last 7/30/90 Days, This Year)
      - Export functionality (PDF, Excel)
  12. **Announcements Management** - Landing page announcement system
      - Create/edit/delete announcements
      - Priority levels (Normal, High)
      - Audience targeting (All Users, Coaches Only, Players Only, Caregivers Only)
      - Pin to top functionality
      - Publish date tracking
      - Mock data with 2 sample announcements
- Updated desktop navigation with correct structure:
  - Main section (1-6): Landing, Coaching, Games, Resources, Schedule, Messaging
  - Admin section (7-12): Session Builder, Lesson Builder, Teams, Users, Reporting, Announcements
- Mobile pages implemented:
  - Landing Page with blue gradient header, quick access cards, announcements
  - Coaching Hub with links to Lessons and AI Coach
  - Lessons page with search, filters, and lesson cards
  - Lesson Detail page with 4 session blocks, objectives, equipment, coaching points
- All pages use brand colors (#0091f3 blue, #ea7800 orange, #545859 dark grey)
- All pages use mock data for prototype demonstration

### Fixed
- Repository push configuration - now pushing to correct repository (coaching-app-prototype)
- Build syntax errors in AuthContext.tsx (missing closing braces, removed timeout reference)
- Build syntax errors in Reporting.tsx (className typos, variable name typo)
- Session persistence issue - simplified auth initialization logic
- Removed complex timeout recovery mechanism that was causing "navigating..." hang
- **Desktop navigation not working** - Added `key={location.pathname}` to `<Outlet />` in DesktopLayout to force re-render on route changes
  - Pages were accessible via direct URL but not via navigation links
  - React Router wasn't re-rendering the Outlet component when route changed
  - Solution forces React to treat each route as a new component instance

### Known Issues
- **Session Persistence Not Working** - User gets logged out on page refresh
  - Session IS being saved to localStorage (`sb-pikrxkxpizdezazlwxhb-auth-token` key exists)
  - `supabase.auth.getSession()` was timing out (3 seconds) when trying to read session
  - Implemented simplified auth initialization without timeout recovery
  - Issue may be related to Supabase project configuration or network latency
  - **WORKAROUND**: User must log in again after page refresh
  - **TODO**: Debug why getSession() hangs even though session exists in localStorage
  - **TODO**: Consider alternative session management approach or check Supabase project auth settings

### Technical Notes
- All admin pages follow consistent split-panel or table-based layouts
- CRUD operations working in-memory (not yet connected to Supabase database)
- CSV import uses simple parsing (headers: email, first_name, last_name, role, status, team, cellphone)
- Reporting charts use simple HTML/CSS bar charts (no charting library yet)
- All forms include validation and user feedback
- Modal dialogs for add/edit operations across all management pages

### Deployment
- Successfully deployed to Netlify: https://wcrfootball.netlify.app
- Build passing after syntax error fixes
- All 12 admin pages accessible to admin users on desktop

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
