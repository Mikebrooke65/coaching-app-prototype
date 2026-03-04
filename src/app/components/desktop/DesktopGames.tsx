import { Trophy, Calendar, MapPin, Plus, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Game {
  id: number;
  team: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  result?: {
    home: number;
    away: number;
  };
  status: 'upcoming' | 'completed' | 'cancelled';
}

export function DesktopGames() {
  const [filterStatus, setFilterStatus] = useState("all");

  const games: Game[] = [
    {
      id: 1,
      team: "U12 Rangers Blue",
      opponent: "City Knights",
      date: "Mar 5, 2026",
      time: "10:00 AM",
      location: "Home Ground",
      result: { home: 3, away: 1 },
      status: "completed"
    },
    {
      id: 2,
      team: "U10 Rangers",
      opponent: "Eagles FC",
      date: "Mar 8, 2026",
      time: "2:00 PM",
      location: "Eagles Field",
      status: "upcoming"
    },
    {
      id: 3,
      team: "U14 Rangers",
      opponent: "Strikers United",
      date: "Mar 9, 2026",
      time: "11:00 AM",
      location: "Home Ground",
      status: "upcoming"
    },
    {
      id: 4,
      team: "U16 Rangers",
      opponent: "Phoenix FC",
      date: "Feb 28, 2026",
      time: "3:00 PM",
      location: "Phoenix Arena",
      result: { home: 2, away: 2 },
      status: "completed"
    },
    {
      id: 5,
      team: "U8 Rangers",
      opponent: "Junior Stars",
      date: "Mar 12, 2026",
      time: "9:00 AM",
      location: "Home Ground",
      status: "upcoming"
    },
    {
      id: 6,
      team: "U12 Rangers White",
      opponent: "Thunder FC",
      date: "Feb 25, 2026",
      time: "1:00 PM",
      location: "Thunder Stadium",
      result: { home: 1, away: 3 },
      status: "completed"
    },
  ];

  const filteredGames = games.filter(game => 
    filterStatus === "all" || game.status === filterStatus
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const getResultBadge = (result: { home: number; away: number }) => {
    if (result.home > result.away) {
      return <Badge className="bg-green-100 text-green-800">Win</Badge>;
    } else if (result.home < result.away) {
      return <Badge className="bg-red-100 text-red-800">Loss</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Draw</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#ea7800' }}>Games & Matches</h1>
        <p className="text-gray-600">Track game schedules, results, and team performance</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2 bg-[#0091f3] hover:bg-[#0081d8]">
            <Plus className="w-4 h-4" />
            Add Game
          </Button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[#0091f3] hover:shadow-md transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#ea7800]/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-[#ea7800]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{game.team}</h3>
                  <p className="text-sm text-gray-500">vs {game.opponent}</p>
                </div>
              </div>
              {getStatusBadge(game.status)}
            </div>

            {/* Match Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{game.date} at {game.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{game.location}</span>
              </div>
            </div>

            {/* Result or CTA */}
            {game.result ? (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">{game.team.split(' ')[0]}</p>
                      <p className="text-2xl font-bold text-gray-900">{game.result.home}</p>
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">{game.opponent.split(' ')[0]}</p>
                      <p className="text-2xl font-bold text-gray-900">{game.result.away}</p>
                    </div>
                  </div>
                  {getResultBadge(game.result)}
                </div>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full" size="sm">
                  Log Result
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Games</p>
          <p className="text-2xl font-bold text-gray-900">{games.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Wins</p>
          <p className="text-2xl font-bold text-green-600">
            {games.filter(g => g.result && g.result.home > g.result.away).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Draws</p>
          <p className="text-2xl font-bold text-gray-600">
            {games.filter(g => g.result && g.result.home === g.result.away).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Losses</p>
          <p className="text-2xl font-bold text-red-600">
            {games.filter(g => g.result && g.result.home < g.result.away).length}
          </p>
        </div>
      </div>
    </div>
  );
}