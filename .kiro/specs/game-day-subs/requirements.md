# Requirements Document

## Introduction

The Game Day Subs feature adds a complete game day workflow to the West Coast Rangers Football Coaching App. It covers four areas:

1. **Actual Attendance Tracking** — for ALL event types (games, training, general). RSVPs record intention; actual attendance is separate data recorded by coaches on the day.
2. **Team Configuration** — new `game_players` and `half_duration` fields on the teams table, editable from the desktop Teams detail page.
3. **Game Day Squad & Starting Lineup** — a dedicated Subs Page accessed from game cards, showing confirmed attendees with lineup selection capped at the team's `game_players` count.
4. **Substitution Management** — two modes (Random/Equal Time and Coach's Choice) for managing player rotations during a game, driven by kick-off time and half duration.

## Glossary

- **Attendance_Record**: A database record of a player's actual presence at an event, independent of the RSVP data. Applies to all event types (game, training, general).
- **Subs_Page**: The new mobile page for managing game day attendance, starting lineup, and substitutions, accessed from a game card on the Games Page.
- **Game_Day_Squad**: The list of players confirmed as actually present at a game, derived from Attendance Records.
- **Starting_Lineup**: The subset of the Game Day Squad selected to start the game on the field, capped at the team's Game_Players_Count.
- **Guest_Player**: A fill-in player not on the team roster, added to the Game Day Squad by free-text name entry.
- **Substitution_Event**: A recorded swap of players coming off the field with players going on, including the game minute.
- **Random_Strategy**: An automated substitution mode that calculates optimal rotation windows to give every squad member approximately equal playing time.
- **Coach_Strategy**: A manual substitution mode where the coach selects which players swap without automated suggestions.
- **Rotation_Window**: A calculated time interval during a half at which substitutions should occur under the Random Strategy.
- **Game_Players_Count**: A configurable integer on the team record representing the number of players on the field at one time (e.g. 11 for Youth/Senior, 7 for U9).
- **Half_Duration**: A configurable integer on the team record representing the number of minutes per half.
- **Kick_Off_Time**: The actual time the first half started, recorded by the coach on the Subs Page.
- **Second_Half_Start_Time**: The actual time the second half started, recorded by the coach on the Subs Page. Needed because half-time length varies and the ref may run over in the first half.
- **Swap_Group_Size**: The number of substitutions made simultaneously at each Rotation Window. Determined by the number of available subs (1 sub = 1 at a time, 2 subs = 2 at a time, 3 subs = 2 at a time, etc.).
- **Playing_Time_Bar**: A horizontal bar displayed next to each player in the Game Day Squad showing the proportion of total game time they have been on the field. A full green bar means the player has played every minute.
- **Games_Page**: The existing mobile page (`src/pages/Games.tsx`) that displays game cards with navigation, score recording, and feedback.
- **Teams_Detail_Page**: The existing desktop page for viewing and editing team details.
- **Event**: A record in the events table with event_type of 'game', 'training', or 'general'.
- **Coach**: A user with role 'coach' or 'manager' who is a member of the relevant team.

## Requirements

### Requirement 1: Actual Attendance Tracking for All Event Types

**User Story:** As a coach, I want to record who actually attended any event (game, training, or general), so that I have accurate attendance data separate from RSVP intentions.

#### Acceptance Criteria

1. THE Attendance_Record database table SHALL store event_id, user_id, attended (boolean), and recorded_at fields for each attendance confirmation
2. WHEN a Coach opens the attendance view for any Event, THE Attendance view SHALL display all players who have an RSVP record for the Event, grouped by RSVP status in the order: going, maybe, not_going, no_response
3. WHEN a player has an RSVP status of "going" and no Attendance_Record exists, THE Attendance view SHALL treat the player as present by default and display a "No" button to mark the player as absent
4. WHEN a player has an RSVP status of "maybe", "not_going", or "no_response" and no Attendance_Record exists, THE Attendance view SHALL treat the player as absent by default and display a "Yes" button to mark the player as present
5. WHEN the Coach presses the "No" button next to a present player, THE Attendance view SHALL create or update the player's Attendance_Record with attended set to false
6. WHEN the Coach presses the "Yes" button next to an absent player, THE Attendance view SHALL create or update the player's Attendance_Record with attended set to true
7. THE Attendance view SHALL allow the Coach to modify attendance at any time (e.g. for late arrivals)
8. THE Attendance_Record table SHALL NOT modify or overwrite the original RSVP data in the event_rsvps table

### Requirement 2: Guest Player Attendance

**User Story:** As a coach, I want to add guest or fill-in players who are not on the team roster to any event's attendance, so that the full attendance is accurately represented.

#### Acceptance Criteria

1. THE Attendance view SHALL display a text input area at the bottom of the attendance list for entering guest player names
2. WHEN the Coach enters a guest player name and confirms, THE Attendance view SHALL add the Guest_Player to the attendance list as a present attendee
3. THE Attendance_Record table SHALL store Guest_Player entries with a guest_name field and a null user_id to distinguish Guest_Players from rostered players
4. WHEN a Guest_Player is added to a game Event, THE Subs_Page SHALL include the Guest_Player in the Game_Day_Squad, Starting_Lineup selection, and substitution calculations

### Requirement 3: Team Configuration Fields

**User Story:** As a coach, I want to configure the number of on-field players and half duration for my team, so that the substitution system can calculate rotation windows accurately.

#### Acceptance Criteria

1. THE teams database table SHALL include a `game_players` integer column representing the number of players on the field at one time
2. THE teams database table SHALL include a `half_duration` integer column representing the number of minutes per half
3. WHEN a new team is created or when half_duration has not been set, THE system SHALL default the half_duration based on the team's age_group: U4–U6 = 15 minutes, U7–U8 = 20 minutes, U9–U10 = 25 minutes, U11–U12 = 30 minutes, U13–U14 = 35 minutes, U15–U17 and Senior = 45 minutes
4. THE half_duration field SHALL be editable by the Coach to override the default value for cases where a different duration is used
5. WHEN a Coach views the Teams_Detail_Page on desktop, THE Teams_Detail_Page SHALL display editable inputs for game_players and half_duration, with half_duration pre-populated from the age group default if not previously set
6. WHEN a Coach saves updated team configuration values, THE Teams_Detail_Page SHALL persist the game_players and half_duration values to the teams table
7. IF game_players is set to a value less than 1, THEN THE Teams_Detail_Page SHALL display a validation error and prevent saving
8. IF half_duration is set to a value less than 1, THEN THE Teams_Detail_Page SHALL display a validation error and prevent saving

### Requirement 4: Navigation from Games Page to Subs Page

**User Story:** As a coach, I want to navigate to the Subs Page from the currently focused game card, so that I can manage game day attendance and substitutions for that specific game.

#### Acceptance Criteria

1. WHEN a game card is displayed on the Games_Page, THE Games_Page SHALL display a "Subs" navigation link on the game card
2. WHEN the Coach taps the "Subs" link, THE Games_Page SHALL navigate to the Subs_Page passing the selected game's event ID
3. WHEN the Subs_Page loads, THE Subs_Page SHALL display the game context at the top of the page including team name (formatted as "{age_group} {name}"), opponent, date, location, and home/away status

### Requirement 5: Game Day Squad Display

**User Story:** As a coach, I want to see which players actually showed up for a game on the Subs Page, so that I can select a starting lineup from available players.

#### Acceptance Criteria

1. WHEN the Subs_Page loads for a game Event, THE Subs_Page SHALL display a "Game Day Squad" section listing all players marked as present via Attendance_Records, including Guest_Players
2. WHEN no Attendance_Records exist for the game Event, THE Subs_Page SHALL derive the initial Game_Day_Squad from RSVP data, treating players with "going" status as present
3. THE Subs_Page SHALL display the total count of present players in the Game Day Squad section header

### Requirement 6: Starting Lineup Selection

**User Story:** As a coach, I want to select the starting lineup from the present players, so that the system knows who begins on the field and who starts as a substitute.

#### Acceptance Criteria

1. THE Subs_Page SHALL display a checkbox on the left side of each present player in the Game Day Squad
2. WHEN the Coach checks a player's checkbox, THE Subs_Page SHALL add the player to the Starting_Lineup
3. WHEN the Coach unchecks a player's checkbox, THE Subs_Page SHALL remove the player from the Starting_Lineup
4. THE Subs_Page SHALL enforce a maximum number of selected Starting_Lineup checkboxes equal to the team's Game_Players_Count
5. IF the Coach attempts to select more players than the Game_Players_Count, THEN THE Subs_Page SHALL prevent the selection and display a message indicating the lineup is full
6. THE Subs_Page SHALL display a count of selected players versus the Game_Players_Count (e.g. "7/11 selected")

### Requirement 7: Game Time Recording

**User Story:** As a coach, I want to record the actual kick-off time and second half start time, so that time-dependent substitution calculations use the correct reference points for each half.

#### Acceptance Criteria

1. THE Subs_Page SHALL display a kick-off time input in the substitution management section
2. WHEN the Coach records the kick-off time, THE Subs_Page SHALL store the Kick_Off_Time as a timestamp associated with the game Event
3. THE Subs_Page SHALL display a second half start time input, available after the Kick_Off_Time has been recorded
4. WHEN the Coach records the second half start time, THE Subs_Page SHALL store the Second_Half_Start_Time as a timestamp associated with the game Event
5. THE Subs_Page SHALL use the Kick_Off_Time as the reference point for first half substitution calculations and the Second_Half_Start_Time as the reference point for second half substitution calculations
6. IF the Coach has not recorded a Kick_Off_Time, THEN THE Subs_Page SHALL prevent activation of the Random_Strategy substitution mode
7. THE Subs_Page SHALL treat the game as two separate playing windows: first half (Kick_Off_Time to Kick_Off_Time + Half_Duration) and second half (Second_Half_Start_Time to Second_Half_Start_Time + Half_Duration)

### Requirement 8: Substitution Strategy Selection

**User Story:** As a coach, I want to choose between automated equal-time rotation and manual substitution control, so that I can manage substitutions according to my preferred approach.

#### Acceptance Criteria

1. THE Subs_Page SHALL display a strategy selector in the substitution management section with "Random" and "Coach" options
2. WHEN the Coach selects the "Random" option, THE Subs_Page SHALL activate the Random_Strategy mode
3. WHEN the Coach selects the "Coach" option, THE Subs_Page SHALL activate the Coach_Strategy mode
4. THE Subs_Page SHALL default to no strategy selected until the Coach makes a choice

### Requirement 9: Random Strategy — Equal Time Rotation Calculation

**User Story:** As a coach using the random strategy, I want the system to calculate an optimal substitution rotation so that every player in the game day squad gets approximately equal playing time.

#### Acceptance Criteria

1. WHEN the Random_Strategy is active and the Starting_Lineup is complete, THE Subs_Page SHALL calculate Rotation_Windows separately for each half, using the Kick_Off_Time for the first half and the Second_Half_Start_Time for the second half, based on the Half_Duration, the number of substitute players, and the actual start times
2. THE Subs_Page SHALL determine the Swap_Group_Size based on the number of available substitutes: 1 sub results in 1-at-a-time swaps, 2 subs result in 2-at-a-time swaps, 3 subs result in 2-at-a-time swaps, and for N subs where N > 2 the Swap_Group_Size SHALL be the largest even number less than or equal to N (pairing where possible)
3. THE Subs_Page SHALL distribute Rotation_Windows evenly across each half's playing window to equalise playing time for all squad members, treating each half independently based on its actual start time
4. WHEN a Rotation_Window is reached, THE Subs_Page SHALL highlight which players should come off the field and which substitute players should go on
5. WHEN the Coach confirms a substitution at a Rotation_Window, THE Subs_Page SHALL record a Substitution_Event with the players coming off, the players going on, and the game minute
6. WHEN attendance changes after the rotation has been calculated, THE Subs_Page SHALL recalculate the Rotation_Windows and Swap_Group_Size based on the updated Game_Day_Squad

### Requirement 10: Coach Strategy — Manual Substitutions

**User Story:** As a coach using the manual strategy, I want to select which players come off and go on at any time, so that I have full control over substitution decisions.

#### Acceptance Criteria

1. WHEN the Coach_Strategy is active, THE Subs_Page SHALL display the list of players currently on the field and the list of substitute players currently off the field
2. WHEN the Coach selects a player to come off and a player to go on, THE Subs_Page SHALL record a Substitution_Event with the players involved and the current game minute
3. THE Subs_Page SHALL calculate the current game minute based on the Kick_Off_Time (during the first half) or the Second_Half_Start_Time (during the second half) and the current time
4. WHEN a Substitution_Event is recorded, THE Subs_Page SHALL update the on-field and substitute player lists to reflect the swap

### Requirement 11: Substitution Event Recording

**User Story:** As a coach, I want all substitutions to be recorded with timestamps, so that I can review the substitution history after the game.

#### Acceptance Criteria

1. THE Substitution_Event database table SHALL store event_id, player_off_id, player_on_id, game_minute, strategy_used, and recorded_at fields
2. WHEN a Substitution_Event is recorded, THE Subs_Page SHALL display the substitution in a chronological history list on the Subs_Page
3. THE Subs_Page SHALL support Substitution_Events involving Guest_Players by storing the guest_name when the player is not a rostered team member
4. WHEN the Coach reviews the substitution history, THE Subs_Page SHALL display each Substitution_Event with the player names, direction (on/off), and game minute

### Requirement 12: Playing Time Indicator

**User Story:** As a coach, I want to see a visual indicator of how much game time each player has had, so that I can make informed substitution decisions and ensure fair playing time across the squad.

#### Acceptance Criteria

1. THE Subs_Page SHALL display a Playing_Time_Bar next to each player in the Game Day Squad during active game play (after Kick_Off_Time has been recorded)
2. THE Playing_Time_Bar SHALL be a horizontal bar that fills proportionally based on the player's total on-field time as a percentage of total elapsed game time across both halves
3. THE Playing_Time_Bar SHALL use green fill to represent time played, with a full bar indicating the player has been on the field for the entire game so far
4. THE Subs_Page SHALL also display the playing time as a percentage value alongside the Playing_Time_Bar (e.g. "75%")
5. THE Playing_Time_Bar SHALL update in real-time during the game as the clock progresses, reflecting current on-field status and accumulated time from both halves
6. THE Playing_Time_Bar SHALL be visible in both Coach_Strategy and Random_Strategy modes, and any future substitution strategy modes
