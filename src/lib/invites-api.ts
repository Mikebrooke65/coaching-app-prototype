import { ApiClient, ApiError } from './api-client';
import type {
  InviteCode,
  InviteCodeValidation,
  LiteRegistrationData,
  InvitePlayerData,
  User,
} from '../types/database';

/** Generate a random alphanumeric code */
function generateCode(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

class InvitesApi extends ApiClient {
  /** Generate a new invite code for a team, optionally linked to a competition */
  async generateInviteCode(
    teamId: string,
    recipientEmail: string,
    recipientPhone?: string,
    competitionId?: string
  ): Promise<InviteCode> {
    const { data: { user: authUser } } = await this.supabase.auth.getUser();
    if (!authUser) throw new ApiError('Not authenticated');

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000); // 21 days

    const { data, error } = await this.supabase
      .from('invite_codes')
      .insert({
        code: generateCode(),
        team_id: teamId,
        competition_id: competitionId || null,
        created_by: authUser.id,
        recipient_email: recipientEmail,
        recipient_phone: recipientPhone || null,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as InviteCode;
  }

  /** Validate an invite code — returns status and details */
  async validateInviteCode(code: string): Promise<InviteCodeValidation> {
    const { data, error } = await this.supabase
      .from('invite_codes')
      .select('*, team:teams(*)')
      .eq('code', code)
      .single();

    if (error || !data) {
      return { valid: false, error: 'invalid' };
    }

    if (data.redeemed_by) {
      return { valid: false, error: 'redeemed', invite: data };
    }

    if (new Date(data.expires_at) < new Date()) {
      // Notify the inviter about expired code usage
      await this.notifyExpiredCodeUsage(data);
      return { valid: false, error: 'expired', invite: data };
    }

    return { valid: true, invite: data, team: data.team };
  }

  /** Redeem an invite code — creates lite user or adds existing user to team */
  async redeemInviteCode(code: string, userData: LiteRegistrationData): Promise<User> {
    const validation = await this.validateInviteCode(code);
    if (!validation.valid || !validation.invite) {
      throw new ApiError(validation.error || 'Invalid invite code');
    }

    const invite = validation.invite;

    // Check if user already exists
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', userData.email)
      .single();

    let userId: string;

    if (existingUser) {
      // Existing user — skip account creation, just add to team
      userId = existingUser.id;
    } else {
      // Create new Supabase auth user
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      if (authError) throw new ApiError(authError.message);
      if (!authData.user) throw new ApiError('Failed to create auth user');

      userId = authData.user.id;

      // Create user record
      const { error: userError } = await this.supabase
        .from('users')
        .insert({
          id: userId,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          cellphone: '',
          role: 'player',
          user_type: 'lite',
          active: true,
          privacy_consent_at: userData.privacy_consent ? new Date().toISOString() : null,
        });
      if (userError) throw new ApiError(userError.message);
    }

    // Add to team (skip if already a member)
    const { data: existingMember } = await this.supabase
      .from('team_members')
      .select('id')
      .eq('team_id', invite.team_id)
      .eq('user_id', userId)
      .single();

    if (!existingMember) {
      const { error: tmError } = await this.supabase
        .from('team_members')
        .insert({ team_id: invite.team_id, user_id: userId, role: 'player' });
      if (tmError) throw new ApiError(tmError.message);
    }

    // Mark invite as redeemed
    await this.supabase
      .from('invite_codes')
      .update({ redeemed_by: userId, redeemed_at: new Date().toISOString() })
      .eq('id', invite.id);

    // Return the user
    const { data: user, error: fetchError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) throw new ApiError(fetchError.message);
    return user as User;
  }

  /** Get all pending (unredeemed, unexpired) invite codes */
  async getPendingInvites(): Promise<InviteCode[]> {
    const { data, error } = await this.supabase
      .from('invite_codes')
      .select('*, team:teams(*)')
      .is('redeemed_by', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw new ApiError(error.message);
    return data as InviteCode[];
  }

  /** Invite a mid-season player to a WCR team */
  async inviteMidSeasonPlayer(teamId: string, playerData: InvitePlayerData): Promise<InviteCode> {
    // Check if user already exists
    const { data: existingUser } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', playerData.email)
      .single();

    if (existingUser) {
      // Add existing user to team directly
      const { data: existingMember } = await this.supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', existingUser.id)
        .single();

      if (!existingMember) {
        await this.supabase
          .from('team_members')
          .insert({ team_id: teamId, user_id: existingUser.id, role: 'player' });
      }
    }

    // Generate invite code regardless (for tracking)
    return this.generateInviteCode(teamId, playerData.email, playerData.phone);
  }

  /** Notify the inviter that an expired code was used */
  private async notifyExpiredCodeUsage(invite: InviteCode): Promise<void> {
    // Use in-app messaging to notify the creator
    // For MVP: we'll create a system message to the inviter
    try {
      const { data: creator } = await this.supabase
        .from('users')
        .select('first_name, last_name')
        .eq('id', invite.created_by)
        .single();

      if (creator) {
        console.log(
          `Expired invite code ${invite.code} was used. Notifying ${creator.first_name} ${creator.last_name}.`
        );
        // TODO: Send in-app message to invite.created_by when messaging integration is wired
      }
    } catch {
      // Non-critical — log and continue
      console.warn('Failed to notify inviter about expired code');
    }
  }
}

export const invitesApi = new InvitesApi();
