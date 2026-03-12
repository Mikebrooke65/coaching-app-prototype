import { useState } from 'react';
import { CheckSquare, Square, AlertCircle } from 'lucide-react';
import { toggleLineupSelection } from '../../lib/lineup-utils';
import type { SquadMember } from '../../types/database';

interface LineupSelectorProps {
  squad: SquadMember[];
  gamePlayers: number;
  lineup: string[];
  onLineupChange: (lineup: string[]) => void;
}

export function LineupSelector({ squad, gamePlayers, lineup, onLineupChange }: LineupSelectorProps) {
  const [error, setError] = useState<string | null>(null);

  const handleToggle = (playerId: string) => {
    const result = toggleLineupSelection(lineup, playerId, gamePlayers);
    if (result.error) {
      setError(result.error);
      setTimeout(() => setError(null), 2000);
    } else {
      setError(null);
    }
    onLineupChange(result.lineup);
  };

  // Use user_id for rostered players, attendance record id for guests
  const getPlayerId = (member: SquadMember) => member.user_id || member.id;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Starting Lineup</h3>
        <span className={`text-sm font-medium px-2 py-0.5 rounded ${
          lineup.length === gamePlayers
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {lineup.length}/{gamePlayers} selected
        </span>
      </div>

      {error && (
        <div className="mb-2 flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      <div className="space-y-1">
        {squad.map(member => {
          const id = getPlayerId(member);
          const isSelected = lineup.includes(id);

          return (
            <button
              key={id}
              onClick={() => handleToggle(id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isSelected
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
              }`}
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <span className="text-sm text-gray-800">{member.display_name}</span>
              {member.is_guest && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 font-medium">
                  Guest
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
