import { ApiClient, ApiError } from './api-client';
import type {
  TeamMember,
  TeamMemberWithUser,
  TeamMemberWithTeam,
  TeamRole,
  User,
  LiteUserReport,
} from '../types/database';

class RolesApi extends ApiClient {
  /** Get all members of a team with user details */
  async getTeamMembers(teamId: string): Promise<TeamMemberWithUser[]> {
    const { data, error } = await this.supabase
      .from('team_members')
      .select('*, user:users(*)')
      .eq('team_id', teamId)
      .order('role', { ascending: true });

    if (error) throw new ApiError(error.message);
    return data as TeamMemberWithUser[];
  }

  /** Get all team memberships for a user with team details */
  async getUserTeamMemberships(userId: string): Promise<TeamMemberWithTeam[]> {
    const { data, error } = await this.supabase
      .from('team_members')
      .select('*, team:teams(*)')
      .eq('user_id', userId);

    if (error) throw new ApiError(error.message);
    return data as TeamMemberWithTeam[];
  }

  /** Add a user to a team with a specific role */
  async addTeamMember(teamId: string, userId: string, role: TeamRole = 'player'): Promise<TeamMember> {
    const { data, error } = await this.supabase
      .from('team_members')
      .insert({ team_id: teamId, user_id: userId, role })
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as TeamMember;
  }

  /** Update the role of an existing team membership */
  async updateTeamMemberRole(membershipId: string, role: TeamRole): Promise<TeamMember> {
    const { data, error } = await this.supabase
      .from('team_members')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', membershipId)
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as TeamMember;
  }

  /** Remove a team membership */
  async removeTeamMember(membershipId: string): Promise<void> {
    const { error } = await this.supabase
      .from('team_members')
      .delete()
      .eq('id', membershipId);

    if (error) throw new ApiError(error.message);
  }

  /** Promote a lite user to full user (preserves all team memberships) */
  async promoteToFullUser(userId: string): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .update({ user_type: 'full' })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as User;
  }

  /** Get a report of all lite users, optionally filtered by team */
  async getLiteUsersReport(teamId?: string): Promise<LiteUserReport[]> {
    let query = this.supabase
      .from('team_members')
      .select('*, user:users(*), team:teams(*)')
      .eq('user:users.user_type', 'lite');

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;
    if (error) throw new ApiError(error.message);

    const now = new Date();
    return (data || []).map((row: any) => ({
      user: row.user,
      team_name: row.team.name,
      team_age_group: row.team.age_group,
      date_added: row.created_at,
      days_since_creation: Math.floor(
        (now.getTime() - new Date(row.created_at).getTime()) / (1000 * 60 * 60 * 24)
      ),
    }));
  }
}

export const rolesApi = new RolesApi();
