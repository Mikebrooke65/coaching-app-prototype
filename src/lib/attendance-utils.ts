// Pure utility functions for attendance tracking and RSVP grouping.
// No database, UI, or external dependencies.

/**
 * Derives a default attendance status from an RSVP status string.
 * Returns true only for 'going'; all other statuses default to absent.
 */
export function deriveAttendanceFromRsvp(rsvpStatus: string): boolean {
  return rsvpStatus === 'going';
}

/**
 * Groups an array of players by their RSVP status.
 * Returns groups in the order: going, maybe, not_going, no_response.
 * Players with unrecognized statuses are placed in the no_response group.
 */
export function groupByRsvpStatus<T extends { rsvp_status: string }>(
  players: T[],
): { going: T[]; maybe: T[]; not_going: T[]; no_response: T[] } {
  const groups: { going: T[]; maybe: T[]; not_going: T[]; no_response: T[] } = {
    going: [],
    maybe: [],
    not_going: [],
    no_response: [],
  };

  for (const player of players) {
    switch (player.rsvp_status) {
      case 'going':
        groups.going.push(player);
        break;
      case 'maybe':
        groups.maybe.push(player);
        break;
      case 'not_going':
        groups.not_going.push(player);
        break;
      default:
        groups.no_response.push(player);
        break;
    }
  }

  return groups;
}

/**
 * Returns the default half duration in minutes for a given age group.
 *
 * - U4, U5, U6       → 15
 * - U7, U8            → 20
 * - U9, U10           → 25
 * - U11, U12          → 30
 * - U13, U14          → 35
 * - U15, U16, U17, Senior → 45
 *
 * Unrecognized age groups default to 25 minutes.
 */
export function getDefaultHalfDuration(ageGroup: string): number {
  const durations: Record<string, number> = {
    U4: 15,
    U5: 15,
    U6: 15,
    U7: 20,
    U8: 20,
    U9: 25,
    U10: 25,
    U11: 30,
    U12: 30,
    U13: 35,
    U14: 35,
    U15: 45,
    U16: 45,
    U17: 45,
    Senior: 45,
  };

  return durations[ageGroup] ?? 25;
}
