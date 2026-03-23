
# Implementation Plan: Lesson Builder CRUD

## Overview

This implementation plan transforms the existing mock-data Lesson Builder UI into a fully functional CRUD interface connected to the Supabase database. The implementation follows an incremental approach: first establishing data models and interfaces, then implementing data fetching, followed by form state management, and finally adding CRUD operations with validation and error handling.

## Tasks

- [x] 1. Set up TypeScript interfaces and data models
  - Create TypeScript interfaces for DBSession, DBLesson, LessonAllocation, UILesson, SessionBlock, and LessonFormData
  - Add session type mapping constants (UI block types to database session_type values)
  - Define validation error types and error message constants
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Implement lesson data fetching with sessions
  - [x] 2.1 Create fetchLessonWithSessions function
    - Fetch lesson record by ID from lessons table
    - Extract four session IDs (session_1_id through session_4_id)
    - Fetch all four sessions in single query using .in() operator
    - Map sessions to SessionBlock format for form display
    - Handle errors and return structured data
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ]* 2.2 Write property test for session fetch completeness
    - **Property 2: Session Fetch Completeness**
    - **Validates: Requirements 1.2**
    - Test that exactly four sessions are fetched for any valid lesson
  
  - [ ]* 2.3 Write property test for data transformation
    - **Property 3: Data Transformation Completeness**
    - **Validates: Requirements 1.3, 1.4**
    - Test that all required fields are populated in form state

- [x] 3. Implement session fetching with filtering
  - [x] 3.1 Create fetchSessionsByTypeAndAge function
    - Query sessions table filtered by age_group and session_type
    - Order results by title for consistent display
    - Return array of DBSession objects
    - Handle empty results gracefully
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7_
  
  - [ ]* 3.2 Write property test for session type filtering
    - **Property 4: Session Type Filtering**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.7**
    - Test that each block type shows only correct session_type
  
  - [ ]* 3.3 Write property test for age group filtering
    - **Property 5: Age Group Filter Consistency**
    - **Validates: Requirements 2.1, 2.6, 8.4**
    - Test that sessions match selected age group and selections clear on age change

- [x] 4. Add useEffect hook for lesson loading
  - Implement useEffect that triggers when selectedLesson changes
  - Call fetchLessonWithSessions when lesson is selected
  - Transform fetched data to formData state
  - Calculate and display total_duration
  - Handle loading states and errors
  - _Requirements: 1.1, 1.3, 1.4, 1.6_

- [x] 5. Implement session dropdown population
  - [x] 5.1 Create getFilteredSessionsForBlock function
    - Map UI block type to database session_type
    - Call fetchSessionsByTypeAndAge with current age group and mapped type
    - Return filtered sessions for dropdown display
    - Display "No sessions available" when results are empty
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_
  
  - [x] 5.2 Update session block dropdowns to use real data
    - Replace mockAvailableSessions with fetchSessionsByTypeAndAge calls
    - Display session title and duration in dropdown options
    - Update handleSelectSession to work with real session data
    - _Requirements: 2.7, 2.8_

- [x] 6. Implement total duration calculation
  - [x] 6.1 Create calculateTotalDuration function
    - Sum durations from all four session blocks
    - Treat empty blocks as zero duration
    - Return calculated total
    - _Requirements: 1.6, 6.1, 6.2, 6.5_
  
  - [x] 6.2 Add duration recalculation on session changes
    - Call calculateTotalDuration whenever a session is selected or changed
    - Update formData.totalDuration state
    - Display updated value in UI
    - _Requirements: 4.7, 6.3_
  
  - [ ]* 6.3 Write property test for duration calculation
    - **Property 1: Total Duration Calculation**
    - **Validates: Requirements 1.6, 3.6, 4.7, 6.2, 6.3, 6.4, 6.5**
    - Test that total equals sum of four session durations in all scenarios

- [ ] 7. Checkpoint - Ensure data fetching works correctly
  - Verify lessons load from database
  - Verify sessions populate dropdowns correctly
  - Verify total duration calculates accurately
  - Ensure all tests pass, ask the user if questions arise

- [x] 8. Implement form validation
  - [x] 8.1 Create validateLesson function
    - Check title is not empty
    - Check age_group, division, and skill_category are selected
    - Check all four session blocks have sessions selected
    - Return ValidationErrors object with specific messages
    - _Requirements: 3.2, 3.3, 3.4, 4.1, 7.1, 7.2, 7.3, 7.4, 7.7_
  
  - [x] 8.2 Add validation state management
    - Create validationErrors state
    - Run validation on form changes
    - Display inline error messages for each field
    - _Requirements: 3.9, 7.4, 7.7_
  
  - [ ]* 8.3 Write property test for required field validation
    - **Property 6: Required Field Validation**
    - **Validates: Requirements 3.2, 3.3, 3.4, 4.1, 7.1, 7.2, 7.3, 7.4**
    - Test that validation catches all missing required fields
  
  - [ ]* 8.4 Write property test for save button state
    - **Property 7: Save Button State**
    - **Validates: Requirements 7.5, 7.6**
    - Test that button is disabled when validation fails and enabled when it passes

- [x] 9. Implement create lesson functionality
  - [x] 9.1 Create createLesson function
    - Transform formData to DBLesson format
    - Calculate total_duration from session blocks
    - Insert new lesson record with generated UUID
    - Return created lesson data
    - Handle database errors
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [x] 9.2 Update handleSave for creation mode
    - Check if isCreatingNew is true
    - Run validation before save
    - Call createLesson if validation passes
    - Refresh lesson list after successful creation
    - Display success message
    - Handle errors and preserve form data
    - _Requirements: 3.4, 3.5, 3.7, 3.8, 3.9_
  
  - [ ]* 9.3 Write property test for successful creation workflow
    - **Property 8: Successful Creation Workflow**
    - **Validates: Requirements 3.5, 3.7**
    - Test that creation inserts record, refreshes list, and shows success message
  
  - [ ]* 9.4 Write unit tests for create validation
    - Test that validation prevents save when fields are missing
    - Test that specific error messages are displayed
    - Test that form data is preserved on validation failure

- [x] 10. Implement update lesson functionality
  - [x] 10.1 Create updateLesson function
    - Transform formData to update payload
    - Include updated_at timestamp
    - Update lesson record by ID
    - Return updated lesson data
    - Handle database errors
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [x] 10.2 Update handleSave for edit mode
    - Check if selectedLesson exists
    - Run validation before save
    - Call updateLesson if validation passes
    - Refresh lesson list after successful update
    - Display success message
    - Handle errors and preserve form data
    - _Requirements: 4.1, 4.2, 4.5, 4.6_
  
  - [ ]* 10.3 Write property test for successful update workflow
    - **Property 9: Successful Update Workflow**
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.5**
    - Test that update modifies record, sets updated_at, refreshes list, and shows success
  
  - [ ]* 10.4 Write unit tests for update scenarios
    - Test that existing lesson data loads correctly
    - Test that changes are saved to database
    - Test that updated_at timestamp is set

- [x] 11. Implement copy lesson functionality
  - [x] 11.1 Create copyLesson function
    - Accept new lesson name and source lesson data
    - Generate new UUID for copied lesson
    - Set created_at to current timestamp
    - Insert new record with copied data and new title
    - Return created lesson data
    - _Requirements: 5.2, 5.3, 5.4_
  
  - [x] 11.2 Implement "Save as New" modal and handler
    - Show modal when "Save as New" button clicked
    - Validate new name is not empty
    - Call copyLesson with new name and current form data
    - Refresh lesson list and select new lesson
    - Display success message
    - Handle cancellation and errors
    - _Requirements: 5.1, 5.2, 5.5, 5.6, 5.7_
  
  - [ ]* 11.3 Write property test for copy operation
    - **Property 11: Copy Operation Correctness**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5**
    - Test that copy creates new record with new UUID, new created_at, and provided title

- [ ] 12. Checkpoint - Ensure CRUD operations work correctly
  - Test creating a new lesson
  - Test updating an existing lesson
  - Test copying a lesson
  - Verify validation prevents invalid saves
  - Ensure all tests pass, ask the user if questions arise

- [x] 13. Implement form state management
  - [x] 13.1 Implement handleCreateNew function
    - Clear all form fields
    - Set default values for age_group and division
    - Set isCreatingNew to true
    - Clear selectedLesson
    - _Requirements: 8.1_
  
  - [x] 13.2 Implement handleCancel function
    - Clear all form fields
    - Set isCreatingNew to false
    - Clear selectedLesson
    - _Requirements: 8.2_
  
  - [x] 13.3 Implement age group change handler
    - Clear all session block selections when age group changes
    - Refresh available sessions for all blocks
    - Recalculate total_duration (will be 0)
    - _Requirements: 2.6, 8.4_
  
  - [ ]* 13.4 Write property test for form reset behavior
    - **Property 12: Form Reset Behavior**
    - **Validates: Requirements 8.1, 8.2**
    - Test that form clears and resets on "New Lesson" and "Cancel" actions

- [ ] 14. Implement error handling
  - [ ] 14.1 Add error state and display component
    - Create error state variable
    - Create error message display component (toast or banner)
    - Add dismiss functionality
    - Auto-clear errors on successful operations
    - _Requirements: 9.6, 9.7_
  
  - [ ] 14.2 Add error handling to all database operations
    - Wrap all Supabase calls in try-catch blocks
    - Log errors to console for debugging
    - Set user-friendly error messages
    - Preserve form state on errors
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 14.3 Write property test for error handling
    - **Property 10: Error Handling with State Preservation**
    - **Validates: Requirements 1.5, 3.8, 4.6, 9.1, 9.2, 9.3, 9.4, 9.5**
    - Test that errors display messages, log to console, and preserve form state
  
  - [ ]* 14.4 Write unit tests for error scenarios
    - Test network error handling
    - Test database error handling
    - Test validation error display
    - Test error dismissal

- [ ] 15. Implement allocation management integration
  - [ ] 15.1 Update fetchLessons to include allocations
    - Fetch lesson_allocations data
    - Merge allocations into lesson objects as allocated_age_groups array
    - Handle gracefully if allocations table doesn't exist
    - _Requirements: 10.3, 10.4_
  
  - [ ] 15.2 Ensure handleToggleAllocation works with updated lessons
    - Verify allocation toggles update database
    - Refresh lesson list after allocation changes
    - Update selectedLesson with new allocation data
    - Display allocation count badges correctly
    - _Requirements: 10.1, 10.2, 10.5, 10.6_
  
  - [ ]* 15.3 Write property test for allocation synchronization
    - **Property 13: Allocation Synchronization**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6**
    - Test that allocations are fetched, preserved, updated, and displayed correctly

- [ ] 16. Add validation error messaging
  - [ ] 16.1 Create error message display for each form field
    - Add error message elements below each required field
    - Display specific validation errors from validateLesson
    - Style error messages for visibility
    - _Requirements: 3.9, 7.7, 9.6, 9.7_
  
  - [ ]* 16.2 Write property test for validation error messaging
    - **Property 14: Validation Error Messaging**
    - **Validates: Requirements 3.9, 7.7, 9.6, 9.7**
    - Test that specific error messages are displayed for each validation failure

- [x] 17. Final integration and polish
  - [x] 17.1 Remove all mock data references
    - Remove mockAvailableSessions constant
    - Ensure all data comes from database
    - Remove any hardcoded test data
  
  - [x] 17.2 Add loading states
    - Show spinner while fetching lessons
    - Show loading indicator while fetching sessions
    - Disable form during save operations
  
  - [x] 17.3 Optimize performance
    - Implement session caching by age group and type
    - Add debouncing to search input
    - Batch session queries where possible
  
  - [ ]* 17.4 Write integration tests
    - Test complete create workflow
    - Test complete update workflow
    - Test complete copy workflow
    - Test allocation management workflow

- [ ] 18. Final checkpoint - Complete system verification
  - Verify all CRUD operations work end-to-end
  - Verify all validation rules are enforced
  - Verify all error scenarios are handled gracefully
  - Verify allocations integrate correctly
  - Run all property-based tests and unit tests
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation uses TypeScript with React and Supabase for database operations
- All database queries respect Row Level Security (RLS) policies
- Form state is preserved on errors to allow user retry without data loss
