import { useState } from 'react';
import { Clock, Play, Shuffle, UserCog } from 'lucide-react';
import { subsApi } from '../../lib/subs-api';
import { RandomStrategy } from './RandomStrategy';
import { CoachStrategy } from './CoachStrategy';
import type { GameTime, SubstitutionEvent, SquadMember } from '../../types/database';

interface SubstitutionManagerProps {
  eventId: string;
  gameTime: GameTime | null;
  substitutionEvents: SubstitutionEvent[];
  squad: SquadMember[];
  lineup: string[];
  gamePlayers: number;
  halfDuration: number;
  strategy: 'random' | 'coach' | null;
  onStrategyChange: (strategy: 'random' | 'coach') => void;
  onGameTimeChange: (gt: GameTime) => void;
  onSubstitutionRecorded: (sub: SubstitutionEvent) => void;
}

export function SubstitutionManager({
  eventId,
  gameTime,
  substitutionEvents,
  squad,
  lineup,
  gamePlayers,
  halfDuration,
  strategy,
  onStrategyChange,
  onGameTimeChange,
  onSubstitutionRecorded,
}: SubstitutionManagerProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const kickedOff = !!gameTime?.kick_off_time;
  const secondHalfStarted = !!gameTime?.second_half_start_time;

  const handleRecordKickOff = async () => {
    try {
      setSaving(true);
      setError(null);
      const now = new Date().toISOString();
      const gt = await subsApi.upsertGameTime(eventId, now, undefined);
      onGameTimeChange(gt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record kick-off');
    } finally {
      setSaving(false);
    }
  };

  const handleRecordSecondHalf = async () => {
    try {
      setSaving(true);
      setError(null);
      const now = new Date().toISOString();
      const gt = await subsApi.upsertGameTime(eventId, undefined, now);
      onGameTimeChange(gt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record second half start');
    } finally {
      setSaving(false);
    }
  };

  // Derive bench from squad minus lineup
  const bench = squad.filter(m => {
    const id = m.user_id || m.id;
    return !lineup.includes(id);
  });

  const subsCount = bench.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Substitutions</h3>

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* Game time controls */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Game Time</p>
        <div className="flex gap-2">
          <button
            onClick={handleRecordKickOff}
            disabled={kickedOff || saving}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              kickedOff
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-[#ea7800] text-white hover:bg-[#d06e00] disabled:opacity-50'
            }`}
          >
            <Play className="w-4 h-4" />
            {kickedOff ? `Kicked off ${new Date(gameTime!.kick_off_time!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Record Kick-off'}
          </button>
          <button
            onClick={handleRecordSecondHalf}
            disabled={!kickedOff || secondHalfStarted || saving}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              secondHalfStarted
                ? 'bg-green-100 text-green-700 cursor-default'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <Clock className="w-4 h-4" />
            {secondHalfStarted ? `2nd half ${new Date(gameTime!.second_half_start_time!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : '2nd Half Start'}
          </button>
        </div>
      </div>

      {/* Strategy selector */}
      {subsCount > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Strategy</p>
          <div className="flex gap-2">
            <button
              onClick={() => onStrategyChange('random')}
              disabled={!kickedOff}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                strategy === 'random'
                  ? 'bg-[#ea7800] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <Shuffle className="w-4 h-4" />
              Random
            </button>
            <button
              onClick={() => onStrategyChange('coach')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                strategy === 'coach'
                  ? 'bg-[#ea7800] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UserCog className="w-4 h-4" />
              Coach
            </button>
          </div>
        </div>
      )}

      {subsCount === 0 && lineup.length > 0 && (
        <p className="text-sm text-gray-500 italic">No substitutes — all squad members are in the starting lineup.</p>
      )}

      {/* Strategy component */}
      {strategy === 'random' && kickedOff && (
        <RandomStrategy
          eventId={eventId}
          squad={squad}
          lineup={lineup}
          gamePlayers={gamePlayers}
          halfDuration={halfDuration}
          gameTime={gameTime!}
          substitutionEvents={substitutionEvents}
          onSubstitutionRecorded={onSubstitutionRecorded}
        />
      )}

      {strategy === 'coach' && (
        <CoachStrategy
          eventId={eventId}
          squad={squad}
          lineup={lineup}
          gamePlayers={gamePlayers}
          halfDuration={halfDuration}
          gameTime={gameTime}
          substitutionEvents={substitutionEvents}
          onSubstitutionRecorded={onSubstitutionRecorded}
        />
      )}

      {/* Substitution history */}
      {substitutionEvents.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">History</p>
          <div className="space-y-1">
            {substitutionEvents.map(sub => {
              const offName = sub.player_off_guest_name || squad.find(m => m.user_id === sub.player_off_id)?.display_name || 'Unknown';
              const onName = sub.player_on_guest_name || squad.find(m => m.user_id === sub.player_on_id)?.display_name || 'Unknown';
              return (
                <div key={sub.id} className="flex items-center gap-2 text-xs text-gray-600 px-2 py-1 bg-gray-50 rounded">
                  <span className="font-medium text-gray-800">{sub.game_minute}'</span>
                  <span className="text-red-500">↓ {offName}</span>
                  <span className="text-green-600">↑ {onName}</span>
                  <span className="ml-auto text-gray-400">{sub.strategy_used}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
