# Design Document: Admin Reporting Dashboard

## Introduction

This document outlines the technical design for the Admin Reporting Dashboard feature. The system provides 8 comprehensive reports for admins to monitor coaching activities, assess content effectiveness, and make data-driven decisions. The design leverages existing database tables, implements reusable UI components, and optimizes query performance through database views and indexes.

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Desktop Admin UI                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Reporting  │  │  Report Card │  │ Report Page  │      │
│  │   Dashboard  │→ │   Component  │→ │  Component   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Reporting API Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Reports API │  │  Filters API │  │  Export API  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Database                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Existing   │  │  Report Views│  │   Indexes    │      │
│  │    Tables    │  │  (Optional)  │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

```
src/
├── pages/
│   └── desktop/
│       ├── DesktopReporting.tsx          # Main reporting dashboard
│       ├── LessonDeliveryReport.tsx      # Report 1
│       ├── LessonEffectivenessReport.tsx # Report 2
│       ├── SessionRatingsReport.tsx      # Report 3
│       ├── CoachActivityReport.tsx       # Report 4
│       ├── TeamTrainingReport.tsx        # Report 5
│       └── GameFeedbackReport.tsx        # Report 6
├── components/
│   └── reporting/
│       ├── ReportCard.tsx                # Report tile on dashboard
│       ├── ReportFilters.tsx             # Reusable filter panel
│       ├── ReportTable.tsx               # Reusable data table
│       ├── ExportButton.tsx              # CSV/PDF export
│       ├── DateRangePicker.tsx           # Date range selector
│       └── DrillDownModal.tsx            # Detail view modal
└── lib/
    ├── reporting-api.ts                  # API methods for reports
    └── export-utils.ts                   # CSV/PDF generation
```

## Data Models

### Existing Tables (No Changes Needed)

All reports use existing database tables:


**lesson_deliveries**: Tracks lesson deliveries by coaches
- id, lesson_id, team_id, coach_id, delivered_at, notes, created_at

**lessons**: Lesson metadata
- id, title, skill_category, age_group, division, session_1_id, session_2_id, session_3_id, session_4_id

**sessions**: Session metadata
- id, title, session_type, age_group, duration

**lesson_feedback**: Coach feedback on lessons
- id, lesson_id, coach_id, team_id, rating, comments, created_at

**session_feedback**: Coach feedback on sessions
- id, session_id, coach_id, team_id, rating, comments, created_at

**game_feedback**: Post-match feedback using 4 Moments
- id, game_id, coach_id, team_id, attacking_www, attacking_ebi, transition_atd_www, transition_atd_ebi, defending_www, defending_ebi, transition_dta_www, transition_dta_ebi, key_areas, comments, created_at

**teams**: Team information
- id, name, age_group, division

**users**: User information
- id, first_name, last_name, role

**team_members**: Team assignments
- id, team_id, user_id, role

### TypeScript Interfaces

```typescript
// Report Filter State
interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  teamId?: string;
  coachId?: string;
  ageGroup?: string;
  skillCategory?: string;
  minDeliveries?: number;
}

// Lesson Delivery Report Row
interface LessonDeliveryRow {
  id: string;
  lessonName: string;
  skillCategory: string;
  coachName: string;
  teamName: string;
  ageGroup: string;
  dateDelivered: string;
  lessonVersion: number;
  notes: string | null;
}

// Lesson Effectiveness Report Row
interface LessonEffectivenessRow {
  lessonId: string;
  lessonName: string;
  averageRating: number;
  deliveryCount: number;
  feedbackCount: number;
  feedbackRate: number;
  skillCategory: string;
  ageGroup: string;
}

// Session Ratings Report Row
interface SessionRatingsRow {
  sessionId: string;
  sessionName: string;
  sessionType: string;
  averageRating: number;
  timesDelivered: number;
  feedbackCount: number;
  ageGroup: string;
}

// Coach Activity Report Row
interface CoachActivityRow {
  coachId: string;
  coachName: string;
  lessonsDelivered: number;
  gameFeedbackCount: number;
  lastActivityDate: string;
  teamsCoached: string[];
}

// Team Training Report Row
interface TeamTrainingRow {
  teamName: string;
  ageGroup: string;
  lessonName: string;
  skillCategory: string;
  dateDelivered: string;
  coachName: string;
  lessonVersion: number;
}

// Game Feedback Report Row
interface GameFeedbackRow {
  id: string;
  teamName: string;
  date: string;
  opponent: string | null;
  coachName: string;
  attacking: { www: string; ebi: string };
  transitionATD: { www: string; ebi: string };
  defending: { www: string; ebi: string };
  transitionDTA: { www: string; ebi: string };
  keyAreas: string[];
  comments: string | null;
}

// Export Options
interface ExportOptions {
  format: 'csv' | 'pdf';
  filename: string;
  data: any[];
  columns: string[];
}
```

## API Design

### Reporting API (`src/lib/reporting-api.ts`)

```typescript
class ReportingApi extends ApiClient {
  // Lesson Delivery Summary
  async getLessonDeliveries(filters: ReportFilters): Promise<LessonDeliveryRow[]>
  
  // Lesson Effectiveness
  async getLessonEffectiveness(filters: ReportFilters): Promise<LessonEffectivenessRow[]>
  
  // Session Ratings
  async getSessionRatings(filters: ReportFilters): Promise<SessionRatingsRow[]>
  
  // Coach Activity
  async getCoachActivity(filters: ReportFilters): Promise<CoachActivityRow[]>
  
  // Team Training History
  async getTeamTraining(filters: ReportFilters): Promise<TeamTrainingRow[]>
  
  // Game Feedback
  async getGameFeedback(filters: ReportFilters): Promise<GameFeedbackRow[]>
  
  // Filter Options
  async getFilterOptions(): Promise<{
    teams: { id: string; name: string; ageGroup: string }[];
    coaches: { id: string; name: string }[];
    skillCategories: string[];
  }>
  
  // Drill-down
  async getLessonFeedbackDetails(lessonId: string): Promise<any[]>
  async getSessionFeedbackDetails(sessionId: string): Promise<any[]>
  async getCoachDeliveryHistory(coachId: string, filters: ReportFilters): Promise<any[]>
}
```

### Export Utilities (`src/lib/export-utils.ts`)

```typescript
// CSV Export
export function exportToCSV(options: ExportOptions): void

// PDF Export (Phase 3)
export function exportToPDF(options: ExportOptions): Promise<void>

// Helper: Format data for export
export function formatDataForExport(data: any[], columns: string[]): any[]
```

## UI Components



### 1. DesktopReporting.tsx (Main Dashboard)

**Purpose**: Landing page showing all available reports as cards

**Layout**:
```tsx
<div className="p-6">
  <h1>Reporting Dashboard</h1>
  <p>Monitor coaching activities and assess content effectiveness</p>
  
  <div className="grid grid-cols-3 gap-4 mt-6">
    <ReportCard
      title="Lesson Delivery Summary"
      description="View lesson deliveries across teams and coaches"
      icon={BookOpen}
      href="/app/admin/reporting/lesson-deliveries"
      category="Lesson Reports"
    />
    <ReportCard
      title="Lesson Effectiveness"
      description="Assess lesson quality based on feedback"
      icon={TrendingUp}
      href="/app/admin/reporting/lesson-effectiveness"
      category="Lesson Reports"
    />
    {/* ... more cards */}
  </div>
</div>
```

### 2. ReportCard.tsx

**Props**:
- title: string
- description: string
- icon: React.ComponentType
- href: string
- category: string

**Styling**: Card with hover effect, icon, title, description, category badge

### 3. ReportFilters.tsx (Reusable)

**Props**:
- availableFilters: string[] (e.g., ['dateRange', 'team', 'coach', 'ageGroup'])
- onApplyFilters: (filters: ReportFilters) => void
- onClearFilters: () => void

**Features**:
- Date range picker (from/to)
- Team dropdown (searchable)
- Coach dropdown (searchable)
- Age group dropdown (U4-U17)
- Skill category dropdown
- "Apply Filters" button
- "Clear Filters" button
- Active filter count badge

**State Management**:
```tsx
const [filters, setFilters] = useState<ReportFilters>({});
const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);

useEffect(() => {
  // Load filter options on mount
  reportingApi.getFilterOptions().then(setFilterOptions);
}, []);
```

### 4. ReportTable.tsx (Reusable)

**Props**:
- columns: { key: string; label: string; sortable?: boolean }[]
- data: any[]
- loading: boolean
- onSort?: (column: string, direction: 'asc' | 'desc') => void
- onRowClick?: (row: any) => void

**Features**:
- Sortable columns (click header to sort)
- Loading skeleton
- Empty state
- Pagination (100 rows per page)
- Row hover effect
- Clickable rows (for drill-down)

### 5. ExportButton.tsx

**Props**:
- format: 'csv' | 'pdf'
- data: any[]
- columns: string[]
- filename: string

**Behavior**:
- Click to trigger export
- Show loading spinner during generation
- Download file automatically
- Show success/error toast

### 6. DateRangePicker.tsx

**Props**:
- value: { from: string; to: string }
- onChange: (range: { from: string; to: string }) => void

**Features**:
- Two date inputs (from/to)
- Calendar popup (optional)
- Validation (from <= to)
- Quick presets: "Last 7 days", "Last 30 days", "Last 3 months", "Last year"

### 7. DrillDownModal.tsx

**Props**:
- title: string
- data: any[]
- columns: { key: string; label: string }[]
- onClose: () => void

**Features**:
- Modal overlay
- Data table
- Close button
- Scrollable content

## Database Queries

### Query 1: Lesson Delivery Summary

```sql
SELECT 
  ld.id,
  l.title AS lesson_name,
  l.skill_category,
  CONCAT(u.first_name, ' ', u.last_name) AS coach_name,
  CONCAT(t.age_group, ' ', t.name) AS team_name,
  t.age_group,
  ld.delivered_at AS date_delivered,
  l.version AS lesson_version,
  ld.notes
FROM lesson_deliveries ld
JOIN lessons l ON ld.lesson_id = l.id
JOIN teams t ON ld.team_id = t.id
JOIN users u ON ld.coach_id = u.id
WHERE 
  ($1::date IS NULL OR ld.delivered_at >= $1)
  AND ($2::date IS NULL OR ld.delivered_at <= $2)
  AND ($3::uuid IS NULL OR ld.team_id = $3)
  AND ($4::uuid IS NULL OR ld.coach_id = $4)
  AND ($5::text IS NULL OR t.age_group = $5)
  AND ($6::text IS NULL OR l.skill_category = $6)
ORDER BY ld.delivered_at DESC
LIMIT 100;
```

### Query 2: Lesson Effectiveness

```sql
SELECT 
  l.id AS lesson_id,
  l.title AS lesson_name,
  COALESCE(AVG(lf.rating), 0) AS average_rating,
  COUNT(DISTINCT ld.id) AS delivery_count,
  COUNT(DISTINCT lf.id) AS feedback_count,
  CASE 
    WHEN COUNT(DISTINCT ld.id) > 0 
    THEN (COUNT(DISTINCT lf.id)::float / COUNT(DISTINCT ld.id) * 100)
    ELSE 0 
  END AS feedback_rate,
  l.skill_category,
  l.age_group
FROM lessons l
LEFT JOIN lesson_deliveries ld ON l.id = ld.lesson_id
LEFT JOIN lesson_feedback lf ON l.id = lf.lesson_id
WHERE 
  ($1::date IS NULL OR ld.delivered_at >= $1)
  AND ($2::date IS NULL OR ld.delivered_at <= $2)
  AND ($3::text IS NULL OR l.age_group = $3)
  AND ($4::text IS NULL OR l.skill_category = $4)
GROUP BY l.id, l.title, l.skill_category, l.age_group
HAVING ($5::int IS NULL OR COUNT(DISTINCT ld.id) >= $5)
ORDER BY average_rating DESC;
```

### Query 3: Session Ratings

```sql
SELECT 
  s.id AS session_id,
  s.title AS session_name,
  s.session_type,
  COALESCE(AVG(sf.rating), 0) AS average_rating,
  COUNT(DISTINCT ld.id) AS times_delivered,
  COUNT(DISTINCT sf.id) AS feedback_count,
  s.age_group
FROM sessions s
LEFT JOIN lessons l ON (
  s.id = l.session_1_id OR 
  s.id = l.session_2_id OR 
  s.id = l.session_3_id OR 
  s.id = l.session_4_id
)
LEFT JOIN lesson_deliveries ld ON l.id = ld.lesson_id
LEFT JOIN session_feedback sf ON s.id = sf.session_id
WHERE 
  ($1::date IS NULL OR ld.delivered_at >= $1)
  AND ($2::date IS NULL OR ld.delivered_at <= $2)
  AND ($3::text IS NULL OR s.session_type = $3)
  AND ($4::text IS NULL OR s.age_group = $4)
GROUP BY s.id, s.title, s.session_type, s.age_group
ORDER BY average_rating DESC;
```

### Query 4: Coach Activity

```sql
SELECT 
  u.id AS coach_id,
  CONCAT(u.first_name, ' ', u.last_name) AS coach_name,
  COUNT(DISTINCT ld.id) AS lessons_delivered,
  COUNT(DISTINCT gf.id) AS game_feedback_count,
  MAX(GREATEST(ld.delivered_at, gf.created_at)) AS last_activity_date,
  ARRAY_AGG(DISTINCT CONCAT(t.age_group, ' ', t.name)) AS teams_coached
FROM users u
LEFT JOIN lesson_deliveries ld ON u.id = ld.coach_id
LEFT JOIN game_feedback gf ON u.id = gf.coach_id
LEFT JOIN team_members tm ON u.id = tm.user_id
LEFT JOIN teams t ON tm.team_id = t.id
WHERE u.role IN ('coach', 'manager', 'admin')
  AND ($1::date IS NULL OR ld.delivered_at >= $1 OR gf.created_at >= $1)
  AND ($2::date IS NULL OR ld.delivered_at <= $2 OR gf.created_at <= $2)
GROUP BY u.id, u.first_name, u.last_name
ORDER BY lessons_delivered DESC;
```

### Query 5: Team Training History

```sql
SELECT 
  CONCAT(t.age_group, ' ', t.name) AS team_name,
  t.age_group,
  l.title AS lesson_name,
  l.skill_category,
  ld.delivered_at AS date_delivered,
  CONCAT(u.first_name, ' ', u.last_name) AS coach_name,
  l.version AS lesson_version
FROM lesson_deliveries ld
JOIN lessons l ON ld.lesson_id = l.id
JOIN teams t ON ld.team_id = t.id
JOIN users u ON ld.coach_id = u.id
WHERE 
  ($1::uuid IS NULL OR ld.team_id = $1)
  AND ($2::text IS NULL OR t.age_group = $2)
  AND ($3::date IS NULL OR ld.delivered_at >= $3)
  AND ($4::date IS NULL OR ld.delivered_at <= $4)
  AND ($5::text IS NULL OR l.skill_category = $5)
ORDER BY ld.delivered_at DESC;
```

### Query 6: Game Feedback

```sql
SELECT 
  gf.id,
  CONCAT(t.age_group, ' ', t.name) AS team_name,
  gf.created_at AS date,
  e.opponent,
  CONCAT(u.first_name, ' ', u.last_name) AS coach_name,
  gf.attacking_www,
  gf.attacking_ebi,
  gf.transition_atd_www,
  gf.transition_atd_ebi,
  gf.defending_www,
  gf.defending_ebi,
  gf.transition_dta_www,
  gf.transition_dta_ebi,
  gf.key_areas,
  gf.comments
FROM game_feedback gf
JOIN teams t ON gf.team_id = t.id
JOIN users u ON gf.coach_id = u.id
LEFT JOIN events e ON gf.game_id = e.id
WHERE 
  ($1::date IS NULL OR gf.created_at >= $1)
  AND ($2::date IS NULL OR gf.created_at <= $2)
  AND ($3::uuid IS NULL OR gf.team_id = $3)
  AND ($4::uuid IS NULL OR gf.coach_id = $4)
  AND ($5::text IS NULL OR t.age_group = $5)
ORDER BY gf.created_at DESC;
```

## Performance Optimization



### Database Indexes

Create indexes on commonly filtered columns:

```sql
-- Lesson deliveries
CREATE INDEX IF NOT EXISTS idx_lesson_deliveries_delivered_at 
  ON lesson_deliveries(delivered_at);
CREATE INDEX IF NOT EXISTS idx_lesson_deliveries_team_id 
  ON lesson_deliveries(team_id);
CREATE INDEX IF NOT EXISTS idx_lesson_deliveries_coach_id 
  ON lesson_deliveries(coach_id);

-- Lesson feedback
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_lesson_id 
  ON lesson_feedback(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_created_at 
  ON lesson_feedback(created_at);

-- Session feedback
CREATE INDEX IF NOT EXISTS idx_session_feedback_session_id 
  ON session_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_session_feedback_created_at 
  ON session_feedback(created_at);

-- Game feedback
CREATE INDEX IF NOT EXISTS idx_game_feedback_created_at 
  ON game_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_game_feedback_team_id 
  ON game_feedback(team_id);
CREATE INDEX IF NOT EXISTS idx_game_feedback_coach_id 
  ON game_feedback(coach_id);

-- Lessons
CREATE INDEX IF NOT EXISTS idx_lessons_age_group 
  ON lessons(age_group);
CREATE INDEX IF NOT EXISTS idx_lessons_skill_category 
  ON lessons(skill_category);

-- Teams
CREATE INDEX IF NOT EXISTS idx_teams_age_group 
  ON teams(age_group);
```

### Caching Strategy

1. **Filter Options**: Cache for 5 minutes (teams, coaches, skills rarely change)
2. **Report Data**: No caching (always fresh data)
3. **Pagination**: Load 100 rows initially, fetch more on demand

### Query Optimization

1. Use `LIMIT` to prevent loading too much data
2. Use parameterized queries to prevent SQL injection
3. Use `LEFT JOIN` for optional relationships
4. Use `COALESCE` for null handling
5. Use `COUNT(DISTINCT)` for accurate counts

## Routing

Add routes to `src/App.tsx`:

```tsx
{
  path: '/app/admin/reporting',
  element: <DesktopReporting />,
  meta: { requiresAuth: true, allowedRoles: ['admin'] }
},
{
  path: '/app/admin/reporting/lesson-deliveries',
  element: <LessonDeliveryReport />,
  meta: { requiresAuth: true, allowedRoles: ['admin'] }
},
{
  path: '/app/admin/reporting/lesson-effectiveness',
  element: <LessonEffectivenessReport />,
  meta: { requiresAuth: true, allowedRoles: ['admin'] }
},
{
  path: '/app/admin/reporting/session-ratings',
  element: <SessionRatingsReport />,
  meta: { requiresAuth: true, allowedRoles: ['admin'] }
},
{
  path: '/app/admin/reporting/coach-activity',
  element: <CoachActivityReport />,
  meta: { requiresAuth: true, allowedRoles: ['admin'] }
},
{
  path: '/app/admin/reporting/team-training',
  element: <TeamTrainingReport />,
  meta: { requiresAuth: true, allowedRoles: ['admin'] }
},
{
  path: '/app/admin/reporting/game-feedback',
  element: <GameFeedbackReport />,
  meta: { requiresAuth: true, allowedRoles: ['admin'] }
}
```

## Navigation

Update `DesktopLayout.tsx` admin navigation:

```tsx
const adminNavItems = [
  { path: '/app/admin/lessons', icon: BookOpen, label: 'Lesson Builder' },
  { path: '/app/admin/teams', icon: Users, label: 'Teams Management' },
  { path: '/app/admin/users', icon: UserCog, label: 'User Management' },
  { path: '/app/admin/reporting', icon: BarChart, label: 'Reporting' }, // Add this
  { path: '/app/admin/announcements', icon: Megaphone, label: 'Announcements' }
];
```

## Export Implementation

### CSV Export

```typescript
export function exportToCSV(options: ExportOptions): void {
  const { data, columns, filename } = options;
  
  // Create CSV header
  const header = columns.join(',');
  
  // Create CSV rows
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col];
      // Escape commas and quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',')
  );
  
  // Combine header and rows
  const csv = [header, ...rows].join('\n');
  
  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}
```

### PDF Export (Phase 3)

Use library like `jsPDF` or `pdfmake`:

```typescript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function exportToPDF(options: ExportOptions): Promise<void> {
  const { data, columns, filename } = options;
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(filename, 14, 20);
  
  // Add table
  doc.autoTable({
    head: [columns],
    body: data.map(row => columns.map(col => row[col])),
    startY: 30,
  });
  
  // Save
  doc.save(`${filename}.pdf`);
}
```

## Error Handling

### API Error Handling

```typescript
async getLessonDeliveries(filters: ReportFilters): Promise<LessonDeliveryRow[]> {
  try {
    const { data, error } = await this.supabase
      .from('lesson_deliveries')
      .select(/* ... */)
      ./* filters */;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching lesson deliveries:', error);
    throw new Error('Failed to load lesson deliveries. Please try again.');
  }
}
```

### UI Error States

```tsx
{error && (
  <div className="bg-red-50 border border-red-200 rounded p-4">
    <p className="text-red-800">{error}</p>
    <button onClick={retry} className="mt-2 text-red-600 underline">
      Try Again
    </button>
  </div>
)}
```

## Security

### RLS Policies

Reports use existing RLS policies on tables. No new policies needed.

### Route Protection

```tsx
// In App.tsx route meta
meta: { requiresAuth: true, allowedRoles: ['admin'] }
```

### Audit Logging

Log report access:

```typescript
async logReportAccess(reportName: string, userId: string): Promise<void> {
  await this.supabase
    .from('audit_log')
    .insert({
      action: 'report_viewed',
      resource: reportName,
      user_id: userId,
      timestamp: new Date().toISOString()
    });
}
```

## Testing Strategy

### Unit Tests

- Test filter logic
- Test data formatting
- Test CSV generation
- Test date range validation

### Integration Tests

- Test API queries with mock data
- Test filter combinations
- Test export functionality

### E2E Tests

- Test report navigation
- Test filter application
- Test export download
- Test drill-down modals

## Phase Implementation

### Phase 1: Essential Reports (Week 1-2)

**Week 1:**
- Set up routing and navigation
- Create ReportFilters component
- Create ReportTable component
- Create ExportButton component (CSV only)
- Implement Lesson Delivery Summary report
- Implement Coach Activity Summary report

**Week 2:**
- Implement Team Training History report
- Create DesktopReporting dashboard
- Add database indexes
- Test and refine

### Phase 2: Feedback Analysis (Week 3-4)

**Week 3:**
- Implement Lesson Effectiveness report
- Implement Session Ratings report
- Create DrillDownModal component

**Week 4:**
- Implement Game Feedback report
- Add drill-down functionality
- Test and refine

### Phase 3: Polish & Advanced (Week 5+)

- Add PDF export
- Optimize query performance
- Add advanced filters
- Mobile responsiveness improvements
- User feedback and iteration

## Success Metrics

- Report load time < 2 seconds
- Export generation < 5 seconds
- Zero SQL injection vulnerabilities
- 100% admin-only access enforcement
- Positive user feedback on usability

## Future Enhancements

1. **Scheduled Reports**: Email reports on schedule
2. **Custom Reports**: Allow admins to create custom queries
3. **Data Visualization**: Add charts and graphs
4. **Comparison Views**: Compare periods (this month vs last month)
5. **Benchmarking**: Compare teams or coaches
6. **Predictive Analytics**: Identify trends and patterns
