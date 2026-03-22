# Requirements Document

## Introduction

The Lesson Builder CRUD feature enables administrators to create, read, update, and manage complete training lessons by selecting and combining four sessions from the database. Currently, the Lesson Builder page has a complete UI but uses mock data and doesn't persist changes to the database. This feature will connect the UI to the database, enabling full CRUD operations for lessons.

## Glossary

- **Lesson_Builder**: The administrative interface for creating and editing training lessons
- **Lesson**: A complete training plan consisting of four sessions, metadata, and allocation settings
- **Session**: A standalone, reusable training activity with a specific type (warmup, skill_intro, progressive, game)
- **Session_Block**: One of four required components in a lesson, each mapped to a specific session type
- **Lesson_Form**: The UI form containing lesson metadata and four session block selectors
- **Lesson_List**: The left panel displaying all available lessons with filters
- **Allocation**: Assignment of a lesson to specific age groups for coach access
- **Database**: The Supabase PostgreSQL database containing lessons and sessions tables

## Requirements

### Requirement 1: Load Lesson Data

**User Story:** As an administrator, I want to view complete lesson details when I select a lesson, so that I can review and edit existing lessons.

#### Acceptance Criteria

1. WHEN an administrator clicks a lesson card in the Lesson_List, THE Lesson_Builder SHALL fetch the complete lesson record from the Database
2. WHEN the lesson record is fetched, THE Lesson_Builder SHALL fetch all four sessions referenced by session_1_id, session_2_id, session_3_id, and session_4_id
3. WHEN all data is retrieved, THE Lesson_Builder SHALL populate the Lesson_Form with the lesson title, age_group, division, skill_category, and four session details
4. WHEN the lesson data includes session references, THE Lesson_Builder SHALL display each session's title and duration in the corresponding Session_Block
5. IF the lesson fetch fails, THEN THE Lesson_Builder SHALL display an error message and maintain the current form state
6. WHEN the lesson data is loaded, THE Lesson_Builder SHALL calculate and display the total_duration as the sum of all four session durations

### Requirement 2: Fetch Real Sessions

**User Story:** As an administrator, I want to select from actual sessions in the database, so that I can build lessons with real training content.

#### Acceptance Criteria

1. WHEN the Lesson_Form is displayed, THE Lesson_Builder SHALL fetch sessions from the Database filtered by the selected age_group
2. WHEN populating Session_Block 1, THE Lesson_Builder SHALL display only sessions where session_type equals 'warmup'
3. WHEN populating Session_Block 2, THE Lesson_Builder SHALL display only sessions where session_type equals 'skill_intro'
4. WHEN populating Session_Block 3, THE Lesson_Builder SHALL display only sessions where session_type equals 'progressive'
5. WHEN populating Session_Block 4, THE Lesson_Builder SHALL display only sessions where session_type equals 'game'
6. WHEN the age_group changes in the Lesson_Form, THE Lesson_Builder SHALL refresh the available sessions for all Session_Blocks
7. WHEN displaying sessions in a dropdown, THE Lesson_Builder SHALL show the session title and duration
8. IF no sessions match the filter criteria, THEN THE Lesson_Builder SHALL display "No sessions available" in the dropdown

### Requirement 3: Create New Lessons

**User Story:** As an administrator, I want to create new lessons from scratch, so that I can expand the lesson library.

#### Acceptance Criteria

1. WHEN an administrator clicks the "New Lesson" button, THE Lesson_Builder SHALL clear the Lesson_Form and set the mode to creation
2. WHEN creating a new lesson, THE Lesson_Builder SHALL require the administrator to provide title, age_group, division, and skill_category
3. WHEN creating a new lesson, THE Lesson_Builder SHALL require the administrator to select exactly four sessions (one per Session_Block)
4. WHEN the administrator clicks "Create Lesson", THE Lesson_Builder SHALL validate that all required fields contain values
5. IF validation passes, THEN THE Lesson_Builder SHALL insert a new lesson record into the Database with a generated UUID
6. WHEN inserting the lesson, THE Lesson_Builder SHALL set total_duration to the sum of the four selected session durations
7. WHEN the lesson is created successfully, THE Lesson_Builder SHALL refresh the Lesson_List and display a success message
8. IF the database insert fails, THEN THE Lesson_Builder SHALL display an error message and maintain the form data
9. IF validation fails, THEN THE Lesson_Builder SHALL display inline error messages for missing required fields

### Requirement 4: Update Existing Lessons

**User Story:** As an administrator, I want to modify existing lessons, so that I can improve and refine training content.

#### Acceptance Criteria

1. WHEN an administrator modifies a loaded lesson and clicks "Save Changes", THE Lesson_Builder SHALL validate all required fields
2. IF validation passes, THEN THE Lesson_Builder SHALL update the lesson record in the Database with the modified values
3. WHEN updating the lesson, THE Lesson_Builder SHALL update title, age_group, division, skill_category, session_1_id, session_2_id, session_3_id, session_4_id, and total_duration
4. WHEN updating the lesson, THE Lesson_Builder SHALL set the updated_at timestamp to the current time
5. WHEN the update succeeds, THE Lesson_Builder SHALL refresh the Lesson_List and display a success message
6. IF the database update fails, THEN THE Lesson_Builder SHALL display an error message and maintain the form data
7. WHEN a session selection changes, THE Lesson_Builder SHALL recalculate and update the total_duration immediately

### Requirement 5: Copy Lessons

**User Story:** As an administrator, I want to duplicate an existing lesson with a new name, so that I can create variations without starting from scratch.

#### Acceptance Criteria

1. WHEN an administrator clicks "Save as New" on a loaded lesson, THE Lesson_Builder SHALL display a modal prompting for a new lesson name
2. WHEN the administrator enters a name and confirms, THE Lesson_Builder SHALL validate that the name is not empty
3. IF validation passes, THEN THE Lesson_Builder SHALL insert a new lesson record with the current form data and the new title
4. WHEN inserting the copied lesson, THE Lesson_Builder SHALL generate a new UUID and set created_at to the current time
5. WHEN the copy succeeds, THE Lesson_Builder SHALL refresh the Lesson_List, select the new lesson, and display a success message
6. IF the administrator cancels the modal, THEN THE Lesson_Builder SHALL close the modal without creating a lesson
7. IF the database insert fails, THEN THE Lesson_Builder SHALL display an error message and keep the modal open

### Requirement 6: Calculate Duration

**User Story:** As an administrator, I want to see the total lesson duration automatically calculated, so that I can ensure lessons fit within time constraints.

#### Acceptance Criteria

1. WHEN a session is selected in any Session_Block, THE Lesson_Builder SHALL retrieve the session duration from the Database
2. WHEN all four sessions are selected, THE Lesson_Builder SHALL calculate total_duration as the sum of the four session durations
3. WHEN the total_duration changes, THE Lesson_Builder SHALL display the updated value in the Lesson_Form
4. WHEN saving or updating a lesson, THE Lesson_Builder SHALL store the calculated total_duration in the Database
5. IF a Session_Block has no session selected, THEN THE Lesson_Builder SHALL treat its duration as zero in the calculation

### Requirement 7: Form Validation

**User Story:** As an administrator, I want to receive clear feedback about missing or invalid data, so that I can correct errors before saving.

#### Acceptance Criteria

1. WHEN the administrator attempts to save a lesson, THE Lesson_Builder SHALL validate that the title field is not empty
2. WHEN the administrator attempts to save a lesson, THE Lesson_Builder SHALL validate that age_group, division, and skill_category are selected
3. WHEN the administrator attempts to save a lesson, THE Lesson_Builder SHALL validate that all four Session_Blocks have sessions selected
4. IF any validation fails, THEN THE Lesson_Builder SHALL prevent the save operation and display error messages
5. WHEN validation errors exist, THE Lesson_Builder SHALL disable the save button
6. WHEN all validation errors are resolved, THE Lesson_Builder SHALL enable the save button
7. WHEN displaying validation errors, THE Lesson_Builder SHALL show specific messages for each missing field

### Requirement 8: Form State Management

**User Story:** As an administrator, I want the form to respond correctly to my actions, so that I have a smooth editing experience.

#### Acceptance Criteria

1. WHEN the administrator clicks "New Lesson", THE Lesson_Builder SHALL clear all Lesson_Form fields and set default values
2. WHEN the administrator clicks "Cancel", THE Lesson_Builder SHALL clear the Lesson_Form and deselect any selected lesson
3. WHEN the administrator selects a different lesson while editing, THE Lesson_Builder SHALL load the new lesson data without saving changes
4. WHEN the age_group changes in the Lesson_Form, THE Lesson_Builder SHALL clear all Session_Block selections
5. WHEN a Session_Block has a selected session, THE Lesson_Builder SHALL display a "Change" button to allow reselection
6. WHEN the administrator clicks "Change" on a Session_Block, THE Lesson_Builder SHALL clear that session selection and show the dropdown

### Requirement 9: Error Handling

**User Story:** As an administrator, I want clear error messages when operations fail, so that I can understand and resolve issues.

#### Acceptance Criteria

1. IF a database query fails, THEN THE Lesson_Builder SHALL log the error to the console and display a user-friendly message
2. IF a lesson fetch fails, THEN THE Lesson_Builder SHALL display "Failed to load lesson data" and maintain the current state
3. IF a session fetch fails, THEN THE Lesson_Builder SHALL display "Failed to load sessions" in the affected Session_Block
4. IF a save operation fails, THEN THE Lesson_Builder SHALL display "Failed to save lesson" and maintain the form data
5. IF a network error occurs, THEN THE Lesson_Builder SHALL display "Network error. Please check your connection."
6. WHEN an error message is displayed, THE Lesson_Builder SHALL provide a way to dismiss the message
7. WHEN an error is resolved, THE Lesson_Builder SHALL clear the error message automatically

### Requirement 10: Integration with Allocation System

**User Story:** As an administrator, I want lesson allocations to work correctly after creating or updating lessons, so that coaches see the appropriate lessons.

#### Acceptance Criteria

1. WHEN a new lesson is created, THE Lesson_Builder SHALL allow the administrator to set allocations immediately
2. WHEN a lesson is updated, THE Lesson_Builder SHALL preserve existing allocations
3. WHEN the Lesson_List is refreshed after a save operation, THE Lesson_Builder SHALL fetch updated allocation data
4. WHEN displaying a lesson card, THE Lesson_Builder SHALL show the current allocation count badge
5. WHEN the administrator toggles an allocation, THE Lesson_Builder SHALL update the Database and refresh the display
6. IF the selected lesson is updated, THEN THE Lesson_Builder SHALL refresh the allocation display in the Lesson_Form
