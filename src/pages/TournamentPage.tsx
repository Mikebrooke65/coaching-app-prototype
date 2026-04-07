import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tournamentApi } from '../lib/tournament-api';
import type { StandingsRowWithName } from '../lib/tournament-api';
import type { Competition, Event } from '../types/database';
import { StandingsTable } from '../components/tournament/StandingsTable';
import { FixtureList } from '../components/tournament/FixtureList';

type Tab = 'standings' | 'fixtures';

export function TournamentPage() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Competition[]>([]);
  const [selectedComp, setSelectedComp] = useState<Competition | null>(null);
  const [fixtures, setFixtures] = useState<Event[]>([]);
  const [standings, setStandings] = useState<StandingsRowWithName[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('standings');
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState('');

  // Derive user's team IDs from auth context
  const userTeamIds = user?.teamMemberships?.map(m => m.team_id) ?? [];

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      setError('');
      const comps = await tournamentApi.getMyTournaments();
      setTournaments(comps);
      if (comps.length === 1) {
        setSelectedComp(comps[0]);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const loadCompetitionData = useCallback(async (comp: Competition) => {
    try {
      setDataLoading(true);
      setError('');
      const [fixtureData, standingsData] = await Promise.all([
        tournamentApi.getFixtures(comp.id),
        tournamentApi.getStandings(comp.id),
      ]);
      setFixtures(fixtureData);
      setStandings(standingsData);
    } catch (e: any) {
      setError(e.message || 'Failed to load tournament data');
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedComp) {
      loadCompetitionData(selectedComp);
    }
  }, [selectedComp, loadCompetitionData]);

  const handleSelectCompetition = (compId: string) => {
    const comp = tournaments.find(c => c.id === compId) ?? null;
    setSelectedComp(comp);
  };

  // Find the first team ID that belongs to the user for highlighting
  const highlightTeamId = userTeamIds[0];

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading tournaments...</div>;
  }

  if (error && tournaments.length === 0) {
    return (
      <div className="p-4">
        <div className="p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-gray-500 text-lg">No active tournaments</p>
        <p className="text-gray-400 text-sm mt-1">You are not linked to any club tournaments</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      {/* Tournament selector (shown when multiple) */}
      {tournaments.length > 1 && (
        <div className="mb-4">
          <select
            value={selectedComp?.id ?? ''}
            onChange={(e) => handleSelectCompetition(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="" disabled>Select tournament...</option>
            {tournaments.map(comp => (
              <option key={comp.id} value={comp.id}>{comp.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Tournament name header */}
      {selectedComp && (
        <h1 className="text-xl font-bold mb-4">{selectedComp.name}</h1>
      )}

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>}

      {selectedComp && (
        <>
          {/* Tab bar */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab('standings')}
              className={`flex-1 py-2 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === 'standings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Standings
            </button>
            <button
              onClick={() => setActiveTab('fixtures')}
              className={`flex-1 py-2 text-sm font-medium text-center border-b-2 transition-colors ${
                activeTab === 'fixtures'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Fixtures
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'standings' && (
            <StandingsTable
              standings={standings}
              highlightTeamId={highlightTeamId}
              loading={dataLoading}
            />
          )}

          {activeTab === 'fixtures' && (
            dataLoading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">Loading fixtures...</div>
            ) : (
              <FixtureList fixtures={fixtures} highlightTeamId={highlightTeamId} />
            )
          )}
        </>
      )}
    </div>
  );
}
