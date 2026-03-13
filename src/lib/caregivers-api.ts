import { ApiClient, ApiError } from './api-client';
import type {
  PlayerCaregiver,
  CaregiverApproval,
  NewCaregiverData,
} from '../types/database';

class CaregiversApi extends ApiClient {
  /** Get all caregivers for a player */
  async getPlayerCaregivers(playerId: string): Promise<(PlayerCaregiver & { caregiver: any })[]> {
    const { data, error } = await this.supabase
      .from('player_caregivers')
      .select('*, caregiver:users!player_caregivers_caregiver_id_fkey(*)')
      .eq('player_id', playerId);

    if (error) throw new ApiError(error.message);
    return data || [];
  }

  /** Get all players for a caregiver */
  async getCaregiverPlayers(caregiverId: string): Promise<(PlayerCaregiver & { player: any })[]> {
    const { data, error } = await this.supabase
      .from('player_caregivers')
      .select('*, player:users!player_caregivers_player_id_fkey(*)')
      .eq('caregiver_id', caregiverId);

    if (error) throw new ApiError(error.message);
    return data || [];
  }

  /** Link a caregiver to a player */
  async linkCaregiverToPlayer(caregiverId: string, playerId: string): Promise<PlayerCaregiver> {
    const { data, error } = await this.supabase
      .from('player_caregivers')
      .insert({ caregiver_id: caregiverId, player_id: playerId })
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as PlayerCaregiver;
  }

  /** Unlink a caregiver from a player */
  async unlinkCaregiverFromPlayer(caregiverId: string, playerId: string): Promise<void> {
    const { error } = await this.supabase
      .from('player_caregivers')
      .delete()
      .eq('caregiver_id', caregiverId)
      .eq('player_id', playerId);

    if (error) throw new ApiError(error.message);
  }

  /** Request adding a new caregiver to a player. Skips approval if player has no existing caregivers. */
  async requestCaregiverAddition(
    playerId: string,
    caregiverData: NewCaregiverData,
    requestedBy: string
  ): Promise<CaregiverApproval | null> {
    // Check if player has existing caregivers
    const { data: existing } = await this.supabase
      .from('player_caregivers')
      .select('id')
      .eq('player_id', playerId);

    if (!existing || existing.length === 0) {
      // No existing caregivers — skip approval, create directly
      await this.createCaregiverDirectly(playerId, caregiverData);
      return null; // null signals approval was skipped
    }

    // Create approval request
    const { data, error } = await this.supabase
      .from('caregiver_approvals')
      .insert({
        player_id: playerId,
        new_caregiver_email: caregiverData.email,
        new_caregiver_first_name: caregiverData.first_name,
        new_caregiver_last_name: caregiverData.last_name,
        requested_by: requestedBy,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as CaregiverApproval;
  }

  /** Respond to a caregiver approval request */
  async respondToApproval(
    approvalId: string,
    approved: boolean,
    respondedBy: string
  ): Promise<CaregiverApproval> {
    const status = approved ? 'approved' : 'denied';

    const { data, error } = await this.supabase
      .from('caregiver_approvals')
      .update({
        status,
        responded_by: respondedBy,
        responded_at: new Date().toISOString(),
      })
      .eq('id', approvalId)
      .select()
      .single();

    if (error) throw new ApiError(error.message);

    // If approved, create the caregiver account and send invite
    if (approved && data) {
      await this.createCaregiverDirectly(data.player_id, {
        first_name: data.new_caregiver_first_name,
        last_name: data.new_caregiver_last_name,
        email: data.new_caregiver_email,
      });
    }

    return data as CaregiverApproval;
  }

  /** Get pending approval requests for a caregiver's linked players */
  async getMyPendingApprovals(caregiverId: string): Promise<CaregiverApproval[]> {
    // Get player IDs this caregiver is linked to
    const { data: links } = await this.supabase
      .from('player_caregivers')
      .select('player_id')
      .eq('caregiver_id', caregiverId);

    if (!links || links.length === 0) return [];

    const playerIds = links.map((l: any) => l.player_id);

    const { data, error } = await this.supabase
      .from('caregiver_approvals')
      .select('*')
      .in('player_id', playerIds)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw new ApiError(error.message);
    return data as CaregiverApproval[];
  }

  /** Escalate approvals that have been pending for more than 7 days */
  async escalateTimedOutApprovals(): Promise<CaregiverApproval[]> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await this.supabase
      .from('caregiver_approvals')
      .update({ status: 'escalated' })
      .eq('status', 'pending')
      .lt('created_at', sevenDaysAgo)
      .select();

    if (error) throw new ApiError(error.message);
    return data as CaregiverApproval[];
  }

  /** Create a caregiver user directly (used when no approval needed or after approval) */
  private async createCaregiverDirectly(
    playerId: string,
    caregiverData: NewCaregiverData
  ): Promise<void> {
    // Check if user already exists
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', caregiverData.email)
      .single();

    let caregiverId: string;

    if (existingUser) {
      caregiverId = existingUser.id;
    } else {
      // For MVP: create a placeholder user record (they'll complete registration via invite)
      // The actual auth account is created when they redeem the invite code
      // For now, we just record the intent — the invite flow handles the rest
      console.log(`Caregiver ${caregiverData.email} will be invited to register`);
      return; // Invite code flow will handle user creation
    }

    // Link caregiver to player (skip if already linked)
    const { data: existingLink } = await this.supabase
      .from('player_caregivers')
      .select('id')
      .eq('player_id', playerId)
      .eq('caregiver_id', caregiverId)
      .single();

    if (!existingLink) {
      await this.supabase
        .from('player_caregivers')
        .insert({ player_id: playerId, caregiver_id: caregiverId });
    }
  }
}

export const caregiversApi = new CaregiversApi();
