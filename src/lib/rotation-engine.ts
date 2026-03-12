// Pure-function module for calculating substitution rotation plans.
// No database, UI, or external dependencies.

export interface RotationInput {
  squadSize: number;        // total players in game day squad
  gamePlayers: number;      // on-field count from team config
  halfDuration: number;     // minutes per half
  startingLineup: string[]; // player IDs/names starting on field
  subs: string[];           // player IDs/names starting on bench
}

export interface RotationWindow {
  minute: number;           // game minute within the half
  playersOff: string[];     // who comes off
  playersOn: string[];      // who goes on
}

export interface RotationPlan {
  firstHalf: RotationWindow[];
  secondHalf: RotationWindow[];
  swapGroupSize: number;
}

/**
 * Determines how many players swap simultaneously at each rotation window.
 * - 0 subs → 0 (no swaps needed)
 * - 1 sub  → 1
 * - 2 subs → 2
 * - N > 2  → largest even number ≤ N
 */
export function calculateSwapGroupSize(numSubs: number): number {
  if (numSubs <= 2) return numSubs;
  return numSubs % 2 === 0 ? numSubs : numSubs - 1;
}

/**
 * Builds rotation windows for a single half.
 *
 * The algorithm cycles all squad members through on-field positions using
 * round-robin rotation. Windows are evenly spaced across the half duration.
 */
function buildHalfRotation(
  onField: string[],
  bench: string[],
  halfDuration: number,
  swapGroupSize: number,
  squadSize: number,
  gamePlayers: number,
): RotationWindow[] {
  if (swapGroupSize === 0 || bench.length === 0) return [];

  // Number of rotation windows needed per half so every player gets time
  const numWindows = Math.ceil(squadSize / gamePlayers) - 1;
  if (numWindows <= 0) return [];

  // Evenly space windows across the half
  const interval = halfDuration / (numWindows + 1);

  const currentOnField = [...onField];
  const currentBench = [...bench];
  const windows: RotationWindow[] = [];

  // Track which on-field position to rotate next (round-robin index)
  let offIndex = 0;
  // Track which bench player goes on next
  let onIndex = 0;

  for (let w = 0; w < numWindows; w++) {
    const minute = Math.round(interval * (w + 1));
    const playersOff: string[] = [];
    const playersOn: string[] = [];

    const swapsThisWindow = Math.min(swapGroupSize, currentBench.length);

    for (let s = 0; s < swapsThisWindow; s++) {
      const offPlayer = currentOnField[offIndex % currentOnField.length];
      const onPlayer = currentBench[onIndex % currentBench.length];

      playersOff.push(offPlayer);
      playersOn.push(onPlayer);

      // Perform the swap in our tracking arrays
      const fieldIdx = currentOnField.indexOf(offPlayer);
      currentOnField[fieldIdx] = onPlayer;
      currentBench[onIndex % currentBench.length] = offPlayer;

      offIndex++;
      onIndex++;
    }

    windows.push({ minute, playersOff, playersOn });
  }

  return windows;
}

/**
 * Calculates a full rotation plan for both halves of a game.
 *
 * Each half is treated independently — the second half resets the rotation
 * using the original starting lineup and subs ordering.
 */
export function calculateRotationPlan(input: RotationInput): RotationPlan {
  const { squadSize, gamePlayers, halfDuration, startingLineup, subs } = input;
  const numSubs = subs.length;
  const swapGroupSize = calculateSwapGroupSize(numSubs);

  if (numSubs === 0) {
    return { firstHalf: [], secondHalf: [], swapGroupSize: 0 };
  }

  const firstHalf = buildHalfRotation(
    startingLineup,
    subs,
    halfDuration,
    swapGroupSize,
    squadSize,
    gamePlayers,
  );

  // Second half resets — same starting lineup and bench order
  const secondHalf = buildHalfRotation(
    startingLineup,
    subs,
    halfDuration,
    swapGroupSize,
    squadSize,
    gamePlayers,
  );

  return { firstHalf, secondHalf, swapGroupSize };
}
