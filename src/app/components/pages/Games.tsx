import { Trophy, Calendar, MapPin, Clock, CheckCircle, XCircle, Circle, ChevronUp, ChevronDown, Users, User, ArrowLeft } from "lucide-react";
import { useState } from "react";

export function Games() {
  const games = [
    {
      id: 1,
      homeTeam: "WCR U14 Blue",
      awayTeam: "City FC U14",
      date: "Feb 28, 2026",
      time: "10:00 AM",
      location: "West Coast Stadium - Field 1",
      status: "upcoming" as const,
      homeScore: null,
      awayScore: null,
    },
    {
      id: 2,
      homeTeam: "WCR U12 White",
      awayTeam: "Harbor United U12",
      date: "Feb 28, 2026",
      time: "11:30 AM",
      location: "West Coast Stadium - Field 2",
      status: "upcoming" as const,
      homeScore: null,
      awayScore: null,
    },
    {
      id: 3,
      homeTeam: "Peninsula FC U16",
      awayTeam: "WCR U16 Rangers",
      date: "Mar 1, 2026",
      time: "2:00 PM",
      location: "Peninsula Sports Complex",
      status: "upcoming" as const,
      homeScore: null,
      awayScore: null,
    },
    {
      id: 4,
      homeTeam: "WCR U10 Blue",
      awayTeam: "Coastal Stars U10",
      date: "Feb 22, 2026",
      time: "9:00 AM",
      location: "West Coast Stadium - Field 1",
      status: "completed" as const,
      homeScore: 3,
      awayScore: 2,
    },
    {
      id: 5,
      homeTeam: "Metro FC U14",
      awayTeam: "WCR U14 White",
      date: "Feb 21, 2026",
      time: "3:00 PM",
      location: "Metro Sports Park",
      status: "completed" as const,
      homeScore: 1,
      awayScore: 1,
    },
    {
      id: 6,
      homeTeam: "WCR U12 Blue",
      awayTeam: "North End United U12",
      date: "Feb 20, 2026",
      time: "10:00 AM",
      location: "West Coast Stadium - Field 2",
      status: "completed" as const,
      homeScore: 4,
      awayScore: 1,
    },
  ];

  // Filter only completed games
  const completedGames = games.filter(game => game.status === 'completed');
  
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [activeView, setActiveView] = useState<'main' | 'team' | 'players'>('main');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  
  const currentGame = completedGames[currentGameIndex];

  // Sample player list for the team
  const teamPlayers = [
    "Alex Thompson",
    "Jordan Martinez",
    "Sam Chen",
    "Riley Johnson",
    "Morgan Davis",
    "Casey O'Brien",
    "Taylor Williams",
    "Dakota Brown",
    "Avery Wilson",
    "Quinn Anderson",
    "Cameron Lee",
    "Jamie Robinson"
  ];

  const handlePrevGame = () => {
    setCurrentGameIndex((prev) => (prev > 0 ? prev - 1 : completedGames.length - 1));
  };

  const handleNextGame = () => {
    setCurrentGameIndex((prev) => (prev < completedGames.length - 1 ? prev + 1 : 0));
  };

  const getResult = (game: typeof games[0], isHome: boolean) => {
    if (game.status !== 'completed' || game.homeScore === null || game.awayScore === null) return null;
    
    const isWCR = isHome ? game.homeTeam.includes('WCR') : game.awayTeam.includes('WCR');
    if (!isWCR) return null;

    if (game.homeScore === game.awayScore) return 'draw';
    if (isHome) {
      return game.homeScore > game.awayScore ? 'win' : 'loss';
    } else {
      return game.awayScore > game.homeScore ? 'win' : 'loss';
    }
  };

  const homeResult = getResult(currentGame, true);
  const awayResult = getResult(currentGame, false);

  // Team Feedback View
  if (activeView === 'team') {
    return (
      <div className="px-4 py-6 pb-20">
        {/* Header with Orange accent */}
        <div className="mb-6 border-l-8 border-[#ea7800] pl-4">
          <button 
            onClick={() => setActiveView('main')}
            className="flex items-center gap-2 text-[#ea7800] hover:text-[#d66d00] transition-colors mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Games</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Team Feedback</h1>
          <p className="text-sm text-gray-600">{currentGame.homeTeam.includes('WCR') ? currentGame.homeTeam : currentGame.awayTeam}</p>
        </div>

        {/* Game Summary with Orange theme */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#ea7800] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className={`font-bold text-lg ${currentGame.homeTeam.includes('WCR') ? 'text-[#ea7800]' : 'text-gray-900'}`}>
                {currentGame.homeTeam}
              </p>
            </div>
            
            <div className="bg-[#ea7800] px-6 py-2 rounded-xl mx-4">
              <span className="text-white font-bold text-2xl">
                {currentGame.homeScore} - {currentGame.awayScore}
              </span>
            </div>
            
            <div className="flex-1 text-right">
              <p className={`font-bold text-lg ${currentGame.awayTeam.includes('WCR') ? 'text-[#ea7800]' : 'text-gray-900'}`}>
                {currentGame.awayTeam}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 pt-4 border-t border-gray-200">
            <Calendar className="w-4 h-4" />
            <span>{currentGame.date}</span>
          </div>
        </div>

        {/* Team Feedback Content */}
        <div className="space-y-4">
          <p className="text-gray-600 text-center">Team feedback content will go here</p>
        </div>
      </div>
    );
  }

  // Players Feedback View
  if (activeView === 'players') {
    return (
      <div className="px-4 py-6 pb-20">
        {/* Header with Orange accent */}
        <div className="mb-6 border-l-8 border-[#ea7800] pl-4">
          <button 
            onClick={() => setActiveView('main')}
            className="flex items-center gap-2 text-[#ea7800] hover:text-[#d66d00] transition-colors mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Games</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Player Feedback</h1>
          <p className="text-sm text-gray-600">{currentGame.homeTeam.includes('WCR') ? currentGame.homeTeam : currentGame.awayTeam}</p>
        </div>

        {/* Game Summary with Orange theme */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#ea7800] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className={`font-bold text-lg ${currentGame.homeTeam.includes('WCR') ? 'text-[#ea7800]' : 'text-gray-900'}`}>
                {currentGame.homeTeam}
              </p>
            </div>
            
            <div className="bg-[#ea7800] px-6 py-2 rounded-xl mx-4">
              <span className="text-white font-bold text-2xl">
                {currentGame.homeScore} - {currentGame.awayScore}
              </span>
            </div>
            
            <div className="flex-1 text-right">
              <p className={`font-bold text-lg ${currentGame.awayTeam.includes('WCR') ? 'text-[#ea7800]' : 'text-gray-900'}`}>
                {currentGame.awayTeam}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-600 pt-4 border-t border-gray-200">
            <Calendar className="w-4 h-4" />
            <span>{currentGame.date}</span>
          </div>
        </div>

        {/* Player Selection */}
        <div className="mb-6">
          <label htmlFor="player-select" className="block text-lg font-semibold text-gray-900 mb-3">
            Select a Player
          </label>
          <select
            id="player-select"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full bg-white border-2 border-[#ea7800] rounded-xl px-4 py-3 text-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ea7800] focus:border-transparent shadow-md"
          >
            <option value="">Choose a player...</option>
            {teamPlayers.map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </div>

        {/* Player Feedback Content */}
        {selectedPlayer && (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-[#ea7800] p-6">
            <h3 className="text-xl font-bold text-[#ea7800] mb-4">{selectedPlayer}</h3>
            <p className="text-gray-600">Player feedback content will go here</p>
          </div>
        )}
      </div>
    );
  }

  // Main Games View
  return (
    <div className="px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-6 border-l-8 border-[#ea7800] pl-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Games</h1>
        <p className="text-sm text-gray-600">Match review and thoughts</p>
      </div>

      {/* Feedback Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
          Feedback on this game
        </h2>

        {/* Game Navigation */}
        <div className="flex items-center gap-4">
          {/* Vertical Arrow Stack */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handlePrevGame}
              className="bg-[#0091f3] text-white p-2.5 rounded-lg hover:bg-[#0081d8] transition-colors shadow-md"
              aria-label="Previous game"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextGame}
              className="bg-[#0091f3] text-white p-2.5 rounded-lg hover:bg-[#0081d8] transition-colors shadow-md"
              aria-label="Next game"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Game Block */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
            {/* Teams and Score */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className={`font-bold text-xl ${currentGame.homeTeam.includes('WCR') ? 'text-[#0091f3]' : 'text-gray-900'}`}>
                  {currentGame.homeTeam}
                </p>
              </div>
              
              <div className="bg-[#545859] px-8 py-3 rounded-xl mx-6">
                <span className="text-white font-bold text-3xl">
                  {currentGame.homeScore} - {currentGame.awayScore}
                </span>
              </div>
              
              <div className="flex-1 text-right">
                <p className={`font-bold text-xl ${currentGame.awayTeam.includes('WCR') ? 'text-[#0091f3]' : 'text-gray-900'}`}>
                  {currentGame.awayTeam}
                </p>
              </div>
            </div>
            
            {/* Date Only */}
            <div className="flex items-center justify-center text-sm text-gray-500 pt-4 border-t border-gray-200">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{currentGame.date}</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-3">
          Game {currentGameIndex + 1} of {completedGames.length}
        </p>

        {/* Team/Players Toggle Buttons */}
        <div className="flex gap-3 mt-6">
          <button 
            onClick={() => setActiveView('team')}
            className="flex-1 bg-[#0091f3] text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-[#0081d8] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Users className="w-6 h-6" />
            Team
          </button>
          <button 
            onClick={() => setActiveView('players')}
            className="flex-1 bg-[#0091f3] text-white py-3 px-6 rounded-xl font-semibold text-lg hover:bg-[#0081d8] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <User className="w-6 h-6" />
            Players
          </button>
        </div>
      </div>

      {/* Next section will go here */}
    </div>
  );
}