import { useState } from 'react';
import { Calendar, MapPin, Users, Trophy, Clock, Plus, Search, Filter } from 'lucide-react';

interface Game {
  id: string;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  homeAway: 'home' | 'away';
  status: 'scheduled' | 'completed' | 'cancelled';
  team: string;
  score?: {
    team: number;
    opponent: number;
  };
  lineup?: string[];
  notes?: string;
}

// Mock data
const mockGames: Game[] = [
  {
    id: '1',
    opponent: 'Coastal United',
    date: '2026-03-15',
    time: '10:00 AM',
    venue: 'Rangers Home Ground',
    homeAway: 'home',
    status: 'scheduled',
    team: 'U12 Boys',
  },
  {
    id: '2',
    opponent: 'City FC',
    date: '2026-03-08',
    time: '2:00 PM',
    venue: 'City Sports Complex',
    homeAway: 'away',
    status: 'completed',
    team: 'U12 Boys',
    score: { team: 3, opponent: 2 },
    notes: 'Great team performance, strong defense',
  },
  {
    id: '3',
    opponent: 'Valley Rangers',
    date: '2026-03-01',
    time: '11:30 AM',
    venue: 'Rangers Home Ground',
    homeAway: 'home',
    status: 'completed',
    team: 'U10 Girls',
    score: { team: 1, opponent: 1 },
  },
  {
    id: '4',
    opponent: 'Harbor Hawks',
    date: '2026-03-22',
    time: '3:00 PM',
    venue: 'Harbor Field',
    homeAway: 'away',
    status: 'scheduled',
    team: 'U14 Boys',
  },
];

export function DesktopGames() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const filteredGames = mockGames.filter((game) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'upcoming' && game.status === 'scheduled') ||
      (filter === 'past' && game.status === 'completed');
    
    const matchesSearch =
      searchTerm === '' ||
      game.opponent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.team.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Games Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0081d9] transition-colors">
          <Plus className="w-4 h-4" />
          Add Game
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Panel - Games List */}
        <div className="w-1/2 flex flex-col bg-white rounded-lg shadow">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-[#0091f3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'upcoming'
                    ? 'bg-[#0091f3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'past'
                    ? 'bg-[#0091f3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Past
              </button>
            </div>
          </div>

          {/* Games List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedGame?.id === game.id
                    ? 'border-[#0091f3] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        vs {game.opponent}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          game.homeAway === 'home'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {game.homeAway.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{game.team}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      game.status === 'scheduled'
                        ? 'bg-green-100 text-green-700'
                        : game.status === 'completed'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
                  </span>
                </div>

                {game.status === 'completed' && game.score && (
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-[#ea7800]" />
                    <span className="font-bold text-gray-900">
                      {game.score.team} - {game.score.opponent}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(game.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{game.time}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredGames.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No games found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Game Details */}
        <div className="w-1/2 bg-white rounded-lg shadow p-6">
          {selectedGame ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    vs {selectedGame.opponent}
                  </h2>
                  <p className="text-gray-600">{selectedGame.team}</p>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
              </div>

              {selectedGame.status === 'completed' && selectedGame.score && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Rangers</p>
                      <p className="text-4xl font-bold text-gray-900">{selectedGame.score.team}</p>
                    </div>
                    <span className="text-2xl text-gray-400">-</span>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">{selectedGame.opponent}</p>
                      <p className="text-4xl font-bold text-gray-900">{selectedGame.score.opponent}</p>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedGame.score.team > selectedGame.score.opponent
                          ? 'bg-green-100 text-green-700'
                          : selectedGame.score.team < selectedGame.score.opponent
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {selectedGame.score.team > selectedGame.score.opponent
                        ? 'Win'
                        : selectedGame.score.team < selectedGame.score.opponent
                        ? 'Loss'
                        : 'Draw'}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Game Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(selectedGame.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{selectedGame.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{selectedGame.venue}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span className="capitalize">{selectedGame.homeAway} Game</span>
                    </div>
                  </div>
                </div>

                {selectedGame.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
                    <p className="text-gray-600">{selectedGame.notes}</p>
                  </div>
                )}

                {selectedGame.status === 'scheduled' && (
                  <div className="pt-4 border-t border-gray-200">
                    <button className="w-full px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0081d9] transition-colors">
                      Manage Lineup
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a game to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
