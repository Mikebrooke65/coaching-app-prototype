import { useState } from 'react';
import { Calendar, MapPin, Users, Trophy, Clock } from 'lucide-react';

interface Game {
  id: string;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  homeAway: 'home' | 'away';
  status: 'scheduled' | 'completed' | 'cancelled';
  score?: {
    team: number;
    opponent: number;
  };
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
  },
  {
    id: '2',
    opponent: 'City FC',
    date: '2026-03-08',
    time: '2:00 PM',
    venue: 'City Sports Complex',
    homeAway: 'away',
    status: 'completed',
    score: { team: 3, opponent: 2 },
  },
  {
    id: '3',
    opponent: 'Valley Rangers',
    date: '2026-03-01',
    time: '11:30 AM',
    venue: 'Rangers Home Ground',
    homeAway: 'home',
    status: 'completed',
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
  },
];

export function Games() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  const filteredGames = mockGames.filter((game) => {
    if (filter === 'upcoming') return game.status === 'scheduled';
    if (filter === 'past') return game.status === 'completed';
    return true;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-4 pb-20">
      <div className="border-l-8 border-[#ea7800] pl-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Games</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-[#0091f3] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'upcoming'
              ? 'bg-[#0091f3] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'past'
              ? 'bg-[#0091f3] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Past
        </button>
      </div>

      {/* Games List */}
      <div className="space-y-3">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
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
                {game.status === 'completed' && game.score && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#ea7800]" />
                    <span className="text-lg font-bold text-gray-900">
                      {game.score.team} - {game.score.opponent}
                    </span>
                    <span className="text-sm text-gray-600">
                      {game.score.team > game.score.opponent
                        ? 'Win'
                        : game.score.team < game.score.opponent
                        ? 'Loss'
                        : 'Draw'}
                    </span>
                  </div>
                )}
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

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(game.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{game.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{game.venue}</span>
              </div>
            </div>

            {/* Actions */}
            {game.status === 'scheduled' && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button className="text-[#0091f3] text-sm font-medium hover:underline">
                  View Details
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No games found</p>
        </div>
      )}
    </div>
  );
}
