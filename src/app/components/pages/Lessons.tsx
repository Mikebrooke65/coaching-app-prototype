import { BookOpen, Clock, Users, Play, Download, ChevronDown, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState } from "react";
import { LessonDetail } from "./LessonDetail";
import { AICoach } from "./AICoach";

export function Lessons() {
  const [selectedTeam, setSelectedTeam] = useState("U14 Blue");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [selectedNextLesson, setSelectedNextLesson] = useState<number | null>(null);
  const [viewingLesson, setViewingLesson] = useState<{ id: number; skill: string; name: string } | null>(null);
  const [showAICoach, setShowAICoach] = useState(false);

  const teams = ["U14 Blue", "U16 Rangers"];

  const pastLessons = [
    {
      id: 1,
      date: "Feb 24, 2026",
      skill: "Shooting",
      name: "Finishing Under Pressure",
      team: "U14 Blue",
    },
    {
      id: 2,
      date: "Feb 22, 2026",
      skill: "Passing",
      name: "Quick Combination Play",
      team: "U14 Blue",
    },
    {
      id: 3,
      date: "Feb 19, 2026",
      skill: "Attacking",
      name: "1v1 Offensive Moves",
      team: "U14 Blue",
    },
    {
      id: 4,
      date: "Feb 17, 2026",
      skill: "Defending",
      name: "Positioning and Marking",
      team: "U14 Blue",
    },
    {
      id: 5,
      date: "Feb 15, 2026",
      skill: "Passing",
      name: "Long Ball Accuracy",
      team: "U14 Blue",
    },
    {
      id: 6,
      date: "Feb 23, 2026",
      skill: "Shooting",
      name: "Power and Placement",
      team: "U16 Rangers",
    },
    {
      id: 7,
      date: "Feb 21, 2026",
      skill: "Attacking",
      name: "Breaking Defensive Lines",
      team: "U16 Rangers",
    },
    {
      id: 8,
      date: "Feb 18, 2026",
      skill: "Passing",
      name: "Through Ball Timing",
      team: "U16 Rangers",
    },
  ];

  const filteredLessons = pastLessons.filter(lesson => lesson.team === selectedTeam);

  const availableLessons = [
    { id: 101, skill: "Shooting", name: "Close Range Finishing", team: "U14 Blue" },
    { id: 102, skill: "Passing", name: "Short Pass Combinations", team: "U14 Blue" },
    { id: 103, skill: "Attacking", name: "Wing Play & Crosses", team: "U14 Blue" },
    { id: 104, skill: "Defending", name: "Jockeying & Delaying", team: "U14 Blue" },
    { id: 105, skill: "Shooting", name: "Volleys & Half-Volleys", team: "U14 Blue" },
    { id: 106, skill: "Passing", name: "Switching Play", team: "U14 Blue" },
    { id: 107, skill: "Attacking", name: "Creating Space", team: "U14 Blue" },
    { id: 108, skill: "Defending", name: "Covering & Support", team: "U14 Blue" },
    { id: 201, skill: "Shooting", name: "Distance Shooting", team: "U16 Rangers" },
    { id: 202, skill: "Passing", name: "Diagonal Passes", team: "U16 Rangers" },
    { id: 203, skill: "Attacking", name: "Overlapping Runs", team: "U16 Rangers" },
    { id: 204, skill: "Defending", name: "Pressing Strategies", team: "U16 Rangers" },
    { id: 205, skill: "Shooting", name: "Headers & Set Pieces", team: "U16 Rangers" },
    { id: 206, skill: "Passing", name: "Build-Up from Back", team: "U16 Rangers" },
  ];

  const filteredAvailableLessons = availableLessons.filter(lesson => lesson.team === selectedTeam);

  const handleLessonSelect = (lesson: { id: number; skill: string; name: string }) => {
    setSelectedNextLesson(lesson.id);
    setViewingLesson(lesson);
  };

  const handleBackFromLesson = () => {
    setViewingLesson(null);
  };

  // If viewing AI Coach, show AI Coach view
  if (showAICoach) {
    return <AICoach onBack={() => setShowAICoach(false)} selectedTeam={selectedTeam} />;
  }

  // If viewing a lesson, show the lesson detail view
  if (viewingLesson) {
    return <LessonDetail lesson={viewingLesson} onBack={handleBackFromLesson} />;
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'Shooting':
        return 'bg-[#ea7800] text-white';
      case 'Passing':
        return 'bg-[#0091f3] text-white';
      case 'Attacking':
        return 'bg-green-500 text-white';
      case 'Defending':
        return 'bg-[#545859] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const categories = ["All", "Shooting", "Passing", "Attacking", "Defending"];

  const lessons = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1569242595722-23f071ac6991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBkcmlsbHMlMjBjb25lc3xlbnwxfHx8fDE3NzIxNDQxODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Finishing Under Pressure",
      description: "Learn to finish under pressure with confidence.",
      category: "Shooting",
      difficulty: "Intermediate",
      duration: "30 min",
      ageGroup: "U14 Blue",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1569242595722-23f071ac6991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBkcmlsbHMlMjBjb25lc3xlbnwxfHx8fDE3NzIxNDQxODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Quick Combination Play",
      description: "Master quick combination play for dynamic team movements.",
      category: "Passing",
      difficulty: "Beginner",
      duration: "25 min",
      ageGroup: "U14 Blue",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1569242595722-23f071ac6991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBkcmlsbHMlMjBjb25lc3xlbnwxfHx8fDE3NzIxNDQxODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "1v1 Offensive Moves",
      description: "Develop your 1v1 offensive skills for better ball control.",
      category: "Attacking",
      difficulty: "Intermediate",
      duration: "35 min",
      ageGroup: "U14 Blue",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1569242595722-23f071ac6991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBkcmlsbHMlMjBjb25lc3xlbnwxfHx8fDE3NzIxNDQxODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Positioning and Marking",
      description: "Learn the art of positioning and marking for effective defense.",
      category: "Defending",
      difficulty: "Advanced",
      duration: "40 min",
      ageGroup: "U14 Blue",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1569242595722-23f071ac6991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBkcmlsbHMlMjBjb25lc3xlbnwxfHx8fDE3NzIxNDQxODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Long Ball Accuracy",
      description: "Improve your long ball accuracy for better team play.",
      category: "Passing",
      difficulty: "Beginner",
      duration: "20 min",
      ageGroup: "U14 Blue",
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1569242595722-23f071ac6991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBkcmlsbHMlMjBjb25lc3xlbnwxfHx8fDE3NzIxNDQxODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Power and Placement",
      description: "Enhance your shooting power and placement for goal scoring.",
      category: "Shooting",
      difficulty: "Advanced",
      duration: "45 min",
      ageGroup: "U16 Rangers",
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1569242595722-23f071ac6991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBkcmlsbHMlMjBjb25lc3xlbnwxfHx8fDE3NzIxNDQxODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Breaking Defensive Lines",
      description: "Learn to break defensive lines for effective attacking.",
      category: "Attacking",
      difficulty: "Intermediate",
      duration: "30 min",
      ageGroup: "U16 Rangers",
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1569242595722-23f071ac6991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBkcmlsbHMlMjBjb25lc3xlbnwxfHx8fDE3NzIxNDQxODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Through Ball Timing",
      description: "Master the timing of through balls for precise passing.",
      category: "Passing",
      difficulty: "Beginner",
      duration: "25 min",
      ageGroup: "U16 Rangers",
    },
  ];

  return (
    <div className="px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-6 border-l-8 border-[#22c55e] pl-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Coaching</h1>
        <p className="text-sm text-gray-600">Training sessions and drills</p>
      </div>

      {/* Team Selection Block */}
      <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-900">Team {selectedTeam}</h2>
            <div className="relative">
              <button
                onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-[#0091f3] text-white rounded-lg text-sm font-medium hover:bg-[#0081d8] transition-colors"
              >
                Change Team
                <ChevronDown className={`w-4 h-4 transition-transform ${showTeamDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showTeamDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  {teams.map((team) => (
                    <button
                      key={team}
                      className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        team === selectedTeam ? 'bg-blue-50 text-[#0091f3] font-medium' : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setSelectedTeam(team);
                        setShowTeamDropdown(false);
                      }}
                    >
                      {team}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Past Lessons List */}
        <div className="p-4">
          <h3 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wide">Past Lessons</h3>
          <div className="space-y-2">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 mb-1">{lesson.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.date}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSkillColor(lesson.skill)}`}>
                      {lesson.skill}
                    </span>
                  </div>
                </div>
                <Play className="w-5 h-5 text-[#0091f3]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next Lesson Block */}
      <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Next Lesson</h2>
        </div>

        {/* Available Lessons List with Checkboxes */}
        <div className="p-4">
          <div className="space-y-2 mb-4">
            {filteredAvailableLessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => handleLessonSelect(lesson)}
                className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedNextLesson === lesson.id 
                    ? 'bg-[#0091f3] border-[#0091f3]' 
                    : 'bg-white border-gray-300'
                }`}>
                  {selectedNextLesson === lesson.id && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 mb-1">{lesson.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSkillColor(lesson.skill)}`}>
                    {lesson.skill}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Ask AI Coach Button */}
          <button
            className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            onClick={() => setShowAICoach(true)}
          >
            <Sparkles className="w-5 h-5" />
            Ask AI Coach
          </button>
        </div>
      </div>
    </div>
  );
}