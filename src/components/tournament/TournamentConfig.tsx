import { useState } from 'react';
import type { Competition } from '../../types/database';
import type { GenerateFixturesParams, TournamentConfig as TournamentConfigType } from '../../lib/tournament-api';

interface TournamentConfigProps {
  competition: Competition;
  onSave: (config: Partial<TournamentConfigType>) => void;
  onGenerateFixtures: (params: GenerateFixturesParams) => void;
  fixturesExist: boolean;
}

export function TournamentConfig({ competition, onSave, onGenerateFixtures, fixturesExist }: TournamentConfigProps) {
  // Config state
  const [format, setFormat] = useState(competition.format ?? 'single_round_robin');
  const [pointsWin, setPointsWin] = useState(competition.points_for_win ?? 3);
  const [pointsDraw, setPointsDraw] = useState(competition.points_for_draw ?? 1);
  const [pointsLoss, setPointsLoss] = useState(competition.points_for_loss ?? 0);

  // Fixture generation state
  const [matchDays, setMatchDays] = useState<string[]>(['']);
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState(30);
  const [venue, setVenue] = useState('');
  const [pitches, setPitches] = useState<string[]>(['Pitch 1']);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSaveConfig = () => {
    onSave({
      format,
      points_for_win: pointsWin,
      points_for_draw: pointsDraw,
      points_for_loss: pointsLoss,
    });
  };

  const buildParams = (confirmOverwrite: boolean): GenerateFixturesParams => ({
    competitionId: competition.id,
    matchDays: matchDays.filter(Boolean),
    defaultStartTime: startTime,
    matchDuration: duration,
    venue: venue || undefined,
    pitches: pitches.filter(Boolean),
    confirmOverwrite,
  });

  const handleGenerate = () => {
    if (fixturesExist) {
      setShowConfirm(true);
    } else {
      onGenerateFixtures(buildParams(false));
    }
  };

  const confirmGenerate = () => {
    setShowConfirm(false);
    onGenerateFixtures(buildParams(true));
  };

  const addMatchDay = () => setMatchDays([...matchDays, '']);
  const removeMatchDay = (i: number) => setMatchDays(matchDays.filter((_, idx) => idx !== i));
  const updateMatchDay = (i: number, val: string) => {
    const next = [...matchDays];
    next[i] = val;
    setMatchDays(next);
  };

  const addPitch = () => setPitches([...pitches, '']);
  const removePitch = (i: number) => setPitches(pitches.filter((_, idx) => idx !== i));
  const updatePitch = (i: number, val: string) => {
    const next = [...pitches];
    next[i] = val;
    setPitches(next);
  };

  return (
    <div className="space-y-6">
      {/* Tournament Settings */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-4">Tournament Settings</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as Competition['format'])}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="single_round_robin">Single Round Robin</option>
              <option value="double_round_robin">Double Round Robin</option>
            </select>
          </div>

          {/* Scoring Rules */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Scoring Rules</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-0.5">Win</label>
                <input type="number" min={0} value={pointsWin} onChange={(e) => setPointsWin(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-0.5">Draw</label>
                <input type="number" min={0} value={pointsDraw} onChange={(e) => setPointsDraw(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-0.5">Loss</label>
                <input type="number" min={0} value={pointsLoss} onChange={(e) => setPointsLoss(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSaveConfig} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          Save Config
        </button>
      </div>

      {/* Fixture Generation */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-4">Generate Fixtures</h3>

        <div className="space-y-4">
          {/* Match Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Match Days</label>
            {matchDays.map((day, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="date" value={day} onChange={(e) => updateMatchDay(i, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                {matchDays.length > 1 && (
                  <button onClick={() => removeMatchDay(i)} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm">
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button onClick={addMatchDay} className="text-sm text-blue-600 hover:underline">+ Add match day</button>
          </div>

          {/* Start Time & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Match Duration (min)</label>
              <input type="number" min={1} value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
            <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Main Ground"
              className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>

          {/* Pitches */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pitches</label>
            {pitches.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={p} onChange={(e) => updatePitch(i, e.target.value)} placeholder="Pitch name"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                {pitches.length > 1 && (
                  <button onClick={() => removePitch(i)} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm">
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button onClick={addPitch} className="text-sm text-blue-600 hover:underline">+ Add pitch</button>
          </div>
        </div>

        <button onClick={handleGenerate}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
          Generate Fixtures
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Regenerate Fixtures?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Existing fixtures will be deleted and replaced with a new schedule. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={confirmGenerate} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                Confirm
              </button>
              <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
