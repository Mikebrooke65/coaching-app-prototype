import { useState } from "react";
import { Plus, Save, Clock, Target, Trash2, Filter, X, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

interface Lesson {
  id: number;
  name: string;
  keySkill: string;
  teamType: string;
  ageGroup: string;
  technicalLevel: string;
  gender: string;
  duration: string;
  sessions: {
    technical: string;
    skillIntroduction: string;
    skillDevelopment: string;
    game: string;
  };
  createdDate: string;
}

const keySkills = ['Passing', 'Shooting', 'Dribbling', 'Defending', 'First Touch', 'Heading', 'Tackling'];
const teamTypes = ['First Kicks', 'Fun Football', 'Junior Football', 'Youth Football', 'Senior'];
const ageGroups = ['U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17'];
const technicalLevels = ['Community', 'Academy/Development'];
const genders = ['Mixed', 'Female'];

const blockConfig = [
  { key: 'technical', title: 'Warm-Up & Technical', color: '#22c55e', description: 'Dynamic warm-up and technical fundamentals' },
  { key: 'skillIntroduction', title: 'Skill Introduction', color: '#0091f3', description: 'Introduce the core skill through demonstration' },
  { key: 'skillDevelopment', title: 'Progressive Development', color: '#ea7800', description: 'Build skills through progressive drills' },
  { key: 'game', title: 'Game Application', color: '#8b5cf6', description: 'Apply skills in small-sided game' },
];

export function LessonBuilder() {
  const [showNewLessonForm, setShowNewLessonForm] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editedLesson, setEditedLesson] = useState<any>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  
  const [newLesson, setNewLesson] = useState({
    name: '',
    keySkill: '',
    teamType: '',
    ageGroup: '',
    technicalLevel: '',
    gender: '',
    duration: '',
    sessions: {
      technical: '',
      skillIntroduction: '',
      skillDevelopment: '',
      game: '',
    },
  });

  // Filters
  const [selectedKeySkill, setSelectedKeySkill] = useState('All');
  const [selectedTeamType, setSelectedTeamType] = useState('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('All');
  const [selectedTechnicalLevel, setSelectedTechnicalLevel] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock existing lessons
  const [lessons] = useState<Lesson[]>([
    {
      id: 1,
      name: 'Basic Passing Fundamentals',
      keySkill: 'Passing',
      teamType: 'Youth Football',
      ageGroup: 'U14',
      technicalLevel: 'Academy/Development',
      gender: 'Mixed',
      duration: '60',
      sessions: {
        technical: 'Dynamic Warm-Up Routine',
        skillIntroduction: 'Passing Technique Basics',
        skillDevelopment: 'Progressive Passing Drills',
        game: 'Small-Sided Passing Game',
      },
      createdDate: 'Mar 1, 2026',
    },
    {
      id: 2,
      name: 'Shooting Accuracy Training',
      keySkill: 'Shooting',
      teamType: 'Youth Football',
      ageGroup: 'U15',
      technicalLevel: 'Academy/Development',
      gender: 'Mixed',
      duration: '60',
      sessions: {
        technical: 'Ball Control Fundamentals',
        skillIntroduction: 'Shooting Form & Technique',
        skillDevelopment: 'Shooting Under Pressure',
        game: 'Shooting in Game Situations',
      },
      createdDate: 'Feb 28, 2026',
    },
    {
      id: 3,
      name: 'Ball Mastery Basics',
      keySkill: 'Dribbling',
      teamType: 'Junior Football',
      ageGroup: 'U10',
      technicalLevel: 'Community',
      gender: 'Mixed',
      duration: '45',
      sessions: {
        technical: 'Ball Control Fundamentals',
        skillIntroduction: 'Dribbling Technique Introduction',
        skillDevelopment: 'Progressive Dribbling Drills',
        game: 'Dribbling in Game Context',
      },
      createdDate: 'Feb 27, 2026',
    },
  ]);

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    const matchesKeySkill = selectedKeySkill === 'All' || lesson.keySkill === selectedKeySkill;
    const matchesTeamType = selectedTeamType === 'All' || lesson.teamType === selectedTeamType;
    const matchesAgeGroup = selectedAgeGroup === 'All' || lesson.ageGroup === selectedAgeGroup;
    const matchesTechnicalLevel = selectedTechnicalLevel === 'All' || lesson.technicalLevel === selectedTechnicalLevel;
    const matchesGender = selectedGender === 'All' || lesson.gender === selectedGender;
    const matchesSearch = lesson.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesKeySkill && matchesTeamType && matchesAgeGroup && matchesTechnicalLevel && matchesGender && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedKeySkill('All');
    setSelectedTeamType('All');
    setSelectedAgeGroup('All');
    setSelectedTechnicalLevel('All');
    setSelectedGender('All');
    setSearchQuery('');
  };

  const activeFiltersCount = [
    selectedKeySkill !== 'All',
    selectedTeamType !== 'All',
    selectedAgeGroup !== 'All',
    selectedTechnicalLevel !== 'All',
    selectedGender !== 'All',
  ].filter(Boolean).length;

  const getSkillColor = (skill: string) => {
    switch (skill) {
      case 'Shooting':
        return 'bg-[#ea7800] text-white';
      case 'Passing':
        return 'bg-[#0091f3] text-white';
      case 'Dribbling':
        return 'bg-purple-500 text-white';
      case 'Defending':
        return 'bg-[#545859] text-white';
      case 'First Touch':
        return 'bg-green-500 text-white';
      case 'Heading':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Mock available sessions from Session Builder - filtered by lesson tags and block type
  const getAvailableSessions = (blockType: string) => {
    const allSessions = [
      { id: 1, name: 'Dynamic Warm-Up Routine', blockType: 'technical', coreSkill: 'Passing', teamType: 'Youth Football', ageGroup: 'U14', technicalLevel: 'Academy/Development', gender: 'Mixed' },
      { id: 2, name: 'Ball Control Fundamentals', blockType: 'technical', coreSkill: 'Dribbling', teamType: 'Junior Football', ageGroup: 'U10', technicalLevel: 'Community', gender: 'Mixed' },
      { id: 3, name: 'Passing Technique Basics', blockType: 'skillIntroduction', coreSkill: 'Passing', teamType: 'Youth Football', ageGroup: 'U14', technicalLevel: 'Academy/Development', gender: 'Mixed' },
      { id: 4, name: 'Shooting Form & Technique', blockType: 'skillIntroduction', coreSkill: 'Shooting', teamType: 'Youth Football', ageGroup: 'U15', technicalLevel: 'Academy/Development', gender: 'Mixed' },
      { id: 5, name: 'Progressive Passing Drills', blockType: 'skillDevelopment', coreSkill: 'Passing', teamType: 'Youth Football', ageGroup: 'U14', technicalLevel: 'Academy/Development', gender: 'Mixed' },
      { id: 6, name: 'Shooting Under Pressure', blockType: 'skillDevelopment', coreSkill: 'Shooting', teamType: 'Youth Football', ageGroup: 'U15', technicalLevel: 'Academy/Development', gender: 'Mixed' },
      { id: 7, name: 'Small-Sided Passing Game', blockType: 'game', coreSkill: 'Passing', teamType: 'Youth Football', ageGroup: 'U14', technicalLevel: 'Academy/Development', gender: 'Mixed' },
      { id: 8, name: 'Shooting in Game Situations', blockType: 'game', coreSkill: 'Shooting', teamType: 'Youth Football', ageGroup: 'U15', technicalLevel: 'Academy/Development', gender: 'Mixed' },
    ];

    return allSessions.filter(session => {
      const matchesBlockType = session.blockType === blockType;
      const matchesKeySkill = !newLesson.keySkill || session.coreSkill === newLesson.keySkill;
      const matchesTeamType = !newLesson.teamType || session.teamType === newLesson.teamType;
      const matchesAgeGroup = !newLesson.ageGroup || session.ageGroup === newLesson.ageGroup;
      const matchesTechnicalLevel = !newLesson.technicalLevel || session.technicalLevel === newLesson.technicalLevel;
      const matchesGender = !newLesson.gender || session.gender === newLesson.gender;

      return matchesBlockType && matchesKeySkill && matchesTeamType && matchesAgeGroup && matchesTechnicalLevel && matchesGender;
    });
  };

  const handleSelectSession = (blockType: string, sessionName: string) => {
    setNewLesson({
      ...newLesson,
      sessions: {
        ...newLesson.sessions,
        [blockType]: sessionName,
      },
    });
    setSelectedBlock(null);
  };

  const handleRemoveSession = (blockType: string) => {
    setNewLesson({
      ...newLesson,
      sessions: {
        ...newLesson.sessions,
        [blockType]: '',
      },
    });
  };

  const handleSaveLesson = () => {
    if (editingLessonId) {
      console.log('Updating lesson:', editingLessonId, newLesson);
    } else {
      console.log('Saving new lesson:', newLesson);
    }
    setShowNewLessonForm(false);
    setEditingLessonId(null);
    setSelectedBlock(null);
    setNewLesson({
      name: '',
      keySkill: '',
      teamType: '',
      ageGroup: '',
      technicalLevel: '',
      gender: '',
      duration: '',
      sessions: {
        technical: '',
        skillIntroduction: '',
        skillDevelopment: '',
        game: '',
      },
    });
  };

  const handleEditLesson = (lesson: Lesson) => {
    setNewLesson({
      name: lesson.name,
      keySkill: lesson.keySkill,
      teamType: lesson.teamType,
      ageGroup: lesson.ageGroup,
      technicalLevel: lesson.technicalLevel,
      gender: lesson.gender,
      duration: lesson.duration,
      sessions: lesson.sessions,
    });
    setEditingLessonId(lesson.id);
    setShowNewLessonForm(true);
    setSelectedLessonId(null);
  };

  const isFormValid = () => {
    return (
      newLesson.name &&
      newLesson.keySkill &&
      newLesson.teamType &&
      newLesson.ageGroup &&
      newLesson.technicalLevel &&
      newLesson.gender &&
      newLesson.duration
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lesson Builder</h1>
          <p className="text-sm text-gray-600">Build custom lessons by combining 4 session blocks</p>
        </div>
        {!showNewLessonForm && (
          <button
            onClick={() => setShowNewLessonForm(true)}
            className="bg-[#0091f3] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0081d8] transition-colors flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create New Lesson
          </button>
        )}
      </div>

      {/* New Lesson Form */}
      {showNewLessonForm && (
        <div className="mb-8 bg-white rounded-2xl shadow-lg border-2 border-[#0091f3] overflow-hidden">
          <div className="bg-[#0091f3] p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {editingLessonId ? 'Edit Lesson' : 'Build a Lesson'}
            </h2>
            <button
              onClick={() => {
                setShowNewLessonForm(false);
                setEditingLessonId(null);
                setSelectedBlock(null);
              }}
              className="text-white hover:bg-[#0081d8] rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            {/* Lesson Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lesson Name *
              </label>
              <Input
                value={newLesson.name}
                onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
                placeholder="e.g., Ball Control Fundamentals"
                className="w-full"
              />
            </div>

            {/* Key Skill */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Key Skill *
              </label>
              <Select
                value={newLesson.keySkill}
                onValueChange={(value) => setNewLesson({ ...newLesson, keySkill: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select key skill..." />
                </SelectTrigger>
                <SelectContent>
                  {keySkills.map(skill => (
                    <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Team Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Team Type *
                </label>
                <Select
                  value={newLesson.teamType}
                  onValueChange={(value) => setNewLesson({ ...newLesson, teamType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teamTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age Group *
                </label>
                <Select
                  value={newLesson.ageGroup}
                  onValueChange={(value) => setNewLesson({ ...newLesson, ageGroup: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {ageGroups.map(age => (
                      <SelectItem key={age} value={age}>{age}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Technical Level & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Technical Level *
                </label>
                <Select
                  value={newLesson.technicalLevel}
                  onValueChange={(value) => setNewLesson({ ...newLesson, technicalLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technical level..." />
                  </SelectTrigger>
                  <SelectContent>
                    {technicalLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gender *
                </label>
                <Select
                  value={newLesson.gender}
                  onValueChange={(value) => setNewLesson({ ...newLesson, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender..." />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.map(gender => (
                      <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Duration (minutes) *
              </label>
              <Input
                type="number"
                value={newLesson.duration}
                onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                placeholder="e.g., 60"
                className="w-full"
              />
            </div>

            {/* Sessions Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Build Your Lesson (4 Blocks)</h3>
                <p className="text-sm text-gray-600">Select a session for each of the 4 lesson blocks. Click each block to view available sessions.</p>
              </div>

              {/* 4 Fixed Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blockConfig.map((block, index) => (
                  <div
                    key={block.key}
                    className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
                    style={{ borderColor: newLesson.sessions[block.key as keyof typeof newLesson.sessions] ? block.color : undefined }}
                  >
                    <div 
                      className="p-4"
                      style={{ backgroundColor: `${block.color}15` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{block.title}</h4>
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: block.color }}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{block.description}</p>

                      {newLesson.sessions[block.key as keyof typeof newLesson.sessions] ? (
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">
                                {newLesson.sessions[block.key as keyof typeof newLesson.sessions]}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveSession(block.key)}
                              className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors ml-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => setSelectedBlock(block.key)}
                            className="w-full mt-2 text-xs font-medium hover:underline"
                            style={{ color: block.color }}
                          >
                            Change Session
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedBlock(block.key)}
                          className="w-full text-white px-4 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                          style={{ backgroundColor: block.color }}
                        >
                          <Plus className="w-4 h-4" />
                          Select Session
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Selector Modal */}
            {selectedBlock && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
                  <div 
                    className="p-6 flex items-center justify-between text-white"
                    style={{ backgroundColor: blockConfig.find(b => b.key === selectedBlock)?.color }}
                  >
                    <h3 className="text-xl font-bold">
                      Select Session for {blockConfig.find(b => b.key === selectedBlock)?.title}
                    </h3>
                    <button
                      onClick={() => setSelectedBlock(null)}
                      className="hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                    {getAvailableSessions(selectedBlock).length === 0 ? (
                      <div className="text-center py-12">
                        <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No matching sessions found</h4>
                        <p className="text-sm text-gray-600">
                          {newLesson.keySkill || newLesson.teamType || newLesson.ageGroup
                            ? 'No sessions match your lesson criteria. Try adjusting your lesson settings or create new sessions in the Session Builder.'
                            : 'Please fill in the lesson details above to see available sessions.'}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {getAvailableSessions(selectedBlock).map((session) => (
                          <button
                            key={session.id}
                            onClick={() => handleSelectSession(selectedBlock, session.name)}
                            className="text-left border-2 border-gray-200 rounded-xl p-4 hover:border-[#0091f3] hover:shadow-md transition-all bg-gray-50 hover:bg-white"
                          >
                            <h4 className="font-bold text-gray-900 mb-2">{session.name}</h4>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <Badge className="bg-blue-100 text-blue-800">{session.coreSkill}</Badge>
                              <Badge className="bg-gray-100 text-gray-800">{session.teamType}</Badge>
                              <Badge className="bg-gray-100 text-gray-800">{session.ageGroup}</Badge>
                              <Badge className="bg-purple-100 text-purple-800">{session.technicalLevel}</Badge>
                              <Badge className="bg-pink-100 text-pink-800">{session.gender}</Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowNewLessonForm(false);
                  setEditingLessonId(null);
                  setSelectedBlock(null);
                }}
                className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLesson}
                disabled={!isFormValid()}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isFormValid()
                    ? 'bg-[#0091f3] text-white hover:bg-[#0081d8] shadow-sm'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-5 h-5" />
                {editingLessonId ? 'Update Lesson' : 'Save Lesson'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Lessons List */}
      {!showNewLessonForm && (
        <>
          {/* Lessons Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            {/* Lessons Header */}
            <div className="px-5 py-3 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Lessons ({filteredLessons.length})
              </h2>
            </div>

            {/* Filters Section - More Compact */}
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900">Filters</span>
                  {activeFiltersCount > 0 && (
                    <Badge className="bg-[#0091f3] text-white text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>

              {/* Search Bar */}
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search lesson names..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0091f3] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Dropdowns - More Compact */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {/* Key Skill Filter */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Key Skill</label>
                  <Select value={selectedKeySkill} onValueChange={setSelectedKeySkill}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {keySkills.map(skill => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Team Type Filter */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Team Type</label>
                  <Select value={selectedTeamType} onValueChange={setSelectedTeamType}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {teamTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Age Group Filter */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Age Group</label>
                  <Select value={selectedAgeGroup} onValueChange={setSelectedAgeGroup}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      <SelectItem value="All">All</SelectItem>
                      {ageGroups.map(age => (
                        <SelectItem key={age} value={age}>{age}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Technical Level Filter */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Technical Level</label>
                  <Select value={selectedTechnicalLevel} onValueChange={setSelectedTechnicalLevel}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {technicalLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Gender</label>
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {genders.map(gender => (
                        <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Lessons List - More Compact */}
            {filteredLessons.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">No lessons found</h3>
                <p className="text-xs text-gray-600 mb-3">Try adjusting your filters or search query</p>
                <button
                  onClick={clearFilters}
                  className="text-[#0091f3] hover:text-[#0081d8] font-medium text-xs"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 max-h-[80vh] overflow-y-auto">
                {filteredLessons.map((lesson) => {
                  const isSelected = selectedLessonId === lesson.id;
                  const displayLesson = isEditingLesson && isSelected ? editedLesson : lesson;
                  
                  return (
                    <div key={lesson.id}>
                      {/* Lesson Row */}
                      <div
                        onClick={() => {
                          if (!isEditingLesson) {
                            setSelectedLessonId(isSelected ? null : lesson.id);
                            setEditedLesson(lesson);
                          }
                        }}
                        className={`px-5 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            {isSelected ? (
                              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <h3 className={`text-sm font-semibold ${isSelected ? 'text-[#0091f3]' : 'text-gray-900'}`}>
                              {lesson.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getSkillColor(lesson.keySkill)}`}>
                              {lesson.keySkill}
                            </span>
                            <span className="text-[10px] text-gray-500 ml-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.duration} min
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Lesson Details */}
                      {isSelected && (
                        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
                          <div className="space-y-4">
                            {/* Lesson Details */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-gray-600">Team Type:</span>
                                <span className="ml-2 font-semibold text-gray-900">{displayLesson.teamType}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Age Group:</span>
                                <span className="ml-2 font-semibold text-gray-900">{displayLesson.ageGroup}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Technical Level:</span>
                                <span className="ml-2 font-semibold text-gray-900">{displayLesson.technicalLevel}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Gender:</span>
                                <span className="ml-2 font-semibold text-gray-900">{displayLesson.gender}</span>
                              </div>
                            </div>

                            {/* 4 Session Blocks */}
                            <div className="border-t border-gray-200 pt-3">
                              <h4 className="text-xs font-bold text-gray-900 mb-2">Lesson Structure (4 Blocks)</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {blockConfig.map((block, index) => (
                                  <div
                                    key={block.key}
                                    className="border rounded-lg p-2"
                                    style={{ borderColor: block.color, backgroundColor: `${block.color}10` }}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <div 
                                        className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[10px]"
                                        style={{ backgroundColor: block.color }}
                                      >
                                        {index + 1}
                                      </div>
                                      <span className="text-[10px] font-bold text-gray-900">{block.title}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-700 ml-7">
                                      {displayLesson.sessions[block.key as keyof typeof displayLesson.sessions] || 'Not assigned'}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2 border-t border-gray-200">
                              <button
                                onClick={() => handleEditLesson(lesson)}
                                className="flex-1 bg-[#0091f3] text-white py-2 px-3 rounded-lg font-semibold hover:bg-[#0081d8] transition-colors text-xs"
                              >
                                Edit Lesson
                              </button>
                              <button
                                onClick={() => console.log('Delete lesson:', lesson.id)}
                                className="bg-red-50 text-red-600 py-2 px-3 rounded-lg font-semibold hover:bg-red-100 transition-colors text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}