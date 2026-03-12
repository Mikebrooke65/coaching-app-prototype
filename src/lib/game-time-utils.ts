// Pure utility functions for game minute and playing time calculations.
// No database, UI, or external dependencies.

/**
 * Calculates the current game minute based on elapsed time from a reference point.
 *
 * - For the first half (half=1): returns floor of elapsed minutes since referenceTime (kick-off).
 * - For the second half (half=2): returns floor of elapsed minutes since referenceTime
 *   (second half start) plus halfDuration.
 * - If currentTime is before referenceTime, returns 0 for the first half or halfDuration
 *   for the second half.
 *
 * @param referenceTime - Kick-off time (half 1) or second half start time (half 2)
 * @param currentTime - The current time to calculate against
 * @param halfDuration - Duration of one half in minutes
 * @param half - Which half of the game (1 or 2)
 * @returns The current game minute as an integer
 */
export function calculateGameMinute(
  referenceTime: Date,
  currentTime: Date,
  halfDuration: number,
  half: 1 | 2,
): number {
  const elapsedMs = currentTime.getTime() - referenceTime.getTime();

  if (elapsedMs < 0) {
    return half === 1 ? 0 : halfDuration;
  }

  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  return half === 1 ? elapsedMinutes : elapsedMinutes + halfDuration;
}

/**
 * Calculates the percentage of total game time a player has been on the field.
 *
 * Sums all on-field interval durations and divides by the total elapsed game time.
 * Returns 0 if totalElapsedTime is 0 (avoids division by zero).
 * Result is clamped between 0 and 100.
 *
 * @param onFieldIntervals - Array of {start, end} intervals (in any consistent time unit)
 * @param totalElapsedTime - Total elapsed game time (same unit as intervals)
 * @returns Percentage of time on field (e.g. 75.5 for 75.5%)
 */
export function calculatePlayingTimePercentage(
  onFieldIntervals: Array<{ start: number; end: number }>,
  totalElapsedTime: number,
): number {
  if (totalElapsedTime <= 0) {
    return 0;
  }

  const totalOnField = onFieldIntervals.reduce(
    (sum, interval) => sum + (interval.end - interval.start),
    0,
  );

  const percentage = (totalOnField / totalElapsedTime) * 100;
  return Math.min(100, Math.max(0, percentage));
}
