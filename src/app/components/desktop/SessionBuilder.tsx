import { ArrowLeft, Plus, Upload, Video, Image as ImageIcon, Trash2, Save, X, Filter, Search, Edit2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

export function SessionBuilder() {
  const [showNewSessionForm, setShowNewSessionForm] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editedSession, setEditedSession] = useState<any>(null);
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null);
  
  const [newSession, setNewSession] = useState({
    coreSkill: '',
    sessionType: '',
    name: '',
    explanation: '',
    duration: '',
    setupImage: '',
    videoUrl: '',
    learningOutcomes: [''],
    teamType: '',
    ageGroup: '',
    technicalLevel: '',
    gender: '',
  });

  // Filters
  const [selectedCoreSkill, setSelectedCoreSkill] = useState('All');
  const [selectedSessionType, setSelectedSessionType] = useState('All');
  const [selectedTeamType, setSelectedTeamType] = useState('All');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('All');
  const [selectedTechnicalLevel, setSelectedTechnicalLevel] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock existing sessions
  const [sessions] = useState([
    {
      id: 1,
      coreSkill: 'Shooting',
      sessionType: 'Technical',
      name: 'Warm-Up & Technical Fundamentals',
      duration: '15-20 mins',
      learningOutcomes: ['Proper shooting technique', 'Body positioning', 'Follow-through mechanics'],
      createdDate: 'Feb 28, 2026',
      teamType: 'Youth Football',
      ageGroup: 'U14',
      technicalLevel: 'Academy/Development',
      gender: 'Mixed',
    },
    {
      id: 2,
      coreSkill: 'Passing',
      sessionType: 'Skill',
      name: 'Short Pass Combinations',
      duration: '15-20 mins',
      learningOutcomes: ['Quick passing under pressure', 'Communication with teammates', 'Movement off the ball'],
      createdDate: 'Feb 27, 2026',
      teamType: 'Junior Football',
      ageGroup: 'U10',
      technicalLevel: 'Community',
      gender: 'Mixed',
    },
    {
      id: 3,
      coreSkill: 'Attacking',
      sessionType: 'Game',
      name: 'Small-Sided Attacking Game',
      duration: '20-25 mins',
      learningOutcomes: ['Decision making in attack', 'Creating space', 'Timing of runs'],
      createdDate: 'Feb 26, 2026',
      teamType: 'Youth Football',
      ageGroup: 'U15',
      technicalLevel: 'Academy/Development',
      gender: 'Female',
    },
  ]);

  const coreSkills = ['Shooting', 'Passing', 'Attacking', 'Defending', 'Dribbling', 'Heading'];
  const sessionTypes = ['Technical', 'Skill', 'Game'];
  const teamTypes = ['First Kicks', 'Fun Football', 'Junior Football', 'Youth Football', 'Senior'];
  const ageGroups = ['U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17'];
  const technicalLevels = ['Community', 'Academy/Development'];
  const genders = ['Mixed', 'Female'];

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesCoreSkill = selectedCoreSkill === 'All' || session.coreSkill === selectedCoreSkill;
    const matchesSessionType = selectedSessionType === 'All' || session.sessionType === selectedSessionType;
    const matchesTeamType = selectedTeamType === 'All' || session.teamType === selectedTeamType;
    const matchesAgeGroup = selectedAgeGroup === 'All' || session.ageGroup === selectedAgeGroup;
    const matchesTechnicalLevel = selectedTechnicalLevel === 'All' || session.technicalLevel === selectedTechnicalLevel;
    const matchesGender = selectedGender === 'All' || session.gender === selectedGender;
    const matchesSearch = session.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCoreSkill && matchesSessionType && matchesTeamType && matchesAgeGroup && matchesTechnicalLevel && matchesGender && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedCoreSkill('All');
    setSelectedSessionType('All');
    setSelectedTeamType('All');
    setSelectedAgeGroup('All');
    setSelectedTechnicalLevel('All');
    setSelectedGender('All');
    setSearchQuery('');
  };

  const activeFiltersCount = [
    selectedCoreSkill !== 'All',
    selectedSessionType !== 'All',
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
      case 'Attacking':
        return 'bg-green-500 text-white';
      case 'Defending':
        return 'bg-[#545859] text-white';
      case 'Dribbling':
        return 'bg-purple-500 text-white';
      case 'Heading':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Technical':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Skill':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Game':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleAddOutcome = () => {
    setNewSession({
      ...newSession,
      learningOutcomes: [...newSession.learningOutcomes, ''],
    });
  };

  const handleRemoveOutcome = (index: number) => {
    const outcomes = newSession.learningOutcomes.filter((_, i) => i !== index);
    setNewSession({
      ...newSession,
      learningOutcomes: outcomes.length > 0 ? outcomes : [''],
    });
  };

  const handleOutcomeChange = (index: number, value: string) => {
    const outcomes = [...newSession.learningOutcomes];
    outcomes[index] = value;
    setNewSession({
      ...newSession,
      learningOutcomes: outcomes,
    });
  };

  const handleImageUpload = () => {
    // In a real app, this would open a file picker
    const mockImageUrl = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjB0cmFpbmluZyUyMGdyaWR8ZW58MXx8fHwxNzQwNjEyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080';
    setNewSession({
      ...newSession,
      setupImage: mockImageUrl,
    });
  };

  const handleSaveSession = () => {
    // In a real app, this would save to storage
    if (editingSessionId) {
      console.log('Updating session:', editingSessionId, newSession);
    } else {
      console.log('Saving new session:', newSession);
    }
    setShowNewSessionForm(false);
    setEditingSessionId(null);
    // Reset form
    setNewSession({
      coreSkill: '',
      sessionType: '',
      name: '',
      explanation: '',
      duration: '',
      setupImage: '',
      videoUrl: '',
      learningOutcomes: [''],
      teamType: '',
      ageGroup: '',
      technicalLevel: '',
      gender: '',
    });
  };

  const handleEditSession = (session: any) => {
    // Populate form with session data
    setNewSession({
      coreSkill: session.coreSkill,
      sessionType: session.sessionType,
      name: session.name,
      explanation: session.explanation || '',
      duration: session.duration,
      setupImage: session.setupImage || '',
      videoUrl: session.videoUrl || '',
      learningOutcomes: session.learningOutcomes,
      teamType: session.teamType,
      ageGroup: session.ageGroup,
      technicalLevel: session.technicalLevel,
      gender: session.gender,
    });
    setEditingSessionId(session.id);
    setShowNewSessionForm(true);
    setSelectedSessionId(null);
  };

  const isFormValid = () => {
    return (
      newSession.coreSkill &&
      newSession.sessionType &&
      newSession.name &&
      newSession.explanation &&
      newSession.duration &&
      newSession.learningOutcomes.some(outcome => outcome.trim() !== '')
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Session Builder</h1>
            <p className="text-gray-600">Create individual training sessions to use in your lessons</p>
          </div>
          {!showNewSessionForm && (
            <button
              onClick={() => setShowNewSessionForm(true)}
              className="flex items-center gap-2 bg-[#22c55e] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1ea84c] transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              New Session
            </button>
          )}
        </div>
      </div>

      {/* New Session Form */}
      {showNewSessionForm && (
        <div className="mb-8 bg-white rounded-2xl shadow-lg border-2 border-[#22c55e] overflow-hidden">
          <div className="bg-[#22c55e] p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {editingSessionId ? 'Edit Session' : 'Create New Session'}
            </h2>
            <button
              onClick={() => {
                setShowNewSessionForm(false);
                setEditingSessionId(null);
              }}
              className="text-white hover:bg-[#1ea84c] rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Core Skill Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Core Skill <span className="text-red-500">*</span>
              </label>
              <select
                value={newSession.coreSkill}
                onChange={(e) => setNewSession({ ...newSession, coreSkill: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
              >
                <option value="">Select a core skill...</option>
                {coreSkills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Session Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {sessionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewSession({ ...newSession, sessionType: type })}
                    className={`py-3 px-4 rounded-xl font-medium text-sm transition-all border-2 ${
                      newSession.sessionType === type
                        ? 'bg-[#22c55e] text-white border-[#22c55e] shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#22c55e]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Session Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Session Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newSession.name}
                onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                placeholder="e.g., Warm-Up & Technical Fundamentals"
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                placeholder="e.g., 15-20 mins"
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
              />
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                How to Run This Session <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newSession.explanation}
                onChange={(e) => setNewSession({ ...newSession, explanation: e.target.value })}
                placeholder="Provide step-by-step instructions on how to run this session..."
                className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                rows={6}
              />
            </div>

            {/* Setup Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Training Area Setup Image
              </label>
              {newSession.setupImage ? (
                <div className="relative">
                  <ImageWithFallback
                    src={newSession.setupImage}
                    alt="Training setup"
                    className="w-full h-64 object-cover rounded-xl border border-gray-300"
                  />
                  <button
                    onClick={() => setNewSession({ ...newSession, setupImage: '' })}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleImageUpload}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-[#22c55e] hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                    <ImageIcon className="w-10 h-10" />
                    <p className="text-sm font-medium">Click to upload setup image</p>
                    <p className="text-xs">PNG, JPG up to 10MB</p>
                  </div>
                </button>
              )}
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Video Tutorial URL (optional)
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <input
                    type="url"
                    value={newSession.videoUrl}
                    onChange={(e) => setNewSession({ ...newSession, videoUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="w-full border border-gray-300 rounded-xl p-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Learning Outcomes <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600 mb-3">
                What will players learn or be able to do after this session?
              </p>
              <div className="space-y-3">
                {newSession.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 flex gap-2 items-start">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#22c55e] text-white text-xs font-bold mt-2 flex-shrink-0">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => handleOutcomeChange(index, e.target.value)}
                        placeholder="e.g., Proper shooting technique"
                        className="flex-1 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                      />
                    </div>
                    {newSession.learningOutcomes.length > 1 && (
                      <button
                        onClick={() => handleRemoveOutcome(index)}
                        className="text-red-500 hover:text-red-600 p-3 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddOutcome}
                className="mt-3 flex items-center gap-2 text-[#22c55e] hover:text-[#1ea84c] font-medium text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Learning Outcome
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowNewSessionForm(false)}
                className="flex-1 bg-gray-100 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSession}
                disabled={!isFormValid()}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isFormValid()
                    ? 'bg-[#22c55e] text-white hover:bg-[#1ea84c] shadow-sm'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Save className="w-5 h-5" />
                Save Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Sessions List */}
      {!showNewSessionForm && (
        <>
          {/* Sessions Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            {/* Sessions Header */}
            <div className="px-5 py-3 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Sessions ({filteredSessions.length})
              </h2>
            </div>

            {/* Filters Section - More Compact */}
            <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900">Filters</span>
                  {activeFiltersCount > 0 && (
                    <Badge className="bg-[#22c55e] text-white text-xs">
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
                    placeholder="Search session names..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Dropdowns - More Compact */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {/* Core Skill Filter */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Core Skill</label>
                  <Select value={selectedCoreSkill} onValueChange={setSelectedCoreSkill}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {coreSkills.map(skill => (
                        <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Session Type Filter */}
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Session Type</label>
                  <Select value={selectedSessionType} onValueChange={setSelectedSessionType}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      {sessionTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
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

            {/* Sessions List - More Compact */}
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">No sessions found</h3>
                <p className="text-xs text-gray-600 mb-3">Try adjusting your filters or search query</p>
                <button
                  onClick={clearFilters}
                  className="text-[#22c55e] hover:text-[#1ea84c] font-medium text-xs"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 max-h-[80vh] overflow-y-auto">
                {filteredSessions.map((session) => {
                  const isSelected = selectedSessionId === session.id;
                  const displaySession = isEditingSession && isSelected ? editedSession : session;
                  
                  return (
                    <div key={session.id}>
                      {/* Session Row */}
                      <div
                        onClick={() => {
                          if (!isEditingSession) {
                            setSelectedSessionId(isSelected ? null : session.id);
                            setEditedSession(session);
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
                            <h3 className={`text-sm font-semibold ${isSelected ? 'text-[#22c55e]' : 'text-gray-900'}`}>
                              {session.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getSkillColor(session.coreSkill)}`}>
                              {session.coreSkill}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getTypeColor(session.sessionType)}`}>
                              {session.sessionType}
                            </span>
                            <span className="text-[10px] text-gray-500 ml-1">
                              {session.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Session Details */}
                      {isSelected && (
                        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
                          <div className="space-y-4">
                            {/* Session Details */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-gray-600">Team Type:</span>
                                <span className="ml-2 font-semibold text-gray-900">{displaySession.teamType}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Age Group:</span>
                                <span className="ml-2 font-semibold text-gray-900">{displaySession.ageGroup}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Technical Level:</span>
                                <span className="ml-2 font-semibold text-gray-900">{displaySession.technicalLevel}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Gender:</span>
                                <span className="ml-2 font-semibold text-gray-900">{displaySession.gender}</span>
                              </div>
                            </div>

                            {/* Learning Outcomes */}
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-2">Learning Outcomes:</p>
                              <ul className="space-y-1">
                                {displaySession.learningOutcomes.map((outcome: string, idx: number) => (
                                  <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                    <span className="text-[#22c55e] mt-0.5">•</span>
                                    <span>{outcome}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2 border-t border-gray-200">
                              <button
                                onClick={() => handleEditSession(session)}
                                className="flex items-center gap-1.5 bg-[#0091f3] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#0081d8] transition-colors"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
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