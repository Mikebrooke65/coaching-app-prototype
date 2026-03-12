import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Users, AlertTriangle } from 'lucide-react';
import { eventsApi } from '../lib/events-api';
import { attendanceApi } from '../lib/attendance-api';
import { subsApi } from '../lib/subs-api';
import { teamsApi } from '../lib/teams-api';
import { deriveAttendanceFromRsvp } from '../lib/attendance-utils';
import { applySubstitutions } from '../lib/substitution-state';
import { calculateGameMinute } from '../lib/game-time-utils';
import { AttendanceView } from '../components/subs/AttendanceView';
import { LineupSelector } from '../components/subs/LineupSelector';
import { SubstitutionManager } from '../components/subs/SubstitutionManager';
import { PlayingTimeBar } from '../components/subs/PlayingTimeBar';
import type { Event, Team, EventAttendance, GameTime, SubstitutionEvent as SubEvent, SquadMember } from '../types/database';

export function SubsPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [rsvpPlayers, setRsvpPlayers] = useState<Array<{
    user_id: string;
    first_name: string;
    last_name: string;
    rsvp_status: 'going' | 'not_going' | 'maybe' | 'no_response';
  }>>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<EventAttendance[]>([]);
  const [gameTime, setGameTime] = useState<GameTime | null>(null);
  const [substitutionEvents, setSubstitutionEvents] = useState<SubEvent[]>([]);
  const [lineup, setLineup] = useState<string[]>([]);
  const [strategy, setStrategy] = useState<'random' | 'coach' | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derive the game day squad from attendance + RSVP defaults
  const getSquad = useCallback((): SquadMember[] => {
    const squad: SquadMember[] = [];

    // Rostered players who are present
    for (const player of rsvpPlayers) {
      const record = attendanceRecords.find(r => r.user_id === player.user_id);
      const attended = record ? record.attended : deriveAttendanceFromRsvp(player.rsvp_status);
      if (attended) {
        squad.push({
          id: record?.id || player.user_id,
          user_id: player.user_id,
          guest_name: null,
          display_name: `${player.first_name} ${player.last_name}`,
          attended: true,
          is_guest: false,
          rsvp_status: player.rsvp_status,
        });
      }
    }

    // Guest players
    for (const record of attendanceRecords) {
      if (record.user_id === null && record.guest_name && record.attended) {
        squad.push({
          id: record.id,
          user_id: null,
          guest_name: record.guest_name,
          display_name: record.guest_name,
          attended: true,
          is_guest: true,
        });
      }
    }

    return squad;
  }, [rsvpPlayers, attendanceRecords]);

  // Load all data
  useEffect(() => {
    if (!eventId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load event
        const eventData = await eventsApi.getEvent(eventId);
        setEvent(eventData);

        // Load team (first target team)
        let teamData: Team | null = null;
        if (eventData.target_teams && eventData.target_teams.length > 0) {
          teamData = await teamsApi.getTeam(eventData.target_teams[0]);
          setTeam(teamData);
        }

        // Load ALL team members who are PLAYERS (not coaches/managers)
        const teamIds = eventData.target_teams || [];
        let allMembers: Array<{ user_id: string; first_name: string; last_name: string }> = [];
        if (teamIds.length > 0) {
          const { data: memberData, error: memberError } = await eventsApi.supabase
            .from('team_members')
            .select(`
              user_id,
              role,
              user:users!team_members_user_id_fkey(first_name, last_name)
            `)
            .in('team_id', teamIds)
            .eq('role', 'player');

          if (!memberError && memberData) {
            allMembers = memberData.map((m: any) => ({
              user_id: m.user_id,
              first_name: m.user?.first_name || '',
              last_name: m.user?.last_name || '',
            }));
          }
        }

        // Load RSVP data
        const rsvpMap: Record<string, string> = {};
        const { data: rsvpData, error: rsvpError } = await eventsApi.supabase
          .from('event_rsvps')
          .select('user_id, status')
          .eq('event_id', eventId);

        if (!rsvpError && rsvpData) {
          for (const r of rsvpData) {
            rsvpMap[r.user_id] = r.status;
          }
        }

        // Merge: all team members with their RSVP status (default to no_response)
        // Deduplicate by user_id in case a member is in multiple target teams
        const seen = new Set<string>();
        const players = allMembers
          .filter(m => {
            if (seen.has(m.user_id)) return false;
            seen.add(m.user_id);
            return true;
          })
          .map(m => ({
            user_id: m.user_id,
            first_name: m.first_name,
            last_name: m.last_name,
            rsvp_status: (rsvpMap[m.user_id] || 'no_response') as 'going' | 'not_going' | 'maybe' | 'no_response',
          }));

        setRsvpPlayers(players);

        // Load attendance records
        const attendance = await attendanceApi.getEventAttendance(eventId);
        setAttendanceRecords(attendance);

        // Load game time
        const gt = await subsApi.getGameTime(eventId);
        setGameTime(gt);

        // Load substitution events
        const subs = await subsApi.getSubstitutionEvents(eventId);
        setSubstitutionEvents(subs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load game data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  const handleToggleAttendance = async (userId: string, attended: boolean) => {
    if (!eventId) return;
    try {
      const record = await attendanceApi.upsertAttendance(eventId, userId, attended);
      setAttendanceRecords(prev => {
        const existing = prev.findIndex(r => r.user_id === userId);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = record;
          return updated;
        }
        return [...prev, record];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update attendance');
    }
  };

  const handleAddGuest = async (guestName: string) => {
    if (!eventId) return;
    try {
      const record = await attendanceApi.addGuestPlayer(eventId, guestName);
      setAttendanceRecords(prev => [...prev, record]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add guest');
    }
  };

  const handleRemoveGuest = async (attendanceId: string) => {
    try {
      await attendanceApi.removeGuestPlayer(attendanceId);
      setAttendanceRecords(prev => prev.filter(r => r.id !== attendanceId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove guest');
    }
  };

  const squad = getSquad();
  const gamePlayers = team?.game_players;
  const halfDuration = team?.half_duration;
  const teamConfigured = gamePlayers != null && halfDuration != null;

  // Compute on-field intervals for a player based on lineup + substitution events
  const computePlayerIntervals = (
    playerId: string,
    startingLineup: string[],
    subs: SubEvent[],
    gt: GameTime,
    hd: number,
  ): Array<{ start: number; end: number }> => {
    const intervals: Array<{ start: number; end: number }> = [];
    const isStarter = startingLineup.includes(playerId);
    let onField = isStarter;
    let onSince = isStarter ? 0 : -1;

    // Sort subs by game_minute
    const sorted = [...subs].sort((a, b) => a.game_minute - b.game_minute);

    for (const sub of sorted) {
      const offId = sub.player_off_id || sub.player_off_guest_name || '';
      const onId = sub.player_on_id || sub.player_on_guest_name || '';

      if (onField && offId === playerId) {
        intervals.push({ start: onSince, end: sub.game_minute });
        onField = false;
      } else if (!onField && onId === playerId) {
        onField = true;
        onSince = sub.game_minute;
      }
    }

    // If still on field, close interval at current game minute
    if (onField) {
      const now = new Date();
      const half = gt.second_half_start_time ? 2 : 1;
      const ref = half === 2
        ? new Date(gt.second_half_start_time!)
        : new Date(gt.kick_off_time!);
      const currentMinute = calculateGameMinute(ref, now, hd, half as 1 | 2);
      intervals.push({ start: onSince, end: currentMinute });
    }

    return intervals;
  };

  // Compute total elapsed game time in minutes
  const computeTotalElapsed = (gt: GameTime, hd: number): number => {
    const now = new Date();
    let total = 0;

    if (gt.kick_off_time) {
      const kickOff = new Date(gt.kick_off_time);
      const firstHalfElapsed = Math.min(hd, Math.max(0, Math.floor((now.getTime() - kickOff.getTime()) / 60000)));
      total += gt.second_half_start_time ? hd : firstHalfElapsed;
    }

    if (gt.second_half_start_time) {
      const secondStart = new Date(gt.second_half_start_time);
      const secondHalfElapsed = Math.min(hd, Math.max(0, Math.floor((now.getTime() - secondStart.getTime()) / 60000)));
      total += secondHalfElapsed;
    }

    return total || 1; // Avoid division by zero
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea7800] mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      {/* Back button */}
      <button
        onClick={() => navigate('/games')}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-3"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Games
      </button>

      {/* Page header */}
      <div className="border-l-8 border-[#ea7800] pl-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Subs</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Game context header */}
      {event && (
        <div
          className="rounded-xl shadow-sm overflow-hidden border border-orange-200 mb-4 p-3"
          style={{ backgroundColor: 'rgba(234, 120, 0, 0.2)' }}
        >
          <p className="font-bold text-gray-900 text-sm text-center">
            {team ? `${team.age_group} ${team.name}` : 'Team'} vs {event.opponent || 'TBD'}
          </p>
          <div className="flex items-center justify-center gap-3 mt-1 text-xs text-gray-500">
            <span>{formatDate(event.event_date)}</span>
            <span>{event.location}</span>
            {event.home_away && (
              <span className={`px-1.5 py-0 rounded text-[10px] font-semibold ${
                event.home_away === 'home' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {event.home_away.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Team config warning */}
      {!teamConfigured && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Team not configured</p>
            <p className="text-xs text-yellow-700 mt-1">
              Set game players and half duration in Teams Management on desktop before using substitutions.
            </p>
          </div>
        </div>
      )}

      {/* Attendance section */}
      <AttendanceView
        players={rsvpPlayers}
        attendanceRecords={attendanceRecords}
        onToggleAttendance={handleToggleAttendance}
        onAddGuest={handleAddGuest}
        onRemoveGuest={handleRemoveGuest}
      />

      {/* Game Day Squad count */}
      <div className="mt-4 mb-2 flex items-center gap-2">
        <Users className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">
          Game Day Squad: {squad.length} present
        </span>
      </div>

      {/* Placeholder sections for components to be wired in Task 13.1 */}
      {teamConfigured && squad.length > 0 && (
        <div className="space-y-4 mt-4">
          {/* Playing time bars for squad members (visible after kick-off) */}
          {gameTime?.kick_off_time && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Playing Time</p>
              <div className="space-y-2">
                {squad.map(member => {
                  const memberId = member.user_id || member.id;
                  const intervals = computePlayerIntervals(memberId, lineup, substitutionEvents, gameTime!, halfDuration!);
                  const totalElapsed = computeTotalElapsed(gameTime!, halfDuration!);
                  return (
                    <div key={memberId} className="flex items-center gap-2">
                      <span className="text-xs text-gray-700 w-28 truncate">{member.display_name}</span>
                      <PlayingTimeBar
                        onFieldIntervals={intervals}
                        totalElapsedTime={totalElapsed}
                        isLive={!!gameTime?.kick_off_time}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <LineupSelector
            squad={squad}
            gamePlayers={gamePlayers!}
            lineup={lineup}
            onLineupChange={setLineup}
          />

          {lineup.length === gamePlayers && (
            <SubstitutionManager
              eventId={eventId!}
              gameTime={gameTime}
              substitutionEvents={substitutionEvents}
              squad={squad}
              lineup={lineup}
              gamePlayers={gamePlayers!}
              halfDuration={halfDuration!}
              strategy={strategy}
              onStrategyChange={setStrategy}
              onGameTimeChange={setGameTime}
              onSubstitutionRecorded={(sub) => setSubstitutionEvents(prev => [...prev, sub])}
            />
          )}
        </div>
      )}
    </div>
  );
}
