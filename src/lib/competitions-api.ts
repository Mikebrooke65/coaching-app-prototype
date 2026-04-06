import { ApiClient, ApiError } from './api-client';
import type {
  Competition,
  CompetitionTeam,
  CreateCompetitionPayload,
} from '../types/database';

class CompetitionsApi extends ApiClient {
  async getCompetitions(): Promise<Competition[]> {
    const { data, error } = await this.supabase
      .from('competitions')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw new ApiError(error.message);
    return data as Competition[];
  }

  async getCompetition(id: string): Promise<Competition> {
    const { data, error } = await this.supabase
      .from('competitions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new ApiError(error.message);
    return data as Competition;
  }

  async createCompetition(payload: CreateCompetitionPayload): Promise<Competition> {
    if (!payload.name || !payload.competition_type || !payload.start_date || !payload.end_date) {
      throw new ApiError('Name, competition type, start date, and end date are required');
    }
    if (new Date(payload.end_date) < new Date(payload.start_date)) {
      throw new ApiError('End date must be after start date');
    }

    const { data, error } = await this.supabase
      .from('competitions')
      .insert(payload)
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as Competition;
  }

  async updateCompetition(id: string, updates: Partial<Competition>): Promise<Competition> {
    const { data, error } = await this.supabase
      .from('competitions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as Competition;
  }

  async deleteCompetition(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('competitions')
      .delete()
      .eq('id', id);

    if (error) throw new ApiError(error.message);
  }

  /** Close a competition: set end_date to today and status to 'closed' */
  async closeCompetition(id: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await this.supabase
      .from('competitions')
      .update({ end_date: today, status: 'closed', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new ApiError(error.message);
  }

  async getCompetitionTeams(competitionId: string): Promise<CompetitionTeam[]> {
    const { data, error } = await this.supabase
      .from('competition_teams')
      .select('*, team:teams(*)')
      .eq('competition_id', competitionId);

    if (error) throw new ApiError(error.message);
    return data as CompetitionTeam[];
  }

  async linkTeam(competitionId: string, teamId: string): Promise<CompetitionTeam> {
    const { data, error } = await this.supabase
      .from('competition_teams')
      .insert({ competition_id: competitionId, team_id: teamId })
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as CompetitionTeam;
  }

  async unlinkTeam(competitionId: string, teamId: string): Promise<void> {
    const { error } = await this.supabase
      .from('competition_teams')
      .delete()
      .eq('competition_id', competitionId)
      .eq('team_id', teamId);

    if (error) throw new ApiError(error.message);
  }

  /** Remove lite users for a closed Other competition. Preserves promoted (full) users. */
  async cleanupLiteUsers(competitionId: string): Promise<{ removed: number; retained: number }> {
    // Get competition to verify it's a Club Tournament and closed
    const comp = await this.getCompetition(competitionId);
    if (comp.competition_type !== 'club_tournament') {
      throw new ApiError('Cleanup only applies to Club Tournament competitions');
    }

    // Get teams linked to this competition
    const { data: compTeams, error: ctError } = await this.supabase
      .from('competition_teams')
      .select('team_id')
      .eq('competition_id', competitionId);

    if (ctError) throw new ApiError(ctError.message);
    const teamIds = (compTeams || []).map((ct: any) => ct.team_id);
    if (teamIds.length === 0) return { removed: 0, retained: 0 };

    // Get team members who are lite users on these teams
    const { data: members, error: mError } = await this.supabase
      .from('team_members')
      .select('*, user:users(*)')
      .in('team_id', teamIds);

    if (mError) throw new ApiError(mError.message);

    let removed = 0;
    let retained = 0;

    for (const member of members || []) {
      if (member.user?.user_type === 'lite') {
        // Deactivate the lite user
        await this.supabase
          .from('users')
          .update({ active: false })
          .eq('id', member.user_id);
        // Remove their team membership
        await this.supabase
          .from('team_members')
          .delete()
          .eq('id', member.id);
        removed++;
      } else {
        retained++;
      }
    }

    return { removed, retained };
  }

  /** Check if a competition is currently active based on dates and status */
  isCompetitionActive(competition: Competition): boolean {
    if (competition.status === 'closed') return false;
    const now = new Date();
    const start = new Date(competition.start_date);
    const end = new Date(competition.end_date);
    return now >= start && now <= end;
  }
}

export const competitionsApi = new CompetitionsApi();
