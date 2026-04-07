export interface FixtureDescriptor {
  homeTeamId: string;
  awayTeamId: string;
  roundNumber: number;
  matchNumber: number;
}

export interface RoundRobinInput {
  teamIds: string[];
  format: 'single_round_robin' | 'double_round_robin';
}

const BYE = '__BYE__';

/**
 * Generate round-robin fixtures using the circle method (rotating polygon algorithm).
 *
 * - For N teams (padded with a BYE if N is odd), produces N-1 rounds of N/2 matches.
 * - Team at index 0 is fixed; the remaining teams rotate clockwise each round.
 * - For double round-robin the algorithm runs twice with home/away swapped in the second pass.
 * - BYE matches are excluded from the output.
 * - matchNumber is a sequential counter across all fixtures starting at 1.
 */
export function generateRoundRobin(input: RoundRobinInput): FixtureDescriptor[] {
  const { teamIds, format } = input;

  if (teamIds.length < 2) {
    return [];
  }

  // Build the working list; add a BYE placeholder when the count is odd.
  const teams = [...teamIds];
  if (teams.length % 2 !== 0) {
    teams.push(BYE);
  }

  const n = teams.length;
  const rounds = n - 1;
  const matchesPerRound = n / 2;

  const singlePassFixtures: Omit<FixtureDescriptor, 'matchNumber'>[] = [];

  // Circle method: position 0 is fixed, positions 1..n-1 rotate.
  const rotating = teams.slice(1);

  for (let round = 0; round < rounds; round++) {
    const current = [teams[0], ...rotating];

    for (let match = 0; match < matchesPerRound; match++) {
      const home = current[match];
      const away = current[n - 1 - match];

      // Skip BYE matches
      if (home === BYE || away === BYE) {
        continue;
      }

      singlePassFixtures.push({
        homeTeamId: home,
        awayTeamId: away,
        roundNumber: round + 1,
      });
    }

    // Rotate: move last element to the front of the rotating array
    rotating.unshift(rotating.pop()!);
  }

  const fixtures: FixtureDescriptor[] = [];
  let matchNumber = 1;

  // First pass (or only pass for single round-robin)
  for (const f of singlePassFixtures) {
    fixtures.push({ ...f, matchNumber: matchNumber++ });
  }

  // Second pass for double round-robin: swap home/away, offset round numbers
  if (format === 'double_round_robin') {
    for (const f of singlePassFixtures) {
      fixtures.push({
        homeTeamId: f.awayTeamId,
        awayTeamId: f.homeTeamId,
        roundNumber: f.roundNumber + rounds,
        matchNumber: matchNumber++,
      });
    }
  }

  return fixtures;
}
