import { ArrowLeft, Mic, Sparkles, TrendingUp, Target, Calendar } from "lucide-react";
import { useState } from "react";

interface AICoachProps {
  onBack: () => void;
  selectedTeam: string;
}

export function AICoach({ onBack, selectedTeam }: AICoachProps) {
  const [focusInput, setFocusInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const pastGameAnalysis = [
    {
      id: 1,
      date: "Feb 24, 2026",
      opponent: "vs Coastal United",
      result: "W 3-1",
      strengths: ["Strong passing in final third", "Good defensive positioning"],
      weaknesses: ["Lost possession in midfield", "Slow transitions"],
      rating: 4.2,
    },
    {
      id: 2,
      date: "Feb 17, 2026",
      opponent: "vs Harbor FC",
      result: "L 1-2",
      strengths: ["Individual skills on display", "Set piece execution"],
      weaknesses: ["Poor finishing", "Communication breakdown in defense"],
      rating: 3.5,
    },
    {
      id: 3,
      date: "Feb 10, 2026",
      opponent: "vs Bay City Rangers",
      result: "D 2-2",
      strengths: ["High energy throughout", "Creative attacking play"],
      weaknesses: ["Gave away early goals", "Fatigue in second half"],
      rating: 3.8,
    },
  ];

  const aiSuggestions = {
    keySkills: [
      {
        skill: "Passing",
        priority: "High",
        reason: "Build on recent success in final third passing",
        color: "bg-[#0091f3]",
      },
      {
        skill: "Shooting",
        priority: "High",
        reason: "Address poor finishing from Feb 17 match",
        color: "bg-[#ea7800]",
      },
      {
        skill: "Defending",
        priority: "Medium",
        reason: "Strengthen communication and early goal prevention",
        color: "bg-[#545859]",
      },
    ],
    recommendedSessions: [
      {
        id: 1,
        name: "Quick Combination Play",
        duration: "25 min",
        skill: "Passing",
        match: "Builds on successful final third play",
      },
      {
        id: 2,
        name: "Finishing Under Pressure",
        duration: "30 min",
        skill: "Shooting",
        match: "Addresses finishing weaknesses",
      },
      {
        id: 3,
        name: "Positioning and Marking",
        duration: "40 min",
        skill: "Defending",
        match: "Improves defensive communication",
      },
    ],
  };

  const handleDictate = () => {
    setIsRecording(!isRecording);
    // In real app, this would use Web Speech API
    if (!isRecording) {
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);
        setFocusInput("We need to work on finishing chances in the box and improving our defensive transitions when we lose possession.");
      }, 3000);
    }
  };

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'Shooting':
        return 'bg-[#ea7800]';
      case 'Passing':
        return 'bg-[#0091f3]';
      case 'Attacking':
        return 'bg-green-500';
      case 'Defending':
        return 'bg-[#545859]';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-white" />
            <h1 className="text-2xl font-bold text-white">AI Coach</h1>
          </div>
          <p className="text-sm text-gray-400">Team {selectedTeam}</p>
        </div>
      </div>

      {/* Past Game Analysis Block */}
      <div className="mb-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Past Game Analysis
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {pastGameAnalysis.map((game) => (
            <div
              key={game.id}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-white mb-1">{game.opponent}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {game.date}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-medium ${
                      game.result.startsWith('W') ? 'bg-green-500/20 text-green-400' :
                      game.result.startsWith('L') ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {game.result}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{game.rating}</div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-green-400 font-medium mb-1">✓ Strengths</p>
                  <ul className="space-y-1 text-gray-300">
                    {game.strengths.map((strength, idx) => (
                      <li key={idx}>• {strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-orange-400 font-medium mb-1">✗ Weaknesses</p>
                  <ul className="space-y-1 text-gray-300">
                    {game.weaknesses.map((weakness, idx) => (
                      <li key={idx}>• {weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What do you want to focus on Block */}
      <div className="mb-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            What do you want to focus on?
          </h2>
        </div>
        <div className="p-4">
          <div className="relative">
            <textarea
              value={focusInput}
              onChange={(e) => setFocusInput(e.target.value)}
              placeholder="Describe what you'd like to work on with your team..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl p-4 pr-14 text-sm focus:outline-none focus:border-gray-500 placeholder-gray-500 min-h-[120px] resize-none"
            />
            <button
              onClick={handleDictate}
              className={`absolute bottom-3 right-3 p-3 rounded-lg transition-all ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'text-white' : 'text-gray-300'}`} />
            </button>
          </div>
          {isRecording && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Listening...
            </p>
          )}
        </div>
      </div>

      {/* AI Suggestion Block */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            AI Suggestions
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Based on game analysis and your focus areas
          </p>
        </div>

        <div className="p-4">
          {/* Key Skills */}
          <div className="mb-4">
            <h3 className="font-bold text-sm text-gray-300 mb-3 uppercase tracking-wide">
              Key Skills to Develop
            </h3>
            <div className="space-y-2">
              {aiSuggestions.keySkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`${getSkillColor(skill.skill)} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                        {skill.skill}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        skill.priority === 'High' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {skill.priority} Priority
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300">{skill.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Sessions */}
          <div>
            <h3 className="font-bold text-sm text-gray-300 mb-3 uppercase tracking-wide">
              Recommended Sessions
            </h3>
            <div className="space-y-2">
              {aiSuggestions.recommendedSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm mb-1">{session.name}</p>
                      <p className="text-xs text-gray-400 mb-2">{session.match}</p>
                    </div>
                    <span className="text-xs text-gray-400">{session.duration}</span>
                  </div>
                  <span className={`${getSkillColor(session.skill)} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                    {session.skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full mt-4 bg-white text-black py-3 px-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            <Target className="w-5 h-5" />
            Apply Suggestions to Training
          </button>
        </div>
      </div>
    </div>
  );
}
