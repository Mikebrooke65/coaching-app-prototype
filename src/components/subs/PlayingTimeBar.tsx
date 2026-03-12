import { useState, useEffect } from 'react';
import { calculatePlayingTimePercentage } from '../../lib/game-time-utils';

interface PlayingTimeBarProps {
  /** Array of on-field intervals in minutes: [{start, end}] */
  onFieldIntervals: Array<{ start: number; end: number }>;
  /** Total elapsed game time in minutes */
  totalElapsedTime: number;
  /** Whether the game is currently in play (enables real-time updates) */
  isLive?: boolean;
}

export function PlayingTimeBar({ onFieldIntervals, totalElapsedTime, isLive }: PlayingTimeBarProps) {
  const [, setTick] = useState(0);

  // Re-render every 30 seconds during live play for real-time updates
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, [isLive]);

  const percentage = calculatePlayingTimePercentage(onFieldIntervals, totalElapsedTime);
  const rounded = Math.round(percentage);

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      <span className="text-[10px] font-medium text-gray-500 w-8 text-right">{rounded}%</span>
    </div>
  );
}
