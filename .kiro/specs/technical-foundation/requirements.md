# Requirements Document: Technical Foundation

## Introduction

This document specifies the functional and non-functional requirements for the technical foundation of the football coaching app for West Coast Rangers FC. The system provides a role-based coaching management platform supporting 200+ users across 5 roles (Player, Caregiver, Coach, Manager, Admin) with mobile and desktop responsive interfaces. The foundation prioritizes offline capability, role-based access control, secure authentication, and data synchronization while maintaining a scalable architecture for future enhancements.

## Glossary

- **System**: The football coaching application
- **User**: Any authenticated person using the application
- **Coach**: A user with the coach role who delivers lessons and provides feedback
- **Admin**: A user with the admin role who manages content, users, and teams
- **Manager**: A user with the manager role who has coaching privileges plus team oversight
- **Player**: A user with the player role who has limited access to schedules and messages
- **Caregiver**: A user with the caregiver role who has limited access to their player's information
- **Session**: A 20-minute training activity with setup instructions and learning objectives
- **Lesson**: A complete training program composed of exactly 4 sessions
- **Delivery_Record**: A record of a lesson delivered by a coach to a team on a specific date
- **Team**: A group of players organized by age group and division
- **Sync_Manager**: The component responsible for offline data synchronization
- **RLS_Policy**: Row-Level Security policy enforced at the database level
- **Auth_Service**: The authentication service managing user sessions
- **IndexedDB**: Client-side structured storage for offline capability
- **Supabase**: The backend-as-a-service platform providing database, auth, and storage

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to securely log in to the system, so that I can access features appropriate to my role.

#### Acceptance Criteria

1. WHEN a user provides valid credentials, THE Auth_Service SHALL authenticate the user and create a session
2. WHEN a user provides invalid credentials, THE Auth_Service SHALL reject the login attempt and display an error message
3. WHEN a session expires, THE System SHALL redirect the user to the login page
4. WHEN a user requests password reset, THE Auth_Service SHALL send a secure reset link via email
5. THE Auth_Service SHALL hash passwords using bcrypt with 10 rounds
6. WHEN a user logs in successfully, THE System SHALL fetch the user profile including team assignments and default team
7. THE System SHALL store session tokens securely using httpOnly, secure, and sameSite cookie attributes

### Requirement 2: Role-Based Access Control

**User Story:** As a system administrator, I want users to only access features appropriate to their role, so that data privacy and security are maintained.

#### Acceptance Criteria

1. WHEN a user attempts to access a route, THE System SHALL verify the user's role is in the route's allowed roles list
2. WHEN a Coach attempts to access admin routes, THE System SHALL deny access and redirect to the landing page
3. WHEN a Player or Caregiver attempts to access coaching features, THE System SHALL deny access and redirect to the landing page
4. WHEN an Admin user accesses the system on a mobile device, THE System SHALL display a desktop-only message for admin routes
5. THE RLS_Policy SHALL enforce role-based data access at the database level
6. WHEN a Coach queries delivery records, THE RLS_Policy SHALL return only records created by that coach or team-level records without coach attribution

### Requirement 3: Offline Capability

**User Story:** As a coach, I want to browse lessons and create delivery records without internet connectivity, so that I can work effectively at training grounds with poor connectivity.

#### Acceptance Criteria

1. WHEN the System detects offline status, THE Sync_Manager SHALL load cached content from IndexedDB
2. WHEN a user creates a delivery record while offline, THE Sync_Manager SHALL queue the record in IndexedDB for later upload
3. WHEN the System detects online status, THE Sync_Manager SHALL automatically upload all queued records to the server
4. WHEN sync completes successfully, THE Sync_Manager SHALL update the local cache with the latest remote data
5. WHEN sync fails, THE System SHALL display an error indicator and retry on the next sync interval
6. THE Sync_Manager SHALL sync data every 5 minutes when online
7. WHEN queued records are uploaded successfully, THE Sync_Manager SHALL remove them from the queue

### Requirement 4: Lesson Structure Management

**User Story:** As an admin, I want to create and manage lessons with a consistent 4-session structure, so that coaches have standardized training programs.

#### Acceptance Criteria

1. WHEN an admin creates a lesson, THE System SHALL require exactly 4 sessions to be selected
2. WHEN an admin assigns sessions to lesson slots, THE System SHALL enforce the slot types: warmup_technical, skill_introduction, progressive_development, game_application
3. WHEN an admin updates a lesson, THE System SHALL increment the version number by 1
4. WHEN a lesson is saved, THE System SHALL calculate and store the total duration as 80 minutes
5. THE System SHALL allow admins to tag lessons with age groups, skill level, and focus areas
6. WHEN an admin publishes a lesson, THE System SHALL make it visible to all authenticated users
7. WHEN an admin saves a lesson as draft, THE System SHALL make it visible only to admins

### Requirement 5: Session Repository Management

**User Story:** As an admin, I want to create and manage training sessions with rich content, so that coaches have detailed activity instructions.

#### Acceptance Criteria

1. WHEN an admin creates a session, THE System SHALL require name, skill category, session type, description, and setup instructions
2. THE System SHALL allow admins to upload setup images and video URLs for sessions
3. THE System SHALL allow admins to define learning objectives as a list of strings
4. THE System SHALL allow admins to tag sessions with age groups, technical level, fun level, and duration
5. WHEN an admin publishes a session, THE System SHALL make it available for lesson composition
6. THE System SHALL support session types: technical_drill, skill_introduction, skill_development, game

### Requirement 6: Delivery Record Tracking

**User Story:** As a coach, I want to record lesson deliveries to my team, so that I can track what content has been covered.

#### Acceptance Criteria

1. WHEN a coach creates a delivery record, THE System SHALL capture coach name and team name as text snapshots
2. WHEN a coach creates a delivery record, THE System SHALL record the lesson version number
3. WHEN a coach creates a delivery record, THE System SHALL set created_by to the coach's user ID and created_at to the current timestamp
4. WHEN a coach updates a delivery record, THE System SHALL set updated_by to the coach's user ID and updated_at to the current timestamp
5. WHEN a coach deletes a delivery record, THE System SHALL perform a soft delete by setting deleted_by and deleted_at
6. THE System SHALL allow coaches to add optional notes to delivery records
7. WHEN a coach views delivery history, THE System SHALL display records ordered by delivery date descending

### Requirement 7: Feedback Collection

**User Story:** As a coach, I want to provide feedback on sessions, lessons, and games, so that admins can improve content and I can track team progress.

#### Acceptance Criteria

1. WHEN a coach submits session feedback, THE System SHALL require a rating between 0 and 5
2. WHEN a coach submits lesson feedback, THE System SHALL require a rating between 0 and 5
3. THE System SHALL allow coaches to add optional comments to session and lesson feedback
4. WHEN a coach submits game feedback, THE System SHALL require WWW (What Went Well) and EBI (Even Better If) for all 4 moments of football
5. THE System SHALL capture the 4 moments as: Attacking, Transition Attack to Defend, Defending, Transition Defend to Attack
6. THE System SHALL allow coaches to specify key areas for improvement as a list
7. WHEN feedback is submitted, THE System SHALL link it to the coach, team, and date for reporting purposes

### Requirement 8: Team Management

**User Story:** As an admin, I want to manage teams and assign users to teams, so that the system reflects the club's organizational structure.

#### Acceptance Criteria

1. WHEN an admin creates a team, THE System SHALL require name, age group, training ground, and training time
2. THE System SHALL allow admins to assign multiple users to a team
3. THE System SHALL allow admins to designate one team as a user's default team
4. WHEN a user has a default team, THE System SHALL pre-populate team selection fields with that team
5. THE System SHALL support coaches and managers being assigned to multiple teams
6. THE System SHALL support players and caregivers being assigned to their respective teams
7. WHEN an admin updates team information, THE System SHALL not affect historical delivery records (denormalized names)

### Requirement 9: User Management

**User Story:** As an admin, I want to manage user accounts and roles, so that I can control system access.

#### Acceptance Criteria

1. WHEN an admin creates a user, THE System SHALL require email, first name, last name, cellphone, and role
2. THE System SHALL support 5 roles: player, caregiver, coach, manager, admin
3. WHEN an admin creates a user, THE System SHALL send a password setup email via Supabase Auth
4. THE System SHALL allow admins to activate or deactivate user accounts
5. WHEN a user is deactivated, THE System SHALL prevent login and invalidate existing sessions
6. THE System SHALL track last login timestamp for each user
7. THE System SHALL allow users to update their own profile information except role

### Requirement 10: Announcement System

**User Story:** As an admin, I want to create targeted announcements, so that I can communicate important information to specific user groups.

#### Acceptance Criteria

1. WHEN an admin creates an announcement, THE System SHALL require title, content, priority, audience, and publish date
2. THE System SHALL support audience types: all, coaches, managers, players, caregivers
3. THE System SHALL allow admins to target announcements to specific teams or age groups
4. WHEN an announcement is published, THE System SHALL display it to users matching the audience and team criteria
5. WHEN an announcement has an expiration date in the past, THE System SHALL hide it from all users
6. WHEN no expiration date is set, THE System SHALL automatically expire announcements after 7 days
7. THE System SHALL allow admins to pin announcements to display them first in the list
8. THE System SHALL support draft and published status for announcements

### Requirement 11: Responsive Layout

**User Story:** As a user, I want the interface to adapt to my device, so that I have an optimal experience on mobile and desktop.

#### Acceptance Criteria

1. WHEN the viewport width is less than 768px, THE System SHALL display the mobile layout with bottom navigation
2. WHEN the viewport width is 768px or greater and the user is an admin, THE System SHALL display the desktop layout with sidebar navigation
3. WHEN the viewport width is 768px or greater and the user is not an admin, THE System SHALL display the mobile layout
4. WHEN the layout changes, THE System SHALL preserve the current route and application state
5. THE System SHALL display appropriate navigation items based on user role
6. WHEN a Coach, Manager, or Admin logs in, THE System SHALL display full version navigation including Coaching, Games, and Resources
7. WHEN a Player or Caregiver logs in, THE System SHALL display lite version navigation with only Landing, Schedule, and Messaging

### Requirement 12: Data Synchronization Consistency

**User Story:** As a coach, I want my offline changes to sync reliably when I'm back online, so that I don't lose any work.

#### Acceptance Criteria

1. WHEN the Sync_Manager uploads queued records, THE System SHALL process them in the order they were created
2. WHEN a sync operation completes successfully, THE Sync_Manager SHALL ensure local cache matches remote database
3. WHEN a sync operation fails, THE Sync_Manager SHALL not corrupt the local cache
4. WHEN a record is queued for upload, THE Sync_Manager SHALL store it atomically in IndexedDB
5. WHEN the System comes online, THE Sync_Manager SHALL immediately trigger a sync operation
6. THE Sync_Manager SHALL display sync status indicators: idle, syncing, success, error
7. WHEN multiple devices modify the same record, THE System SHALL use last write wins based on updated_at timestamp

### Requirement 13: Content Filtering and Search

**User Story:** As a coach, I want to filter lessons and sessions by skill, age group, and other criteria, so that I can quickly find relevant content.

#### Acceptance Criteria

1. WHEN a coach filters lessons by skill, THE System SHALL return only lessons with that skill_id
2. WHEN a coach filters lessons by age group, THE System SHALL return only lessons tagged with that age group
3. WHEN a coach filters sessions by session type, THE System SHALL return only sessions of that type
4. THE System SHALL support combining multiple filter criteria with AND logic
5. WHEN no results match the filter criteria, THE System SHALL display an empty state message
6. THE System SHALL persist filter selections in the URL query parameters
7. WHEN a coach clears filters, THE System SHALL display all published content

### Requirement 14: Admin Reporting

**User Story:** As an admin, I want to view reports on lesson deliveries and feedback, so that I can assess content effectiveness and coach activity.

#### Acceptance Criteria

1. WHEN an admin views the reporting page, THE System SHALL display delivery counts by lesson, team, and time period
2. WHEN an admin views feedback reports, THE System SHALL display average ratings for sessions and lessons
3. THE System SHALL allow admins to filter reports by date range, team, and coach
4. THE System SHALL display coach activity metrics including delivery count and feedback submissions
5. THE System SHALL allow admins to export report data as CSV
6. WHEN viewing lesson effectiveness, THE System SHALL aggregate feedback ratings across all deliveries
7. THE System SHALL display game feedback organized by team and date

### Requirement 15: Error Handling

**User Story:** As a user, I want clear error messages when something goes wrong, so that I understand what happened and what to do next.

#### Acceptance Criteria

1. WHEN an authentication error occurs, THE System SHALL redirect to the login page with an appropriate message
2. WHEN an authorization error occurs, THE System SHALL display an access denied message and redirect to the landing page
3. WHEN a validation error occurs, THE System SHALL display field-specific error messages
4. WHEN a network error occurs, THE System SHALL display a connectivity error message and suggest checking internet connection
5. WHEN an unexpected error occurs, THE System SHALL display a generic error message and log the error for debugging
6. THE System SHALL catch all unhandled errors in an error boundary component
7. WHEN an error boundary catches an error, THE System SHALL display a recovery UI with a reload option

### Requirement 16: Performance Requirements

**User Story:** As a user, I want the application to load quickly and respond promptly, so that I can work efficiently.

#### Acceptance Criteria

1. WHEN a user loads the initial page, THE System SHALL achieve First Contentful Paint within 1.5 seconds
2. WHEN a user loads the initial page, THE System SHALL achieve Largest Contentful Paint within 2.5 seconds
3. WHEN a user loads the initial page, THE System SHALL achieve Time to Interactive within 3.5 seconds
4. WHEN a user interacts with the UI, THE System SHALL respond with First Input Delay less than 100ms
5. THE System SHALL maintain Cumulative Layout Shift less than 0.1
6. WHEN a user queries data, THE System SHALL return results within 2 seconds under normal load
7. WHEN a user performs offline operations, THE System SHALL complete them immediately without network delay

### Requirement 17: Security Requirements

**User Story:** As a system administrator, I want the application to protect user data and prevent unauthorized access, so that the club's information remains secure.

#### Acceptance Criteria

1. THE System SHALL enforce HTTPS for all connections
2. THE System SHALL use TLS 1.3 for transport security
3. WHEN storing passwords, THE Auth_Service SHALL hash them using bcrypt with 10 rounds
4. THE System SHALL validate all user input on both client and server sides
5. THE System SHALL prevent SQL injection through parameterized queries
6. THE System SHALL prevent XSS attacks through React auto-escaping and DOMPurify for rich text
7. THE System SHALL implement CSRF protection using SameSite cookie attributes and CSRF tokens
8. THE RLS_Policy SHALL enforce data isolation between coaches
9. THE System SHALL log all admin actions for audit trail purposes
10. THE System SHALL encrypt sensitive data at rest in the database

### Requirement 18: Database Integrity

**User Story:** As a system administrator, I want the database to maintain referential integrity and prevent invalid states, so that data remains consistent.

#### Acceptance Criteria

1. WHEN a user is deleted, THE System SHALL prevent deletion if the user has associated delivery records
2. WHEN a team is deleted, THE System SHALL prevent deletion if the team has associated delivery records
3. WHEN a lesson is deleted, THE System SHALL prevent deletion if the lesson has associated delivery records
4. THE System SHALL enforce foreign key constraints on all relationship tables
5. THE System SHALL enforce unique constraints on user email addresses
6. THE System SHALL enforce check constraints on rating fields to ensure values between 0 and 5
7. WHEN a transaction fails, THE System SHALL roll back all changes atomically

### Requirement 19: Audit Trail

**User Story:** As an admin, I want to track who created, updated, and deleted records, so that I can maintain accountability.

#### Acceptance Criteria

1. WHEN a delivery record is created, THE System SHALL record created_by and created_at
2. WHEN a delivery record is updated, THE System SHALL record updated_by and updated_at
3. WHEN a delivery record is deleted, THE System SHALL record deleted_by and deleted_at without removing the record
4. THE System SHALL make created_by and created_at immutable after creation
5. THE System SHALL preserve all historical versions of delivery records
6. WHEN viewing audit information, THE System SHALL display user names and timestamps in local timezone
7. THE System SHALL allow admins to filter records by creation date, update date, and deletion status

### Requirement 20: Skill Categorization

**User Story:** As an admin, I want to organize sessions and lessons by skill categories, so that coaches can find content by training focus.

#### Acceptance Criteria

1. THE System SHALL support skill categories: Passing and First Touch, Dribbling and Ball Control, Shooting, Defending, Attacking, Transitions
2. WHEN an admin creates a session, THE System SHALL require selection of one skill category
3. WHEN an admin creates a lesson, THE System SHALL require selection of one skill category
4. THE System SHALL display skills in a consistent order based on display_order field
5. WHEN a coach filters by skill, THE System SHALL return all sessions and lessons in that category
6. THE System SHALL allow admins to add new skill categories
7. THE System SHALL prevent deletion of skill categories that have associated content

### Requirement 21: Player-Caregiver Relationships

**User Story:** As an admin, I want to link players to their caregivers, so that caregivers can access their player's information.

#### Acceptance Criteria

1. WHEN an admin links a player to a caregiver, THE System SHALL create a player_caregiver record
2. THE System SHALL support multiple caregivers per player
3. THE System SHALL support multiple players per caregiver
4. WHEN a caregiver logs in, THE System SHALL display information for all linked players
5. THE System SHALL allow admins to remove player-caregiver links
6. THE RLS_Policy SHALL allow caregivers to read only their linked players' information
7. THE RLS_Policy SHALL allow players to read their linked caregivers' information

### Requirement 22: Content Versioning

**User Story:** As an admin, I want to track lesson versions, so that historical delivery records reference the correct content version.

#### Acceptance Criteria

1. WHEN a lesson is first created, THE System SHALL set version to 1
2. WHEN a lesson is updated, THE System SHALL increment version by 1
3. WHEN a delivery record is created, THE System SHALL capture the current lesson version
4. WHEN viewing a delivery record, THE System SHALL display which version of the lesson was delivered
5. THE System SHALL allow admins to view all versions of a lesson
6. THE System SHALL prevent deletion of lesson versions that have associated delivery records
7. WHEN a lesson version is updated, THE System SHALL not affect existing delivery records

### Requirement 23: Denormalized Historical Data

**User Story:** As an admin, I want delivery records to preserve coach and team names as they were at the time of delivery, so that historical reports remain accurate even if names change.

#### Acceptance Criteria

1. WHEN a delivery record is created, THE System SHALL copy coach name from the user record to the delivery record
2. WHEN a delivery record is created, THE System SHALL copy team name from the team record to the delivery record
3. WHEN a coach's name is updated, THE System SHALL not modify existing delivery records
4. WHEN a team's name is updated, THE System SHALL not modify existing delivery records
5. THE System SHALL store both the foreign key ID and the denormalized name for coaches and teams
6. WHEN displaying delivery history, THE System SHALL use the denormalized names
7. THE System SHALL allow admins to manually correct denormalized names if needed

### Requirement 24: Session Timeout

**User Story:** As a security administrator, I want user sessions to expire after a period of inactivity, so that unattended devices don't remain logged in.

#### Acceptance Criteria

1. WHEN a user session is created, THE System SHALL set expiration to 7 days from creation
2. WHEN a session expires, THE System SHALL invalidate the session token
3. WHEN a user attempts to use an expired session, THE System SHALL redirect to the login page
4. THE System SHALL refresh session tokens automatically before expiration if the user is active
5. WHEN a user logs out, THE System SHALL immediately invalidate the session token
6. THE System SHALL store session expiration time in the JWT token
7. THE System SHALL validate session expiration on every authenticated request

### Requirement 25: Deployment and Build

**User Story:** As a developer, I want automated build and deployment processes, so that code changes are reliably deployed to production.

#### Acceptance Criteria

1. WHEN code is pushed to the main branch, THE System SHALL trigger an automated build via GitHub Actions
2. WHEN the build succeeds, THE System SHALL automatically deploy to Netlify production
3. WHEN the build fails, THE System SHALL notify developers and prevent deployment
4. THE System SHALL run linting, type checking, and tests before building
5. THE System SHALL generate source maps for debugging production issues
6. THE System SHALL apply code splitting to optimize bundle size
7. THE System SHALL configure Netlify redirects to support client-side routing

### Requirement 26: Logging and Monitoring

**User Story:** As a developer, I want comprehensive logging and error tracking, so that I can diagnose and fix issues quickly.

#### Acceptance Criteria

1. WHEN an error occurs in production, THE System SHALL send error details to an error tracking service
2. THE System SHALL log errors with severity levels: debug, info, warn, error
3. THE System SHALL include contextual information in error logs: user ID, route, timestamp
4. THE System SHALL respect log level configuration from environment variables
5. WHEN in development mode, THE System SHALL log debug messages to the console
6. WHEN in production mode, THE System SHALL only log error messages to the console
7. THE System SHALL track performance metrics: FCP, LCP, TTI, FID, CLS

### Requirement 27: Data Seeding

**User Story:** As a developer, I want to seed the database with initial data, so that I can test the application with realistic content.

#### Acceptance Criteria

1. WHEN the seed script runs, THE System SHALL create skill categories with display order
2. WHEN the seed script runs, THE System SHALL create sample teams with age groups and training schedules
3. WHEN the seed script runs, THE System SHALL create an admin user with credentials
4. WHEN the seed script runs, THE System SHALL create sample coach users assigned to teams
5. THE System SHALL use Supabase service role key for seeding to bypass RLS policies
6. THE System SHALL prevent duplicate seeding by checking for existing data
7. THE System SHALL log seed progress and completion status
