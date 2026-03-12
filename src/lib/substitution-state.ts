// Pure utility functions for tracking substitution state.
// No database, UI, or external dependencies.

/**
 * Applies an ordered list of substitution events to a starting lineup and bench,
 * returning the current on-field and bench player sets.
 *
 * Each substitution moves playerOff from onField → bench and playerOn from bench → onField.
 * Substitutions are skipped defensively if playerOff is not on the field or playerOn is not on the bench.
 * Always returns new arrays (immutable).
 *
 * @param startingLineup - Player IDs/names starting on the field
 * @param benchPlayers - Player IDs/names starting on the bench
 * @param subs - Ordered list of substitution events to apply
 * @returns Current state of on-field and bench sets after all substitutions
 */
export function applySubstitutions(
  startingLineup: string[],
  benchPlayers: string[],
  subs: Array<{ playerOff: string; playerOn: string }>,
): { onField: string[]; bench: string[] } {
  let onField = [...startingLineup];
  let bench = [...benchPlayers];

  for (const sub of subs) {
    const offIndex = onField.indexOf(sub.playerOff);
    const onIndex = bench.indexOf(sub.playerOn);

    // Skip if playerOff is not on the field or playerOn is not on the bench
    if (offIndex === -1 || onIndex === -1) {
      continue;
    }

    // Remove playerOff from onField, add to bench
    onField = onField.filter((_, i) => i !== offIndex);
    bench = [...bench, sub.playerOff];

    // Remove playerOn from bench, add to onField
    bench = bench.filter((p) => p !== sub.playerOn);
    onField = [...onField, sub.playerOn];
  }

  return { onField, bench };
}
