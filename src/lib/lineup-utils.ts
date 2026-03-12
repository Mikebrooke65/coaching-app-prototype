// Pure utility functions for lineup selection logic.
// No database, UI, or external dependencies.

/**
 * Returns true if the current lineup has room for another player.
 */
export function canSelectPlayer(currentLineupSize: number, maxPlayers: number): boolean {
  return currentLineupSize < maxPlayers;
}

/**
 * Toggles a player in or out of the lineup, enforcing the max player limit.
 *
 * - If the player is already in the lineup, they are removed.
 * - If the player is not in the lineup and there is room, they are added.
 * - If the lineup is full, the original lineup is returned with an error message.
 *
 * Always returns a new array (immutable).
 */
export function toggleLineupSelection(
  lineup: string[],
  playerId: string,
  maxPlayers: number,
): { lineup: string[]; error?: string } {
  const index = lineup.indexOf(playerId);

  // Player already in lineup — remove them
  if (index !== -1) {
    return { lineup: lineup.filter((id) => id !== playerId) };
  }

  // Lineup full — reject with error
  if (lineup.length >= maxPlayers) {
    return { lineup: [...lineup], error: `Lineup full (${maxPlayers}/${maxPlayers})` };
  }

  // Room available — add player
  return { lineup: [...lineup, playerId] };
}
