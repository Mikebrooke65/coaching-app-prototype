# Requirements Document

## Introduction

This document defines the requirements for a real-time team messaging system for the West Coast Rangers Football Club app (Urrah). The current mobile Messages page and desktop DesktopMessaging page contain only placeholder mock data. This feature replaces them with a fully functional messaging system backed by Supabase (PostgreSQL + Realtime). Users across all roles (coach, manager, player, caregiver, admin) can send and receive messages scoped to their teams, with support for threading, read tracking, emoji reactions, archiving, and automated event reminders.

## Glossary

- **Messaging_System**: The complete messaging feature including database tables, real-time subscriptions, and UI components across mobile and desktop.
- **Message**: A single communication unit containing a title, body, sender reference, and timestamp. A Message is either a top-level message or a reply to another message.
- **Thread**: A top-level Message together with all its replies, displayed as an indented group on the messages page.
- **Recipient_Set**: The resolved set of users who should receive a given Message, determined by the targeting type (individual, whole team, management team, or club admin).
- **Read_Receipt**: A record indicating that a specific user has viewed a specific Message, including the timestamp of first view.
- **Reaction**: An emoji icon attached to a Message by a user.
- **Message_Card**: The UI component that renders a single Message, showing title, body, sender name, date posted, and visual indicators for message type and read status.
- **Message_List**: The scrollable list of Threads visible to the current user on the Messages page.
- **Compose_Form**: The UI for creating a new top-level Message, including recipient selection and message body input.
- **Reply_Form**: The UI for composing a reply within a Thread, pre-populated with the original Recipient_Set.
- **Unread_Badge**: A numeric indicator on the Messages tab in the bottom navigation showing the count of unread Messages for the current user.
- **Read_Count_Indicator**: A display on each top-level Message_Card showing "X/Y" where X is the number of recipients who have read the Message and Y is the total Recipient_Set size.
- **Read_Detail_Modal**: A modal overlay listing all recipients of a Message with visual distinction (green highlight) for those who have read it.
- **Archive**: The state of a Message that has been moved off the active Message_List. Archived messages remain in the database but are hidden from the default view.
- **Event_Reminder**: An automated Message generated from the Schedule area, sent to all users associated with a specific event.
- **Whole_Team**: A targeting option that includes all players, caregivers, managers, and coaches associated with a team.
- **Management_Team**: A targeting option that includes only coaches and managers associated with a team.
- **Club_Admin**: A targeting option that sends a message to all users with the admin role.
- **Supabase_Realtime**: The Supabase real-time subscription service used to push new messages and read receipt updates to connected clients without polling.

## Requirements

### Requirement 1: Message Data Model

**User Story:** As a developer, I want a robust database schema for messages, recipients, and read tracking, so that the messaging system has a reliable foundation.

#### Acceptance Criteria

1. THE Messaging_System SHALL store each Message with a unique ID, sender ID, title, body, created-at timestamp, and optional parent message ID for threading.
2. THE Messaging_System SHALL store a recipient record for each Message linking the Message to a targeting type (individual, whole_team, management_team, or club_admin) and the resolved recipient user IDs.
3. THE Messaging_System SHALL store a Read_Receipt for each user who views a Message, recording the user ID, message ID, and read-at timestamp.
4. THE Messaging_System SHALL store Reactions as records linking a user ID, message ID, and emoji character.
5. THE Messaging_System SHALL store an archived-at timestamp on each Message, where a null value indicates the Message is active.
6. WHEN a Message is created, THE Messaging_System SHALL automatically create a Read_Receipt for the sender.
7. THE Messaging_System SHALL enforce referential integrity between Messages, users, teams, Read_Receipts, and Reactions using foreign key constraints.

### Requirement 2: Row-Level Security

**User Story:** As a club administrator, I want messages to be secured so that users can only access messages intended for them.

#### Acceptance Criteria

1. THE Messaging_System SHALL restrict Message read access so that a user can only retrieve Messages where the user is in the Recipient_Set or is the sender.
2. THE Messaging_System SHALL allow any authenticated user to create a Message, provided the user is a member of the targeted team.
3. THE Messaging_System SHALL restrict Read_Receipt creation so that a user can only mark Messages as read for their own user ID.
4. THE Messaging_System SHALL allow admin-role users to read all Messages across all teams.
5. THE Messaging_System SHALL restrict Reaction creation so that only users in the Recipient_Set or the sender of a Message can add a Reaction to that Message.

### Requirement 3: Compose and Send Messages

**User Story:** As a coach or manager, I want to compose and send messages to specific recipients, so that I can communicate with my team members.

#### Acceptance Criteria

1. WHEN a user opens the Compose_Form, THE Messaging_System SHALL display recipient targeting options: individual user, Whole_Team, Management_Team, and Club_Admin.
2. WHEN the "individual user" targeting option is selected, THE Compose_Form SHALL display a searchable list of users within the sender's team(s).
3. WHEN the "Whole_Team" targeting option is selected, THE Compose_Form SHALL resolve the Recipient_Set to all players, caregivers, managers, and coaches in the selected team.
4. WHEN the "Management_Team" targeting option is selected, THE Compose_Form SHALL resolve the Recipient_Set to only coaches and managers in the selected team.
5. WHEN the "Club_Admin" targeting option is selected, THE Compose_Form SHALL resolve the Recipient_Set to all users with the admin role.
6. THE Compose_Form SHALL require a title and body before allowing the user to send the Message.
7. WHEN the user submits the Compose_Form, THE Messaging_System SHALL persist the Message and all recipient records to the database.
8. WHEN a user belongs to multiple teams, THE Compose_Form SHALL allow the user to select which team context to use for recipient resolution.

### Requirement 4: Message List and Visibility

**User Story:** As a user, I want to see a list of messages relevant to me, so that I can stay informed about team communications.

#### Acceptance Criteria

1. THE Message_List SHALL display all active (non-archived) Threads where the current user is in the Recipient_Set or is the sender.
2. THE Message_List SHALL order Threads by the most recent activity (latest message or reply timestamp), with the most recent Thread at the top.
3. THE Message_List SHALL visually distinguish between private one-to-one Messages and group Messages using distinct icons or labels on each Message_Card.
4. WHEN a caregiver user views the Message_List, THE Messaging_System SHALL include Messages sent to teams where the caregiver's linked player(s) are members, using the player_caregivers relationship table.
5. THE Message_List SHALL support pull-to-refresh on mobile to fetch the latest Messages.

### Requirement 5: Message Card Display

**User Story:** As a user, I want each message to show key information at a glance, so that I can quickly understand the message context.

#### Acceptance Criteria

1. THE Message_Card SHALL display the message title, body text (truncated if longer than 2 lines in list view), sender name, and date posted.
2. THE Message_Card SHALL display the message type indicator: a single-person icon for one-to-one messages and a group icon for group messages.
3. WHILE a Message is unread by the current user, THE Message_Card SHALL render the title in bold font weight.
4. WHEN a Message has been read by the current user, THE Message_Card SHALL render the title in normal (non-bold) font weight.
5. THE Message_Card SHALL use the brand colour Dark Grey (#545859) with 20% shading (rgba(84, 88, 89, 0.2)) as the page background accent, consistent with the existing Messages page styling.

### Requirement 6: Threading and Replies

**User Story:** As a user, I want to reply to messages and see replies grouped under the original message, so that conversations stay organized.

#### Acceptance Criteria

1. THE Message_List SHALL display replies indented under their parent top-level Message to form a visible Thread.
2. WHEN a user taps the reply button on a Message_Card, THE Reply_Form SHALL open with the Recipient_Set pre-populated to match the original Message's recipients.
3. WHEN a reply is submitted, THE Messaging_System SHALL store the reply with a parent_message_id referencing the top-level Message.
4. WHEN a new reply is added to a Thread, THE Messaging_System SHALL update the Thread's last-activity timestamp so the Thread moves to the top of the Message_List.
5. THE Reply_Form SHALL require a body text before allowing submission (title is inherited from the parent Message).

### Requirement 7: Read Tracking

**User Story:** As a coach, I want to see who has read my messages, so that I know important communications have been received.

#### Acceptance Criteria

1. WHEN a user opens a Message they have not previously read, THE Messaging_System SHALL create a Read_Receipt with the current timestamp.
2. THE Message_Card for each top-level Message SHALL display a Read_Count_Indicator showing "X/Y" where X is the count of Read_Receipts and Y is the total Recipient_Set size.
3. WHEN the Message sender views their own sent Message, THE Messaging_System SHALL count the sender as having read the Message (auto-created at send time).
4. WHEN a user taps the Read_Count_Indicator, THE Messaging_System SHALL open the Read_Detail_Modal.
5. THE Read_Detail_Modal SHALL list all recipients by name, with green background highlighting for recipients who have a Read_Receipt.
6. THE Read_Detail_Modal SHALL list recipients who have read the Message before those who have not.

### Requirement 8: Unread Badge

**User Story:** As a user, I want to see how many unread messages I have from the navigation bar, so that I know when new messages arrive.

#### Acceptance Criteria

1. THE Unread_Badge SHALL appear on the Messages tab in the bottom navigation bar when the current user has one or more unread Messages.
2. THE Unread_Badge SHALL display the numeric count of unread Messages for the current user.
3. WHEN the unread count is zero, THE Unread_Badge SHALL be hidden.
4. WHEN a new Message is received via Supabase_Realtime, THE Unread_Badge SHALL update the count without requiring a page refresh.
5. WHEN the user reads a Message, THE Unread_Badge SHALL decrement the count accordingly.

### Requirement 9: Emoji Reactions

**User Story:** As a user, I want to react to messages with emojis, so that I can quickly acknowledge or respond to messages without typing a reply.

#### Acceptance Criteria

1. THE Message_Card SHALL display a reaction button that opens a picker of standard emoji icons.
2. WHEN a user selects an emoji from the picker, THE Messaging_System SHALL store a Reaction linking the user, the Message, and the selected emoji.
3. THE Message_Card SHALL display all Reactions grouped by emoji, with a count next to each unique emoji.
4. WHEN a user taps an emoji they have already reacted with, THE Messaging_System SHALL remove that Reaction (toggle behaviour).
5. THE Messaging_System SHALL allow any user in the Recipient_Set or the sender to add a Reaction to any Message in the Thread, including replies.

### Requirement 10: Real-Time Updates

**User Story:** As a user, I want to see new messages and read receipts appear in real time, so that conversations feel live and responsive.

#### Acceptance Criteria

1. WHEN a new Message is inserted into the database, THE Messaging_System SHALL push the Message to all connected clients in the Recipient_Set via Supabase_Realtime.
2. WHEN a new Read_Receipt is inserted, THE Messaging_System SHALL update the Read_Count_Indicator on the relevant Message_Card for all connected clients viewing that Thread.
3. WHEN a new Reaction is inserted or deleted, THE Messaging_System SHALL update the Reaction display on the relevant Message_Card for all connected clients.
4. IF the Supabase_Realtime connection is lost, THEN THE Messaging_System SHALL attempt to reconnect and fetch any missed Messages upon reconnection.

### Requirement 11: Event Reminder Messages

**User Story:** As a coach or manager, I want to send reminder messages from the schedule area, so that I can prompt responses when RSVP numbers are low.

#### Acceptance Criteria

1. WHEN a coach or manager views an event card in the Schedule area, THE Messaging_System SHALL display a "Send Reminder" action button.
2. WHEN the "Send Reminder" button is tapped, THE Messaging_System SHALL create a pre-filled Message with the event title, date, location, and a prompt for recipients to RSVP.
3. THE Event_Reminder Recipient_Set SHALL resolve to all users associated with the event's target teams (players, caregivers, coaches, and managers).
4. THE Event_Reminder Message SHALL be stored as a standard Message and appear in the Message_List for all recipients.
5. THE Compose_Form for an Event_Reminder SHALL allow the coach or manager to edit the pre-filled body text before sending.

### Requirement 12: Message Archiving

**User Story:** As a user, I want to archive old messages, so that my active message list stays manageable and focused on current conversations.

#### Acceptance Criteria

1. THE Message_Card SHALL provide an archive action (swipe gesture on mobile, context menu on desktop) for top-level Messages.
2. WHEN a user archives a Message, THE Messaging_System SHALL set the archived-at timestamp on the Message for that user.
3. THE Message_List SHALL exclude Messages that have been archived by the current user from the default active view.
4. THE Messaging_System SHALL provide an "Archived" view accessible from the Messages page that lists all archived Threads for the current user.
5. WHEN a user selects a Message in the Archived view, THE Messaging_System SHALL allow the user to unarchive the Message, restoring it to the active Message_List.
6. WHEN a new reply is added to an archived Thread, THE Messaging_System SHALL automatically unarchive the Thread for all users who had archived it.

### Requirement 13: Desktop Admin Messaging

**User Story:** As an admin, I want to use the same messaging functionality on the desktop interface, so that I can manage club communications from the admin dashboard.

#### Acceptance Criteria

1. THE DesktopMessaging page SHALL provide the same messaging capabilities as the mobile Messaging page: compose, reply, read tracking, reactions, and archiving.
2. THE DesktopMessaging page SHALL use a two-panel layout with the Thread list on the left and the selected Thread detail on the right.
3. WHEN an admin user views the DesktopMessaging page, THE Messaging_System SHALL display Messages from all teams across the club.
4. THE DesktopMessaging page SHALL allow admin users to send Messages to any team, Management_Team, or individual user in the club.

### Requirement 14: Message Search

**User Story:** As a user, I want to search through my messages, so that I can find specific conversations or information quickly.

#### Acceptance Criteria

1. THE Message_List SHALL provide a search input field at the top of the page.
2. WHEN a user enters text in the search field, THE Messaging_System SHALL filter the Message_List to show only Threads where the title, body, or sender name contains the search text.
3. THE search SHALL apply to both active and archived Messages, with results clearly labelled by status.
4. WHEN the search field is cleared, THE Message_List SHALL return to the default active view.

### Requirement 15: Error Handling

**User Story:** As a user, I want clear feedback when messaging operations fail, so that I know what went wrong and can retry.

#### Acceptance Criteria

1. IF a Message fails to send due to a network error, THEN THE Messaging_System SHALL display an inline error notification and retain the composed message text so the user can retry.
2. IF the Supabase_Realtime subscription fails to establish, THEN THE Messaging_System SHALL fall back to polling for new Messages at a 30-second interval.
3. IF a Read_Receipt fails to persist, THEN THE Messaging_System SHALL retry the operation silently up to 3 times before displaying an error.
4. IF the user attempts to send a Message with an empty title or body, THEN THE Compose_Form SHALL display a validation error and prevent submission.

### Requirement 16: Notification Preparation

**User Story:** As a developer, I want the messaging system to be ready for push notifications in the future native app, so that the notification infrastructure is in place when needed.

#### Acceptance Criteria

1. THE Messaging_System SHALL include a device_tokens table storing user ID, device token, platform (web, android, ios), and created-at timestamp.
2. THE Messaging_System SHALL record a notification-pending flag on each message_recipient record when a new Message is created, to support future push notification delivery.
3. WHILE the app is a web application, THE Messaging_System SHALL rely on Supabase_Realtime and the Unread_Badge for in-app notification of new Messages.
4. THE device_tokens table schema SHALL support registration of multiple devices per user.
