import { useState, useEffect } from 'react';
import { Calendar, MapPin, Trophy, Clock, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { gamesApi } from '../lib/games-api';
import type { Game, GameFeedbackRecord, Team, User } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

export function Games() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<User[]>([]);
  const [gameFeedback, setGameFeedback] = useState<GameFeedbackRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Score recording state
  const [teamScore, setTeamScore] = useState<string>('');
  const [opponentScore, setOpponentScore] = useState<string>('');
  const [scoreSaving, setScoreSaving] = useState(false);

  // Feedback state
  const [feedbackType, setFeedbackType] = useState<'team' | 'player'>('team');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSaving, setFeedbackSaving] = useState(false);

  // Load user's teams
  useEffect(() => {
    if (user) {
      console.log('Games: User loaded, fetching teams for user:', user.id);
      loadTeams();
    } else {
      console.log('Games: No user available yet');
    }
  }, [user]);

  // Load games when team is selected
  useEffect(() => {
    if (selectedTeam) {
      loadGames();
    }
  }, [selectedTeam]);

  // Load game details when game is selected
  useEffect(() => {
    if (selectedGame) {
      loadGameDetails();
    }
  }, [selectedGame]);

  const loadTeams = async () => {
    if (!user?.id) {
      console.log('Games: No user ID available');
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Games: Fetching teams for user:', user.id);
      
      // Get teams based on user role - using user_teams table
      const { data, error } = await gamesApi.supabase
        .from('user_teams')
        .select('team:teams(*)')
        .eq('user_id', user.id);

      console.log('Games: Query result:', { data, error });

      if (error) throw error;

      const userTeams = data.map((ut: any) => ut.team).filter(Boolean);
      console.log('Games: User teams:', userTeams);
      setTeams(userTeams);

      // Auto-select first team
      if (userTeams.length > 0) {
        console.log('Games: Auto-selecting team:', userTeams[0]);
        setSelectedTeam(userTeams[0]);
      } else {
        console.log('Games: No teams found for user');
      }
    } catch (err) {
      console.error('Games: Error loading teams:', err);
      setError(err instanceof Error ? err.message : 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const loadGames = async () => {
    if (!selectedTeam) return;

    try {
      setLoading(true);
      const pastGames = await gamesApi.getPastGames(selectedTeam.id);
      setGames(pastGames);

      // Auto-select most recent game
      if (pastGames.length > 0) {
        setSelectedGame(pastGames[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const loadGameDetails = async () => {
    if (!selectedGame || !selectedTeam) return;

    try {
      // Load team players
      const players = await gamesApi.getTeamPlayers(selectedTeam.id);
      setTeamPlayers(players);

      // Load existing feedback
      const feedback = await gamesApi.getGameFeedback(selectedGame.id);
      setGameFeedback(feedback);

      // Pre-fill score if already recorded
      if (selectedGame.team_score !== null && selectedGame.team_score !== undefined) {
        setTeamScore(selectedGame.team_score.toString());
      } else {
        setTeamScore('');
      }
      if (selectedGame.opponent_score !== null && selectedGame.opponent_score !== undefined) {
        setOpponentScore(selectedGame.opponent_score.toString());
      } else {
        setOpponentScore('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game details');
    }
  };

  const handleSaveScore = async () => {
    if (!selectedGame) return;

    const team = parseInt(teamScore);
    const opponent = parseInt(opponentScore);

    if (isNaN(team) || isNaN(opponent) || team < 0 || opponent < 0) {
      setError('Please enter valid scores');
      return;
    }

    try {
      setScoreSaving(true);
      setError(null);
      const updatedGame = await gamesApi.updateGameScore(selectedGame.id, team, opponent);
      setSelectedGame(updatedGame);
      
      // Update in games list
      setGames(games.map(g => g.id === updatedGame.id ? updatedGame : g));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save score');
    } finally {
      setScoreSaving(false);
    }
  };

  const handleSaveFeedback = async () => {
    if (!selectedGame || !selectedTeam || !feedbackText.trim()) {
      setError('Please enter feedback');
      return;
    }

    if (feedbackType === 'player' && !selectedPlayerId) {
      setError('Please select a player');
      return;
    }

    try {
      setFeedbackSaving(true);
      setError(null);

      const newFeedback = await gamesApi.createGameFeedback({
        game_id: selectedGame.id,
        team_id: selectedTeam.id,
        feedback_type: feedbackType,
        player_id: feedbackType === 'player' ? selectedPlayerId : undefined,
        feedback_text: feedbackText,
      });

      setGameFeedback([newFeedback, ...gameFeedback]);
      setFeedbackText('');
      setSelectedPlayerId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save feedback');
    } finally {
      setFeedbackSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading && teams.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0091f3] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="p-4 pb-20">
        <div className="border-l-8 border-[#ea7800] pl-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Games</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No teams assigned</p>
          <p className="text-sm text-gray-500 mt-1">Contact your administrator</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="border-l-8 border-[#ea7800] pl-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Games</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Team Selection */}
      {teams.length > 1 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Team
          </label>
          <select
            value={selectedTeam?.id || ''}
            onChange={(e) => {
              const team = teams.find(t => t.id === e.target.value);
              setSelectedTeam(team || null);
              setSelectedGame(null);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
          >
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name} ({team.age_group})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Games List for Selection */}
      {games.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Game
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {games.map(game => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedGame?.id === game.id
                    ? 'border-[#0091f3] bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">vs {game.opponent}</p>
                    <p className="text-sm text-gray-600">{formatDate(game.game_date)}</p>
                  </div>
                  {game.team_score !== null && game.opponent_score !== null && (
                    <span className="text-sm font-semibold text-gray-900">
                      {game.team_score} - {game.opponent_score}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Game Details */}
      {selectedGame && (
        <div className="space-y-4">
          {/* Game Detail Card */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTeam?.name} vs {selectedGame.opponent}
                </h3>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                    selectedGame.home_away === 'home'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {selectedGame.home_away.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedGame.game_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTime(selectedGame.game_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{selectedGame.venue}</span>
              </div>
            </div>
          </div>

          {/* Score Recording */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Record Score</h4>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedTeam?.name}
                </label>
                <input
                  type="number"
                  min="0"
                  value={teamScore}
                  onChange={(e) => setTeamScore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedGame.opponent}
                </label>
                <input
                  type="number"
                  min="0"
                  value={opponentScore}
                  onChange={(e) => setOpponentScore(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  placeholder="0"
                />
              </div>
              <button
                onClick={handleSaveScore}
                disabled={scoreSaving}
                className="px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0077cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {scoreSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Analysis</h4>

            {/* Feedback Type Selection */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => {
                  setFeedbackType('team');
                  setSelectedPlayerId('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  feedbackType === 'team'
                    ? 'bg-[#0091f3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Team
              </button>
              <button
                onClick={() => setFeedbackType('player')}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  feedbackType === 'player'
                    ? 'bg-[#0091f3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Player
              </button>
            </div>

            {/* Player Selection */}
            {feedbackType === 'player' && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Player
                </label>
                <select
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                >
                  <option value="">Choose a player...</option>
                  {teamPlayers.map(player => (
                    <option key={player.id} value={player.id}>
                      {player.first_name} {player.last_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Feedback Text */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder={`Enter ${feedbackType} feedback...`}
              />
            </div>

            <button
              onClick={handleSaveFeedback}
              disabled={feedbackSaving}
              className="w-full px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0077cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {feedbackSaving ? 'Saving...' : 'Save Feedback'}
            </button>
          </div>

          {/* Existing Feedback */}
          {gameFeedback.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Previous Feedback</h4>
              <div className="space-y-3">
                {gameFeedback.map(feedback => {
                  const player = feedback.player_id 
                    ? teamPlayers.find(p => p.id === feedback.player_id)
                    : null;
                  
                  return (
                    <div key={feedback.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">
                          {feedback.feedback_type === 'team' ? 'TEAM' : `PLAYER: ${player?.first_name} ${player?.last_name}`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{feedback.feedback_text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {games.length === 0 && selectedTeam && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No past games found</p>
          <p className="text-sm text-gray-500 mt-1">Games will appear here after they've been played</p>
        </div>
      )}
    </div>
  );
}
