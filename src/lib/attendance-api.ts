import { ApiClient, ApiError } from './api-client';
import type { EventAttendance } from '../types/database';

export class AttendanceApi extends ApiClient {
  // Get all attendance records for an event
  async getEventAttendance(eventId: string): Promise<EventAttendance[]> {
    const { data, error } = await this.supabase
      .from('event_attendance')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) throw new ApiError(error.message);
    return data as EventAttendance[];
  }

  // Upsert an attendance record for a rostered player
  async upsertAttendance(
    eventId: string,
    userId: string,
    attended: boolean
  ): Promise<EventAttendance> {
    const { data: { user } } = await this.supabase.auth.getUser();

    const { data, error } = await this.supabase
      .from('event_attendance')
      .upsert(
        {
          event_id: eventId,
          user_id: userId,
          attended,
          recorded_at: new Date().toISOString(),
          created_by: user?.id,
          updated_by: user?.id,
        },
        { onConflict: 'event_id,user_id' }
      )
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as EventAttendance;
  }

  // Add a guest player to an event's attendance
  async addGuestPlayer(
    eventId: string,
    guestName: string
  ): Promise<EventAttendance> {
    const { data: { user } } = await this.supabase.auth.getUser();

    const { data, error } = await this.supabase
      .from('event_attendance')
      .insert({
        event_id: eventId,
        user_id: null,
        guest_name: guestName,
        attended: true,
        recorded_at: new Date().toISOString(),
        created_by: user?.id,
        updated_by: user?.id,
      })
      .select()
      .single();

    if (error) throw new ApiError(error.message);
    return data as EventAttendance;
  }

  // Remove a guest player attendance record
  async removeGuestPlayer(attendanceId: string): Promise<void> {
    const { error } = await this.supabase
      .from('event_attendance')
      .delete()
      .eq('id', attendanceId);

    if (error) throw new ApiError(error.message);
  }
}

export const attendanceApi = new AttendanceApi();
