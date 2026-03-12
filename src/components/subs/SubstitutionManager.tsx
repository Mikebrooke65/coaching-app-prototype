import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [elapsed, setElapsed] = useState<string>('00:00');
  const [subAlert, setSubAlert] = useState(false);
  const alertedMinutesRef = useRef<Set<number>>(new Set());

  const kickedOff = !!gameTime?.kick_off_time;
  const secondHalfStarted = !!gameTime?.second_half_start_time;

  // Compute current game minute from kick-off or 2nd half start
  const getElapsedSeconds = useCallback((): number => {
    if (!gameTime) return 0;
    const now = Date.now();
    if (secondHalfStarted && gameTime.second_half_start_time) {
      return Math.floor((now - new Date(gameTime.second_half_start_time).getTime()) / 1000);
    }
    if (kickedOff && gameTime.kick_off_time) {
      return Math.floor((now - new Date(gameTime.kick_off_time).getTime()) / 1000);
    }
    return 0;
  }, [gameTime, kickedOff, secondHalfStarted]);

  const getCurrentGameMinute = useCallback((): number => {
    const secs = getElapsedSeconds();
    const halfMin = Math.floor(secs / 60);
    return secondHalfStarted ? halfDuration + halfMin : halfMin;
  }, [getElapsedSeconds, secondHalfStarted, halfDuration]);

  // Live timer tick — updates every second
  useEffect(() => {
    if (!kickedOff) return;
    const tick = () => {
      const secs = getElapsedSeconds();
      const mins = Math.floor(secs / 60);
      const s = secs % 60;
      setElapsed(`${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [kickedOff, getElapsedSeconds]);

  // Substitution alert — check if current minute matches a rotation window
  useEffect(() => {
    if (!kickedOff || strategy !== 'random') return;
    const check = () => {
      const gameMin = getCurrentGameMinute();
      // We'll broadcast an event that RandomStrategy can also use
      // Check rotation windows via a custom event
      window.dispatchEvent(new CustomEvent('game-minute-tick', { detail: { gameMinute: gameMin } }));
    };
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [kickedOff, strategy, getCurrentGameMinute]);

  // Listen for sub-alert events from RandomStrategy
  useEffect(() => {
    const handler = (e: Event) => {
      const { minute } = (e as CustomEvent).detail;
      if (alertedMinutesRef.current.has(minute)) return;
      alertedMinutesRef.current.add(minute);
      setSubAlert(true);
      // Play alert sound
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.type = 'square';
        gain.gain.value = 0.3;
        osc.start();
        // Three short beeps
        setTimeout(() => { gain.gain.value = 0; }, 150);
        setTimeout(() => { gain.gain.value = 0.3; }, 250);
        setTimeout(() => { gain.gain.value = 0; }, 400);
        setTimeout(() => { gain.gain.value = 0.3; }, 500);
        setTimeout(() => { gain.gain.value = 0; }, 650);
        setTimeout(() => { osc.stop(); ctx.close(); }, 700);
      } catch { /* audio not available */ }
      // Flash for 5 seconds
      setTimeout(() => setSubAlert(false), 5000);
    };
    window.addEventListener('sub-alert', handler);
    return () => window.removeEventListener('sub-alert', handler);
  }, []);

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

      {/* Sub alert flash */}
      {subAlert && (
        <div className="p-3 bg-orange-500 text-white text-center rounded-lg animate-pulse font-bold text-sm">
          ⚽ SUBSTITUTION TIME ⚽
        </div>
      )}

      {/* Game time controls */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Game Time</p>

        {/* Live timer display */}
        {kickedOff && (
          <div className="text-center py-2">
            <span className="text-3xl font-mono font-bold text-gray-900">{elapsed}</span>
            <span className="ml-2 text-sm text-gray-400">{secondHalfStarted ? '2nd Half' : '1st Half'}</span>
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1">
            <button
              onClick={handleRecordKickOff}
              disabled={kickedOff || saving}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                kickedOff
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-[#ea7800] text-white hover:bg-[#d06e00] disabled:opacity-50'
              }`}
            >
              <Play className="w-4 h-4" />
              {kickedOff ? 'Kicked Off' : 'Record Kick-off'}
            </button>
            {kickedOff && gameTime?.kick_off_time && (
              <p className="text-[10px] text-gray-400 text-center mt-1">
                {new Date(gameTime.kick_off_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            )}
          </div>
          <div className="flex-1">
            <button
              onClick={handleRecordSecondHalf}
              disabled={!kickedOff || secondHalfStarted || saving}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                secondHalfStarted
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <Clock className="w-4 h-4" />
              {secondHalfStarted ? '2nd Half Started' : '2nd Half Start'}
            </button>
            {secondHalfStarted && gameTime?.second_half_start_time && (
              <p className="text-[10px] text-gray-400 text-center mt-1">
                {new Date(gameTime.second_half_start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            )}
          </div>
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
