# Requirements Document: Admin Reporting Dashboard

## Introduction

This document specifies the functional requirements for the Admin Reporting Dashboard feature. The system provides comprehensive reports for admins to monitor coaching activities, assess content effectiveness, track coach engagement, and make data-driven decisions about lesson and session content. The dashboard consolidates data from lesson deliveries, feedback submissions, game feedback, and user activity to provide actionable insights.

## Glossary

- **Report**: A data visualization or table showing aggregated information with filters and export capabilities
- **Lesson Delivery**: A record of a lesson being delivered by a coach to a team on a specific date
- **Feedback**: Coach-submitted ratings and comments on sessions, lessons, or games
- **Coach Activity**: Metrics tracking coach engagement (deliveries, feedback submissions)
- **Standings/Ladder**: Not applicable to this spec (tournament feature)
- **Export**: Download report data as CSV or PDF file
- **Date Range**: Filter for selecting from/to dates for report data
- **Aggregation**: Calculation combining multiple records (average, sum, count)

## Requirements

### Requirement 1: Lesson Delivery Summary Report

**User Story:** As an admin, I want to view a summary of lesson deliveries across teams and coaches, so that I can monitor which lessons are being used and ensure balanced skill coverage.

#### Acceptance Criteria

1. WHEN an admin views the Lesson Delivery Summary report, THE System SHALL display a table with columns: Lesson Name, Skill Category, Coach Name, Team Name, Age Group, Date Delivered, Lesson Version, Notes
2. THE System SHALL allow filtering by date range (from/to dates)
3. THE System SHALL allow filtering by team (dropdown with all teams)
4. THE System SHALL allow filtering by coach (dropdown with all coaches)
5. THE System SHALL allow filtering by age group (dropdown: U4-U17)
6. THE System SHALL allow filtering by skill category (dropdown with all skill categories)
7. WHEN multiple filters are applied, THE System SHALL combine them with AND logic
8. THE System SHALL display delivery count at the top of the report
9. THE System SHALL allow exporting the report as CSV
10. THE System SHALL allow exporting the report as PDF
11. WHEN no deliveries match the filters, THE System SHALL display "No deliveries found" message
12. THE System SHALL sort deliveries by date descending (most recent first) by default

### Requirement 2: Lesson Effectiveness Report

**User Story:** As an admin, I want to view lesson effectiveness based on coach feedback, so that I can identify which lessons work well and which need improvement.

#### Acceptance Criteria

1. WHEN an admin views the Lesson Effectiveness report, THE System SHALL display a table with columns: Lesson Name, Average Rating, Number of Deliveries, Feedback Count, Skill Category, Age Group
2. THE System SHALL calculate average rating from all lesson_feedback records for each lesson
3. THE System SHALL count total deliveries from lesson_deliveries table
4. THE System SHALL count feedback submissions from lesson_feedback table
5. THE System SHALL calculate feedback submission rate as (Feedback Count / Delivery Count * 100)%
6. THE System SHALL allow filtering by date range
7. THE System SHALL allow filtering by age group
8. THE System SHALL allow filtering by skill category
9. THE System SHALL allow filtering by minimum number of deliveries (e.g., "only show lessons with 3+ deliveries")
10. THE System SHALL sort by average rating descending by default
11. THE System SHALL display lessons with no feedback as "No feedback yet"
12. THE System SHALL allow exporting as CSV
13. WHEN viewing a lesson row, THE System SHALL allow drilling down to see individual feedback comments

### Requirement 3: Session Ratings Report

**User Story:** As an admin, I want to view session ratings and feedback, so that I can identify which sessions are most effective and which need revision.

#### Acceptance Criteria

1. WHEN an admin views the Session Ratings report, THE System SHALL display a table with columns: Session Name, Session Type, Average Rating, Times Delivered, Feedback Count, Age Group
2. THE System SHALL calculate average rating from session_feedback records
3. THE System SHALL count how many times each session appears in lesson deliveries
4. THE System SHALL count feedback submissions from session_feedback table
5. THE System SHALL allow filtering by date range
6. THE System SHALL allow filtering by session type (warmup, skill_intro, progressive, game)
7. THE System SHALL allow filtering by age group
8. THE System SHALL allow filtering by skill category
9. THE System SHALL sort by average rating descending by default
10. THE System SHALL allow exporting as CSV
11. WHEN viewing a session row, THE System SHALL allow drilling down to see aggregated feedback comments

### Requirement 4: Coach Activity Summary Report

**User Story:** As an admin, I want to view coach activity metrics, so that I can monitor engagement and identify coaches who may need support.

#### Acceptance Criteria

1. WHEN an admin views the Coach Activity Summary, THE System SHALL display a table with columns: Coach Name, Lessons Delivered, Game Feedback Count, Last Activity Date, Teams Coached
2. THE System SHALL count lesson deliveries from lesson_deliveries table per coach
3. THE System SHALL count game feedback submissions from game_feedback table per coach
4. THE System SHALL show the most recent activity date (latest delivery or feedback)
5. THE System SHALL list all teams the coach is assigned to
6. THE System SHALL allow filtering by date range
7. THE System SHALL allow filtering by age group (shows coaches who coach that age group)
8. THE System SHALL allow filtering by specific coaches (multi-select)
9. THE System SHALL calculate and display "Average lessons per coach" at the top
10. THE System SHALL calculate and display "Average game feedback per coach" at the top
11. THE System SHALL sort by lessons delivered descending by default
12. THE System SHALL allow exporting as CSV
13. THE System SHALL allow exporting as PDF

### Requirement 5: Team Training History Report

**User Story:** As an admin, I want to view training history for each team, so that I can ensure balanced skill development and identify training gaps.

#### Acceptance Criteria

1. WHEN an admin views the Team Training History report, THE System SHALL display a table with columns: Team Name, Age Group, Lesson Name, Skill Category, Date Delivered, Coach Name, Lesson Version
2. THE System SHALL allow filtering by team (dropdown)
3. THE System SHALL allow filtering by age group (dropdown)
4. THE System SHALL allow filtering by date range
5. THE System SHALL allow filtering by skill category
6. THE System SHALL group lessons by skill category to show coverage
7. THE System SHALL highlight skills that have not been trained within the last 30 days
8. THE System SHALL display skill coverage summary at the top (e.g., "Passing: 5 lessons, Dribbling: 3 lessons")
9. THE System SHALL sort by date descending by default
10. THE System SHALL allow exporting as CSV
11. THE System SHALL allow exporting as PDF
12. WHEN a skill has not been trained in 30+ days, THE System SHALL display a warning indicator

### Requirement 6: Game Feedback Report

**User Story:** As an admin, I want to view game feedback organized by team and date, so that I can understand team performance trends using the 4 Moments framework.

#### Acceptance Criteria

1. WHEN an admin views the Game Feedback report, THE System SHALL display feedback organized by team and date
2. THE System SHALL show all 4 Moments for each game: Attacking, Transition Attack→Defend, Defending, Transition Defend→Attack
3. THE System SHALL display WWW (What Went Well) and EBI (Even Better If) for each moment
4. THE System SHALL display key areas for improvement
5. THE System SHALL display overall comments
6. THE System SHALL show opponent name (if recorded)
7. THE System SHALL show coach name and date
8. THE System SHALL allow filtering by date range
9. THE System SHALL allow filtering by team
10. THE System SHALL allow filtering by coach
11. THE System SHALL allow filtering by age group
12. THE System SHALL sort by date descending (most recent first)
13. THE System SHALL allow exporting as CSV
14. THE System SHALL allow exporting as PDF

### Requirement 7: Report Filters Component

**User Story:** As an admin, I want consistent filter controls across all reports, so that I can easily narrow down data to what I need.

#### Acceptance Criteria

1. THE System SHALL provide a reusable filter panel component used across all reports
2. THE System SHALL include date range picker with from/to dates
3. THE System SHALL include team dropdown (populated from teams table)
4. THE System SHALL include age group dropdown (U4-U17)
5. THE System SHALL include coach dropdown (populated from users where role='coach' or role='manager')
6. THE System SHALL include skill category dropdown (populated from skill categories)
7. THE System SHALL include "Apply Filters" button
8. THE System SHALL include "Clear Filters" button
9. WHEN filters are applied, THE System SHALL update the URL query parameters
10. WHEN the page loads with query parameters, THE System SHALL apply those filters automatically
11. THE System SHALL show active filter count (e.g., "3 filters active")
12. THE System SHALL persist filter selections when navigating between reports

### Requirement 8: Export Functionality

**User Story:** As an admin, I want to export report data, so that I can analyze it in Excel or share it with stakeholders.

#### Acceptance Criteria

1. THE System SHALL provide "Export CSV" button on all reports
2. THE System SHALL provide "Export PDF" button on applicable reports (Lesson Delivery, Coach Activity, Team Training, Game Feedback)
3. WHEN exporting CSV, THE System SHALL include all visible columns
4. WHEN exporting CSV, THE System SHALL respect current filters
5. WHEN exporting CSV, THE System SHALL include column headers
6. WHEN exporting CSV, THE System SHALL use UTF-8 encoding
7. WHEN exporting PDF, THE System SHALL format data in a readable table layout
8. WHEN exporting PDF, THE System SHALL include report title and date range
9. WHEN exporting PDF, THE System SHALL include page numbers
10. THE System SHALL generate exports within 5 seconds for up to 1000 records
11. WHEN export is generating, THE System SHALL show loading indicator
12. WHEN export fails, THE System SHALL display error message

### Requirement 9: Report Performance

**User Story:** As an admin, I want reports to load quickly, so that I can efficiently review data without waiting.

#### Acceptance Criteria

1. WHEN an admin loads a report, THE System SHALL display data within 2 seconds for date ranges up to 1 year
2. WHEN an admin applies filters, THE System SHALL update results within 1 second
3. THE System SHALL use database indexes on commonly filtered columns (date, team_id, coach_id, age_group)
4. THE System SHALL limit initial data load to 100 records with pagination
5. THE System SHALL provide "Load More" button to fetch additional records
6. THE System SHALL cache filter dropdown options (teams, coaches, skills) for 5 minutes
7. WHEN a report query takes longer than 5 seconds, THE System SHALL display a timeout message

### Requirement 10: Report Access Control

**User Story:** As a system administrator, I want reports to be admin-only, so that sensitive data is protected.

#### Acceptance Criteria

1. THE System SHALL restrict all reports to users with role='admin'
2. WHEN a non-admin user attempts to access reports, THE System SHALL redirect to landing page
3. THE System SHALL enforce RLS policies at the database level for report queries
4. THE System SHALL log when reports are generated and by whom (audit trail)
5. THE System SHALL include user_id and timestamp in audit log
6. THE System SHALL allow admins to view audit log of report access

### Requirement 11: Reporting Dashboard Navigation

**User Story:** As an admin, I want easy navigation between reports, so that I can quickly access the information I need.

#### Acceptance Criteria

1. THE System SHALL provide a Reporting page accessible from admin navigation menu
2. THE System SHALL display report cards/tiles on the main reporting page
3. THE System SHALL show report name, description, and icon on each card
4. WHEN an admin clicks a report card, THE System SHALL navigate to that report page
5. THE System SHALL highlight the active report in the navigation
6. THE System SHALL provide breadcrumb navigation (Admin > Reporting > Report Name)
7. THE System SHALL provide "Back to Reports" link on individual report pages
8. THE System SHALL organize reports by category: Lesson Reports, Coach Reports, Team Reports, Game Reports

### Requirement 12: Report Data Freshness

**User Story:** As an admin, I want to see current data in reports, so that I can make decisions based on the latest information.

#### Acceptance Criteria

1. THE System SHALL display "Last updated" timestamp on each report
2. THE System SHALL provide "Refresh" button to reload report data
3. WHEN data is refreshed, THE System SHALL show loading indicator
4. THE System SHALL automatically refresh data when navigating back to a report
5. THE System SHALL not cache report data longer than 5 minutes
6. WHEN underlying data changes (new delivery, new feedback), THE System SHALL reflect changes on next page load

### Requirement 13: Empty States and Error Handling

**User Story:** As an admin, I want clear messages when reports have no data or errors occur, so that I understand what's happening.

#### Acceptance Criteria

1. WHEN a report has no data, THE System SHALL display "No data found" with helpful message
2. WHEN filters result in no matches, THE System SHALL display "No results match your filters. Try adjusting your criteria."
3. WHEN a database error occurs, THE System SHALL display "Unable to load report. Please try again."
4. WHEN a network error occurs, THE System SHALL display "Connection error. Please check your internet."
5. THE System SHALL log all errors to error tracking service
6. THE System SHALL provide "Try Again" button on error states
7. WHEN a report is loading, THE System SHALL display skeleton loaders or spinner

### Requirement 14: Mobile Responsiveness

**User Story:** As an admin, I want to view reports on mobile devices, so that I can check data on the go.

#### Acceptance Criteria

1. WHEN viewing reports on mobile (viewport < 768px), THE System SHALL display a message: "Reports are best viewed on desktop"
2. THE System SHALL allow basic report viewing on mobile with horizontal scroll for tables
3. THE System SHALL stack filter controls vertically on mobile
4. THE System SHALL make export buttons full-width on mobile
5. THE System SHALL prioritize desktop experience (reports are primarily desktop feature)

### Requirement 15: Report Drill-Down

**User Story:** As an admin, I want to drill down into report details, so that I can investigate specific data points.

#### Acceptance Criteria

1. WHEN viewing Lesson Effectiveness report, THE System SHALL allow clicking a lesson to see all feedback comments
2. WHEN viewing Session Ratings report, THE System SHALL allow clicking a session to see all feedback comments
3. WHEN viewing Coach Activity report, THE System SHALL allow clicking a coach to see their delivery history
4. WHEN viewing Team Training History, THE System SHALL allow clicking a lesson to see lesson details
5. THE System SHALL open drill-down details in a modal or side panel
6. THE System SHALL provide "Close" button to return to main report
7. THE System SHALL maintain filter context when drilling down

---

## Phase 1 Priority (Essential Reports)

These reports provide the most immediate value and should be implemented first:

1. ✅ **Requirement 1**: Lesson Delivery Summary Report
2. ✅ **Requirement 4**: Coach Activity Summary Report
3. ✅ **Requirement 5**: Team Training History Report
4. ✅ **Requirement 7**: Report Filters Component
5. ✅ **Requirement 8**: Export Functionality (CSV only for Phase 1)
6. ✅ **Requirement 11**: Reporting Dashboard Navigation

## Phase 2 Priority (Feedback Analysis)

These reports add feedback analysis capabilities:

1. ✅ **Requirement 2**: Lesson Effectiveness Report
2. ✅ **Requirement 3**: Session Ratings Report
3. ✅ **Requirement 6**: Game Feedback Report
4. ✅ **Requirement 15**: Report Drill-Down

## Phase 3 Priority (Polish & Advanced)

These requirements enhance the reporting experience:

1. ✅ **Requirement 8**: Export Functionality (PDF support)
2. ✅ **Requirement 9**: Report Performance optimization
3. ✅ **Requirement 12**: Report Data Freshness
4. ✅ **Requirement 13**: Empty States and Error Handling
5. ✅ **Requirement 14**: Mobile Responsiveness

---

## Non-Functional Requirements

### Performance
- Reports load within 2 seconds for 1-year date ranges
- Exports generate within 5 seconds for up to 1000 records
- Filter application updates results within 1 second

### Security
- Admin-only access enforced at route and database level
- RLS policies protect sensitive data
- Audit trail logs all report access

### Usability
- Consistent filter UI across all reports
- Clear empty states and error messages
- Intuitive navigation between reports

### Scalability
- Pagination for large datasets
- Database indexes on filtered columns
- Caching for filter dropdown options
