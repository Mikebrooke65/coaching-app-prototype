# Implementation Plan: Team Messaging

## Overview

Replace the placeholder mock data in the mobile Messaging and desktop DesktopMessaging pages with a fully functional real-time messaging system built on Supabase. Implementation proceeds bottom-up: database schema → TypeScript types → API service → React context → shared UI components → page integration → event reminder integration → search and archiving.

## Tasks

- [x] 1. Database schema and types
  - [x] 1.1 Create database migration `supabase/migrations/033_team_messaging.sql`
    - Create `messages` table with id, sender_id, team_id, parent_message_id, title, body, created_at
    - Create `message_recipients` table with id, message_id, targeting_type (CHECK constraint), recipient_user_ids (uuid[]), notification_pending (default true)
    - Create `message_read_receipts` table with id, message_id, user_id, read_at, UNIQUE(message_id, user_id)
    - Create `message_reactions` table with id, message_id, user_id, emoji, created_at, UNIQUE(message_id, user_id, emoji)
    - Create `message_archives` table with id, message_id, user_id, archived_at, UNIQUE(message_id, user_id)
    - Create `device_tokens` table with id, user_id, device_token, platform (CHECK constraint), created_at, UNIQUE(user_id, device_token)
    - Create all foreign key constraints for referential integrity
    - Create `trigger_sender_auto_read` trigger on messages INSERT to auto-create read receipt for sender
    - Create all indexes: parent_message_id, team_id+created_at, sender_id, GIN on recipient_user_ids, etc.
    - Create RLS policies for all tables per design document
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2, 2.3, 2.4, 2.5, 16.1, 16.2, 16.4_

  - [ ]* 1.2 Write property tests for database constraints and triggers
    - **Property 1: Message creation stores all required fields**
    - **Property 2: Sender auto-read receipt**
    - **Property 3: Foreign key integrity rejects invalid references**
    - **Property 32: Notification pending flag defaults to true**
    - **Property 33: Multiple device tokens per user**
    - **Validates: Requirements 1.1, 1.2, 1.6, 1.7, 16.2, 16.4**

  - [x] 1.3 Add TypeScript interfaces to `src/types/database.ts`
    - Add Message, MessageRecipient, MessageReadReceipt, MessageReaction, MessageArchive, DeviceToken interfaces
    - Add MessageTargetingType union type
    - Add Thread, ThreadDetail, ReactionGroup, CreateMessagePayload, CreateReplyPayload, SearchResult composed view types
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. API service layer
  - [x] 2.1 Create `src/lib/messaging-api.ts` extending ApiClient
    - Implement `getThreads(userId, teamIds)` — fetch active threads with sender info, read counts, reactions, sorted by last activity
    - Implement `getThreadDetail(messageId)` — fetch top-level message + all replies with sender info and reactions
    - Implement `createMessage(payload)` — insert message + message_recipients with resolved recipient_user_ids
    - Implement `createReply(parentId, payload)` — insert reply with parent_message_id set to top-level message ID
    - Implement `resolveRecipients(targetType, teamId, individualUserId?)` — resolve recipient user IDs based on targeting type
    - _Requirements: 3.3, 3.4, 3.5, 3.7, 4.1, 4.2, 6.3_

  - [ ]* 2.2 Write property tests for recipient resolution
    - **Property 8: Recipient resolution correctness**
    - **Validates: Requirements 3.3, 3.4, 3.5**

  - [x] 2.3 Implement read receipt and unread count methods in `messaging-api.ts`
    - Implement `markAsRead(messageId, userId)` with retry logic (3 retries, exponential backoff 1s/2s/4s)
    - Implement `getReadReceipts(messageId)` — fetch all read receipts for a message
    - Implement `getUnreadCount(userId)` — count messages where user is in recipient set and has no read receipt
    - _Requirements: 7.1, 7.2, 8.1, 8.2, 15.3_

  - [ ]* 2.4 Write property tests for read tracking
    - **Property 6: Read receipt self-only constraint**
    - **Property 20: Read count indicator accuracy**
    - **Property 22: Unread badge accuracy**
    - **Validates: Requirements 2.3, 7.2, 8.1, 8.2, 8.3**

  - [x] 2.5 Implement reaction methods in `messaging-api.ts`
    - Implement `toggleReaction(messageId, userId, emoji)` — insert or delete reaction (handle unique constraint as toggle)
    - Implement `getReactions(messageId)` — fetch reactions grouped by emoji with count and user_ids
    - _Requirements: 9.2, 9.3, 9.4_

  - [ ]* 2.6 Write property tests for reactions
    - **Property 24: Reaction toggle is idempotent round-trip**
    - **Property 25: Reaction grouping correctness**
    - **Validates: Requirements 9.3, 9.4**

  - [x] 2.7 Implement archiving methods in `messaging-api.ts`
    - Implement `archiveThread(messageId, userId)` — insert into message_archives
    - Implement `unarchiveThread(messageId, userId)` — delete from message_archives
    - Implement `getArchivedThreads(userId)` — fetch archived threads for user
    - _Requirements: 12.2, 12.4, 12.5_

  - [ ]* 2.8 Write property tests for archiving
    - **Property 28: Archive round-trip**
    - **Validates: Requirements 12.2, 12.5**

  - [x] 2.9 Implement search method in `messaging-api.ts`
    - Implement `searchMessages(query, userId)` — filter threads by title, body, or sender name, include both active and archived with status label
    - _Requirements: 14.2, 14.3_

  - [ ]* 2.10 Write property tests for search
    - **Property 30: Search returns matching results across active and archived**
    - **Validates: Requirements 14.2, 14.3**

  - [x] 2.11 Implement Realtime subscription methods in `messaging-api.ts`
    - Implement `subscribeToMessages(teamIds, callback)` — subscribe to messages table inserts filtered by team
    - Implement `subscribeToReadReceipts(messageIds, callback)` — subscribe to read receipt inserts
    - Implement `subscribeToReactions(messageIds, callback)` — subscribe to reaction inserts/deletes
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 3. Checkpoint - Database and API layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Messaging context and state management
  - [x] 4.1 Create `src/contexts/MessagingContext.tsx`
    - Provide `threads`, `archivedThreads`, `unreadCount`, `selectedThread` state
    - Expose `sendMessage()`, `sendReply()`, `markAsRead()`, `toggleReaction()`, `archiveThread()`, `unarchiveThread()` actions
    - Set up Supabase Realtime subscriptions on mount, clean up on unmount
    - Implement polling fallback: on CHANNEL_ERROR or TIMED_OUT, start 30-second polling interval; stop when Realtime reconnects
    - Optimistically update UI state on actions with rollback on failure
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 15.2_

  - [ ]* 4.2 Write property tests for context state
    - **Property 23: Reading a message decrements unread count**
    - **Property 11: Thread ordering by last activity**
    - **Validates: Requirements 4.2, 8.5**

- [x] 5. Shared UI components
  - [x] 5.1 Create `src/components/messaging/MessageCard.tsx`
    - Display title (bold if unread, normal if read), truncated body (2 lines max), sender name, formatted date
    - Display type icon: User icon for individual, Users icon for group messages (using lucide-react)
    - Display read count indicator "X/Y" for top-level messages
    - Display reaction chips grouped by emoji with count
    - Display reaction button to open ReactionPicker
    - Use brand colour Dark Grey #545859 with 20% shading rgba(84, 88, 89, 0.2) for page background accent
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.2, 9.3_

  - [ ]* 5.2 Write property tests for MessageCard display logic
    - **Property 13: Message card content completeness**
    - **Property 14: Read status determines display style**
    - **Property 15: Message type icon correctness**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

  - [x] 5.3 Create `src/components/messaging/ComposeForm.tsx`
    - Targeting type selector: individual, whole_team, management_team, club_admin
    - Team selector dropdown when user belongs to multiple teams
    - Searchable user list when individual targeting is selected
    - Title input and body textarea with validation (reject empty/whitespace-only)
    - Inline error messages for validation failures
    - Retain composed text on send failure for retry
    - _Requirements: 3.1, 3.2, 3.6, 3.8, 15.1, 15.4_

  - [ ]* 5.4 Write property tests for compose form validation
    - **Property 9: Compose form validation rejects empty input**
    - **Validates: Requirements 3.6, 6.5, 15.4**

  - [x] 5.5 Create `src/components/messaging/ThreadView.tsx`
    - Render top-level message with full body
    - Render replies indented under parent message
    - Include ReplyForm at the bottom with pre-populated recipient display
    - Mark messages as read when viewed (call markAsRead via context)
    - _Requirements: 6.1, 6.2, 7.1_

  - [x] 5.6 Create `src/components/messaging/ReplyForm.tsx`
    - Body textarea only (title inherited from parent)
    - Display pre-populated recipient set from parent message
    - Validate body is not empty/whitespace before allowing submission
    - _Requirements: 6.2, 6.5_

  - [ ]* 5.7 Write property tests for reply form
    - **Property 16: Reply stores parent reference**
    - **Property 17: Reply updates thread last activity**
    - **Property 18: Reply form inherits recipient set**
    - **Validates: Requirements 6.2, 6.3, 6.4**

  - [x] 5.8 Create `src/components/messaging/ReadDetailModal.tsx`
    - List all recipients by name
    - Green background highlight for recipients with read receipts
    - Sort readers before non-readers
    - _Requirements: 7.4, 7.5, 7.6_

  - [ ]* 5.9 Write property tests for read detail modal
    - **Property 21: Read detail modal ordering**
    - **Validates: Requirements 7.5, 7.6**

  - [x] 5.10 Create `src/components/messaging/ReactionPicker.tsx`
    - Emoji picker popover with standard emoji set
    - Toggle behaviour: tapping already-reacted emoji removes it
    - _Requirements: 9.1, 9.4_

  - [x] 5.11 Create `src/components/messaging/SearchBar.tsx`
    - Search input with debounced filtering
    - Clear button returns to default active view
    - _Requirements: 14.1, 14.4_

  - [x] 5.12 Create `src/components/messaging/UnreadBadge.tsx`
    - Numeric badge overlay component
    - Show when count > 0, hide when count = 0
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 6. Checkpoint - Shared components
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Mobile and desktop page integration
  - [x] 7.1 Replace `src/pages/Messaging.tsx` with real implementation
    - Wrap with MessagingContext provider
    - Render SearchBar at top, MessageList (active threads) as scrollable list of MessageCard components
    - Implement pull-to-refresh to fetch latest messages
    - Tap MessageCard to drill into ThreadView
    - Swipe-to-archive gesture on MessageCard
    - Add "Archived" view toggle to show archived threads
    - Integrate UnreadBadge into bottom navigation Messages tab
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 5.5, 8.1, 8.4, 12.1, 12.3, 12.4_

  - [ ]* 7.2 Write property tests for mobile message list
    - **Property 10: Active message list completeness**
    - **Property 12: Caregiver message visibility**
    - **Validates: Requirements 4.1, 4.4, 12.3**

  - [x] 7.3 Replace `src/pages/desktop/DesktopMessaging.tsx` with real implementation
    - Two-panel layout: thread list on left, selected thread detail on right
    - Same messaging capabilities as mobile: compose, reply, read tracking, reactions, archiving
    - Admin users see messages from all teams across the club
    - Admin users can send messages to any team, management team, or individual
    - Context menu archive action (instead of swipe)
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ]* 7.4 Write unit tests for desktop two-panel layout
    - Test thread list renders on left panel, thread detail renders on right panel
    - Test admin user sees messages from all teams
    - _Requirements: 13.2, 13.3_

- [x] 8. Event reminder integration
  - [x] 8.1 Add "Send Reminder" button to event card components
    - Add button to existing Schedule event card (mobile and desktop)
    - On tap, open ComposeForm pre-filled with event title, date, location, and RSVP prompt in body
    - Resolve recipient set from event's target teams (all players, caregivers, coaches, managers)
    - Allow coach/manager to edit pre-filled body before sending
    - Store as standard Message visible in Message_List for all recipients
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ]* 8.2 Write property tests for event reminders
    - **Property 26: Event reminder pre-fill correctness**
    - **Property 27: Event reminder recipient resolution**
    - **Validates: Requirements 11.2, 11.3**

- [x] 9. Auto-unarchive on reply and error handling
  - [x] 9.1 Implement auto-unarchive when a reply is added to an archived thread
    - Add database trigger or application logic: on reply INSERT, delete all `message_archives` records for the parent thread
    - _Requirements: 12.6_

  - [ ]* 9.2 Write property test for auto-unarchive
    - **Property 29: Reply auto-unarchives thread**
    - **Validates: Requirements 12.6**

  - [x] 9.3 Implement error handling across messaging components
    - Network error on send: display inline error toast, retain composed text for retry
    - Read receipt retry: 3 retries with exponential backoff, revert optimistic UI on exhaustion
    - Validation errors: inline error messages on ComposeForm and ReplyForm
    - _Requirements: 15.1, 15.3, 15.4_

  - [ ]* 9.4 Write property test for read receipt retry
    - **Property 31: Read receipt retry logic**
    - **Validates: Requirements 15.3**

- [x] 10. Final checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check library for TypeScript property-based testing
- Checkpoints ensure incremental validation at key milestones
- Shared components are used by both mobile and desktop pages
- The existing placeholder pages (Messaging.tsx, DesktopMessaging.tsx) are replaced in-place