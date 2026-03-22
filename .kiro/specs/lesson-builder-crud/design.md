# Design Document: Lesson Builder CRUD

## Overview

The Lesson Builder CRUD feature transforms the existing mock-data UI into a fully functional administrative interface for creating, reading, updating, and managing training lessons. The design focuses on seamless integration with the Supabase database, efficient data fetching strategies, and robust form state management.

The system enables administrators to:
- Browse and filter existing lessons from the database
- Load complete lesson details including all four referenced sessions
- Create new lessons by selecting sessions from the database
- Update existing lessons with validation and error handling
- Duplicate lessons with modified names
- Manage lesson allocations to age groups

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LessonBuilder Component                   │
│  ┌────────────────┐              ┌────────────────────────┐ │
│  │  Lesson List   │              │    Lesson Form         │ │
│  │  - Filters     │◄────────────►│    - Metadata          │ │
│  │  - Search      │              │    - 4 Session Blocks  │ │
│  │  - Selection   │              │    - Allocations       │ │
│  └────────────────┘              └────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Client Layer                     │
│  - Query Builder                                             │
│  - RLS Policy Enforcement                                    │
│  - Real-time Subscriptions (future)                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────────┐  │
│  │ lessons  │───►│ sessions │    │ lesson_allocations   │  │
│  │          │    │          │    │                      │  │
│  │ session_ │    │ session_ │    │ lesson_id            │  │
│  │ 1_id     │    │ name     │    │ age_group            │  │
│  │ session_ │    │ session_ │    └──────────────────────┘  │
│  │ 2_id     │    │ type     │                              │
│  │ session_ │    │ duration │                              │
│  │ 3_id     │    │ ...      │                              │
│  │ session_ │    └──────────┘                              │
│  │ 4_id     │                                               │
│  └──────────┘                                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

The LessonBuilder component is organized into three main sections:

1. **Lesson List Panel** (Left, 1/3 width)
   - Search input
   - Age group and division filters
   - Scrollable list of lesson cards
   - "New Lesson" button

2. **Lesson Form Panel** (Right, 2/3 width)
   - Lesson metadata fields (title, age_group, division, skill_category)
   - Four session block selectors
   - Total duration display
   - Allocation toggles
   - Action buttons (Save, Save as New, Cancel)

3. **Modal Overlays**
   - Save as New modal (name input)
   - Error message toasts

## Components and Interfaces

### Data Models

Based on the database schema (migration 010), the following TypeScript interfaces will be used:

```typescript
// Database Session Model
interface DBSession {
  id: string;
  session_name: string;
  age_group: string;
  session_type: 'warmup' | 'skill_intro' | 'progressive' | 'game';
  duration: number;
  title: string;
  description: string | null;
  organisation: string;
  equipment: string[];
  coaching_points: string[];
  steps: string[];
  key_objectives: string[];
  pitch_layout_description: string;
  diagram_url: string | null;
  video_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Database Lesson Model
interface DBLesson {
  id: string;
  title: string;
  description: string | null;
  age_group: string;
  skill_category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  session_1_id: string;
  session_2_id: string;
  session_3_id: string;
  session_4_id: string;
  total_duration: number | null;
  objectives: string[];
  coaching_focus: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Lesson Allocation Model
interface LessonAllocation {
  id: string;
  lesson_id: string;
  age_group: string;
  created_at: string;
}

// UI Lesson Model (with allocations)
interface UILesson extends DBLesson {
  allocated_age_groups: string[];
}

// UI Session Block Model
interface SessionBlock {
  type: 'Warm-Up & Technical' | 'Skill Introduction' | 'Progressive Development' | 'Game Application';
  sessionId: string;
  sessionName: string;
  duration: number;
}

// Form State Model
interface LessonFormData {
  name: string;
  ageGroup: string;
  division: 'Community' | 'Academy';
  skills: string;
  blocks: SessionBlock[];
}
```

### Session Type Mapping

The database uses different session type values than the UI block types. The mapping is:

| UI Block Type              | Database session_type | Description                    |
|----------------------------|----------------------|--------------------------------|
| Warm-Up & Technical        | warmup               | Initial warm-up activities     |
| Skill Introduction         | skill_intro          | Introduce new skills           |
| Progressive Development    | progressive          | Build on introduced skills     |
| Game Application           | game                 | Apply skills in game context   |

This mapping must be applied when:
- Fetching sessions for dropdown population
- Validating session selections
- Displaying session information

### State Management

The component uses React useState hooks for local state management:

```typescript
// Lesson list state
const [lessons, setLessons] = useState<UILesson[]>([]);
const [loading, setLoading] = useState(true);
const [selectedLesson, setSelectedLesson] = useState<UILesson | null>(null);

// Form state
const [isCreatingNew, setIsCreatingNew] = useState(false);
const [formData, setFormData] = useState<LessonFormData>(initialFormData);

// Filter state
const [searchQuery, setSearchQuery] = useState('');
const [filterAge, setFilterAge] = useState('all');
const [filterDivision, setFilterDivision] = useState('all');

// Modal state
const [showSaveAsNew, setShowSaveAsNew] = useState(false);
const [newLessonName, setNewLessonName] = useState('');

// Error state
const [error, setError] = useState<string | null>(null);

// Session cache (for dropdown population)
const [sessionsByType, setSessionsByType] = useState<Record<string, DBSession[]>>({});
```

## Data Models

### Database Schema Reference

From migration 010_refactor_lessons_sessions.sql:

**sessions table:**
- Primary key: `id` (UUID)
- Unique constraint: `session_name`
- Key fields: `age_group`, `session_type`, `duration`, `title`
- Content arrays: `equipment`, `coaching_points`, `steps`, `key_objectives`

**lessons table:**
- Primary key: `id` (UUID)
- Foreign keys: `session_1_id`, `session_2_id`, `session_3_id`, `session_4_id` (all reference sessions.id with ON DELETE RESTRICT)
- Key fields: `title`, `age_group`, `skill_category`, `division`, `total_duration`
- Content arrays: `objectives`, `coaching_focus`

**lesson_allocations table:**
- Primary key: `id` (UUID)
- Foreign key: `lesson_id` (references lessons.id)
- Key fields: `age_group`
- Unique constraint: `(lesson_id, age_group)`

### Data Transformation

**Loading a Lesson:**
1. Fetch lesson record from `lessons` table
2. Fetch four session records using session_1_id through session_4_id
3. Fetch allocations from `lesson_allocations` table
4. Transform to UILesson format with allocated_age_groups array
5. Map session data to SessionBlock format for form display

**Saving a Lesson:**
1. Validate form data (all required fields present)
2. Calculate total_duration from selected sessions
3. Transform UILesson to DBLesson format
4. Insert or update lesson record
5. Handle allocation updates separately (if changed)

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, several redundancies were identified:

**Redundant Properties:**
- Properties 1.6, 3.6, and 6.2 all test the same calculation: total_duration = sum of four session durations
- Properties 2.2, 2.3, 2.4, 2.5 all test session type filtering but can be combined into one comprehensive property
- Properties 3.8, 4.6, and 9.4 all test error handling with form data preservation
- Properties 3.7 and 4.5 both test list refresh after successful operations
- Properties 7.1, 7.2, 7.3 all test required field validation and can be combined
- Properties 7.5 and 7.6 test button state based on validation and can be combined

**Consolidated Properties:**
- Single property for total duration calculation (covers all scenarios)
- Single property for session type filtering (covers all four block types)
- Single property for error handling with state preservation
- Single property for list refresh after mutations
- Single property for required field validation
- Single property for save button state based on validation

### Property 1: Total Duration Calculation

*For any* lesson with four selected sessions, the total_duration SHALL equal the sum of the four session durations, and this calculation SHALL be performed whenever sessions change, when loading a lesson, and when saving a lesson.

**Validates: Requirements 1.6, 3.6, 4.7, 6.2, 6.3, 6.4, 6.5**

### Property 2: Session Fetch Completeness

*For any* lesson record fetched from the database, the system SHALL fetch exactly four session records corresponding to session_1_id, session_2_id, session_3_id, and session_4_id.

**Validates: Requirements 1.2**

### Property 3: Data Transformation Completeness

*For any* lesson and session data retrieved from the database, the form state SHALL contain all required fields: title, age_group, division, skill_category, and four session blocks with session title and duration.

**Validates: Requirements 1.3, 1.4**

### Property 4: Session Type Filtering

*For any* session block (1 through 4), the available sessions SHALL be filtered by both age_group and session_type, where block 1 shows only 'warmup', block 2 shows only 'skill_intro', block 3 shows only 'progressive', and block 4 shows only 'game' sessions.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.7**

### Property 5: Age Group Filter Consistency

*For any* age group selection in the form, all fetched sessions SHALL match that age group, and changing the age group SHALL clear all session selections and refresh the available sessions.

**Validates: Requirements 2.1, 2.6, 8.4**

### Property 6: Required Field Validation

*For any* save or create operation, the system SHALL validate that title is not empty, age_group is selected, division is selected, skill_category is selected, and all four session blocks have sessions selected, and SHALL prevent the operation if any validation fails.

**Validates: Requirements 3.2, 3.3, 3.4, 4.1, 7.1, 7.2, 7.3, 7.4**

### Property 7: Save Button State

*For any* form state, the save button SHALL be disabled when validation errors exist and enabled when all validation passes.

**Validates: Requirements 7.5, 7.6**

### Property 8: Successful Creation Workflow

*For any* valid lesson creation, the system SHALL insert a new record with a generated UUID, set total_duration to the calculated value, refresh the lesson list, and display a success message.

**Validates: Requirements 3.5, 3.7**

### Property 9: Successful Update Workflow

*For any* valid lesson update, the system SHALL update the specified fields (title, age_group, division, skill_category, session_1_id, session_2_id, session_3_id, session_4_id, total_duration), set updated_at to current time, refresh the lesson list, and display a success message.

**Validates: Requirements 4.2, 4.3, 4.4, 4.5**

### Property 10: Error Handling with State Preservation

*For any* database operation failure (fetch, insert, update), the system SHALL display an appropriate error message, log the error to the console, and maintain the current form state without data loss.

**Validates: Requirements 1.5, 3.8, 4.6, 9.1, 9.2, 9.3, 9.4, 9.5**

### Property 11: Copy Operation Correctness

*For any* lesson copy operation with a valid non-empty name, the system SHALL insert a new record with a new UUID, new created_at timestamp, the provided title, and all other data copied from the source lesson, then refresh the list and select the new lesson.

**Validates: Requirements 5.2, 5.3, 5.4, 5.5**

### Property 12: Form Reset Behavior

*For any* "New Lesson" or "Cancel" action, the system SHALL clear all form fields, set default values, deselect any selected lesson, and reset the form mode.

**Validates: Requirements 8.1, 8.2**

### Property 13: Allocation Synchronization

*For any* lesson, the allocation data SHALL be fetched when loading the lesson list, preserved during lesson updates, updated immediately when toggled, and displayed correctly in both the lesson card badge and the allocation toggles.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6**

### Property 14: Validation Error Messaging

*For any* validation failure, the system SHALL display specific error messages for each missing or invalid field.

**Validates: Requirements 3.9, 7.7, 9.6, 9.7**

## Error Handling

### Error Categories

1. **Network Errors**
   - Connection failures
   - Timeout errors
   - DNS resolution failures
   - Display: "Network error. Please check your connection."

2. **Database Errors**
   - Query failures
   - Constraint violations
   - Foreign key violations
   - Display: Specific message based on operation (e.g., "Failed to load lesson data")

3. **Validation Errors**
   - Missing required fields
   - Invalid data formats
   - Business rule violations
   - Display: Inline error messages next to affected fields

4. **Authorization Errors**
   - Insufficient permissions (RLS policy violations)
   - Display: "You don't have permission to perform this action"

### Error Handling Strategy

**Fetch Errors:**
```typescript
try {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();
  
  if (error) throw error;
  
  // Process data
} catch (error) {
  console.error('Error fetching lesson:', error);
  setError('Failed to load lesson data');
  // Maintain current state
}
```

**Mutation Errors:**
```typescript
try {
  const { data, error } = await supabase
    .from('lessons')
    .insert(lessonData)
    .select()
    .single();
  
  if (error) throw error;
  
  // Success handling
  await fetchLessons(); // Refresh list
  setError(null);
  showSuccessMessage('Lesson created successfully');
} catch (error) {
  console.error('Error creating lesson:', error);
  setError('Failed to create lesson');
  // Preserve form data for retry
}
```

**Validation Errors:**
```typescript
const validateLesson = (formData: LessonFormData): ValidationErrors => {
  const errors: ValidationErrors = {};
  
  if (!formData.name.trim()) {
    errors.name = 'Lesson name is required';
  }
  
  if (!formData.ageGroup) {
    errors.ageGroup = 'Age group is required';
  }
  
  if (!formData.division) {
    errors.division = 'Division is required';
  }
  
  if (!formData.skills.trim()) {
    errors.skills = 'Skills focus is required';
  }
  
  formData.blocks.forEach((block, index) => {
    if (!block.sessionId) {
      errors[`block${index}`] = `Session ${index + 1} is required`;
    }
  });
  
  return errors;
};
```

### Error Recovery

1. **Automatic Retry**: Not implemented (user must manually retry)
2. **State Preservation**: Form data is always preserved on error
3. **Error Dismissal**: Errors auto-clear on successful operation or manual dismissal
4. **Logging**: All errors logged to console for debugging

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific UI interactions (button clicks, form submissions)
- Edge cases (empty dropdowns, no sessions available)
- Error conditions (network failures, validation failures)
- Integration points (Supabase client calls)

**Property-Based Tests** focus on:
- Universal properties across all inputs (total duration calculation)
- Data transformation correctness (database to form state)
- Validation rules (required fields, session type filtering)
- State management (form reset, error preservation)

### Property-Based Testing Configuration

**Library**: fast-check (for TypeScript/JavaScript)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: lesson-builder-crud, Property {number}: {property_text}`

**Example Property Test**:
```typescript
import fc from 'fast-check';

// Feature: lesson-builder-crud, Property 1: Total Duration Calculation
test('total duration equals sum of four session durations', () => {
  fc.assert(
    fc.property(
      fc.array(fc.integer({ min: 1, max: 120 }), { minLength: 4, maxLength: 4 }),
      (durations) => {
        const sessions = durations.map((duration, i) => ({
          id: `session-${i}`,
          duration,
          title: `Session ${i}`,
        }));
        
        const totalDuration = calculateTotalDuration(sessions);
        const expectedTotal = durations.reduce((sum, d) => sum + d, 0);
        
        expect(totalDuration).toBe(expectedTotal);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Examples

**Test: Load Lesson Data**
```typescript
test('loads lesson and fetches four sessions', async () => {
  const mockLesson = {
    id: 'lesson-1',
    title: 'Test Lesson',
    session_1_id: 'session-1',
    session_2_id: 'session-2',
    session_3_id: 'session-3',
    session_4_id: 'session-4',
  };
  
  const mockSessions = [
    { id: 'session-1', title: 'Warmup', duration: 10 },
    { id: 'session-2', title: 'Skill Intro', duration: 15 },
    { id: 'session-3', title: 'Progressive', duration: 20 },
    { id: 'session-4', title: 'Game', duration: 15 },
  ];
  
  // Mock Supabase calls
  supabase.from('lessons').select.mockResolvedValueOnce({ data: mockLesson, error: null });
  supabase.from('sessions').select.mockResolvedValueOnce({ data: mockSessions, error: null });
  
  // Render component and click lesson
  const { getByText } = render(<LessonBuilder />);
  fireEvent.click(getByText('Test Lesson'));
  
  // Verify all sessions fetched
  await waitFor(() => {
    expect(getByText('Warmup')).toBeInTheDocument();
    expect(getByText('Skill Intro')).toBeInTheDocument();
    expect(getByText('Progressive')).toBeInTheDocument();
    expect(getByText('Game')).toBeInTheDocument();
  });
});
```

**Test: Validation Prevents Save**
```typescript
test('prevents save when required fields are missing', async () => {
  const { getByText, getByLabelText } = render(<LessonBuilder />);
  
  // Click "New Lesson"
  fireEvent.click(getByText('New Lesson'));
  
  // Try to save without filling fields
  const saveButton = getByText('Create Lesson');
  fireEvent.click(saveButton);
  
  // Verify error messages displayed
  expect(getByText('Lesson name is required')).toBeInTheDocument();
  expect(getByText('Skills focus is required')).toBeInTheDocument();
  
  // Verify no database call made
  expect(supabase.from).not.toHaveBeenCalled();
});
```

**Test: Error Handling Preserves Form Data**
```typescript
test('preserves form data when save fails', async () => {
  const { getByText, getByLabelText } = render(<LessonBuilder />);
  
  // Fill form
  fireEvent.change(getByLabelText('Lesson Name'), { target: { value: 'Test Lesson' } });
  fireEvent.change(getByLabelText('Skills Focus'), { target: { value: 'Passing' } });
  
  // Mock database error
  supabase.from('lessons').insert.mockResolvedValueOnce({ data: null, error: new Error('DB Error') });
  
  // Try to save
  fireEvent.click(getByText('Create Lesson'));
  
  // Verify error message
  await waitFor(() => {
    expect(getByText('Failed to create lesson')).toBeInTheDocument();
  });
  
  // Verify form data preserved
  expect(getByLabelText('Lesson Name')).toHaveValue('Test Lesson');
  expect(getByLabelText('Skills Focus')).toHaveValue('Passing');
});
```

### Integration Testing

Integration tests will verify:
- Complete CRUD workflows (create → read → update → delete)
- Allocation management integration
- Session filtering and selection
- Form state transitions

### Manual Testing Checklist

- [ ] Load existing lesson and verify all data displays correctly
- [ ] Create new lesson with all four sessions
- [ ] Update existing lesson and verify changes persist
- [ ] Copy lesson with new name
- [ ] Test validation by attempting to save incomplete form
- [ ] Test error handling by simulating network failure
- [ ] Test allocation toggles
- [ ] Test age group filter changes
- [ ] Test session type filtering in dropdowns
- [ ] Test total duration calculation updates

## API Integration Patterns

### Supabase Query Patterns

**Fetch Lessons with Allocations:**
```typescript
const fetchLessons = async (): Promise<UILesson[]> => {
  // Fetch lessons
  const { data: lessonsData, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .order('age_group')
    .order('title');
  
  if (lessonsError) throw lessonsError;
  
  // Fetch allocations
  const { data: allocationsData, error: allocationsError } = await supabase
    .from('lesson_allocations')
    .select('lesson_id, age_group');
  
  if (allocationsError) {
    console.warn('Allocations table not found:', allocationsError);
    return lessonsData.map(lesson => ({ ...lesson, allocated_age_groups: [] }));
  }
  
  // Merge allocations into lessons
  return lessonsData.map(lesson => ({
    ...lesson,
    allocated_age_groups: allocationsData
      .filter(a => a.lesson_id === lesson.id)
      .map(a => a.age_group)
  }));
};
```

**Fetch Single Lesson with Sessions:**
```typescript
const fetchLessonWithSessions = async (lessonId: string) => {
  // Fetch lesson
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();
  
  if (lessonError) throw lessonError;
  
  // Fetch all four sessions
  const sessionIds = [
    lesson.session_1_id,
    lesson.session_2_id,
    lesson.session_3_id,
    lesson.session_4_id
  ];
  
  const { data: sessions, error: sessionsError } = await supabase
    .from('sessions')
    .select('id, title, duration, session_type')
    .in('id', sessionIds);
  
  if (sessionsError) throw sessionsError;
  
  // Map sessions to blocks
  const sessionMap = new Map(sessions.map(s => [s.id, s]));
  const blocks = [
    sessionMap.get(lesson.session_1_id),
    sessionMap.get(lesson.session_2_id),
    sessionMap.get(lesson.session_3_id),
    sessionMap.get(lesson.session_4_id)
  ];
  
  return { lesson, sessions: blocks };
};
```

**Fetch Sessions by Age Group and Type:**
```typescript
const fetchSessionsByTypeAndAge = async (
  ageGroup: string,
  sessionType: 'warmup' | 'skill_intro' | 'progressive' | 'game'
): Promise<DBSession[]> => {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, title, duration, session_type, age_group')
    .eq('age_group', ageGroup)
    .eq('session_type', sessionType)
    .order('title');
  
  if (error) throw error;
  
  return data;
};
```

**Create Lesson:**
```typescript
const createLesson = async (formData: LessonFormData): Promise<DBLesson> => {
  const lessonData = {
    title: formData.name,
    age_group: formData.ageGroup,
    division: formData.division,
    skill_category: formData.skills,
    session_1_id: formData.blocks[0].sessionId,
    session_2_id: formData.blocks[1].sessionId,
    session_3_id: formData.blocks[2].sessionId,
    session_4_id: formData.blocks[3].sessionId,
    total_duration: formData.blocks.reduce((sum, b) => sum + b.duration, 0),
    objectives: [],
    coaching_focus: []
  };
  
  const { data, error } = await supabase
    .from('lessons')
    .insert(lessonData)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};
```

**Update Lesson:**
```typescript
const updateLesson = async (
  lessonId: string,
  formData: LessonFormData
): Promise<DBLesson> => {
  const lessonData = {
    title: formData.name,
    age_group: formData.ageGroup,
    division: formData.division,
    skill_category: formData.skills,
    session_1_id: formData.blocks[0].sessionId,
    session_2_id: formData.blocks[1].sessionId,
    session_3_id: formData.blocks[2].sessionId,
    session_4_id: formData.blocks[3].sessionId,
    total_duration: formData.blocks.reduce((sum, b) => sum + b.duration, 0),
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('lessons')
    .update(lessonData)
    .eq('id', lessonId)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};
```

**Toggle Allocation:**
```typescript
const toggleAllocation = async (
  lessonId: string,
  ageGroup: string,
  isAllocated: boolean
): Promise<void> => {
  if (isAllocated) {
    // Remove allocation
    const { error } = await supabase
      .from('lesson_allocations')
      .delete()
      .eq('lesson_id', lessonId)
      .eq('age_group', ageGroup);
    
    if (error) throw error;
  } else {
    // Add allocation
    const { error } = await supabase
      .from('lesson_allocations')
      .insert({
        lesson_id: lessonId,
        age_group: ageGroup
      });
    
    if (error) throw error;
  }
};
```

### Data Flow Diagrams

**Loading a Lesson:**
```
User clicks lesson card
    ↓
fetchLessonWithSessions(lessonId)
    ↓
Fetch lesson record from DB
    ↓
Extract four session IDs
    ↓
Fetch four sessions in single query
    ↓
Map sessions to blocks
    ↓
Transform to form state
    ↓
Update UI
```

**Creating a Lesson:**
```
User fills form and clicks "Create"
    ↓
Validate form data
    ↓
Calculate total_duration
    ↓
Transform form state to DB format
    ↓
Insert lesson record
    ↓
Refresh lesson list
    ↓
Display success message
```

**Changing Age Group:**
```
User selects new age group
    ↓
Clear all session selections
    ↓
Fetch sessions for each type
    ↓
Update session dropdowns
    ↓
Recalculate total_duration (0)
```

## Implementation Notes

### Performance Considerations

1. **Session Caching**: Cache fetched sessions by age group and type to avoid redundant queries
2. **Debounced Search**: Debounce search input to reduce query frequency
3. **Optimistic Updates**: Update UI immediately, rollback on error
4. **Batch Queries**: Fetch all four sessions in a single query using `.in()`

### Security Considerations

1. **RLS Policies**: All queries respect Row Level Security policies
2. **Admin-Only Access**: Only users with role='admin' can create/update lessons
3. **Input Sanitization**: All user input is sanitized before database insertion
4. **SQL Injection Prevention**: Supabase client handles parameterization

### Accessibility Considerations

1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **Screen Reader Support**: Proper ARIA labels on form fields
3. **Error Announcements**: Validation errors announced to screen readers
4. **Focus Management**: Focus moves to error messages when validation fails

### Future Enhancements

1. **Drag-and-Drop**: Reorder session blocks via drag-and-drop
2. **Bulk Operations**: Select multiple lessons for batch allocation
3. **Version History**: Track lesson changes over time
4. **Preview Mode**: Preview lesson before saving
5. **Duplicate Detection**: Warn when creating similar lessons
6. **Session Preview**: View full session details in modal

## Conclusion

This design provides a comprehensive blueprint for implementing full CRUD functionality in the Lesson Builder. The architecture emphasizes data integrity, error resilience, and user experience while maintaining clean separation between UI state and database operations. The dual testing approach ensures both specific behaviors and universal properties are validated, providing confidence in the system's correctness.
