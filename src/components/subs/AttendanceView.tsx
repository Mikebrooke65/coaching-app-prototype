import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import type { EventAttendance } from '../../types/database';
import { groupByRsvpStatus, deriveAttendanceFromRsvp } from '../../lib/attendance-utils';

interface AttendanceViewProps {
  players: Array<{
    user_id: string;
    first_name: string;
    last_name: string;
    rsvp_status: 'going' | 'not_going' | 'maybe' | 'no_response';
  }>;
  attendanceRecords: EventAttendance[];
  onToggleAttendance: (userId: string, attended: boolean) => void;
  onAddGuest: (guestName: string) => void;
  onRemoveGuest: (attendanceId: string) => void;
}

const GROUP_LABELS: Record<string, string> = {
  going: 'Going',
  maybe: 'Maybe',
  not_going: 'Not Going',
  no_response: 'No Response',
};

const GROUP_ORDER = ['going', 'maybe', 'not_going', 'no_response'] as const;

export function AttendanceView({
  players,
  attendanceRecords,
  onToggleAttendance,
  onAddGuest,
  onRemoveGuest,
}: AttendanceViewProps) {
  const [guestName, setGuestName] = useState('');

  const grouped = groupByRsvpStatus(players);

  const getAttendanceStatus = (userId: string, rsvpStatus: string): boolean => {
    const record = attendanceRecords.find((r) => r.user_id === userId);
    if (record) return record.attended;
    return deriveAttendanceFromRsvp(rsvpStatus);
  };

  const guestRecords = attendanceRecords.filter(
    (r) => r.user_id === null && r.guest_name
  );

  const handleAddGuest = () => {
    const trimmed = guestName.trim();
    if (!trimmed) return;
    onAddGuest(trimmed);
    setGuestName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddGuest();
    }
  };

  const isAddDisabled = guestName.trim().length === 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendance</h3>

      {/* Player groups by RSVP status */}
      <div className="space-y-4">
        {GROUP_ORDER.map((status) => {
          const group = grouped[status];
          if (group.length === 0) return null;

          return (
            <div key={status}>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                {GROUP_LABELS[status]}
              </p>
              <div className="space-y-1">
                {group.map((player) => {
                  const isPresent = getAttendanceStatus(
                    player.user_id,
                    player.rsvp_status,
                  );

                  return (
                    <div
                      key={player.user_id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border-l-4 ${
                        isPresent
                          ? 'border-l-green-400 bg-green-50/50'
                          : 'border-l-red-400 bg-red-50/50'
                      }`}
                    >
                      <span className="text-sm text-gray-800">
                        {player.first_name} {player.last_name}
                      </span>
                      {isPresent ? (
                        <button
                          onClick={() =>
                            onToggleAttendance(player.user_id, false)
                          }
                          className="px-3 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          Absent
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onToggleAttendance(player.user_id, true)
                          }
                          className="px-3 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                        >
                          Present
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Guest Players Section */}
      <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
          Guest Players
        </p>

        {/* Existing guests */}
        {guestRecords.length > 0 && (
          <div className="space-y-1 mb-3">
            {guestRecords.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg border-l-4 border-l-green-400 bg-green-50/50"
              >
                <span className="text-sm text-gray-800">
                  {guest.guest_name}
                </span>
                <button
                  onClick={() => onRemoveGuest(guest.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove guest ${guest.guest_name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add guest input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <UserPlus className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Guest player name"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea7800] focus:border-transparent"
            />
          </div>
          <button
            onClick={handleAddGuest}
            disabled={isAddDisabled}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#ea7800] text-white hover:bg-[#d06e00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
