import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { applySubstitutions } from '../../lib/substitution-state';
import { calculateGameMinute } from '../../lib/game-time-utils';
import { subsApi } from '../../lib/subs-api';
import type { GameTime, SubstitutionEvent, SquadMember } from '../../types/database';

interface CoachStrategyProps {
  eventId: string;
  squad: SquadMember[];
  lineup: string[];
  gamePlayers: number;
  halfDuration: number;
  gameTime: GameTime | null;
  substitutionEvents: SubstitutionEvent[];
  onSubstitutionRecorded: (sub: SubstitutionEvent) => void;
}

export function CoachStrategy({
  eventId,
  squad,
  lineup,
  halfDuration,
  gameTime,
  substitutionEvents,
  onSubstitutionRecorded,
}: CoachStrategyProps) {
  const [selectedOff, setSelectedOff] = useState<string | null>(null);
  const [selectedOn, setSelectedOn] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute current on-field and bench from starting lineup + recorded subs
  const benchIds = squad
    .filter(m => !lineup.includes(m.user_id || m.id))
    .map(m => m.user_id || m.id);

  const appliedSubs = substitutionEvents.map(s => ({
    playerOff: s.player_off_id || s.player_off_guest_name || '',
    playerOn: s.player_on_id || s.player_on_guest_name || '',
  }));

  const { onField, bench } = applySubstitutions(lineup, benchIds, appliedSubs);

  const getName = (id: string) =>
    squad.find(m => (m.user_id || m.id) === id)?.display_name || id;

  const getMember = (id: string) =>
    squad.find(m => (m.user_id || m.id) === id);

  const getCurrentHalf = (): 1 | 2 => {
    if (gameTime?.second_half_start_time) return 2;
    return 1;
  };

  const handleConfirmSwap = async () => {
    if (!selectedOff || !selectedOn) return;
    try {
      setSaving(true);
      setError(null);

      const half = getCurrentHalf();
      let gameMinute = 0;
      if (gameTime?.kick_off_time) {
        const ref = half === 2 && gameTime.second_half_start_time
          ? new Date(gameTime.second_half_start_time)
          : new Date(gameTime.kick_off_time);
        gameMinute = calculateGameMinute(ref, new Date(), halfDuration, half);
      }

      const offMember = getMember(selectedOff);
      const onMember = getMember(selectedOn);

      const sub = await subsApi.recordSubstitution({
        event_id: eventId,
        player_off_id: offMember?.user_id || null,
        player_off_guest_name: offMember?.is_guest ? offMember.guest_name : null,
        player_on_id: onMember?.user_id || null,
        player_on_guest_name: onMember?.is_guest ? onMember.guest_name : null,
        game_minute: gameMinute,
        half,
        strategy_used: 'coach',
      });

      onSubstitutionRecorded(sub);
      setSelectedOff(null);
      setSelectedOn(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record substitution');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">{error}</div>
      )}

      {/* On-field players */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
          On Field ({onField.length})
        </p>
        <div className="space-y-1">
          {onField.map(id => (
            <button
              key={id}
              onClick={() => setSelectedOff(selectedOff === id ? null : id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                selectedOff === id
                  ? 'bg-red-50 border border-red-300 text-red-700'
                  : 'bg-green-50 border border-green-100 text-gray-800 hover:bg-green-100'
              }`}
            >
              {selectedOff === id && <ArrowDown className="w-4 h-4 text-red-500" />}
              <span>{getName(id)}</span>
              {getMember(id)?.is_guest && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 font-medium">Guest</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bench players */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
          Bench ({bench.length})
        </p>
        <div className="space-y-1">
          {bench.map(id => (
            <button
              key={id}
              onClick={() => setSelectedOn(selectedOn === id ? null : id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                selectedOn === id
                  ? 'bg-green-50 border border-green-300 text-green-700'
                  : 'bg-gray-50 border border-gray-100 text-gray-800 hover:bg-gray-100'
              }`}
            >
              {selectedOn === id && <ArrowUp className="w-4 h-4 text-green-500" />}
              <span>{getName(id)}</span>
              {getMember(id)?.is_guest && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-600 font-medium">Guest</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm swap button */}
      {selectedOff && selectedOn && (
        <button
          onClick={handleConfirmSwap}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-[#ea7800] text-white hover:bg-[#d06e00] transition-colors disabled:opacity-50"
        >
          {saving ? 'Recording...' : `Swap: ${getName(selectedOff)} ↔ ${getName(selectedOn)}`}
        </button>
      )}

      {!selectedOff && !selectedOn && bench.length > 0 && (
        <p className="text-xs text-gray-400 text-center">Select a player to come off, then a player to go on</p>
      )}
    </div>
  );
}
