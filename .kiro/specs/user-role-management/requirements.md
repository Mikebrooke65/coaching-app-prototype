# Requirements Document

## Introduction

The User Role Management feature overhauls how the West Coast Rangers Football Club Junior Coaching App handles user roles, team membership, competitions, and lite user workflows. Currently the app has a single `users.role` field for app-level permissions and a `team_members` table with a limited role check constraint (`player`, `coach`). A legacy `user_teams` table exists but is empty and incorrectly referenced by AuthContext for profile loading. This feature introduces independent app-level and team-level role systems, a competitions framework, three distinct lite user scenarios, and resolves the critical `user_teams` data integrity issue by deprecating it entirely in favour of `team_members` as the single source of truth.

## Glossary

- **App**: The West Coast Rangers Football Club Junior Coaching App (React + TypeScript + Supabase + Vite)
- **Admin_Site**: The desktop web interface for administrative functions
- **App_Role**: The application-level permission stored in `users.role` (admin, coach, manager, player, caregiver)
- **Team_Role**: The team-level role stored in `team_members.role` (coach, manager, player) — independent of App_Role
- **Full_User**: A user with a complete club membership and full app access (user_type = 'full')
- **Lite_User**: A user with temporary or limited access created through an invite process (user_type = 'lite')
- **Competition**: A tournament, league, or social competition that teams participate in, stored in the `competitions` table
- **WCR_Competition**: A competition officially sanctioned by West Coast Rangers requiring full club membership
- **Other_Competition**: A non-WCR competition (tournament, social) that triggers lite user processes
- **Invite_Code**: A unique alphanumeric code sent via email that allows a new user to register through the Lite_Landing_Page
- **Lite_Landing_Page**: A simplified registration page accessed via Invite_Code for creating lite user accounts
- **Caregiver_Approval**: A workflow where an existing caregiver must approve the addition of a new caregiver to their linked player
- **Team_Members_Table**: The `team_members` database table — the single source of truth for all team membership and team-level roles
- **User_Teams_Table**: The legacy `user_teams` database table — empty, deprecated, and scheduled for removal
- **AuthContext**: The React context (`src/contexts/AuthContext.tsx`) responsible for loading user profile and team data on authentication

## Requirements

### Requirement 1: Deprecate user_teams and Fix AuthContext

**User Story:** As a developer, I want AuthContext to load team data from `team_members` instead of the empty `user_teams` table, so that authenticated users see their actual team assignments.

#### Acceptance Criteria

1. WHEN a user authenticates, THE AuthContext SHALL load team assignments by querying Team_Members_Table joined with the `teams` table, filtered by the authenticated user's ID
2. THE AuthContext SHALL stop querying User_Teams_Table for any purpose
3. WHEN team assignments are loaded from Team_Members_Table, THE AuthContext SHALL include the Team_Role for each team membership in the user profile
4. THE App SHALL treat Team_Members_Table as the single source of truth for all team membership queries across all features
5. IF a query references User_Teams_Table, THEN THE App SHALL return an error during development to prevent accidental usage

### Requirement 2: Independent App-Level and Team-Level Role Systems

**User Story:** As an admin, I want app-level roles and team-level roles to operate independently, so that a user can hold different roles on different teams while maintaining a single app permission level.

#### Acceptance Criteria

1. THE App SHALL maintain App_Role in the `users.role` column with allowed values: admin, coach, manager, player, caregiver
2. THE App SHALL maintain Team_Role in the `team_members.role` column with allowed values: coach, manager, player
3. WHEN a user is added to a team, THE Admin_Site SHALL allow the admin to specify the Team_Role for that membership independently of the user's App_Role
4. THE App SHALL allow a single user to hold different Team_Roles on different teams simultaneously (e.g., coach on Team X, manager on Team Y, player on Team Z)
5. WHEN displaying team rosters, THE App SHALL show each member's Team_Role for that specific team
6. THE App SHALL use App_Role to determine navigation visibility (full version for admin, coach, manager; lite version for player, caregiver)
7. THE App SHALL use Team_Role to determine team-level permissions such as managing team members, creating events, and sending messages within a specific team context

### Requirement 3: Multi-Role Team Assignment on Desktop

**User Story:** As an admin, I want to assign users to multiple teams with specific roles from the desktop Users page, so that I can manage complex role assignments like a person who coaches one team and manages another.

#### Acceptance Criteria

1. THE Admin_Site Users page SHALL display all current team assignments for each user, showing team name and Team_Role
2. THE Admin_Site Users page SHALL provide an interface to add a new team assignment for a user by selecting a team and a Team_Role
3. THE Admin_Site Users page SHALL allow the admin to change the Team_Role of an existing team assignment
4. THE Admin_Site Users page SHALL allow the admin to remove a team assignment from a user
5. WHEN a user is added to a team via the Admin_Site, THE Admin_Site SHALL create a record in Team_Members_Table with the specified Team_Role
6. THE Admin_Site SHALL prevent duplicate team assignments (same user and same team)
7. WHEN a coach or manager adds a player to their team roster, THE App SHALL set the Team_Role to 'player' as the default

### Requirement 4: Competitions Management

**User Story:** As an admin, I want to create and manage competitions, so that teams can be linked to tournaments, leagues, and social competitions with appropriate user access rules.

#### Acceptance Criteria

1. THE Admin_Site SHALL provide a competitions management page for creating, editing, and deleting competitions
2. WHEN creating a competition, THE Admin_Site SHALL require a competition name and a competition type flag (WCR or Other)
3. THE Admin_Site SHALL store competitions in a `competitions` table with columns: id, name, competition_type (check: 'wcr', 'other'), status (check: 'active', 'closed'), start_date (date, not null), end_date (date, not null), created_at, updated_at
4. WHEN creating a competition, THE Admin_Site SHALL require start_date and end_date representing the window before the first game through after the last game
5. THE Admin_Site SHALL allow the admin to link one or more teams to a competition
6. THE Admin_Site SHALL store team-competition links in a `competition_teams` table with columns: id, competition_id, team_id, created_at
7. WHEN a competition is flagged as Other, THE Admin_Site SHALL indicate that lite user processes apply for that competition's teams
8. THE Admin_Site SHALL allow the admin to view all teams linked to a specific competition
9. THE Admin_Site SHALL allow the admin to view all competitions linked to a specific team
10. WHEN the current date is outside the competition's start_date to end_date range, THE App SHALL treat the competition as closed
11. THE Admin_Site SHALL display a "Close Now" action next to the end_date, allowing the admin to force-close a competition by setting end_date to today's date and status to 'closed'
12. WHEN a competition is closed (either by date or manually), THE App SHALL trigger the lite user cleanup process defined in Requirement 6

### Requirement 5: Lite User Type Tracking

**User Story:** As an admin, I want to distinguish between full and lite users in the system, so that I can track temporary access and enforce appropriate permissions.

#### Acceptance Criteria

1. THE App SHALL store a `user_type` field on the `users` table with allowed values: 'full' and 'lite'
2. WHEN an admin creates a user through the standard Admin_Site user creation flow, THE Admin_Site SHALL set user_type to 'full'
3. WHEN a user is created through a lite invite process, THE App SHALL set user_type to 'lite'
4. THE Admin_Site SHALL display the user_type for each user in the Users page
5. THE Admin_Site SHALL allow the admin to filter users by user_type
6. THE Admin_Site SHALL allow the admin to promote a Lite_User to Full_User by changing user_type to 'full'


### Requirement 6: Lite User Scenario 1 — Non-WCR Competition Teams

**User Story:** As a team manager of a non-WCR competition team, I want to invite all team members via a unique code, so that temporary players and staff can access the app for the duration of the competition without requiring full club membership.

#### Acceptance Criteria

1. WHEN a competition is flagged as Other, THE Admin_Site SHALL allow the admin to create a unique team for that competition with a designated Team Manager
2. WHEN a non-WCR competition team is created, THE App SHALL generate a unique Invite_Code for that team
3. THE App SHALL send an email to each invited member containing the Invite_Code and a link to the Lite_Landing_Page
4. WHEN a recipient opens the Lite_Landing_Page with a valid Invite_Code, THE Lite_Landing_Page SHALL present a registration form requiring first name, last name, email, and password
5. WHEN a recipient completes registration via the Lite_Landing_Page, THE App SHALL create a user record with user_type set to 'lite' and App_Role set to 'player'
6. WHEN a lite user is created for a non-WCR competition team, THE App SHALL add the user to Team_Members_Table with Team_Role set to 'player'
7. WHEN a non-WCR competition closes, THE Admin_Site SHALL allow the admin to remove all Lite_Users associated with that competition's teams
8. WHEN Lite_Users are removed for a closed competition, THE App SHALL only remove users whose user_type is still 'lite' — Full_Users who were promoted during the competition SHALL be retained
9. WHEN removing Lite_Users for a closed competition, THE App SHALL deactivate those lite user accounts and remove their Team_Members_Table entries
9. IF an Invite_Code has already been used by a registered email, THEN THE Lite_Landing_Page SHALL display an error indicating the code has been redeemed
10. IF an Invite_Code has expired, THEN THE Lite_Landing_Page SHALL display a message: "This code has expired. Your coach/manager has been notified." and THE App SHALL send a notification to the user who initiated the invite informing them the code was used after expiry, so they can restart the process
11. THE App SHALL set Invite_Code expiry to 21 days (three weeks) from creation by default
12. IF the invited email already exists as a Full_User in the system, THEN THE App SHALL skip account creation and instead add the existing user to the competition team in Team_Members_Table with the appropriate Team_Role

### Requirement 7: Lite User Scenario 2 — Mid-Season Player Addition for WCR Teams

**User Story:** As a coach or manager of a WCR team, I want to add a new player mid-season as a "player lite", so that the player can participate immediately while the admin follows up on full membership.

#### Acceptance Criteria

1. THE App SHALL allow a user with Team_Role of coach or manager to add a new player to their WCR team roster
2. WHEN a coach or manager adds a new mid-season player, THE App SHALL require the player's first name, last name, and email address
3. WHEN a mid-season player is added, THE App SHALL create a user record with user_type set to 'lite' and App_Role set to 'player'
4. WHEN a mid-season player is added, THE App SHALL add the user to Team_Members_Table with Team_Role set to 'player'
5. WHEN a mid-season player is added, THE App SHALL send an email invitation to the player with an Invite_Code and link to the Lite_Landing_Page
6. IF the invited email already exists as a user in the system, THEN THE App SHALL skip account creation and instead add the existing user to the team in Team_Members_Table with Team_Role set to 'player'
7. THE Admin_Site SHALL provide a report listing all Lite_Users on WCR teams, showing user name, team name, date added, and days since creation
8. THE Admin_Site SHALL allow the admin to promote a mid-season Lite_User to Full_User after membership is confirmed
9. WHEN a Lite_User is promoted to Full_User, THE App SHALL retain all existing team memberships and transition the user_type from 'lite' to 'full'

### Requirement 8: Lite User Scenario 3 — Caregiver Addition with Approval

**User Story:** As a coach or manager, I want to add a new caregiver to a player, so that additional family members can access the player's team information after the existing caregiver approves.

#### Acceptance Criteria

1. THE App SHALL allow a user with Team_Role of coach or manager to initiate adding a new caregiver to a player on their team
2. WHEN a coach or manager initiates a caregiver addition, THE App SHALL require the new caregiver's first name, last name, and email address
3. WHEN a caregiver addition is initiated, THE App SHALL send a Caregiver_Approval request to all existing caregivers linked to that player
4. THE Caregiver_Approval request SHALL include the new caregiver's name and a prompt to approve or deny the addition
5. WHEN any existing caregiver approves the request, THE App SHALL create a user record for the new caregiver with user_type set to 'lite' and App_Role set to 'caregiver'
6. WHEN the new caregiver account is created, THE App SHALL send an email invitation with an Invite_Code and link to the Lite_Landing_Page
7. WHEN the new caregiver completes registration via the Lite_Landing_Page, THE App SHALL link the new caregiver to the player in the player-caregiver relationship table
8. IF all existing caregivers deny the Caregiver_Approval request, THEN THE App SHALL notify the requesting coach or manager that the addition was denied
9. IF no existing caregiver responds to the Caregiver_Approval request within 7 days, THEN THE App SHALL escalate the request to an admin for manual approval
10. WHEN a player has no existing caregivers, THE App SHALL skip the approval process and proceed directly to creating the caregiver account and sending the invitation

### Requirement 9: Team Role Default Fix on Team Member Addition

**User Story:** As a coach or manager, I want the system to assign appropriate team roles when adding members to teams, so that coaches and managers are not incorrectly defaulted to the 'player' role.

#### Acceptance Criteria

1. WHEN a user is added to a team and no Team_Role is explicitly specified, THE App SHALL default the Team_Role to 'player'
2. WHEN an admin assigns a user to a team via the Admin_Site, THE Admin_Site SHALL require explicit Team_Role selection (coach, manager, or player)
3. WHEN a coach or manager adds a member to their team roster, THE App SHALL allow specifying the Team_Role if the adding user has Team_Role of coach or manager on that team
4. THE App SHALL validate that the Team_Role value is one of: coach, manager, player before inserting into Team_Members_Table

### Requirement 10: Caregiver-Player Relationship Management

**User Story:** As an admin, I want to manage caregiver-player relationships, so that caregivers can access information for the players they are responsible for.

#### Acceptance Criteria

1. THE Admin_Site SHALL display all caregiver-player relationships for a selected player
2. THE Admin_Site SHALL display all player-caregiver relationships for a selected caregiver
3. THE Admin_Site SHALL allow the admin to create a new caregiver-player link by selecting a caregiver and a player
4. THE Admin_Site SHALL allow the admin to remove a caregiver-player link
5. WHEN a caregiver is linked to a player, THE App SHALL grant the caregiver read access to the player's team schedule, messages, and events
6. THE App SHALL store caregiver-player relationships in a `player_caregivers` table with columns: id, player_id, caregiver_id, created_at

### Requirement 11: Navigation and Permission Consistency

**User Story:** As a user, I want the app navigation to reflect my actual permissions, so that I see the correct features for my role.

#### Acceptance Criteria

1. WHEN a user has App_Role of admin, coach, or manager, THE App SHALL display full navigation with all six areas: Home, Coaching, Games, Resources, Schedule, and Messages
2. WHEN a user has App_Role of player or caregiver, THE App SHALL display lite navigation with three areas: Home, Schedule, and Messages
3. WHEN determining team-level permissions, THE App SHALL check the user's Team_Role for the currently selected team context, not the user's App_Role
4. WHEN a user switches team context, THE App SHALL re-evaluate team-level permissions based on the user's Team_Role for the newly selected team
5. IF a user has App_Role of coach but Team_Role of player on a specific team, THEN THE App SHALL restrict team-level actions on that team to player-level permissions while maintaining full app navigation

### Requirement 12: Database Migration for Role System Changes

**User Story:** As a developer, I want the database schema updated to support the new role system, so that all role and membership data is stored correctly.

#### Acceptance Criteria

1. THE App SHALL add 'manager' to the `team_members.role` check constraint, resulting in allowed values: 'player', 'coach', 'manager'
2. THE App SHALL add a `user_type` column to the `users` table with a check constraint allowing 'full' and 'lite', defaulting to 'full'
3. THE App SHALL create a `competitions` table with columns: id (uuid, primary key), name (text, not null), competition_type (text, check: 'wcr', 'other'), status (text, check: 'active', 'closed', default: 'active'), start_date (date, not null), end_date (date, not null), created_at (timestamptz), updated_at (timestamptz)
4. THE App SHALL create a `competition_teams` table with columns: id (uuid, primary key), competition_id (uuid, foreign key to competitions), team_id (uuid, foreign key to teams), created_at (timestamptz), with a unique constraint on (competition_id, team_id)
5. THE App SHALL create an `invite_codes` table with columns: id (uuid, primary key), code (text, unique, not null), team_id (uuid, foreign key to teams), competition_id (uuid, nullable, foreign key to competitions), created_by (uuid, foreign key to users), redeemed_by (uuid, nullable, foreign key to users), redeemed_at (timestamptz, nullable), expires_at (timestamptz), created_at (timestamptz)
6. THE App SHALL create a `caregiver_approvals` table with columns: id (uuid, primary key), player_id (uuid, foreign key to users), new_caregiver_email (text, not null), new_caregiver_first_name (text, not null), new_caregiver_last_name (text, not null), requested_by (uuid, foreign key to users), status (text, check: 'pending', 'approved', 'denied', 'escalated'), responded_by (uuid, nullable, foreign key to users), responded_at (timestamptz, nullable), created_at (timestamptz)
7. THE App SHALL enable Row Level Security on all new tables
8. THE App SHALL create a `player_caregivers` table with columns: id (uuid, primary key), player_id (uuid, foreign key to users), caregiver_id (uuid, foreign key to users), created_at (timestamptz), with a unique constraint on (player_id, caregiver_id)
9. THE App SHALL create the migration as file `036_user_role_management.sql` following the sequential numbering convention

### Requirement 13: Invite Delivery Mechanism

**User Story:** As a coach or manager, I want invite codes delivered to new users reliably, so that invitations reach people quickly and don't get lost in spam folders.

#### Acceptance Criteria

**MVP (Prototype — Web App):**

1. WHEN an invite is generated (for any lite user scenario), THE App SHALL collect the recipient's mobile phone number and email address in addition to first name and last name
2. FOR MVP, THE App SHALL deliver invite codes via the existing in-app messaging system to the coach/manager who initiated the invite, with the code and a shareable link they can forward manually (e.g., via WhatsApp, SMS, or email)
3. THE Admin_Site SHALL display all pending invite codes with recipient details, code, expiry date, and redemption status
4. THE App SHALL store the recipient's mobile number and email in the `invite_codes` table for future automated delivery

**Production (iOS/Android Native App):**

5. THE App SHALL use SMS as the primary invite delivery channel, sending the invite code and a deep link to the recipient's mobile number via an SMS gateway (e.g., Twilio or AWS SNS)
6. THE App SHALL use email as the secondary/backup delivery channel, sending the same invite code and link with additional context (welcome info, privacy notice, club details) via a transactional email service (e.g., Supabase Auth email, Resend, or Postmark)
7. WHEN an invite is generated, THE App SHALL send both an SMS and an email to maximise delivery reliability
8. THE SMS message SHALL contain the invite code, a deep link that opens the app directly if installed or redirects to the app store if not, and a brief description of the invitation
9. THE email message SHALL contain the invite code, the same deep link, the inviting coach/manager's name, the team name, and a summary of what the recipient is being invited to
10. IF SMS delivery fails (invalid number, carrier rejection), THE App SHALL log the failure and notify the initiating coach/manager via in-app messaging so they can verify the number and retry
11. THE App SHALL support deep links on iOS (Universal Links) and Android (App Links) so that tapping the invite link in SMS or email opens the Lite_Landing_Page directly within the native app

**Cost and Infrastructure Notes (non-functional):**

12. SMS costs for NZ/AU numbers are approximately $0.08 per message via Twilio — estimated $20-30 per season for a 200-user club
13. Transactional email services (Resend, Postmark) offer free tiers sufficient for the club's volume (3,000+ emails/month)
14. *FUTURE: WHEN the native app is deployed, THE App SHALL add push notifications (via Firebase Cloud Messaging) as a third delivery channel for invite reminders to users who already have the app installed

### Requirement 14: Privacy Consent and Visibility Messaging

**User Story:** As a user, I want to understand what information I'm sharing and who can see my data when I use the app, so that I can make informed decisions about my participation.

#### Acceptance Criteria

1. WHEN a new user registers via the Lite_Landing_Page, THE Lite_Landing_Page SHALL display a clear privacy notice explaining what data is collected and who can see it
2. THE privacy notice SHALL inform caregivers that other caregivers linked to the same player will be able to see their name and contact details
3. THE privacy notice SHALL inform all users that coaches, managers, and admins of their team(s) can see their name and role
4. THE Lite_Landing_Page SHALL require the user to acknowledge the privacy notice (checkbox or explicit consent action) before completing registration
5. THE App SHALL store the consent acknowledgement timestamp in the user record
6. WHEN a caregiver is linked to a player who already has other caregivers, THE App SHALL display the names of existing caregivers to the new caregiver after registration
