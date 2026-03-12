# Implementation Plan: Game Day Subs

## Overview

Incremental implementation of the Game Day Subs feature across four areas: database migration, attendance tracking, subs page with lineup selection, and substitution engine. Each task builds on the previous, with pure logic modules implemented and tested before UI components. The rotation engine and utility functions are built first as independently testable units, then wired into the React components.

## Tasks

- [x] 1. Database migration and type definitions
  - [x] 1.1 Create the database migration file `supabase/migrations/031_game_day_subs.sql`
    - Create `event_attendance` table with columns: id (uuid PK), event_id (FK → events.id), user_id (FK → users.id, nullable), guest_name (text, nullable), attended (boolean, default true), recorded_at, created_at, updated_at, created_by, updated_by
    - Add UNIQUE constraint on (event_id, user_id) WHERE user_id IS NOT NULL
    - Add CHECK constraint: user_id IS NOT NULL OR guest_name IS NOT NULL
    - Create `game_times` table with columns: id (uuid PK), event_id (FK → events.id, UNIQUE), kick_off_time (timestamptz, nullable), second_half_start_time (timestamptz, nullable), created_at, updated_at, created_by, updated_by
    - Create `substitution_events` table with columns: id (uuid PK), event_id (FK → events.id), player_off_id (FK → users.id, nullable), player_off_guest_name (text, nullable), player_on_id (FK → users.id, nullable), player_on_guest_name (text, nullable), game_minute (integer), half (integer, CHECK IN (1,2)), strategy_used (text, CHECK IN ('random','coach')), recorded_at, created_at, updated_at, created_by, updated_by
    - ALTER `teams` table: add `game_players` (integer, nullable, CHECK >= 1) and `half_duration` (integer, nullable, CHECK >= 1)
    - UPDATE existing teams to set `half_duration` based on age_group defaults (U4-U6=15, U7-U8=20, U9-U10=25, U11-U12=30, U13-U14=35, U15-U17/Senior=45)
    - Add RLS policies for all three new tables following project conventions (coaches/managers read/write, players read own)
    - Add indexes on event_id for all three new tables
    - _Requirements: 1.1, 1.8, 2.3, 3.1, 3.2, 3.3, 7.2, 7.4, 11.1, 11.3_

  - [x] 1.2 Add new TypeScript types to `src/types/database.ts`
    - Add `EventAttendance` interface
    - Add `GameTime` interface
    - Add `SubstitutionEvent` interface
    - Add `SquadMember` interface
    - Extend existing `Team` interface with optional `game_players` and `half_duration` fields
    - _Requirements: 1.1, 3.1, 3.2, 11.1_

- [x] 2. Pure logic modules — rotation engine and utility functions
  - [x] 2.1 Create the rotation engine `src/lib/rotation-engine.ts`
    - Export `RotationInput`, `RotationWindow`, and `RotationPlan` interfaces
    - Implement `calculateSwapGroupSize(numSubs: number): number` — 0→0, 1→1, 2→2, N>2→largest even ≤ N
    - Implement `calculateRotationPlan(input: RotationInput): RotationPlan` — distributes rotation windows evenly across each half, round-robin player rotation
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 2.2 Write property test for swap group size calculation
    - **Property 10: Swap group size calculation**
    - Test in `src/lib/__tests__/rotation-engine.test.ts`
    - For any non-negative integer N, verify: 0→0, 1→1, 2→2, N>2→largest even ≤ N
    - **Validates: Requirements 9.2**

  - [ ]* 2.3 Write property test for rotation engine equal-time distribution
    - **Property 11: Rotation engine equal-time distribution**
    - Test in `src/lib/__tests__/rotation-engine.test.ts`
    - For any valid input (squadSize > gamePlayers, gamePlayers ≥ 1, halfDuration ≥ 1), verify rotation windows are evenly distributed and all players get approximately equal time (within one window's duration)
    - **Validates: Requirements 9.1, 9.3, 9.6, 7.5, 7.7**

  - [x] 2.4 Create attendance utility functions `src/lib/attendance-utils.ts`
    - Implement `deriveAttendanceFromRsvp(rsvpStatus: string): boolean` — returns true only for 'going'
    - Implement `groupByRsvpStatus(players: Array<{rsvp_status: string}>): grouped object` — groups in order: going, maybe, not_going, no_response
    - Implement `getDefaultHalfDuration(ageGroup: string): number` — returns default minutes per age group
    - _Requirements: 1.2, 1.3, 1.4, 3.3_

  - [ ]* 2.5 Write property tests for attendance derivation and RSVP grouping
    - **Property 1: Default attendance derivation from RSVP** — test in `src/lib/__tests__/attendance-logic.test.ts`
    - **Property 4: RSVP grouping order** — test in `src/lib/__tests__/attendance-logic.test.ts`
    - **Validates: Requirements 1.2, 1.3, 1.4, 5.2**

  - [x] 2.6 Create game minute and playing time utility functions `src/lib/game-time-utils.ts`
    - Implement `calculateGameMinute(referenceTime: Date, currentTime: Date, halfDuration: number, half: 1 | 2): number` — floor of elapsed minutes, offset by halfDuration for second half
    - Implement `calculatePlayingTimePercentage(onFieldIntervals: Array<{start: number, end: number}>, totalElapsedTime: number): number` — sum of intervals / total * 100
    - _Requirements: 10.3, 12.2_

  - [ ]* 2.7 Write property tests for game minute and playing time calculations
    - **Property 12: Game minute calculation** — test in `src/lib/__tests__/game-minute.test.ts`
    - **Property 14: Playing time percentage calculation** — test in `src/lib/__tests__/playing-time.test.ts`
    - **Validates: Requirements 10.3, 12.2**

  - [x] 2.8 Create lineup logic utility `src/lib/lineup-utils.ts`
    - Implement `canSelectPlayer(currentLineupSize: number, maxPlayers: number): boolean`
    - Implement `toggleLineupSelection(lineup: string[], playerId: string, maxPlayers: number): { lineup: string[], error?: string }`
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [ ]* 2.9 Write property test for lineup selection invariant
    - **Property 8: Starting lineup invariant**
    - Test in `src/lib/__tests__/lineup-logic.test.ts`
    - For any sequence of check/uncheck operations with max N, lineup never exceeds N players
    - **Validates: Requirements 6.2, 6.3, 6.4, 6.5**

  - [x] 2.10 Create substitution state tracker utility `src/lib/substitution-state.ts`
    - Implement `applySubstitutions(startingLineup: string[], subs: Array<{playerOff: string, playerOn: string}>): { onField: string[], bench: string[] }`
    - Given a starting lineup and ordered list of substitution events, compute current on-field and bench sets
    - _Requirements: 10.1, 10.4_

  - [ ]* 2.11 Write property test for substitution state consistency
    - **Property 13: Substitution state consistency**
    - Test in `src/lib/__tests__/substitution-state.test.ts`
    - For any starting lineup and valid swap sequence, on-field set equals starting lineup with swaps applied; bench is complement within squad
    - **Validates: Requirements 10.1, 10.4, 9.5, 10.2, 11.1**

- [x] 3. Checkpoint — Pure logic modules
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. API services
  - [x] 4.1 Create `src/lib/attendance-api.ts`
    - Extend `ApiClient` base class
    - Implement `getEventAttendance(eventId: string): Promise<EventAttendance[]>`
    - Implement `upsertAttendance(eventId: string, userId: string | null, attended: boolean, guestName?: string): Promise<EventAttendance>`
    - Implement `addGuestPlayer(eventId: string, guestName: string): Promise<EventAttendance>`
    - _Requirements: 1.1, 1.5, 1.6, 1.7, 2.2, 2.3_

  - [x] 4.2 Create `src/lib/subs-api.ts`
    - Extend `ApiClient` base class
    - Implement `getGameTime(eventId: string): Promise<GameTime | null>`
    - Implement `upsertGameTime(eventId: string, kickOffTime?: string, secondHalfStartTime?: string): Promise<GameTime>`
    - Implement `getSubstitutionEvents(eventId: string): Promise<SubstitutionEvent[]>`
    - Implement `recordSubstitution(sub: Omit<SubstitutionEvent, 'id' | 'recorded_at'>): Promise<SubstitutionEvent>`
    - Implement `getGameDaySquad(eventId: string): Promise<SquadMember[]>` — joins attendance + user data
    - _Requirements: 7.2, 7.4, 11.1, 11.3, 5.1_

  - [x] 4.3 Extend `src/lib/teams-api.ts` (or create if not existing) with team config methods
    - Add `updateTeamConfig(teamId: string, gamePlayers: number, halfDuration: number): Promise<Team>`
    - Add `getTeam(teamId: string): Promise<Team>` if not already present
    - _Requirements: 3.5, 3.6_

  - [ ]* 4.4 Write unit tests for attendance API
    - Test in `src/lib/__tests__/attendance-api.test.ts`
    - Test upsert creates new record, updates existing, guest player creation, error handling
    - _Requirements: 1.1, 1.5, 1.6, 2.2, 2.3_

  - [ ]* 4.5 Write unit tests for subs API
    - Test in `src/lib/__tests__/subs-api.test.ts`
    - Test game time save/load, substitution event recording, game day squad retrieval
    - _Requirements: 7.2, 7.4, 11.1, 5.1_

- [x] 5. Checkpoint — API services
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Attendance view component (reusable for all event types)
  - [x] 6.1 Create `src/components/subs/AttendanceView.tsx`
    - Accept props: eventId, players (with RSVP data), attendance records, onToggleAttendance callback, onAddGuest callback
    - Display players grouped by RSVP status: going → maybe → not_going → no_response
    - "Going" players show as present by default with a "No" button; others show as absent with a "Yes" button
    - Override defaults when an attendance record exists
    - Guest player text input at the bottom with validation (reject empty/whitespace names)
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 2.1, 2.2_

  - [ ]* 6.2 Write unit tests for AttendanceView component
    - Test in `src/components/subs/__tests__/AttendanceView.test.tsx`
    - Test RSVP grouping display, toggle buttons, guest player input validation
    - _Requirements: 1.2, 1.3, 1.4, 2.1, 2.2_

- [x] 7. Team configuration editor
  - [x] 7.1 Add team config fields to `src/pages/desktop/TeamsManagement.tsx`
    - Add editable number inputs for `game_players` and `half_duration`
    - Pre-populate `half_duration` from age group default using `getDefaultHalfDuration()` when not set
    - Inline validation: both fields must be ≥ 1, show error messages and disable save on invalid input
    - Save via teams API on form submission
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 7.2 Write property test for team config validation
    - **Property 6: Team config round-trip and validation**
    - Test in `src/lib/__tests__/attendance-logic.test.ts` (or a dedicated team-config test file)
    - For any integer ≥ 1, validation passes; for any integer < 1, validation rejects
    - **Validates: Requirements 3.1, 3.2, 3.4, 3.5, 3.6, 3.7, 3.8**

- [x] 8. Subs page — core structure and navigation
  - [x] 8.1 Create `src/pages/SubsPage.tsx` with route `/games/:eventId/subs`
    - Load game context: event details, team config (game_players, half_duration), attendance records, RSVP data
    - Display game context header: team name ("{age_group} {name}"), opponent, date, location, home/away
    - Show message directing to desktop team config if game_players or half_duration not set
    - Brand colour: Orange `#ea7800`, include `pb-20` for mobile nav clearance
    - Orchestrate child components: AttendanceView, LineupSelector, SubstitutionManager
    - _Requirements: 4.3, 5.1, 5.2, 5.3_

  - [x] 8.2 Add "Subs" navigation link to game cards on `src/pages/Games.tsx`
    - Add a "Subs" link/button on each game card
    - Navigate to `/games/:eventId/subs` passing the event ID
    - _Requirements: 4.1, 4.2_

  - [x] 8.3 Register the `/games/:eventId/subs` route in the app router
    - Add route entry in the routing configuration (check `src/App.tsx` or `src/routes/`)
    - Wrap with ProtectedRoute if needed
    - _Requirements: 4.2_

- [x] 9. Lineup selector component
  - [x] 9.1 Create `src/components/subs/LineupSelector.tsx`
    - Display checkbox list of present players from the game day squad
    - Enforce max selection = team's `game_players` count
    - Display "X/Y selected" counter
    - Show "Lineup full" message when attempting to exceed max
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 10. Checkpoint — Core UI components
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Substitution manager and strategy components
  - [x] 11.1 Create `src/components/subs/SubstitutionManager.tsx`
    - Strategy selector toggle: "Random" / "Coach" (default: no selection)
    - Kick-off time input; second half start time input (available after kick-off recorded)
    - Save game times via subs API
    - Disable Random strategy until kick-off time is recorded
    - Display substitution history chronologically
    - Delegate to RandomStrategy or CoachStrategy sub-components based on selection
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 8.1, 8.2, 8.3, 8.4, 11.2, 11.4_

  - [x] 11.2 Create `src/components/subs/RandomStrategy.tsx`
    - Use rotation engine to calculate rotation windows from squad, lineup, and game times
    - Display rotation windows with player swap suggestions (who comes off, who goes on)
    - Highlight current/next rotation window
    - Confirm button to record each substitution event via subs API
    - Recalculate when attendance changes
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 11.3 Create `src/components/subs/CoachStrategy.tsx`
    - Display on-field players and bench players as two lists
    - Coach selects one player off and one player on
    - Auto-calculate game minute from kick-off/second-half times using game-time-utils
    - Record substitution event via subs API on confirm
    - Update on-field/bench lists after swap
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 12. Playing time bar component
  - [x] 12.1 Create `src/components/subs/PlayingTimeBar.tsx`
    - Green horizontal bar, width proportional to % of total elapsed game time played
    - Display percentage label alongside (e.g. "75%")
    - Update in real-time via interval timer during active play
    - Works in both Random and Coach strategy modes
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [x] 13. Wire everything together on the Subs page
  - [x] 13.1 Integrate all components into `src/pages/SubsPage.tsx`
    - Wire AttendanceView with attendance API (toggle attendance, add guests)
    - Wire LineupSelector with game day squad state
    - Wire SubstitutionManager with game times API and substitution events API
    - Wire PlayingTimeBar into the squad display, visible after kick-off recorded
    - Ensure state flows correctly: attendance changes → squad updates → lineup recalculation → rotation recalculation
    - Handle edge cases: zero subs (hide swap UI), no RSVPs (empty list), unconfigured team (show config message)
    - _Requirements: 2.4, 5.1, 5.2, 5.3, 9.6_

- [x] 14. Final checkpoint — Full feature integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at natural break points
- Property tests validate universal correctness properties from the design document using fast-check with Vitest
- Pure logic modules (tasks 2.x) are built first so they can be tested independently before UI integration
- Migration file (031) follows the existing numbering convention in `supabase/migrations/`
- The attendance view component is designed to be reusable across all event types, not just games
