import { useState, useMemo, useEffect, useRef } from 'react';
import { ArrowRightLeft, Check } from 'lucide-react';
import { calculateRotationPlan } from '../../lib/rotation-engine';
import { calculateGameMinute } from '../../lib/game-time-utils';
import { subsApi } from '../../lib/subs-api';
import type { GameTime, SubstitutionEvent, SquadMember } from '../../types/database';

interface RandomStrategyProps {
  eventId: string;
  squad: SquadMember[];
  lineup: string[];
  gamePlayers: number;
  halfDuration: number;
  gameTime: GameTime;
  substitutionEvents: SubstitutionEvent[];
  onSubstitutionRecorded: (sub: SubstitutionEvent) => void;
}

export function RandomStrategy({
  eventId,
  squad,
  lineup,
  gamePlayers,
  halfDuration,
  gameTime,
  substitutionEvents,
  onSubstitutionRecorded,
}: RandomStrategyProps) {
  const [confirming, setConfirming] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subs = squad.filter(m => {
    const id = m.user_id || m.id;
    return !lineup.includes(id);
  });

  const getDisplayName = (id: string) =>
    squad.find(m => (m.user_id || m.id) === id)?.display_name || id;

  const plan = useMemo(() => {
    if (subs.length === 0) return null;
    return calculateRotationPlan({
      squadSize: squad.length,
      gamePlayers,
      halfDuration,
      startingLineup: lineup,
      subs: subs.map(m => m.user_id || m.id),
    });
  }, [squad.length, gamePlayers, halfDuration, lineup, subs]);

  // Track which window minutes we've already alerted for
  const alertedRef = useRef<Set<number>>(new Set());

  // Listen for game-minute-tick and fire sub-alert when a rotation window is due
  useEffect(() => {
    if (!plan) return;
    const allWindows: Array<{ minute: number; half: 1 | 2; idx: number }> = [];
    plan.firstHalf.forEach((w, idx) => allWindows.push({ minute: w.minute, half: 1, idx }));
    plan.secondHalf.forEach((w, idx) => allWindows.push({ minute: w.minute + halfDuration, half: 2, idx }));

    const handler = (e: Event) => {
      const { gameMinute } = (e as CustomEvent).detail;
      for (const w of allWindows) {
        // Check if this window's minute has been reached and not yet confirmed
        const confirmedCount = w.half === 1
          ? substitutionEvents.filter(s => s.half === 1).length
          : substitutionEvents.filter(s => s.half === 2).length;
        if (w.idx < confirmedCount) continue; // already done
        if (gameMinute >= w.minute && !alertedRef.current.has(w.minute)) {
          alertedRef.current.add(w.minute);
          window.dispatchEvent(new CustomEvent('sub-alert', { detail: { minute: w.minute } }));
          break; // one alert at a time
        }
      }
    };
    window.addEventListener('game-minute-tick', handler);
    return () => window.removeEventListener('game-minute-tick', handler);
  }, [plan, halfDuration, substitutionEvents]);

  // Determine current half and game minute
  const getCurrentHalf = (): 1 | 2 => {
    if (gameTime.second_half_start_time) return 2;
    return 1;
  };

  const getCurrentGameMinute = (): number => {
    const now = new Date();
    const half = getCurrentHalf();
    const ref = half === 2 && gameTime.second_half_start_time
      ? new Date(gameTime.second_half_start_time)
      : new Date(gameTime.kick_off_time!);
    return calculateGameMinute(ref, now, halfDuration, half);
  };

  // Count confirmed subs per half to track which windows are done
  const confirmedFirstHalf = substitutionEvents.filter(s => s.half === 1).length;
  const confirmedSecondHalf = substitutionEvents.filter(s => s.half === 2).length;

  const handleConfirmWindow = async (halfNum: 1 | 2, windowIndex: number, playersOff: string[], playersOn: string[]) => {
    try {
      setConfirming(windowIndex);
      setError(null);
      const gameMinute = getCurrentGameMinute();

      for (let i = 0; i < playersOff.length; i++) {
        const offId = playersOff[i];
        const onId = playersOn[i];
        const offMember = squad.find(m => (m.user_id || m.id) === offId);
        const onMember = squad.find(m => (m.user_id || m.id) === onId);

        const sub = await subsApi.recordSubstitution({
          event_id: eventId,
          player_off_id: offMember?.user_id || null,
          player_off_guest_name: offMember?.is_guest ? offMember.guest_name : null,
          player_on_id: onMember?.user_id || null,
          player_on_guest_name: onMember?.is_guest ? onMember.guest_name : null,
          game_minute: gameMinute,
          half: halfNum,
          strategy_used: 'random',
        });
        onSubstitutionRecorded(sub);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record substitution');
    } finally {
      setConfirming(null);
    }
  };

  if (!plan || (plan.firstHalf.length === 0 && plan.secondHalf.length === 0)) {
    return <p className="text-sm text-gray-500 italic">No rotation needed — no substitutes available.</p>;
  }

  const currentHalf = getCurrentHalf();
  const currentMinute = getCurrentGameMinute();

  const renderHalf = (halfNum: 1 | 2, windows: typeof plan.firstHalf, confirmedCount: number) => (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {halfNum === 1 ? 'First' : 'Second'} Half
      </p>
      {windows.map((w, idx) => {
        const isDone = idx < confirmedCount;
        const isCurrent = !isDone && halfNum === currentHalf && (idx === confirmedCount);
        const adjustedMinute = halfNum === 2 ? w.minute + halfDuration : w.minute;
        const isDue = isCurrent && currentMinute >= adjustedMinute;

        return (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${
              isDone ? 'bg-gray-50 border-gray-200 opacity-60' :
              isDue ? 'bg-orange-100 border-orange-400 ring-2 ring-orange-300 animate-pulse' :
              isCurrent ? 'bg-orange-50 border-orange-300 ring-1 ring-orange-200' :
              'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">{adjustedMinute}' mark</span>
              {isDone && <Check className="w-4 h-4 text-green-500" />}
            </div>
            <div className="space-y-1">
              {w.playersOff.map((offId, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-red-500">↓ {getDisplayName(offId)}</span>
                  <ArrowRightLeft className="w-3 h-3 text-gray-400" />
                  <span className="text-green-600">↑ {getDisplayName(w.playersOn[i])}</span>
                </div>
              ))}
            </div>
            {isCurrent && !isDone && (
              <button
                onClick={() => handleConfirmWindow(halfNum, idx, w.playersOff, w.playersOn)}
                disabled={confirming !== null}
                className="mt-2 w-full px-3 py-1.5 text-sm font-medium rounded-lg bg-[#ea7800] text-white hover:bg-[#d06e00] transition-colors disabled:opacity-50"
              >
                {confirming === idx ? 'Recording...' : 'Confirm Swap'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">{error}</div>
      )}
      <p className="text-xs text-gray-500">Swap group size: {plan.swapGroupSize} at a time</p>
      {renderHalf(1, plan.firstHalf, confirmedFirstHalf)}
      {gameTime.second_half_start_time && renderHalf(2, plan.secondHalf, confirmedSecondHalf)}
    </div>
  );
}
