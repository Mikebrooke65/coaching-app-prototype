# Requirements Document

## Introduction

The West Coast Rangers Football Club Junior Coaching App is a mobile and web-based system designed to support approximately 200 junior coaches and managers in delivering effective training sessions, while also providing players and their caregivers with access to team information and communication. Coaches and managers access the system via a mobile app on iOS and Android devices. Admins have access to both the mobile app and a desktop web application that provides additional content management, reporting, and administrative capabilities. Players and caregivers use a lighter version of the mobile app focused on team coordination and communication.

## Glossary

- **Mobile_App**: The .NET MAUI application deployed to iOS and Android devices used by coaches, managers, admins, players, and caregivers
- **Admin_Site**: The Azure Static Web App providing web-based administration and content management for admins (desktop access only)
- **Coach**: A junior coach who delivers training sessions to teams (mobile app access only, may be assigned to multiple teams)
- **Manager**: A team manager who may access lesson plans and team information (mobile app access only, may be assigned to multiple teams)
- **Admin**: An administrator who creates lesson content, manages users, and oversees the system (mobile app and desktop web app access, may also serve as a coach)
- **Player**: A youth football player who is a member of one or more teams (mobile app access only)
- **Caregiver**: A parent, guardian, or other caregiver responsible for one or more players (mobile app access only)
- **Landing_Page**: The home screen displaying welcome text and team-specific announcements
- **Lessons_Area**: The section where coaches browse, select, and manage lesson deliveries
- **Games_Area**: The section where coaches provide game feedback and performance reflections
- **Resources_Area**: The section containing general coaching information such as pitch sizes and how-to articles
- **Session_Plan**: A 20-minute training activity stored in a searchable repository with structured content and media
- **Lesson**: A complete structured training program composed of four Session_Plans: Technical Drill, Skill Introduction, Skill Development, and Game
- **Session_Repository**: A searchable collection of reusable Session_Plans that Admins use to build lessons
- **Session_Feedback**: A coach's rating (0-5) and optional comments on a specific session plan after delivery
- **Lesson_Feedback**: A coach's rating (0-5) and optional comments on a complete lesson after delivery
- **Delivery_Record**: A timestamped record capturing when a coach delivered a specific lesson to a team
- **Team_Announcement**: Time-limited team-specific text displayed on the Landing_Page that auto-expires after seven days
- **Resource_Article**: General coaching information content created by admines
- **Game_Feedback**: Structured coach reflections following a match using the 4 Moments of Football framework
- **4_Moments_of_Football**: A coaching analysis framework covering Attacking, Attacking to Defending Transition, Defending, and Defending to Attacking Transition
- **WWW**: "What Went Well" - positive observations from game performance
- **EBI**: "Even Better If" - areas for improvement identified during game analysis
- **Team**: A youth football squad identified by age group and team name
- **Skill**: A football skill category used to organize lessons and session plans. Initial skill categories include: Passing and First Touch, Dribbling and Ball Control, Shooting, Defending, Attacking, and Transitions
- **Azure_Table_Storage**: The cloud database storing all structured application data
- **Azure_Blob_Storage**: The cloud storage service for media assets (images and videos)
- **Lesson_Version**: An integer tracking the revision number of a lesson's content
- **Game_Feedback**: Coach-submitted reflections and analysis following a match

## Requirements

### Requirement 1: User Authentication

**User Story:** As a coach, I want to securely log into the mobile app, so that I can access lesson plans and record my coaching activities.

#### Acceptance Criteria

1. WHEN a user enters valid email and password credentials, THE Mobile_App SHALL authenticate the user against Azure_Table_Storage
2. WHEN authentication succeeds, THE Mobile_App SHALL cache the credentials securely on the device
3. WHEN a user has cached credentials, THE Mobile_App SHALL authenticate automatically without requiring re-entry
4. THE Mobile_App SHALL support authentication for up to 200 users
5. WHEN authentication fails, THE Mobile_App SHALL display an error message and prevent access

### Requirement 1a: Landing Page and App Navigation

**User Story:** As a coach, I want to see a clear landing page with relevant information and easy navigation to the main app areas, so that I can quickly access the features I need.

#### Acceptance Criteria

1. WHEN a coach logs in, THE Mobile_App SHALL display the Landing_Page
2. THE Landing_Page SHALL display default welcome text editable by Admin
3. THE Landing_Page SHALL display team-specific announcements for the coach's selected team
4. THE Mobile_App SHALL provide navigation to four main areas: Landing_Page, Lessons_Area, Games_Area, and Resources_Area
5. THE Mobile_App SHALL allow coaches to navigate between areas using a persistent navigation menu

### Requirement 1b: Team Announcements Management

**User Story:** As an admin, I want to create general and targeted announcements that automatically expire, so that coaches see current and relevant information without manual cleanup.

#### Acceptance Criteria

1. THE Landing_Page SHALL display two announcement sections: General Announcement and Team-Specific Announcement
2. THE Admin_Site SHALL allow Admin to create a general announcement with content that displays to all users
3. WHEN a general announcement is created, THE Mobile_App SHALL display it in the first paragraph of the announcements section for all coaches
4. THE Admin_Site SHALL allow Admin to create team-specific announcements with content
5. WHEN creating a team-specific announcement, THE Admin_Site SHALL allow Admin to target specific teams by selecting team IDs
6. WHEN creating a team-specific announcement, THE Admin_Site SHALL allow Admin to target age groups (e.g., all U9 teams, all U10 teams)
7. THE Mobile_App SHALL display team-specific announcements in the second paragraph of the announcements section for coaches whose selected team matches the announcement target
8. WHEN an announcement is created, THE Admin_Site SHALL store the creation timestamp in Azure_Table_Storage
9. WHEN an announcement is seven days old, THE Mobile_App SHALL automatically remove it from display
10. WHEN an Admin creates a new general announcement, THE Mobile_App SHALL replace the previous general announcement regardless of age
11. WHEN an Admin creates a new team-specific announcement for the same target, THE Mobile_App SHALL replace the previous announcement for that target regardless of age
12. THE Admin_Site SHALL allow Admin to manually delete announcements before expiry

### Requirement 2: User Account Management

**User Story:** As an admin, I want to create and manage user accounts, so that I can control who has access to the system.

#### Acceptance Criteria

1. THE Admin_Site SHALL allow Admin to create user accounts with first name, last name, email, password, cellphone, and role
2. THE Admin_Site SHALL support five role types: Coach, Manager, Admin, Player, and Caregiver
3. WHEN an Admin creates a user account, THE Admin_Site SHALL store the account in Azure_Table_Storage with a hashed password
4. THE Admin_Site SHALL allow Admin to reset user passwords
5. THE Admin_Site SHALL allow Admin to edit user details including team associations
6. THE Admin_Site SHALL allow Admin to remove user accounts
7. THE Admin_Site SHALL allow an Admin account to also be assigned the Coach role
8. THE Admin_Site SHALL allow a Caregiver account to also be assigned the Manager role
9. THE Admin_Site SHALL allow a Caregiver account to also be assigned the Coach role

### Requirement 2a: Player and Caregiver Management

**User Story:** As an admin, I want to manage players and their caregivers, so that families can access team information and communication.

#### Acceptance Criteria

1. THE Admin_Site SHALL allow Admin to create player accounts with first name, last name, date of birth, and contact information
2. THE Admin_Site SHALL allow Admin to associate a player with one or more teams
3. THE Admin_Site SHALL allow Admin to create caregiver accounts with first name, last name, email, password, and cellphone
4. THE Admin_Site SHALL allow Admin to link one or more caregivers to a player
5. THE Admin_Site SHALL allow Admin to link one or more players to a caregiver
6. THE Admin_Site SHALL store player-caregiver relationships in Azure_Table_Storage
7. THE Admin_Site SHALL allow Admin to view all caregivers associated with a player
8. THE Admin_Site SHALL allow Admin to view all players associated with a caregiver
9. THE Admin_Site SHALL allow Admin to remove player-caregiver associations
10. WHEN a player is associated with a team, THE Mobile_App SHALL make team information accessible to the player and their linked caregivers

### Requirement 3: Team Management

**User Story:** As a admin, I want to manage team information, so that coaches can associate their lesson deliveries with the correct teams.

#### Acceptance Criteria

1. THE Admin_Site SHALL allow Admin to create teams with age group, team name, training ground, and training time
2. THE Admin_Site SHALL store team information in Azure_Table_Storage
3. THE Admin_Site SHALL allow Admin to edit team details
4. THE Admin_Site SHALL allow Admin to delete teams
5. WHEN a team is created or updated, THE Admin_Site SHALL make the changes available to Mobile_App after synchronization

### Requirement 4: Coach-Team Association

**User Story:** As a admin, I want to associate coaches with teams, so that the app can pre-populate team selections for coaches.

#### Acceptance Criteria

1. THE Admin_Site SHALL allow Admin to assign a default team to a coach
2. THE Admin_Site SHALL allow Admin to assign multiple accessible teams to a coach
3. WHEN a coach has no default team assigned, THE Mobile_App SHALL display all accessible teams without pre-selection
4. WHEN a coach selects a team for lesson delivery, THE Mobile_App SHALL record the selected team regardless of default assignment
5. THE Mobile_App SHALL allow coaches to select any of their accessible teams for each lesson delivery

### Requirement 5: Session Plan Repository Management

**User Story:** As an admin, I want to create and manage reusable session plans in a searchable repository, so that I can build lessons by selecting appropriate 20-minute training activities.

#### Acceptance Criteria

1. THE Admin_Site SHALL provide a session plan builder interface for creating session plans
2. WHEN an Admin creates a session plan, THE Admin_Site SHALL require an associated skill category
3. WHEN an Admin creates a session plan, THE Admin_Site SHALL require one or more tags for categorization and searchability
4. THE Admin_Site SHALL support the following tag categories: Technical Level, Fun Level, Age Group, and Session Type (including "Game" for game-based sessions)
5. WHEN an Admin creates a session plan, THE Admin_Site SHALL require a session title
6. WHEN an Admin creates a session plan, THE Admin_Site SHALL require a session description
7. WHEN an Admin creates a session plan, THE Admin_Site SHALL require a setup explanation describing how to set up the session
8. THE Admin_Site SHALL allow Admin to upload a setup drawing showing the session layout
9. THE Admin_Site SHALL allow Admin to optionally associate one video demonstrating how the exercise works
10. THE Admin_Site SHALL allow Admin to enter up to five key learning objectives for the session
11. THE Admin_Site SHALL store session plan content in Azure_Table_Storage and media files in Azure_Blob_Storage
12. THE Admin_Site SHALL provide a searchable session plan repository interface
13. THE Admin_Site SHALL allow Admin to search session plans by skill category, tags, title, or learning objectives
14. THE Admin_Site SHALL allow Admin to edit existing session plans including updating tags
15. THE Admin_Site SHALL allow Admin to delete session plans from the repository
16. WHEN a session plan is saved, THE Admin_Site SHALL make it immediately available in the session repository

### Requirement 5a: Lesson Composition from Session Plans

**User Story:** As an admin, I want to create lessons at an appropriate technical level by selecting appropriate session plans from the repository, so that coaches have complete structured training programs tailored to their team's needs.

#### Acceptance Criteria

1. THE Admin_Site SHALL provide a lesson builder interface for composing lessons
2. WHEN an Admin creates a lesson, THE Admin_Site SHALL require a skill category and lesson name
3. THE Admin_Site SHALL require Admin to select session plans for four specific slots:
   - Slot 1: Technical Drill session
   - Slot 2: Skill Introduction session
   - Slot 3: Skill Development session
   - Slot 4: Game session
4. THE Admin_Site SHALL allow Admin to filter session plans by skill category and tags when selecting for each slot
5. THE Admin_Site SHALL only display sessions tagged as "Game" when selecting for Slot 4
6. THE Admin_Site SHALL display each selected session plan in its designated slot within the lesson structure
7. WHEN an Admin creates a lesson, THE Admin_Site SHALL allow Admin to add tags to the lesson
8. THE Admin_Site SHALL support the same tag categories for lessons as for session plans
9. WHEN a lesson is created, THE Admin_Site SHALL assign version number 1
10. THE Admin_Site SHALL store the lesson composition in Azure_Table_Storage with references to the four selected session plans and lesson tags
11. WHEN a lesson is saved, THE Admin_Site SHALL make it immediately available to Mobile_App after synchronization

### Requirement 6: Lesson Content Editing and Versioning

**User Story:** As a admin, I want to update existing lessons and track changes, so that coaches always have current content with change history.

#### Acceptance Criteria

1. THE Admin_Site SHALL allow Admin to edit existing lesson content
2. WHEN a Admin saves changes to a lesson, THE Admin_Site SHALL increment the lesson version number by 1
3. WHEN the lesson version increments, THE Admin_Site SHALL prompt Admin to enter a changelog note
4. THE Admin_Site SHALL store the changelog note with timestamp in Azure_Table_Storage
5. THE Admin_Site SHALL display version history with changelog notes for each lesson
6. THE Admin_Site SHALL allow Admin to delete lessons

### Requirement 7: Lesson Browsing by Skill

**User Story:** As a coach, I want to browse lessons organized by skill category, so that I can find appropriate training content for my session.

#### Acceptance Criteria

1. WHEN a coach selects a skill category, THE Mobile_App SHALL display all lessons associated with that skill
2. THE Mobile_App SHALL load skill categories from Azure_Table_Storage
3. THE Mobile_App SHALL cache skill categories and lessons locally for offline access
4. WHEN the Mobile_App synchronizes with Azure_Table_Storage, THE Mobile_App SHALL update the local cache with new or modified lessons
5. THE Mobile_App SHALL display lessons with their names and skill categories

### Requirement 8: Lesson Content Display

**User Story:** As a coach, I want to view detailed lesson content with media, so that I can understand and deliver the training session effectively.

#### Acceptance Criteria

1. WHEN a coach selects a lesson, THE Mobile_App SHALL display the lesson's markdown content rendered as HTML
2. WHERE a lesson includes images, THE Mobile_App SHALL display image thumbnails with the ability to view full-screen
3. WHERE a lesson includes videos, THE Mobile_App SHALL provide video playback controls
4. WHEN the Mobile_App is offline, THE Mobile_App SHALL display cached lesson text content
5. WHEN the Mobile_App is offline and media is requested, THE Mobile_App SHALL display a placeholder message indicating media requires internet connectivity

### Requirement 9: Lesson Delivery Recording

**User Story:** As a coach, I want to record when I deliver a lesson to a team, so that I can track my coaching activities and the team's training history.

#### Acceptance Criteria

1. WHILE viewing a lesson, THE Mobile_App SHALL display an option to record lesson delivery
2. WHEN a coach chooses to record delivery, THE Mobile_App SHALL prompt for delivery date with today's date as default
3. WHEN a coach confirms delivery recording, THE Mobile_App SHALL create a Delivery_Record in Azure_Table_Storage with coach ID, coach name, team ID, team name, lesson ID, lesson version, and delivery date
4. WHEN a Delivery_Record is created, THE Mobile_App SHALL capture coach name and team name as text snapshots
5. WHEN a Delivery_Record is created, THE Mobile_App SHALL prompt the coach to optionally enter delivery notes
6. WHERE a coach enters delivery notes, THE Mobile_App SHALL store the notes in the Delivery_Record with the delivery timestamp

### Requirement 10: Delivery Record Management

**User Story:** As a coach, I want to view and edit my lesson delivery records, so that I can maintain accurate coaching history.

#### Acceptance Criteria

1. THE Mobile_App SHALL display a list of delivery records filtered by the authenticated coach
2. THE Mobile_App SHALL display a list of delivery records filtered by selected team
3. WHEN displaying delivery records, THE Mobile_App SHALL show skill, lesson name, coach name, team name, date delivered, lesson version, and notes
4. THE Mobile_App SHALL allow a coach to edit delivery records they created
5. THE Mobile_App SHALL allow a coach to delete delivery records they created
6. WHEN a coach views team delivery records, THE Mobile_App SHALL only display records for the selected team
7. THE Mobile_App SHALL prevent coaches from editing or deleting delivery records created by other coaches

### Requirement 10a: Session Feedback Capture

**User Story:** As a coach, I want to provide feedback on individual session plans after delivery, so that admines can improve training content based on my experience.

#### Acceptance Criteria

1. WHEN a coach delivers a lesson, THE Mobile_App SHALL allow the coach to optionally rate each of the three session plans
2. WHEN rating a session plan, THE Mobile_App SHALL require a rating from 0 to 5
3. WHEN rating a session plan, THE Mobile_App SHALL allow the coach to optionally enter brief comments
4. WHEN a coach submits session feedback, THE Mobile_App SHALL create a Session_Feedback record in Azure_Table_Storage with feedback ID, coach ID, coach name, session plan ID, lesson ID, team ID, delivery date, rating, comments, and timestamp
5. THE Mobile_App SHALL allow a coach to edit Session_Feedback records they created
6. THE Mobile_App SHALL prevent coaches from editing or deleting Session_Feedback records created by other coaches

### Requirement 10b: Lesson Feedback Capture

**User Story:** As a coach, I want to provide feedback on complete lessons after delivery, so that admines can understand how well the overall training program worked.

#### Acceptance Criteria

1. WHEN a coach delivers a lesson, THE Mobile_App SHALL allow the coach to optionally rate the complete lesson
2. WHEN rating a lesson, THE Mobile_App SHALL require a rating from 0 to 5
3. WHEN rating a lesson, THE Mobile_App SHALL allow the coach to optionally enter brief comments
4. WHEN a coach submits lesson feedback, THE Mobile_App SHALL create a Lesson_Feedback record in Azure_Table_Storage with feedback ID, coach ID, coach name, lesson ID, team ID, delivery date, rating, comments, and timestamp
5. THE Mobile_App SHALL allow a coach to edit Lesson_Feedback records they created
6. THE Mobile_App SHALL prevent coaches from editing or deleting Lesson_Feedback records created by other coaches

### Requirement 10c: Session and Lesson Feedback Reporting

**User Story:** As a admin, I want to view feedback on sessions and lessons, so that I can identify which content needs improvement and make data-driven modifications.

#### Acceptance Criteria

1. THE Admin_Site SHALL display session feedback aggregated by session plan
2. WHEN displaying session feedback, THE Admin_Site SHALL show session plan title, skill category, average rating, number of ratings, and all coach comments
3. THE Admin_Site SHALL allow Admin to filter session feedback by date range, skill category, or rating threshold
4. THE Admin_Site SHALL display lesson feedback aggregated by lesson
5. WHEN displaying lesson feedback, THE Admin_Site SHALL show lesson name, skill category, average rating, number of ratings, and all coach comments
6. THE Admin_Site SHALL allow Admin to filter lesson feedback by date range, skill category, or rating threshold
7. THE Admin_Site SHALL allow Admin to export session and lesson feedback in CSV format
8. THE Admin_Site SHALL retrieve feedback data from Azure_Table_Storage

### Requirement 11: Configurable Text Content

**User Story:** As a admin, I want to create and manage text content displayed in the mobile app, so that I can provide guidance and context to coaches.

#### Acceptance Criteria

1. THE Admin_Site SHALL provide a text block editor for creating display content
2. WHEN creating a text block, THE Admin_Site SHALL require page name and text content
3. THE Admin_Site SHALL support markdown formatting in text content including bold, italic, and bullet lists
4. THE Admin_Site SHALL provide a live preview of how markdown will render
5. THE Admin_Site SHALL allow Admin to create team-specific text blocks by associating a team ID
6. THE Admin_Site SHALL store text blocks in Azure_Table_Storage
7. WHEN the Mobile_App displays a page with configurable text, THE Mobile_App SHALL load and render the appropriate text block from Azure_Table_Storage
8. WHERE a team-specific text block exists, THE Mobile_App SHALL display it instead of the default text block

### Requirement 11a: Resources Area Content Management

**User Story:** As a admin, I want to create and manage general coaching resources, so that coaches have access to reference materials like pitch sizes and how-to articles.

#### Acceptance Criteria

1. THE Admin_Site SHALL provide a resource article editor for creating coaching reference content
2. WHEN creating a resource article, THE Admin_Site SHALL require a title and content
3. THE Admin_Site SHALL allow Admin to categorize resource articles by type
4. THE Admin_Site SHALL support markdown formatting in resource article content
5. THE Admin_Site SHALL allow Admin to associate images with resource articles
6. THE Admin_Site SHALL store resource articles in Azure_Table_Storage and media in Azure_Blob_Storage
7. THE Mobile_App SHALL display resource articles in the Resources_Area
8. THE Mobile_App SHALL allow coaches to browse resource articles by category
9. THE Mobile_App SHALL cache resource articles locally for offline access
10. THE Admin_Site SHALL allow Admin to edit and delete resource articles

### Requirement 12: admin Reporting

**User Story:** As a admin, I want to generate reports on lesson deliveries, so that I can monitor coaching activities across teams.

#### Acceptance Criteria

1. THE Admin_Site SHALL allow Admin to generate reports showing lesson deliveries
2. THE Admin_Site SHALL allow filtering reports by date range, team, coach, and age group
3. THE Admin_Site SHALL support age group filtering for U8, U9, U10, U11, and U12 teams
4. WHEN generating a report, THE Admin_Site SHALL display skill, lesson name, coach name, team name, age group, date delivered, lesson version, and notes
5. THE Admin_Site SHALL allow Admin to export reports in CSV format
6. THE Admin_Site SHALL allow Admin to export reports in PDF format
7. THE Admin_Site SHALL retrieve report data from Azure_Table_Storage

### Requirement 13: Audit Trail

**User Story:** As a admin, I want to view audit information for delivery records, so that I can track who created, modified, or deleted coaching records.

#### Acceptance Criteria

1. WHEN a Delivery_Record is created, THE Mobile_App SHALL store the creating user ID and creation timestamp
2. WHEN a Delivery_Record is edited, THE Mobile_App SHALL store the editing user ID and edit timestamp
3. WHEN a Delivery_Record is deleted, THE Mobile_App SHALL store the deletion user ID and deletion timestamp
4. THE Admin_Site SHALL display audit information including action type, user ID, and timestamp for all delivery records
5. THE Admin_Site SHALL allow Admin to view complete audit history for any delivery record

### Requirement 14: Team Selection Interface

**User Story:** As a coach, I want to select which team I'm coaching for each session, so that I can record deliveries for different teams I support.

#### Acceptance Criteria

1. THE Mobile_App SHALL display a team picker on the skill selection page
2. WHERE a coach has a default team assigned, THE Mobile_App SHALL pre-populate the team picker with that team
3. THE Mobile_App SHALL allow the coach to change the selected team from their accessible teams list
4. WHEN a coach records a lesson delivery, THE Mobile_App SHALL use the currently selected team
5. THE Mobile_App SHALL persist the selected team during the session until changed by the coach

### Requirement 15: Lesson Search and Discovery

**User Story:** As a admin, I want to search and browse all lessons in the system, so that I can manage content effectively.

#### Acceptance Criteria

1. THE Admin_Site SHALL display a searchable list of all lessons
2. THE Admin_Site SHALL allow Admin to search lessons by name, skill, or tags
3. WHEN displaying lesson search results, THE Admin_Site SHALL show lesson name, skill, version number, and last modified date
4. WHEN a Admin selects a lesson from search results, THE Admin_Site SHALL display the full lesson details
5. THE Admin_Site SHALL allow Admin to navigate from search results to edit or delete a lesson

### Requirement 16: Game Feedback Capture

**User Story:** As a coach, I want to record reflections after games, so that I can track team performance and identify areas for improvement.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide an option to add game analysis from the skill selection page
2. WHEN a coach selects game analysis, THE Mobile_App SHALL prompt for a game date with today's date as default
### Requirement 16: Game Feedback Capture

**User Story:** As a coach, I want to record structured reflections after games using the 4 Moments of Football framework, so that I can systematically analyze team performance and identify areas for improvement.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide an option to add game analysis from the skill selection page
2. WHEN a coach selects game analysis, THE Mobile_App SHALL prompt for a game date with today's date as default
3. WHEN a coach enters game analysis, THE Mobile_App SHALL guide the coach through the 4 Moments of Football framework in sequence:
   - Moment 1: Attacking
   - Moment 2: Attacking to Defending Transition
   - Moment 3: Defending
   - Moment 4: Defending to Attacking Transition
4. FOR EACH of the 4 Moments, THE Mobile_App SHALL prompt the coach to enter:
   - WWW (What Went Well) - free text field
   - EBI (Even Better If) - free text field
5. AFTER completing all 4 Moments, THE Mobile_App SHALL prompt the coach to identify 2-3 key areas the team needs to work on
6. THE Mobile_App SHALL allow the coach to select key areas from a predefined list of skills or enter custom text
7. WHEN a coach submits game analysis, THE Mobile_App SHALL create a Game_Feedback record in Azure_Table_Storage with:
   - Feedback ID, coach ID, coach name, team ID, team name, date
   - Attacking WWW and EBI
   - Attacking to Defending Transition WWW and EBI
   - Defending WWW and EBI
   - Defending to Attacking Transition WWW and EBI
   - 2-3 key areas to work on
   - Created by and created at timestamps
8. THE Mobile_App SHALL allow a coach to save game feedback as a draft and complete it later
9. THE Mobile_App SHALL allow a coach to edit Game_Feedback records they created
10. THE Mobile_App SHALL allow a coach to delete Game_Feedback records they created
11. THE Mobile_App SHALL prevent coaches from editing or deleting Game_Feedback records created by other coaches

### Requirement 17: Game Feedback Reporting

**User Story:** As a admin, I want to view game feedback from coaches using the 4 Moments framework, so that I can understand team performance trends and coaching needs across all moments of play.

#### Acceptance Criteria

1. THE Admin_Site SHALL display game feedback records filtered by team, coach, date range, or age group
2. THE Admin_Site SHALL support age group filtering for U8, U9, U10, U11, and U12 teams
3. WHEN displaying game feedback, THE Admin_Site SHALL show:
   - Coach name, team name, age group, game date
   - WWW and EBI for each of the 4 Moments of Football
   - Key areas identified for improvement
4. THE Admin_Site SHALL allow Admin to filter feedback by specific moments (e.g., show only Attacking feedback)
5. THE Admin_Site SHALL allow Admin to filter feedback by key areas identified
6. THE Admin_Site SHALL highlight common themes across multiple game feedback entries
7. THE Admin_Site SHALL allow Admin to export game feedback in CSV format with all 4 Moments data
8. THE Admin_Site SHALL retrieve game feedback from Azure_Table_Storage
9. THE Admin_Site SHALL display game feedback in chronological order with most recent first

### Requirement 17a: Coach Activity Summary Report

**User Story:** As a admin, I want to view coach activity summaries, so that I can monitor coaching engagement and identify coaches who may need support.

#### Acceptance Criteria

1. THE Admin_Site SHALL generate coach activity summary reports
2. THE Admin_Site SHALL allow filtering by date range, age group, or specific coaches
3. WHEN generating a coach activity report, THE Admin_Site SHALL display coach name, number of lessons delivered, number of game feedback entries, and date range
4. THE Admin_Site SHALL calculate and display average lessons per coach
5. THE Admin_Site SHALL allow Admin to export coach activity reports in CSV and PDF formats
6. THE Admin_Site SHALL retrieve activity data from Azure_Table_Storage

### Requirement 17b: Team Training History Report

**User Story:** As a admin, I want to view training history for each team, so that I can ensure balanced skill development and identify training gaps.

#### Acceptance Criteria

1. THE Admin_Site SHALL generate team training history reports
2. THE Admin_Site SHALL allow filtering by team, age group, or date range
3. WHEN generating a team training history report, THE Admin_Site SHALL display team name, age group, lesson name, skill category, date delivered, and coach name
4. THE Admin_Site SHALL group lessons by skill category to show skill coverage
5. THE Admin_Site SHALL highlight skills that have not been trained within a specified time period
6. THE Admin_Site SHALL allow Admin to export team training history reports in CSV and PDF formats
7. THE Admin_Site SHALL retrieve training history from Azure_Table_Storage

### Requirement 17c: Session and Lesson Popularity Report

**User Story:** As a admin, I want to view which sessions and lessons are most and least popular based on feedback ratings, so that I can improve content quality.

#### Acceptance Criteria

1. THE Admin_Site SHALL generate session and lesson popularity reports based on feedback ratings
2. THE Admin_Site SHALL allow filtering by skill category, age group, or date range
3. WHEN generating a popularity report, THE Admin_Site SHALL display session/lesson name, skill category, average rating, number of ratings, and number of deliveries
4. THE Admin_Site SHALL sort sessions and lessons by average rating (highest to lowest or lowest to highest)
5. THE Admin_Site SHALL highlight sessions and lessons with ratings below a configurable threshold (e.g., below 3.0)
6. THE Admin_Site SHALL display coach comments alongside ratings for context
7. THE Admin_Site SHALL allow Admin to export popularity reports in CSV and PDF formats
8. THE Admin_Site SHALL retrieve feedback data from Azure_Table_Storage

### Requirement 17d: Skill Coverage Report

**User Story:** As a admin, I want to view which skills are being trained most and least frequently, so that I can ensure balanced curriculum delivery across teams.

#### Acceptance Criteria

1. THE Admin_Site SHALL generate skill coverage reports showing training frequency by skill category
2. THE Admin_Site SHALL allow filtering by age group, team, or date range
3. WHEN generating a skill coverage report, THE Admin_Site SHALL display skill category, number of lessons delivered, number of teams trained, and percentage of total training time
4. THE Admin_Site SHALL identify skills that have not been trained within a specified time period
5. THE Admin_Site SHALL compare skill coverage across age groups to identify imbalances
6. THE Admin_Site SHALL allow Admin to export skill coverage reports in CSV and PDF formats
7. THE Admin_Site SHALL retrieve lesson delivery data from Azure_Table_Storage

### Requirement 17e: Audit Trail Report

**User Story:** As a admin, I want to view detailed audit trails for delivery records, so that I can track who created, modified, or deleted coaching records and maintain data integrity.

#### Acceptance Criteria

1. THE Admin_Site SHALL generate audit trail reports for delivery records
2. THE Admin_Site SHALL allow filtering by action type (create, edit, delete), user, team, or date range
3. WHEN generating an audit trail report, THE Admin_Site SHALL display action type, user ID, user name, team name, lesson name, timestamp, and before/after values for edits
4. THE Admin_Site SHALL display audit records in chronological order with most recent first
5. THE Admin_Site SHALL allow Admin to export audit trail reports in CSV and PDF formats
6. THE Admin_Site SHALL retrieve audit data from Azure_Table_Storage

### Requirement 18: Privacy and Access Control

**User Story:** As a coach, I want my delivery records and feedback to remain private from other coaches, so that my coaching activities are confidential.

#### Acceptance Criteria

1. WHEN a coach views their delivery history, THE Mobile_App SHALL display only records created by that coach
2. WHEN a coach views team delivery history, THE Mobile_App SHALL display only records for the selected team without revealing which other coaches created them
3. THE Mobile_App SHALL prevent coaches from viewing delivery records for teams they cannot access
4. THE Mobile_App SHALL prevent coaches from viewing game feedback created by other coaches
5. THE Admin_Site SHALL allow Admin to view all delivery records and game feedback across all coaches and teams

### Requirement 19: Data Synchronization

**User Story:** As a coach, I want the app to synchronize with the latest content, so that I always have current lesson plans and can submit my records.

#### Acceptance Criteria

1. WHEN the Mobile_App launches with internet connectivity, THE Mobile_App SHALL synchronize with Azure_Table_Storage
2. WHEN synchronizing, THE Mobile_App SHALL download new or updated lessons, skills, teams, and text blocks
3. WHEN synchronizing, THE Mobile_App SHALL upload pending delivery records and game feedback created offline
4. WHEN synchronization completes, THE Mobile_App SHALL update the local cache with new data
5. WHEN synchronization fails, THE Mobile_App SHALL retry with exponential backoff up to three attempts
6. WHEN the Mobile_App is offline, THE Mobile_App SHALL queue delivery records and game feedback for upload when connectivity returns

### Requirement 20: Offline Functionality

**User Story:** As a coach, I want to access lesson content and record deliveries without internet connectivity, so that I can use the app at training grounds with poor signal.

#### Acceptance Criteria

1. THE Mobile_App SHALL cache all lesson text content locally after synchronization
2. THE Mobile_App SHALL cache all skill categories and lesson metadata locally
3. WHEN offline, THE Mobile_App SHALL allow coaches to browse cached lessons
4. WHEN offline, THE Mobile_App SHALL allow coaches to record lesson deliveries
5. WHEN offline, THE Mobile_App SHALL allow coaches to enter game feedback
6. WHEN offline and a coach requests media content, THE Mobile_App SHALL display a message indicating internet connectivity is required
7. WHEN connectivity returns, THE Mobile_App SHALL automatically upload queued delivery records and game feedback

### Requirement 21: Messaging Infrastructure Preparation

**User Story:** As a admin, I want the system prepared for future messaging capabilities with flexible targeting options, so that I can communicate effectively with coaches and managers across teams and age groups.

#### Acceptance Criteria

1. THE Admin_Site SHALL create a Messages table in Azure_Table_Storage with fields for message ID, sender ID, title, body, timestamp sent, read status, and message type
2. THE Admin_Site SHALL create a MessageRecipients table to support flexible message targeting with fields for message ID, recipient type (Coach/Manager), recipient ID (for individual users), team ID (for team targeting), and age group (for age group targeting)
3. WHEN creating a message, THE Admin_Site SHALL allow Admin to select recipient types: Coaches, Managers, or both
4. WHEN creating a message, THE Admin_Site SHALL allow Admin to target specific individuals by selecting user IDs
5. WHEN creating a message, THE Admin_Site SHALL allow Admin to target specific teams by selecting team IDs
6. WHEN creating a message, THE Admin_Site SHALL allow Admin to target age groups (e.g., all U9 teams, all U10 teams)
7. WHEN creating a message, THE Admin_Site SHALL allow Admin to combine targeting criteria (e.g., all coaches for U9 teams)
8. WHEN a message is targeted to a team, THE Mobile_App SHALL deliver the message to all coaches and managers linked to that team via their AccessibleTeamIDs
9. WHEN a message is targeted to an age group, THE Mobile_App SHALL deliver the message to all coaches and managers linked to teams in that age group
10. WHEN a new message is available for a user, THE Mobile_App SHALL send a push notification to the user's device
11. WHEN a user has unread messages, THE Mobile_App SHALL display a notification badge on the messages tab icon
12. WHEN a user opens the Mobile_App with unread messages, THE Mobile_App SHALL display a visual indicator showing the number of unread messages
13. THE Mobile_App SHALL include a messages tab in the user interface displaying "Feature coming soon"
14. THE Mobile_App SHALL register device tokens for push notifications during user authentication
15. THE Admin_Site SHALL store user device tokens in Azure_Table_Storage
16. THE Mobile_App SHALL include role-based permissions data model supporting future message sending and receiving capabilities


## Future Enhancements

The following features are planned for future versions and should be considered during the initial design to ensure the system architecture can accommodate these capabilities.

### Future Enhancement 1: Player and Roster Management

**Description:** Track individual players within teams to enable attendance tracking, skill progression monitoring, and personalized coaching insights.

**Considerations:**
- Player table with fields for player ID, name, age group, team association, and contact information
- Link players to teams with support for players moving between teams
- Foundation for tracking individual player development over time
- Integration point with Friendly Manager system for player roster synchronization

**Player Development Tracking:**
- Coaches can add private notes on individual players
- Notes stored per player with timestamp and coach ID
- Coaches can highlight current key focus points for each player (e.g., "Work on first touch," "Improve defensive positioning")
- Focus points visible to all coaches assigned to the player's team(s)
- Historical notes and focus points tracked over time to show player progression
- Notes and focus points accessible from player profile view in mobile app

**Player-Specific Communication:**
- Coaches can send messages directly to a player and/or their linked caregivers
- Messages can include development updates, focus areas, and encouragement
- Conversation threads maintained per player for continuity
- Caregivers receive notifications when coaches send player development messages
- Players (age-appropriate) can view messages about their development
- Privacy: Only coaches assigned to the player's team(s) can view notes and send messages
- Message templates for common development topics (e.g., "Great progress on [skill]," "Let's focus on [area]")

### Future Enhancement 2: Session Attendance Tracking

**Description:** Record which players attended each training session to identify attendance patterns and engagement levels.

**Considerations:**
- Attendance records linked to delivery records and player IDs
- Attendance reporting by player, team, and date range
- Attendance trends and alerts for low participation
- Mobile app interface for coaches to mark attendance during or after sessions

### Future Enhancement 3: Parent and Guardian Communication

**Description:** Extend messaging capabilities to include parent/guardian notifications and limited access to team information.

**Considerations:**
- Parent user role with restricted permissions
- Parent accounts linked to specific players
- Notifications for training schedules, cancellations, and team announcements
- Parent view of their child's team schedule and general team information
- Privacy controls ensuring parents only see information relevant to their child's team

### Future Enhancement 4: AI-Powered Coaching Assistant

**Description:** An interactive AI coaching assistant integrated into the lesson selection workflow that helps coaches quickly find appropriate training content by analyzing their verbal description of team issues.

**User Workflow:**

**Typical Coach Journey:**
1. Coach opens Mobile_App on the day before practice
2. Navigates to Lessons_Area
3. Reviews past lessons delivered to their team
4. Chooses one of two paths:
   - **Path A:** Selects the next logical lesson in the progression
   - **Path B:** Taps "AI Coach" button and describes current team challenges

**AI Coach Integration:**

**Voice Input:**
- Coach taps "AI Coach" button in Lessons_Area
- Uses voice dictation to describe team issues (e.g., "My team is struggling with passing under pressure")
- AI processes natural language input to understand the problem

**Quick Analysis:**
- AI reviews team's training history (what lessons have been delivered)
- Considers team's age group for age-appropriate recommendations
- Analyzes recent game feedback if available
- Identifies relevant skill categories and focus areas

**Lesson Recommendation:**
- AI suggests 1-3 specific lessons from the repository that address the described issue
- Each suggestion includes:
  - Lesson name and brief description
  - Why this lesson is relevant to the stated problem
  - What the team will work on in this lesson
- Coach can preview the full lesson before selecting
- Coach selects a lesson and proceeds with normal lesson delivery workflow

**Simple Interaction Model:**
- Single voice input from coach (no back-and-forth dialogue in Version 1)
- Immediate lesson suggestions (no lengthy questioning)
- Optional: Coach can refine by speaking again if suggestions aren't quite right
- Designed for quick decision-making (under 1 minute from voice input to lesson selection)

**Access Points:**
- "AI Coach" button prominently displayed in Lessons_Area
- Available when browsing lessons by skill
- Integrated into lesson selection workflow

**Technical Considerations:**
- Voice-to-text conversion for coach input
- Natural language processing to extract key issues and skills
- Machine learning model trained on coaching terminology and common team challenges
- Tagging system for session plans and lessons to enable AI matching
- Recommendation engine that considers training history and age appropriateness
- Works offline with cached lessons (voice processing requires connectivity)

**Benefits:**
- Saves time for coaches who aren't sure which lesson to select
- Helps less experienced coaches find appropriate content
- Ensures training addresses current team needs rather than following rigid progression
- Reduces cognitive load on busy practice days
- Makes lesson selection more intuitive and conversational

**Future Enhancements (Beyond Version 1):**
- Multi-turn dialogue for clarification when needed
- Proactive suggestions based on game feedback patterns
- Learning from which suggestions coaches actually select
- admin dashboard showing common themes across teams
- Custom drill generation when repository doesn't have perfect match

**Example Interaction:**
1. Coach taps "AI Coach" button
2. Coach speaks: "My U9 team keeps losing the ball when opponents press them"
3. AI displays: "I found 3 lessons that can help with playing under pressure:
   - **Lesson: Receiving Under Pressure** - Focuses on body positioning and first touch when marked tightly
   - **Lesson: Quick Decision Making** - Helps players recognize when to pass vs. dribble under pressure  
   - **Lesson: Support Play Basics** - Teaches players how to create passing options for teammates
   
   Based on your team's training history, I recommend starting with 'Receiving Under Pressure' since you haven't covered this recently."
4. Coach previews lesson and selects it
5. Proceeds with normal lesson delivery workflow

### Future Enhancement 5: Game Day Match Management

**Description:** Manage and communicate match details to teams, including automated notifications ahead of game day.

**Considerations:**

**Match Data Management:**
- Match table with fields for match ID, team ID, opponent name, match date, match time, venue, and match type (league/friendly)
- admin Site includes a dedicated match management section for entering weekend matches
- Bulk entry interface for entering multiple matches at once (e.g., all weekend fixtures)
- admines can edit match details for any team
- When match details are updated, automatic notifications sent to affected coaches and managers
- Match change notifications clearly indicate what changed (time, venue, opponent, etc.)

**Match Communication:**
- After entering matches, admines can send match details to relevant team coaches and managers
- Automated messaging to relevant team coaches and managers ahead of match day (e.g., 24-48 hours before)
- Match notifications include date, time, venue, and opponent information
- Update notifications sent immediately when match details change

**Match Reporting:**
- admin Site can generate a PDF report of all weekend matches
- Report displays matches in a table format with columns: Team, Date, Time, Venue, Opponent
- Report can be filtered by date range, age group, or specific teams
- Copy-to-clipboard functionality for pasting match table into emails
- Export options include PDF and formatted text for email

**Mobile App Integration:**
- Coaches and managers can view upcoming matches for their teams in the mobile app
- Match details automatically update in the app when admines make changes
- Match history visible alongside game feedback for post-match analysis
- Match details linked to game feedback for context

**Additional Features:**
- Integration with Friendly Manager for match schedule synchronization if available
- Calendar integration to add matches to coach's personal calendar
- Automatic reminders at configurable intervals (e.g., 48 hours, 24 hours, 2 hours before match)

**Benefits:**
- Streamlines weekend match communication workflow
- Reduces manual communication overhead for admines
- Ensures coaches have timely and accurate match information
- Provides easy distribution of match schedules via email
- Creates connection between match schedule and game feedback
- Foundation for match attendance tracking and player selection features

### Future Enhancement 6: External System Integration

**Description:** Integrate with external systems to reduce manual data entry and improve data accuracy.

**Considerations:**

**Friendly Manager Integration:**
- API integration to synchronize team rosters, player information, and team details
- Automatic updates when teams or players change in Friendly Manager
- Bidirectional sync or read-only import based on system capabilities
- Mapping between Friendly Manager team IDs and coaching app team IDs
- Initial data migration strategy from Friendly Manager to coaching app

**Calendar Integration:**
- Export training schedules to coach's personal calendar (Google Calendar, Outlook, Apple Calendar)
- Automatic updates when training times or locations change
- Integration with team scheduling in Friendly Manager if available

**Weather API Integration:**
- Display weather forecasts for upcoming training sessions
- Alerts for adverse weather conditions
- Session planning recommendations based on weather (indoor vs outdoor drills)

### Future Enhancement 7: Complete Team Management Platform (Heja/TeamReach Replacement)

**Description:** Expand the app to become a complete team management and communication platform that replaces dedicated team messaging apps like Heja and TeamReach, providing a unified solution for coaching content, team coordination, and family communication.

**Target Users:**
- Coaches and Managers (existing users with expanded capabilities)
- Parents/Guardians (new user type with lighter app version)
- Players (new user type with lighter app version)

**Core Team Management Features:**

**Event Management:**
- Coaches/managers can create and manage training sessions (practices)
- Coaches/managers can create and manage match events
- Events include date, time, location, and optional notes
- Events automatically appear in team calendar view
- Integration with match management system (Enhancement 5)

**RSVP and Attendance:**
- Parents/players can indicate attendance for each event (Going/Not Going/Maybe)
- Real-time attendance tracking visible to coaches and managers
- Attendance reminders sent to families who haven't responded
- Attendance history linked to player records
- Coaches can see at-a-glance who's coming to each session
- Attendance data feeds into attendance tracking reports (Enhancement 2)

**Team Group Messaging:**
- Team-based group chat for coaches, managers, parents, and players
- Everyone in the team can post messages to the group
- Support for text messages, images, and attachments
- Message notifications via push notifications
- Message history searchable and archived
- Optional: Direct messaging between coach and individual families

**Family Communication Channels:**
- Coaches can send announcements to all team families
- Parents can message coaches/managers directly
- Two-way communication for questions, updates, and coordination
- Read receipts to confirm important messages were seen

**Player and Parent Management:**

**Data Source Integration:**
- Friendly Manager as master data source for players, parents, and team associations
- Automatic sync of player rosters and contact information
- Updates from Friendly Manager propagate to coaching app

**Flexible Family Access:**
- Team invite codes for easy onboarding (e.g., "Join team with code: RANGERS-U9-2024")
- Parents/guardians can join team using invite code without being in Friendly Manager
- Support for multiple caregivers per player (grandparents, other guardians)
- Self-service registration for additional family members via team code

**Parent/Player App (Lighter Version):**

**Limited Feature Set:**
- View team calendar (practices and matches)
- RSVP to events
- View and participate in team group chat
- Receive announcements from coaches
- View basic team information (schedule, location, coach contacts)
- No access to coaching content (lessons, sessions, feedback)
- No access to admin features or reports

**Mobile App Architecture:**
- Same .NET MAUI app with role-based feature visibility
- Parent/player users see simplified interface
- Coaches/managers see full coaching features plus team management
- admines see everything via both mobile and desktop

**Privacy and Permissions:**
- Parents can only see information for their child's team(s)
- Players can only see information for their own team(s)
- Coaches/managers see full team information for their assigned teams
- admines have visibility across all teams
- Configurable privacy settings for what information is shared with families

**Notification System:**
- Push notifications for new messages, event updates, and RSVP reminders
- Configurable notification preferences per user
- Digest mode option (daily summary instead of real-time)
- Critical notifications (match cancellations) always delivered immediately

**Benefits:**
- Single app replaces multiple tools (coaching content + team management + communication)
- Reduces app fatigue for coaches and families
- Centralized communication reduces missed messages
- Attendance tracking integrated with coaching records
- Seamless experience from lesson planning to match day coordination
- Lower barrier to entry for families (simple team code to join)

**Technical Considerations:**
- Role-based access control for three user types (coach/manager, parent, player)
- Friendly Manager API integration for roster sync
- Team invite code generation and validation system
- Real-time messaging infrastructure (consider Azure SignalR or similar)
- Scalable notification system for large numbers of families
- Data privacy compliance for storing family contact information
- Offline support for viewing team calendar and messages

**Implementation Dependencies:**
- Requires Player/Roster Management (Enhancement 1)
- Requires Parent Communication infrastructure (Enhancement 3)
- Requires Match Management (Enhancement 5)
- Requires Friendly Manager Integration (Enhancement 6)
- Builds on existing Messaging Infrastructure (Requirement 21)

**Phased Rollout Approach:**
1. **Phase 7a:** Event management and RSVP system for coaches/managers
2. **Phase 7b:** Parent/player app with calendar view and RSVP capability
3. **Phase 7c:** Team group messaging and announcements
4. **Phase 7d:** Team invite codes and self-service family registration
5. **Phase 7e:** Direct messaging and advanced communication features

### Implementation Priority

These enhancements are listed in suggested implementation order:
1. **Phase 2:** Player/Roster Management and Friendly Manager Integration (foundation for other features)
2. **Phase 3:** Session Attendance Tracking (builds on player management)
3. **Phase 4:** Game Day Match Management (automated match notifications and scheduling)
4. **Phase 5:** Enhanced Game Feedback Structure (prepares data for AI)
5. **Phase 6:** AI-Powered Coaching Assistant (requires sufficient historical data)
6. **Phase 7:** Complete Team Management Platform (event management, RSVP, team messaging, parent/player app)
7. **Phase 8:** Calendar and Weather Integration (quality-of-life improvements)

### Architectural Considerations

To support these future enhancements, the initial system design should:
- Use extensible data models that can accommodate additional fields without breaking changes
- Design APIs with versioning support for backward compatibility
- Implement a flexible tagging/categorization system for content
- Build a modular architecture where new features can be added without major refactoring
- Consider data privacy and access control patterns that can scale to additional user roles
- Plan for external API integration points in the system architecture
