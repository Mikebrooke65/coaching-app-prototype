import { useState, useEffect } from 'react';
import { Calendar, MapPin, Trophy, Clock, ChevronLeft, ChevronRight, Save, ArrowRightCircle, ChevronDown, Users } from 'lucide-react';
import { gamesApi } from '../../lib/games-api';
import { eventsApi } from '../../lib/events-api';
import type { Game, GameFeedbackRecord, Team, User } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router';

export function DesktopGames() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Team and filtering state
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showAgeGroupDropdown, setShowAgeGroupDropdown] = useState(false);
  
  // Games state
  const [games, setGames] = useState<Game[]>([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
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
  const [currentFeedbackId, setCurrentFeedbackId] = useState<string | null>(null);

  // Load all teams (admin can see all teams)
  useEffect(() => {
    if (user) {
      loadAllTeams();
    }
  }, [user]);

  // Load games when team is selected
  useEffect(() => {
    if (selectedTeam) {
      loadGames();
    }
  }, [selectedTeam]);

  // Load game details when game index changes
  useEffect(() => {
    if (games.length > 0 && games[currentGameIndex]) {
      loadGameDetails(games[currentGameIndex]);
    }
  }, [currentGameIndex, games]);
  const loadAllTeams = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get all teams for admin users, or user's teams for others
      let teamsData;
      if (user.role === 'admin') {
        const { data, error } = await gamesApi.supabase
          .from('teams')
          .select('*')
          .order('age_group')
          .order('name');
        
        if (error) throw error;
        teamsData = data || [];
      } else {
        // Get user's teams only
        const { data, error } = await gamesApi.supabase
          .from('team_members')
          .select('team:teams(*)')
          .eq('user_id', user.id);

        if (error) throw error;
        teamsData = data.map((tm: any) => tm.team).filter(Boolean);
      }

      setAllTeams(teamsData);

      // Auto-select first team if only one available
      if (teamsData.length === 1) {
        setSelectedTeam(teamsData[0]);
        setSelectedAgeGroup(teamsData[0].age_group);
      }
    } catch (err) {
      console.error('Error loading teams:', err);
      setError(err instanceof Error ? err.message : 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };
  const loadGames = async () => {
    if (!selectedTeam) return;

    try {
      setLoading(true);
      
      // Query events table for game events
      const { data, error } = await gamesApi.supabase
        .from('events')
        .select('*')
        .eq('event_type', 'game')
        .contains('target_teams', [selectedTeam.id])
        .lt('event_date', new Date().toISOString())
        .order('event_date', { ascending: false });

      if (error) throw error;

      // Convert events to Game format
      const pastGames: Game[] = (data || []).map(event => ({
        id: event.id,
        team_id: selectedTeam.id,
        opponent: event.opponent || 'Unknown',
        game_date: event.event_date,
        venue: event.location,
        home_away: event.home_away || 'home',
        status: 'completed' as const,
        team_score: event.team_score,
        opponent_score: event.opponent_score,
        created_at: event.created_at,
        updated_at: event.updated_at,
        created_by: event.created_by,
        updated_by: event.updated_by,
      }));

      setGames(pastGames);

      // Auto-select most recent game (index 0)
      if (pastGames.length > 0) {
        setCurrentGameIndex(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load games');
    } finally {
      setLoading(false);
    }
  };
  const loadGameDetails = async (game: Game) => {
    if (!game || !selectedTeam) return;

    try {
      // Load team players
      const players = await gamesApi.getTeamPlayers(selectedTeam.id);
      setTeamPlayers(players);

      // Load existing feedback
      const feedback = await gamesApi.getGameFeedback(game.id);
      setGameFeedback(feedback);

      // Pre-fill score if already recorded
      if (game.team_score !== null && game.team_score !== undefined) {
        setTeamScore(game.team_score.toString());
      } else {
        setTeamScore('');
      }
      if (game.opponent_score !== null && game.opponent_score !== undefined) {
        setOpponentScore(game.opponent_score.toString());
      } else {
        setOpponentScore('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game details');
    }
  };

  const handleSaveScore = async () => {
    const currentGame = games[currentGameIndex];
    if (!currentGame) return;

    // Handle empty strings as 0
    const team = teamScore === '' ? 0 : parseInt(teamScore);
    const opponent = opponentScore === '' ? 0 : parseInt(opponentScore);

    if (isNaN(team) || isNaN(opponent)) {
      setError('Please enter valid scores');
      return;
    }

    if (team < 0 || opponent < 0) {
      setError('Scores cannot be negative');
      return;
    }

    try {
      setScoreSaving(true);
      setError(null);
      
      // Update score in events table
      await eventsApi.updateEventScore(currentGame.id, team, opponent);
      
      // Update local state
      const updatedGame = { ...currentGame, team_score: team, opponent_score: opponent };
      const updatedGames = [...games];
      updatedGames[currentGameIndex] = updatedGame;
      setGames(updatedGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save score');
    } finally {
      setScoreSaving(false);
    }
  };
  const handleSaveFeedback = async () => {
    const currentGame = games[currentGameIndex];
    if (!currentGame || !selectedTeam || !feedbackText.trim()) {
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

      let savedFeedback: GameFeedbackRecord;

      if (currentFeedbackId) {
        // Update existing feedback
        savedFeedback = await gamesApi.updateGameFeedback(currentFeedbackId, feedbackText);
        // Update in list
        setGameFeedback(gameFeedback.map(f => f.id === currentFeedbackId ? savedFeedback : f));
      } else {
        // Create new feedback
        savedFeedback = await gamesApi.createGameFeedback({
          game_id: currentGame.id,
          team_id: selectedTeam.id,
          feedback_type: feedbackType,
          player_id: feedbackType === 'player' ? selectedPlayerId : undefined,
          feedback_text: feedbackText,
        });
        // Add to list
        setGameFeedback([savedFeedback, ...gameFeedback]);
      }

      // Reset form
      setFeedbackText('');
      setSelectedPlayerId('');
      setCurrentFeedbackId(null);
      setFeedbackType('team');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save feedback');
    } finally {
      setFeedbackSaving(false);
    }
  };

  const navigateGame = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentGameIndex > 0) {
      setCurrentGameIndex(currentGameIndex - 1);
    } else if (direction === 'next' && currentGameIndex < games.length - 1) {
      setCurrentGameIndex(currentGameIndex + 1);
    }
  };
  const handlePlayerChange = (playerId: string) => {
    setSelectedPlayerId(playerId);
    
    if (!playerId) {
      setFeedbackText('');
      setCurrentFeedbackId(null);
      return;
    }

    // Find existing feedback for this player in this game
    const existingFeedback = gameFeedback.find(
      f => f.feedback_type === 'player' && f.player_id === playerId
    );

    if (existingFeedback) {
      setFeedbackText(existingFeedback.feedback_text);
      setCurrentFeedbackId(existingFeedback.id);
    } else {
      setFeedbackText('');
      setCurrentFeedbackId(null);
    }
  };

  const handleFeedbackTypeChange = (type: 'team' | 'player') => {
    setFeedbackType(type);
    setSelectedPlayerId('');
    setCurrentFeedbackId(null);
    
    if (type === 'team') {
      // Load existing team feedback if any
      const existingTeamFeedback = gameFeedback.find(
        f => f.feedback_type === 'team'
      );
      
      if (existingTeamFeedback) {
        setFeedbackText(existingTeamFeedback.feedback_text);
        setCurrentFeedbackId(existingTeamFeedback.id);
      } else {
        setFeedbackText('');
      }
    } else {
      setFeedbackText('');
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
  // Define all possible age groups
  const allAgeGroups = ['U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17'];
  
  // Get age groups that actually have teams (for display purposes)
  const ageGroupsWithTeams = [...new Set(allTeams.map(team => team.age_group))];
  
  // Filter teams by selected age group
  const filteredTeams = user?.role === 'admin' 
    ? (selectedAgeGroup ? allTeams.filter(team => team.age_group === selectedAgeGroup) : [])
    : allTeams;

  if (loading && allTeams.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea7800] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#ea7800]">Games Management</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Panel - Team Selection & Games List */}
        <div className="w-1/3 flex flex-col bg-white rounded-lg shadow">
          {/* Team Selection */}
          <div className="p-4 border-b border-gray-200">
            {/* Age Group Filter (for admin users) */}
            {user?.role === 'admin' && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowAgeGroupDropdown(!showAgeGroupDropdown)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3] flex items-center justify-between"
                  >
                    <span>{selectedAgeGroup || 'Select Age Group'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showAgeGroupDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {allAgeGroups.map(ageGroup => {
                        const hasTeams = ageGroupsWithTeams.includes(ageGroup);
                        return (
                          <button
                            key={ageGroup}
                            onClick={() => {
                              setSelectedAgeGroup(ageGroup);
                              setShowAgeGroupDropdown(false);
                              setSelectedTeam(null);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center justify-between"
                          >
                            <span>{ageGroup}</span>
                            {hasTeams && (
                              <span className="text-xs text-gray-500">
                                ({allTeams.filter(t => t.age_group === ageGroup).length} teams)
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Team Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Team
              </label>
              {user?.role === 'admin' && !selectedAgeGroup ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    Please select an age group first to see available teams
                  </p>
                </div>
              ) : filteredTeams.length === 0 ? (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    {selectedAgeGroup ? `No teams found for ${selectedAgeGroup}` : 'No teams available'}
                  </p>
                </div>
              ) : (
                <select
                  value={selectedTeam?.id || ''}
                  onChange={(e) => {
                    const team = filteredTeams.find(t => t.id === e.target.value);
                    setSelectedTeam(team || null);
                    setCurrentGameIndex(0);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                >
                  <option value="">Choose a team...</option>
                  {filteredTeams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.age_group} {team.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          {/* Games List */}
          <div className="flex-1 overflow-y-auto p-4">
            {games.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Past Games ({games.length})</h3>
                {games.map((game, index) => (
                  <div
                    key={game.id}
                    onClick={() => setCurrentGameIndex(index)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      currentGameIndex === index
                        ? 'border-[#0091f3] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          vs {game.opponent}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            game.home_away === 'home' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {game.home_away.toUpperCase()}
                          </span>
                          {game.team_score !== null && game.team_score !== undefined && (
                            <span className="text-xs font-bold text-gray-900">
                              {game.team_score}-{game.opponent_score}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(game.game_date)}
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedTeam ? (
              <div className="text-center py-8">
                <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No past games found</p>
                <p className="text-xs text-gray-500 mt-1">Games will appear here after they've been played</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Select a team to view games</p>
              </div>
            )}
          </div>
        </div>
        {/* Right Panel - Game Details */}
        <div className="w-2/3 bg-white rounded-lg shadow p-6">
          {games.length > 0 && games[currentGameIndex] ? (
            <div className="h-full flex flex-col">
              {/* Game Header with Navigation */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateGame('prev')}
                    disabled={currentGameIndex === 0}
                    className={`p-2 rounded-lg transition-colors ${
                      currentGameIndex === 0 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedTeam?.age_group} {selectedTeam?.name} vs {games[currentGameIndex].opponent}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        games[currentGameIndex].home_away === 'home'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {games[currentGameIndex].home_away.toUpperCase()} GAME
                      </span>
                      <span className="text-sm text-gray-500">
                        Game {currentGameIndex + 1} of {games.length}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateGame('next')}
                    disabled={currentGameIndex === games.length - 1}
                    className={`p-2 rounded-lg transition-colors ${
                      currentGameIndex === games.length - 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={() => navigate(`/games/${games[currentGameIndex].id}/subs`)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#ea7800] text-white rounded-lg hover:bg-[#d06e00] transition-colors"
                >
                  <ArrowRightCircle className="w-4 h-4" />
                  Manage Subs
                </button>
              </div>
              {/* Game Details */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Score Display */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Final Score</h3>
                  {games[currentGameIndex].team_score !== null && games[currentGameIndex].team_score !== undefined ? (
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">{selectedTeam?.name}</p>
                        <p className="text-3xl font-bold text-gray-900">{games[currentGameIndex].team_score}</p>
                      </div>
                      <span className="text-xl text-gray-400">-</span>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">{games[currentGameIndex].opponent}</p>
                        <p className="text-3xl font-bold text-gray-900">{games[currentGameIndex].opponent_score}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">Score not recorded</p>
                  )}
                </div>

                {/* Game Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Game Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(games[currentGameIndex].game_date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{formatTime(games[currentGameIndex].game_date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{games[currentGameIndex].venue}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Score Recording */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Record/Update Score</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">{selectedTeam?.name}:</label>
                    <input
                      type="number"
                      min="0"
                      value={teamScore}
                      onChange={(e) => setTeamScore(e.target.value)}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                      placeholder="0"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">{games[currentGameIndex].opponent}:</label>
                    <input
                      type="number"
                      min="0"
                      value={opponentScore}
                      onChange={(e) => setOpponentScore(e.target.value)}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                      placeholder="0"
                    />
                  </div>
                  <button
                    onClick={handleSaveScore}
                    disabled={scoreSaving}
                    className="ml-auto px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0077cc] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {scoreSaving ? 'Saving...' : 'Save Score'}
                  </button>
                </div>
              </div>
              {/* Feedback Section */}
              <div className="flex-1 min-h-0 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Game Analysis</h3>
                
                <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                  {/* Feedback Form */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Add Feedback</h4>

                    {/* Feedback Type Selection */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => handleFeedbackTypeChange('team')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          feedbackType === 'team'
                            ? 'bg-[#0091f3] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Team
                      </button>
                      <button
                        onClick={() => handleFeedbackTypeChange('player')}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          feedbackType === 'player'
                            ? 'bg-[#0091f3] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
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
                          onChange={(e) => handlePlayerChange(e.target.value)}
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
                      {feedbackSaving ? 'Saving...' : currentFeedbackId ? 'Update Feedback' : 'Save Feedback'}
                    </button>
                  </div>

                  {/* Existing Feedback */}
                  <div className="flex flex-col min-h-0">
                    <h4 className="font-medium text-gray-900 mb-3">Previous Feedback</h4>
                    <div className="flex-1 overflow-y-auto">
                      {gameFeedback.length > 0 ? (
                        <div className="space-y-3">
                          {gameFeedback.map(feedback => {
                            const player = feedback.player_id 
                              ? teamPlayers.find(p => p.id === feedback.player_id)
                              : null;
                            
                            return (
                              <div key={feedback.id} className="p-3 bg-white rounded-lg border border-gray-200">
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
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <div className="text-center">
                            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No feedback recorded yet</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedTeam ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No games found</p>
                <p className="text-sm">Past games will appear here after they've been played</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a team to view games</p>
                <p className="text-sm">Choose a team from the left panel to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}