export interface CompletedFixture {
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
}

export interface StandingsConfig {
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
  tiebreakerRules: string[];
}

export interface StandingsRow {
  team_id: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

/**
 * Pure standings calculator — no database access.
 *
 * 1. Initialise a standings map for all teamIds with zeros.
 * 2. For each completed fixture, determine win/draw/loss and update both teams.
 * 3. Sort by: points (desc), then each tiebreaker rule in order, then alphabetical by team_id.
 *
 * Supported tiebreaker rules:
 *   - "goal_difference": goals_for − goals_against (desc)
 *   - "goals_scored":    goals_for (desc)
 *   - "head_to_head":    points from matches between tied teams only (desc)
 */
export function calculateStandings(
  teamIds: string[],
  fixtures: CompletedFixture[],
  config: StandingsConfig,
): StandingsRow[] {
  // 1. Initialise standings map
  const map = new Map<string, StandingsRow>();
  for (const id of teamIds) {
    map.set(id, {
      team_id: id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goals_for: 0,
      goals_against: 0,
      goal_difference: 0,
      points: 0,
    });
  }

  // 2. Process each fixture
  for (const f of fixtures) {
    const home = map.get(f.homeTeamId);
    const away = map.get(f.awayTeamId);

    // Skip fixtures involving teams not in the teamIds list
    if (!home || !away) continue;

    home.played++;
    away.played++;
    home.goals_for += f.homeScore;
    home.goals_against += f.awayScore;
    away.goals_for += f.awayScore;
    away.goals_against += f.homeScore;

    if (f.homeScore > f.awayScore) {
      // Home win
      home.won++;
      home.points += config.pointsForWin;
      away.lost++;
      away.points += config.pointsForLoss;
    } else if (f.homeScore < f.awayScore) {
      // Away win
      away.won++;
      away.points += config.pointsForWin;
      home.lost++;
      home.points += config.pointsForLoss;
    } else {
      // Draw
      home.drawn++;
      home.points += config.pointsForDraw;
      away.drawn++;
      away.points += config.pointsForDraw;
    }
  }

  // Compute goal difference
  for (const row of map.values()) {
    row.goal_difference = row.goals_for - row.goals_against;
  }

  // 3. Sort
  const rows = Array.from(map.values());

  rows.sort((a, b) => {
    // Primary: points descending
    if (b.points !== a.points) return b.points - a.points;

    // Apply each tiebreaker rule in order
    for (const rule of config.tiebreakerRules) {
      const diff = applyTiebreaker(rule, a, b, fixtures, config);
      if (diff !== 0) return diff;
    }

    // Final fallback: alphabetical by team_id
    return a.team_id.localeCompare(b.team_id);
  });

  return rows;
}

/**
 * Apply a single tiebreaker rule. Returns negative if `a` should rank higher,
 * positive if `b` should rank higher, 0 if still tied.
 */
function applyTiebreaker(
  rule: string,
  a: StandingsRow,
  b: StandingsRow,
  fixtures: CompletedFixture[],
  config: StandingsConfig,
): number {
  switch (rule) {
    case 'goal_difference':
      return b.goal_difference - a.goal_difference;

    case 'goals_scored':
      return b.goals_for - a.goals_for;

    case 'head_to_head':
      return compareHeadToHead(a.team_id, b.team_id, fixtures, config);

    default:
      return 0;
  }
}

/**
 * Compute head-to-head points from matches between two specific teams.
 * Returns negative if teamA has more h2h points, positive if teamB does, 0 if equal.
 */
function compareHeadToHead(
  teamA: string,
  teamB: string,
  fixtures: CompletedFixture[],
  config: StandingsConfig,
): number {
  let pointsA = 0;
  let pointsB = 0;

  for (const f of fixtures) {
    const isAHome = f.homeTeamId === teamA && f.awayTeamId === teamB;
    const isBHome = f.homeTeamId === teamB && f.awayTeamId === teamA;

    if (!isAHome && !isBHome) continue;

    const aScore = isAHome ? f.homeScore : f.awayScore;
    const bScore = isAHome ? f.awayScore : f.homeScore;

    if (aScore > bScore) {
      pointsA += config.pointsForWin;
      pointsB += config.pointsForLoss;
    } else if (aScore < bScore) {
      pointsB += config.pointsForWin;
      pointsA += config.pointsForLoss;
    } else {
      pointsA += config.pointsForDraw;
      pointsB += config.pointsForDraw;
    }
  }

  return pointsB - pointsA;
}
