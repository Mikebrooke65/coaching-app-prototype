import { ApiClient, ApiError } from './api-client';
import type { GameTime, SubstitutionEvent, SquadMember } from '../types/database';

export class SubsApi extends ApiClient {
  // Get game time record for an event (kick-off, second half start)
  async getGameTime(eventId: string): Promise<GameTime | null> {
    const { data, error } = await this.supabase
      .from('game_times')
      .select('*')
      .eq('event_id', eventId)
      .maybeSingle();

    if (error) throw new ApiError(error.message);
    return data as GameTime | null;
  }

  // Create or update game time record (upsert on event_id)
  async upsertGameTime(
    eventId: string,
    kickOffTime?: string,
    secondHalfStartTime?: string
  ): Promise<GameTime> {
    const { data: { user } } = await this.supabase.auth.getUser();

    const record: Record<string, any> = {
      event_id: eventId,
      created_by: user?.id,
      updated_by: user?.id,
    };

    if (kickOffTime !== undefined) {
      record.kick_off_time = kickOffTime;
    }
    if (secondHalfStartTime !== undefined) {
      record.second_half_start_time = secondHalfStartTime;
    }

    const { data, error } = await this.supabase
      .from('game_times')
      .upsert(record, { onConflict: 'event_id' })
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as GameTime;
  }

  // Get all substitution events for a game, ordered by game_minute
  async getSubstitutionEvents(eventId: string): Promise<SubstitutionEvent[]> {
    const { data, error } = await this.supabase
      .from('substitution_events')
      .select('*')
      .eq('event_id', eventId)
      .order('game_minute', { ascending: true });

    if (error) throw new ApiError(error.message);
    return data as SubstitutionEvent[];
  }

  // Record a new substitution event
  async recordSubstitution(sub: {
    event_id: string;
    player_off_id: string | null;
    player_off_guest_name: string | null;
    player_on_id: string | null;
    player_on_guest_name: string | null;
    game_minute: number;
    half: 1 | 2;
    strategy_used: 'random' | 'coach';
  }): Promise<SubstitutionEvent> {
    const { data: { user } } = await this.supabase.auth.getUser();

    const { data, error } = await this.supabase
      .from('substitution_events')
      .insert({
        ...sub,
        recorded_at: new Date().toISOString(),
        created_by: user?.id,
        updated_by: user?.id,
      })
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as SubstitutionEvent;
  }

  // Get game day squad — joins event_attendance with users to get display names
  async getGameDaySquad(eventId: string): Promise<SquadMember[]> {
    const { data, error } = await this.supabase
      .from('event_attendance')
      .select(`
        id,
        user_id,
        guest_name,
        attended,
        user:users!event_attendance_user_id_fkey(first_name, last_name)
      `)
      .eq('event_id', eventId)
      .eq('attended', true);

    if (error) throw new ApiError(error.message);

    return (data || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      guest_name: row.guest_name,
      display_name: row.user
        ? `${row.user.first_name} ${row.user.last_name}`
        : row.guest_name || 'Unknown',
      attended: row.attended,
      is_guest: row.user_id === null,
    }));
  }
}

export const subsApi = new SubsApi();
