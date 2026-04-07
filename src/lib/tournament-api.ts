import { ApiClient, ApiError } from './api-client';
import type {
  Competition,
  Event,
  TournamentFormat,
} from '../types/database';
import { generateRoundRobin } from './round-robin';
import { calculateStandings } from './standings-engine';
import type { CompletedFixture, StandingsConfig } from './standings-engine';

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface TournamentConfig {
  format: TournamentFormat;
  points_for_win: number;
  points_for_draw: number;
  points_for_loss: number;
  tiebreaker_rules: string[];
}

export interface GenerateFixturesParams {
  competitionId: string;
  matchDays: string[];        // ISO date strings
  defaultStartTime: string;   // e.g. "09:00"
  matchDuration: number;      // minutes
  venue?: string;
  pitches?: string[];
  confirmOverwrite?: boolean;
}

export interface StandingsRowWithName {
  competition_id: string;
  team_id: string;
  team_name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

// ── TournamentApi ───────────────────────────────────────────────────────────

class TournamentApi extends ApiClient {

  // ── 4.1  Basic CRUD ─────────────────────────────────────────────────────

  /** Fetch competition with tournament-specific fields. */
  async getTournamentConfig(competitionId: string): Promise<Competition> {
    const { data, error } = await this.supabase
      .from('competitions')
      .select('*')
      .eq('id', competitionId)
      .single();

    if (error) throw new ApiError(error.message);
    return data as Competition;
  }

  /** Update format, scoring rules, and tiebreaker_rules on a competition. */
  async updateTournamentConfig(
    competitionId: string,
    config: Partial<TournamentConfig>,
  ): Promise<Competition> {
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (config.format !== undefined) updates.format = config.format;
    if (config.points_for_win !== undefined) updates.points_for_win = config.points_for_win;
    if (config.points_for_draw !== undefined) updates.points_for_draw = config.points_for_draw;
    if (config.points_for_loss !== undefined) updates.points_for_loss = config.points_for_loss;
    if (config.tiebreaker_rules !== undefined) updates.tiebreaker_rules = config.tiebreaker_rules;

    const { data, error } = await this.supabase
      .from('competitions')
      .update(updates)
      .eq('id', competitionId)
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as Competition;
  }

  /** Get all fixtures (events) for a competition, ordered by round then match number. */
  async getFixtures(competitionId: string): Promise<Event[]> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('competition_id', competitionId)
      .order('round_number', { ascending: true })
      .order('match_number', { ascending: true });

    if (error) throw new ApiError(error.message);
    return data as Event[];
  }

  /** Get fixtures grouped by round_number → Map<number, Event[]>. */
  async getFixturesByRound(competitionId: string): Promise<Map<number, Event[]>> {
    const fixtures = await this.getFixtures(competitionId);
    const map = new Map<number, Event[]>();
    for (const f of fixtures) {
      const round = f.round_number ?? 0;
      if (!map.has(round)) map.set(round, []);
      map.get(round)!.push(f);
    }
    return map;
  }

  /** Get standings joined with team names, ordered by points desc. */
  async getStandings(competitionId: string): Promise<StandingsRowWithName[]> {
    const { data, error } = await this.supabase
      .from('competition_standings')
      .select('*, team:teams(name)')
      .eq('competition_id', competitionId)
      .order('points', { ascending: false });

    if (error) throw new ApiError(error.message);

    return (data as any[]).map((row) => ({
      competition_id: row.competition_id,
      team_id: row.team_id,
      team_name: row.team?.name ?? '',
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goals_for: row.goals_for,
      goals_against: row.goals_against,
      goal_difference: row.goal_difference,
      points: row.points,
    }));
  }

  /** Get club_tournament competitions linked to the current user's teams. */
  async getMyTournaments(): Promise<Competition[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new ApiError('User not authenticated');

    // 1. Get user's team IDs via team_members
    const { data: memberships, error: mErr } = await this.supabase
      .from('team_members')
      .select('team_id')
      .eq('user_id', user.id);

    if (mErr) throw new ApiError(mErr.message);
    const teamIds = (memberships ?? []).map((m: any) => m.team_id);
    if (teamIds.length === 0) return [];

    // 2. Get competition IDs linked to those teams
    const { data: compTeams, error: ctErr } = await this.supabase
      .from('competition_teams')
      .select('competition_id')
      .in('team_id', teamIds);

    if (ctErr) throw new ApiError(ctErr.message);
    const compIds = [...new Set((compTeams ?? []).map((ct: any) => ct.competition_id))];
    if (compIds.length === 0) return [];

    // 3. Fetch those competitions filtered to club_tournament
    const { data: comps, error: cErr } = await this.supabase
      .from('competitions')
      .select('*')
      .in('id', compIds)
      .eq('competition_type', 'club_tournament')
      .order('start_date', { ascending: false });

    if (cErr) throw new ApiError(cErr.message);
    return comps as Competition[];
  }

  // ── 4.2  generateFixtures ───────────────────────────────────────────────

  async generateFixtures(params: GenerateFixturesParams): Promise<{ fixtureCount: number }> {
    const {
      competitionId,
      matchDays,
      defaultStartTime,
      matchDuration,
      venue,
      pitches,
      confirmOverwrite,
    } = params;

    // --- Validation ---

    // Competition must exist
    const { data: comp, error: compErr } = await this.supabase
      .from('competitions')
      .select('*')
      .eq('id', competitionId)
      .single();

    if (compErr || !comp) throw new ApiError('Competition not found');
    const competition = comp as Competition;

    // Must be club_tournament
    if (competition.competition_type !== 'club_tournament') {
      throw new ApiError('Tournament features only apply to Club Tournament competitions');
    }

    // Must have a format configured
    if (!competition.format) {
      throw new ApiError('Tournament format must be configured before generating fixtures');
    }

    // Must have ≥ 3 linked teams
    const { data: compTeams, error: ctErr } = await this.supabase
      .from('competition_teams')
      .select('team_id, team:teams(id, name)')
      .eq('competition_id', competitionId);

    if (ctErr) throw new ApiError(ctErr.message);
    if (!compTeams || compTeams.length < 3) {
      throw new ApiError('At least 3 teams are required to generate fixtures');
    }

    // Check for existing fixtures
    const { data: existingFixtures, error: efErr } = await this.supabase
      .from('events')
      .select('id')
      .eq('competition_id', competitionId)
      .limit(1);

    if (efErr) throw new ApiError(efErr.message);

    if (existingFixtures && existingFixtures.length > 0) {
      if (!confirmOverwrite) {
        throw new ApiError('Fixtures already exist. Confirm overwrite to regenerate.');
      }
      // Delete existing fixtures for this competition
      const { error: delErr } = await this.supabase
        .from('events')
        .delete()
        .eq('competition_id', competitionId);

      if (delErr) throw new ApiError(delErr.message);
    }

    // --- Generate round-robin descriptors ---

    const teamMap = new Map<string, string>(); // id → name
    for (const ct of compTeams as any[]) {
      teamMap.set(ct.team_id, ct.team?.name ?? ct.team_id);
    }
    const teamIds = Array.from(teamMap.keys());

    const descriptors = generateRoundRobin({
      teamIds,
      format: competition.format,
    });

    // --- Distribute rounds across match days ---

    // Collect unique round numbers
    const roundNumbers = [...new Set(descriptors.map((d) => d.roundNumber))].sort(
      (a, b) => a - b,
    );

    // Even distribution: assign rounds to match days
    const roundToDay = new Map<number, string>();
    for (let i = 0; i < roundNumbers.length; i++) {
      roundToDay.set(roundNumbers[i], matchDays[i % matchDays.length]);
    }

    // --- Assign pitches with no time overlap ---

    const pitchList = pitches && pitches.length > 0 ? pitches : ['Pitch 1'];

    // Track next available time per pitch per day
    // key = `${day}::${pitch}` → next available time in minutes from midnight
    const pitchSchedule = new Map<string, number>();

    const parseTime = (t: string): number => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + (m || 0);
    };
    const formatTime = (mins: number): string => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    const defaultStartMins = parseTime(defaultStartTime);

    // Build event rows
    const { data: { user } } = await this.supabase.auth.getUser();

    const eventRows: Record<string, unknown>[] = [];

    for (const desc of descriptors) {
      const day = roundToDay.get(desc.roundNumber)!;
      const homeName = teamMap.get(desc.homeTeamId) ?? desc.homeTeamId;
      const awayName = teamMap.get(desc.awayTeamId) ?? desc.awayTeamId;

      // Find the first pitch with an available slot
      let assignedPitch = pitchList[0];
      let startMins = defaultStartMins;

      for (const p of pitchList) {
        const key = `${day}::${p}`;
        const nextAvail = pitchSchedule.get(key) ?? defaultStartMins;
        if (nextAvail <= startMins || !pitchSchedule.has(`${day}::${assignedPitch}`)) {
          assignedPitch = p;
          startMins = nextAvail;
          break;
        }
      }

      // Find earliest available slot across all pitches for this day
      let bestPitch = pitchList[0];
      let bestStart = pitchSchedule.get(`${day}::${pitchList[0]}`) ?? defaultStartMins;
      for (const p of pitchList) {
        const key = `${day}::${p}`;
        const nextAvail = pitchSchedule.get(key) ?? defaultStartMins;
        if (nextAvail < bestStart) {
          bestStart = nextAvail;
          bestPitch = p;
        }
      }
      assignedPitch = bestPitch;
      startMins = bestStart;

      // Update schedule for this pitch
      const schedKey = `${day}::${assignedPitch}`;
      pitchSchedule.set(schedKey, startMins + matchDuration);

      const eventDate = `${day}T${formatTime(startMins)}:00`;

      eventRows.push({
        title: `${homeName} vs ${awayName}`,
        event_type: 'game',
        event_date: eventDate,
        location: venue ?? '',
        competition_id: competitionId,
        round_number: desc.roundNumber,
        match_number: desc.matchNumber,
        pitch: assignedPitch,
        target_teams: [desc.homeTeamId, desc.awayTeamId],
        target_roles: [],
        target_divisions: [],
        target_age_groups: [],
        created_by: user?.id,
      });
    }

    // --- Bulk insert fixtures ---

    if (eventRows.length > 0) {
      const { error: insErr } = await this.supabase.from('events').insert(eventRows);
      if (insErr) throw new ApiError(insErr.message);
    }

    // --- Initialize standings rows for all teams (upsert with zeros) ---

    const standingsRows = teamIds.map((tid) => ({
      competition_id: competitionId,
      team_id: tid,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goals_for: 0,
      goals_against: 0,
      goal_difference: 0,
      points: 0,
    }));

    const { error: sErr } = await this.supabase
      .from('competition_standings')
      .upsert(standingsRows, { onConflict: 'competition_id,team_id' });

    if (sErr) throw new ApiError(sErr.message);

    return { fixtureCount: eventRows.length };
  }

  // ── 4.3  recalculateStandings ───────────────────────────────────────────

  async recalculateStandings(competitionId: string): Promise<StandingsRowWithName[]> {
    // 1. Query all events for this competition where both scores are recorded
    const { data: fixtures, error: fErr } = await this.supabase
      .from('events')
      .select('*')
      .eq('competition_id', competitionId)
      .not('team_score', 'is', null)
      .not('opponent_score', 'is', null);

    if (fErr) throw new ApiError(fErr.message);

    // 2. Map to CompletedFixture[]
    //    target_teams[0] = home, target_teams[1] = away
    //    team_score = home score, opponent_score = away score
    const completedFixtures: CompletedFixture[] = (fixtures ?? []).map((ev: any) => ({
      homeTeamId: ev.target_teams[0],
      awayTeamId: ev.target_teams[1],
      homeScore: ev.team_score,
      awayScore: ev.opponent_score,
    }));

    // 3. Fetch competition config for scoring rules
    const competition = await this.getTournamentConfig(competitionId);

    const config: StandingsConfig = {
      pointsForWin: competition.points_for_win ?? 3,
      pointsForDraw: competition.points_for_draw ?? 1,
      pointsForLoss: competition.points_for_loss ?? 0,
      tiebreakerRules: competition.tiebreaker_rules ?? [
        'goal_difference',
        'goals_scored',
        'head_to_head',
      ],
    };

    // 4. Get all team IDs linked to this competition
    const { data: compTeams, error: ctErr } = await this.supabase
      .from('competition_teams')
      .select('team_id')
      .eq('competition_id', competitionId);

    if (ctErr) throw new ApiError(ctErr.message);
    const teamIds = (compTeams ?? []).map((ct: any) => ct.team_id);

    // 5. Calculate standings using pure function
    const rows = calculateStandings(teamIds, completedFixtures, config);

    // 6. Upsert into competition_standings
    const upsertRows = rows.map((r) => ({
      competition_id: competitionId,
      team_id: r.team_id,
      played: r.played,
      won: r.won,
      drawn: r.drawn,
      lost: r.lost,
      goals_for: r.goals_for,
      goals_against: r.goals_against,
      goal_difference: r.goal_difference,
      points: r.points,
    }));

    if (upsertRows.length > 0) {
      const { error: uErr } = await this.supabase
        .from('competition_standings')
        .upsert(upsertRows, { onConflict: 'competition_id,team_id' });

      if (uErr) throw new ApiError(uErr.message);
    }

    // 7. Return standings with team names
    return this.getStandings(competitionId);
  }

  // ── 4.4  cancelFixture ─────────────────────────────────────────────────

  async cancelFixture(eventId: string): Promise<void> {
    // Fetch the event to get its competition_id before deleting
    const { data: ev, error: evErr } = await this.supabase
      .from('events')
      .select('competition_id')
      .eq('id', eventId)
      .single();

    if (evErr) throw new ApiError(evErr.message);
    const competitionId = (ev as any)?.competition_id;

    // Delete the event
    const { error: delErr } = await this.supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (delErr) throw new ApiError(delErr.message);

    // Trigger standings recalculation if this was a tournament fixture
    if (competitionId) {
      await this.recalculateStandings(competitionId);
    }
  }
}

export const tournamentApi = new TournamentApi();
