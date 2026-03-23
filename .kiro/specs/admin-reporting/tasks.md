# Implementation Tasks: Admin Reporting Dashboard

## Overview

This document breaks down the implementation of the Admin Reporting Dashboard into actionable tasks. Tasks are organized by phase and component, with clear dependencies and acceptance criteria.

---

## Phase 1: Essential Reports (Weeks 1-2)

### Task 1: Database Indexes and Optimization

**Description**: Create database indexes for report query performance

**Files**:
- `supabase/migrations/038_reporting_indexes.sql`

**Acceptance Criteria**:
- [ ] Create indexes on lesson_deliveries (delivered_at, team_id, coach_id)
- [ ] Create indexes on lesson_feedback (lesson_id, created_at)
- [ ] Create indexes on session_feedback (session_id, created_at)
- [ ] Create indexes on game_feedback (created_at, team_id, coach_id)
- [ ] Create indexes on lessons (age_group, skill_category)
- [ ] Create indexes on teams (age_group)
- [ ] Run migration on development database
- [ ] Verify indexes created successfully

**Dependencies**: None

**Estimated Time**: 1 hour

---

### Task 2: Reporting API Service

**Description**: Create API service for fetching report data

**Files**:
- `src/lib/reporting-api.ts`

**Acceptance Criteria**:
- [ ] Create ReportingApi class extending ApiClient
- [ ] Implement getLessonDeliveries(filters) method
- [ ] Implement getCoachActivity(filters) method
- [ ] Implement getTeamTraining(filters) method
- [ ] Implement getFilterOptions() method
- [ ] Add TypeScript interfaces for all report rows
- [ ] Add error handling for all methods
- [ ] Test API methods with sample data

**Dependencies**: Task 1

**Estimated Time**: 4 hours

---

### Task 3: Export Utilities

**Description**: Create utilities for CSV export

**Files**:
- `src/lib/export-utils.ts`

**Acceptance Criteria**:
- [ ] Implement exportToCSV(options) function
- [ ] Handle comma and quote escaping
- [ ] Handle null/undefined values
- [ ] Generate proper CSV format with headers
- [ ] Trigger browser download
- [ ] Add TypeScript interfaces for ExportOptions
- [ ] Test with sample data

**Dependencies**: None

**Estimated Time**: 2 hours

---

### Task 4: ReportFilters Component

**Description**: Create reusable filter panel component

**Files**:
- `src/components/reporting/ReportFilters.tsx`

**Acceptance Criteria**:
- [ ] Create component with props for available filters
- [ ] Implement date range picker (from/to)
- [ ] Implement team dropdown (searchable)
- [ ] Implement coach dropdown (searchable)
- [ ] Implement age group dropdown (U4-U17)
- [ ] Implement skill category dropdown
- [ ] Add "Apply Filters" button
- [ ] Add "Clear Filters" button
- [ ] Show active filter count badge
- [ ] Load filter options from API on mount
- [ ] Update URL query parameters on apply
- [ ] Read URL query parameters on mount
- [ ] Style with Tailwind CSS

**Dependencies**: Task 2

**Estimated Time**: 6 hours

---

### Task 5: ReportTable Component

**Description**: Create reusable data table component

**Files**:
- `src/components/reporting/ReportTable.tsx`

**Acceptance Criteria**:
- [ ] Create component with props for columns and data
- [ ] Implement sortable columns (click header to sort)
- [ ] Implement loading skeleton
- [ ] Implement empty state message
- [ ] Implement pagination (100 rows per page)
- [ ] Add row hover effect
- [ ] Support clickable rows (onRowClick prop)
- [ ] Style with Tailwind CSS
- [ ] Responsive design

**Dependencies**: None

**Estimated Time**: 4 hours

---

### Task 6: ExportButton Component

**Description**: Create export button component

**Files**:
- `src/components/reporting/ExportButton.tsx`

**Acceptance Criteria**:
- [ ] Create component with props for format, data, columns, filename
- [ ] Implement CSV export on click
- [ ] Show loading spinner during generation
- [ ] Show success toast after download
- [ ] Show error toast on failure
- [ ] Style with Tailwind CSS
- [ ] Support disabled state

**Dependencies**: Task 3

**Estimated Time**: 2 hours

---

### Task 7: ReportCard Component

**Description**: Create report card component for dashboard

**Files**:
- `src/components/reporting/ReportCard.tsx`

**Acceptance Criteria**:
- [ ] Create component with props for title, description, icon, href, category
- [ ] Implement card layout with icon, title, description
- [ ] Add category badge
- [ ] Add hover effect
- [ ] Make entire card clickable (navigate to href)
- [ ] Style with Tailwind CSS
- [ ] Responsive design

**Dependencies**: None

**Estimated Time**: 2 hours

---

### Task 8: DesktopReporting Dashboard Page

**Description**: Create main reporting dashboard page

**Files**:
- `src/pages/desktop/DesktopReporting.tsx`

**Acceptance Criteria**:
- [ ] Create page component
- [ ] Add page title and description
- [ ] Display report cards in grid (3 columns)
- [ ] Organize cards by category
- [ ] Add 6 report cards (Phase 1: 3, Phase 2: 3)
- [ ] Style with Tailwind CSS
- [ ] Responsive design

**Dependencies**: Task 7

**Estimated Time**: 2 hours

---

### Task 9: Lesson Delivery Summary Report

**Description**: Implement Lesson Delivery Summary report page

**Files**:
- `src/pages/desktop/LessonDeliveryReport.tsx`

**Acceptance Criteria**:
- [ ] Create page component
- [ ] Add page title and breadcrumb navigation
- [ ] Integrate ReportFilters component (dateRange, team, coach, ageGroup, skillCategory)
- [ ] Fetch data from API on mount and filter change
- [ ] Display data in ReportTable component
- [ ] Show delivery count at top
- [ ] Add ExportButton for CSV
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Handle empty state
- [ ] Sort by date descending by default
- [ ] Style with Tailwind CSS

**Dependencies**: Tasks 2, 4, 5, 6

**Estimated Time**: 4 hours

---

### Task 10: Coach Activity Summary Report

**Description**: Implement Coach Activity Summary report page

**Files**:
- `src/pages/desktop/CoachActivityReport.tsx`

**Acceptance Criteria**:
- [ ] Create page component
- [ ] Add page title and breadcrumb navigation
- [ ] Integrate ReportFilters component (dateRange, ageGroup, coach)
- [ ] Fetch data from API on mount and filter change
- [ ] Display data in ReportTable component
- [ ] Show "Average lessons per coach" at top
- [ ] Show "Average game feedback per coach" at top
- [ ] Add ExportButton for CSV and PDF
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Handle empty state
- [ ] Sort by lessons delivered descending by default
- [ ] Style with Tailwind CSS

**Dependencies**: Tasks 2, 4, 5, 6

**Estimated Time**: 4 hours

---

### Task 11: Team Training History Report

**Description**: Implement Team Training History report page

**Files**:
- `src/pages/desktop/TeamTrainingReport.tsx`

**Acceptance Criteria**:
- [ ] Create page component
- [ ] Add page title and breadcrumb navigation
- [ ] Integrate ReportFilters component (team, ageGroup, dateRange, skillCategory)
- [ ] Fetch data from API on mount and filter change
- [ ] Display data in ReportTable component
- [ ] Show skill coverage summary at top
- [ ] Highlight skills not trained in 30+ days
- [ ] Add ExportButton for CSV and PDF
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Handle empty state
- [ ] Sort by date descending by default
- [ ] Style with Tailwind CSS

**Dependencies**: Tasks 2, 4, 5, 6

**Estimated Time**: 5 hours

---

### Task 12: Routing and Navigation

**Description**: Add routes and navigation for reporting

**Files**:
- `src/App.tsx`
- `src/layouts/DesktopLayout.tsx`

**Acceptance Criteria**:
- [ ] Add route for /app/admin/reporting (dashboard)
- [ ] Add route for /app/admin/reporting/lesson-deliveries
- [ ] Add route for /app/admin/reporting/coach-activity
- [ ] Add route for /app/admin/reporting/team-training
- [ ] Set meta: { requiresAuth: true, allowedRoles: ['admin'] }
- [ ] Add "Reporting" nav item to admin navigation in DesktopLayout
- [ ] Use BarChart icon
- [ ] Test navigation works

**Dependencies**: Tasks 8, 9, 10, 11

**Estimated Time**: 1 hour

---

### Task 13: Phase 1 Testing and Refinement

**Description**: Test Phase 1 reports and fix issues

**Acceptance Criteria**:
- [ ] Test all 3 reports with real data
- [ ] Test filter combinations
- [ ] Test CSV export
- [ ] Test loading states
- [ ] Test error states
- [ ] Test empty states
- [ ] Test sorting
- [ ] Test pagination
- [ ] Fix any bugs found
- [ ] Refine UI based on feedback

**Dependencies**: Tasks 1-12

**Estimated Time**: 4 hours

---

## Phase 2: Feedback Analysis (Weeks 3-4)

### Task 14: Extend Reporting API

**Description**: Add methods for feedback reports

**Files**:
- `src/lib/reporting-api.ts`

**Acceptance Criteria**:
- [ ] Implement getLessonEffectiveness(filters) method
- [ ] Implement getSessionRatings(filters) method
- [ ] Implement getGameFeedback(filters) method
- [ ] Implement getLessonFeedbackDetails(lessonId) method
- [ ] Implement getSessionFeedbackDetails(sessionId) method
- [ ] Add TypeScript interfaces for new report rows
- [ ] Test API methods with sample data

**Dependencies**: Task 2

**Estimated Time**: 4 hours

---

### Task 15: DrillDownModal Component

**Description**: Create modal for viewing detailed feedback

**Files**:
- `src/components/reporting/DrillDownModal.tsx`

**Acceptance Criteria**:
- [ ] Create component with props for title, data, columns, onClose
- [ ] Implement modal overlay
- [ ] Display data in table format
- [ ] Add close button (X icon)
- [ ] Add "Close" button at bottom
- [ ] Handle scrollable content
- [ ] Style with Tailwind CSS
- [ ] Add fade-in animation

**Dependencies**: None

**Estimated Time**: 3 hours

---

### Task 16: Lesson Effectiveness Report

**Description**: Implement Lesson Effectiveness report page

**Files**:
- `src/pages/desktop/LessonEffectivenessReport.tsx`

**Acceptance Criteria**:
- [ ] Create page component
- [ ] Add page title and breadcrumb navigation
- [ ] Integrate ReportFilters component (dateRange, ageGroup, skillCategory, minDeliveries)
- [ ] Fetch data from API on mount and filter change
- [ ] Display data in ReportTable component
- [ ] Show "No feedback yet" for lessons without feedback
- [ ] Make rows clickable to drill down
- [ ] Open DrillDownModal with feedback comments on row click
- [ ] Add ExportButton for CSV
- [ ] Handle loading/error/empty states
- [ ] Sort by average rating descending by default
- [ ] Style with Tailwind CSS

**Dependencies**: Tasks 14, 15

**Estimated Time**: 5 hours

---

### Task 17: Session Ratings Report

**Description**: Implement Session Ratings report page

**Files**:
- `src/pages/desktop/SessionRatingsReport.tsx`

**Acceptance Criteria**:
- [ ] Create page component
- [ ] Add page title and breadcrumb navigation
- [ ] Integrate ReportFilters component (dateRange, sessionType, ageGroup, skillCategory)
- [ ] Fetch data from API on mount and filter change
- [ ] Display data in ReportTable component
- [ ] Make rows clickable to drill down
- [ ] Open DrillDownModal with feedback comments on row click
- [ ] Add ExportButton for CSV
- [ ] Handle loading/error/empty states
- [ ] Sort by average rating descending by default
- [ ] Style with Tailwind CSS

**Dependencies**: Tasks 14, 15

**Estimated Time**: 5 hours

---

### Task 18: Game Feedback Report

**Description**: Implement Game Feedback report page

**Files**:
- `src/pages/desktop/GameFeedbackReport.tsx`

**Acceptance Criteria**:
- [ ] Create page component
- [ ] Add page title and breadcrumb navigation
- [ ] Integrate ReportFilters component (dateRange, team, coach, ageGroup)
- [ ] Fetch data from API on mount and filter change
- [ ] Display feedback organized by team and date
- [ ] Show all 4 Moments (Attacking, Transition A→D, Defending, Transition D→A)
- [ ] Show WWW and EBI for each moment
- [ ] Show key areas and comments
- [ ] Add ExportButton for CSV and PDF
- [ ] Handle loading/error/empty states
- [ ] Sort by date descending by default
- [ ] Style with Tailwind CSS

**Dependencies**: Task 14

**Estimated Time**: 6 hours

---

### Task 19: Update Dashboard with Phase 2 Reports

**Description**: Add Phase 2 report cards to dashboard

**Files**:
- `src/pages/desktop/DesktopReporting.tsx`
- `src/App.tsx`

**Acceptance Criteria**:
- [ ] Add report card for Lesson Effectiveness
- [ ] Add report card for Session Ratings
- [ ] Add report card for Game Feedback
- [ ] Add routes for new reports
- [ ] Test navigation works

**Dependencies**: Tasks 16, 17, 18

**Estimated Time**: 1 hour

---

### Task 20: Phase 2 Testing and Refinement

**Description**: Test Phase 2 reports and fix issues

**Acceptance Criteria**:
- [ ] Test all 3 feedback reports with real data
- [ ] Test drill-down functionality
- [ ] Test filter combinations
- [ ] Test CSV export
- [ ] Test all states (loading, error, empty)
- [ ] Fix any bugs found
- [ ] Refine UI based on feedback

**Dependencies**: Tasks 14-19

**Estimated Time**: 4 hours

---

## Phase 3: Polish & Advanced (Week 5+)

### Task 21: PDF Export Support

**Description**: Add PDF export functionality

**Files**:
- `src/lib/export-utils.ts`
- `package.json`

**Acceptance Criteria**:
- [ ] Install jsPDF and jspdf-autotable
- [ ] Implement exportToPDF(options) function
- [ ] Add report title to PDF
- [ ] Format data as table
- [ ] Add page numbers
- [ ] Test PDF generation
- [ ] Update ExportButton to support PDF

**Dependencies**: Task 3

**Estimated Time**: 4 hours

---

### Task 22: Query Performance Optimization

**Description**: Optimize report queries for better performance

**Acceptance Criteria**:
- [ ] Review slow queries using EXPLAIN ANALYZE
- [ ] Add additional indexes if needed
- [ ] Optimize JOIN operations
- [ ] Add query result caching where appropriate
- [ ] Test performance with large datasets
- [ ] Ensure reports load within 2 seconds

**Dependencies**: Task 1

**Estimated Time**: 4 hours

---

### Task 23: Mobile Responsiveness

**Description**: Improve mobile experience for reports

**Acceptance Criteria**:
- [ ] Add "Best viewed on desktop" message for mobile
- [ ] Make tables horizontally scrollable on mobile
- [ ] Stack filter controls vertically on mobile
- [ ] Make export buttons full-width on mobile
- [ ] Test on various mobile devices
- [ ] Ensure usable (but not optimal) on mobile

**Dependencies**: None

**Estimated Time**: 3 hours

---

### Task 24: Audit Logging

**Description**: Log report access for audit trail

**Files**:
- `src/lib/reporting-api.ts`
- `supabase/migrations/039_audit_log.sql` (if table doesn't exist)

**Acceptance Criteria**:
- [ ] Create audit_log table if needed
- [ ] Implement logReportAccess(reportName, userId) method
- [ ] Call on each report page load
- [ ] Store: action, resource, user_id, timestamp
- [ ] Test logging works

**Dependencies**: Task 2

**Estimated Time**: 2 hours

---

### Task 25: Final Testing and Documentation

**Description**: Comprehensive testing and documentation

**Acceptance Criteria**:
- [ ] Test all 6 reports end-to-end
- [ ] Test all filter combinations
- [ ] Test CSV and PDF exports
- [ ] Test drill-down functionality
- [ ] Test error handling
- [ ] Test performance with large datasets
- [ ] Update CHANGELOG.md
- [ ] Update CONVERSATION-HISTORY.md
- [ ] Create user guide (optional)

**Dependencies**: All previous tasks

**Estimated Time**: 4 hours

---

## Summary

**Total Tasks**: 25
**Phase 1**: 13 tasks (~35 hours)
**Phase 2**: 7 tasks (~30 hours)
**Phase 3**: 5 tasks (~17 hours)
**Total Estimated Time**: ~82 hours (2-3 weeks full-time)

**Priority Order**:
1. Complete Phase 1 (Essential Reports) first
2. Test and gather feedback
3. Proceed to Phase 2 (Feedback Analysis)
4. Test and gather feedback
5. Proceed to Phase 3 (Polish) based on priority
