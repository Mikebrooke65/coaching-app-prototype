import { ApiClient, ApiError } from './api-client';
import type { Event, EventRsvp, Team } from '../types/database';

export class EventsApi extends ApiClient {
  // Get events visible to current user
  async getEvents(): Promise<Event[]> {
    return this.query<Event>('events', {
      order: { column: 'event_date', ascending: true },
    });
  }

  // Get events by type
  async getEventsByType(eventType: 'game' | 'training' | 'general'): Promise<Event[]> {
    return this.query<Event>('events', {
      match: { event_type: eventType },
      order: { column: 'event_date', ascending: true },
    });
  }

  // Get a single event
  async getEvent(eventId: string): Promise<Event> {
    return this.queryOne<Event>('events', eventId);
  }

  // Create a new event
  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return this.insert<Event>('events', {
      ...event,
      created_by: user?.id,
    });
  }

  // Update an event
  async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return this.update<Event>('events', eventId, {
      ...updates,
      updated_by: user?.id,
    });
  }

  // Delete an event
  async deleteEvent(eventId: string): Promise<void> {
    return this.delete('events', eventId);
  }

  // Get user's RSVP for an event
  async getUserRsvp(eventId: string): Promise<EventRsvp | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('event_rsvps')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No RSVP found
      throw new ApiError(error.message);
    }
    return data as EventRsvp;
  }

  // Set user's RSVP for an event
  async setRsvp(
    eventId: string,
    status: 'going' | 'not_going' | 'maybe' | 'no_response'
  ): Promise<EventRsvp> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new ApiError('User not authenticated');

    // Try to update existing RSVP
    const { data: existing } = await this.supabase
      .from('event_rsvps')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return this.update<EventRsvp>('event_rsvps', existing.id, { status });
    }

    // Create new RSVP
    return this.insert<EventRsvp>('event_rsvps', {
      event_id: eventId,
      user_id: user.id,
      status,
    });
  }

  // Get user's teams (for event creation targeting)
  async getUserTeams(): Promise<Team[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase
      .from('team_members')
      .select('team:teams(*)')
      .eq('user_id', user.id);

    if (error) throw new ApiError(error.message);
    return data.map((tm: any) => tm.team).filter(Boolean);
  }

  // Get all teams (for admin)
  async getAllTeams(): Promise<Team[]> {
    return this.query<Team>('teams', {
      order: { column: 'name', ascending: true },
    });
  }

  // Update game event score
  async updateEventScore(
    eventId: string,
    teamScore: number,
    opponentScore: number
  ): Promise<Event> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return this.update<Event>('events', eventId, {
      team_score: teamScore,
      opponent_score: opponentScore,
      updated_by: user?.id,
    });
  }
}

export const eventsApi = new EventsApi();
