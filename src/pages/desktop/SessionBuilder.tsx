import { useState } from 'react';

// Mock session data
const mockSessions = [
  {
    id: '1',
    name: 'Dynamic Warm-Up',
    type: 'Warm-Up',
    duration: 10,
    ageGroup: 'U9-U12',
    skills: ['Movement', 'Coordination'],
    objectives: 'Prepare body for training, increase heart rate',
  },
  {
    id: '2',
    name: 'Passing in Pairs',
    type: 'Technical',
    duration: 15,
    ageGroup: 'U9-U12',
    skills: ['Passing', 'First Touch'],
    objectives: 'Develop accurate passing technique',
  },
  {
    id: '3',
    name: '3v3 Possession',
    type: 'Game Application',
    duration: 20,
    ageGroup: 'U9-U12',
    skills: ['Passing', 'Movement', 'Decision Making'],
    objectives: 'Apply passing skills in game situations',
  },
];

export function SessionBuilder() {
  console.log('SessionBuilder rendering');
  
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Warm-Up',
    duration: 15,
    ageGroup: 'U9-U12',
    skills: '',
    objectives: '',
    equipment: '',
    setup: '',
    coachingPoints: '',
    variations: '',
  });

  const filteredSessions = mockSessions.filter((session) => {
    const matchesType = filterType === 'all' || session.type === filterType;
    const matchesAge = filterAge === 'all' || session.ageGroup === filterAge;
    const matchesSearch = session.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesAge && matchesSearch;
  });

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedSession(null);
    setFormData({
      name: '',
      type: 'Warm-Up',
      duration: 15,
      ageGroup: 'U9-U12',
      skills: '',
      objectives: '',
      equipment: '',
      setup: '',
      coachingPoints: '',
      variations: '',
    });
  };

  const handleSelectSession = (session: any) => {
    setIsCreatingNew(false);
    setSelectedSession(session);
    setFormData({
      name: session.name,
      type: session.type,
      duration: session.duration,
      ageGroup: session.ageGroup,
      skills: session.skills.join(', '),
      objectives: session.objectives,
      equipment: '',
      setup: '',
      coachingPoints: '',
      variations: '',
    });
  };

  const handleSave = () => {
    console.log('Saving session:', formData);
    // TODO: Save to Supabase
    alert('Session saved! (This will save to database when connected)');
  };

  return (
    <div className="h-full flex gap-6">
      {/* Left Panel - Sessions Library */}
      <div className="w-1/3 flex flex-col bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sessions Library</h2>
            <button
              onClick={handleCreateNew}
              className="px-3 py-1.5 bg-[#0091f3] text-white rounded-lg text-sm font-medium hover:bg-[#0077cc] flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Session
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
            >
              <option value="all">All Types</option>
              <option value="Warm-Up">Warm-Up</option>
              <option value="Technical">Technical</option>
              <option value="Game Application">Game Application</option>
            </select>

            <select
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
            >
              <option value="all">All Ages</option>
              <option value="U4-U6">U4-U6</option>
              <option value="U7-U8">U7-U8</option>
              <option value="U9-U12">U9-U12</option>
              <option value="U13-U17">U13-U17</option>
            </select>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => handleSelectSession(session)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedSession?.id === session.id
                  ? 'border-[#0091f3] bg-[#0091f3] bg-opacity-5'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 text-sm">{session.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {session.duration} min
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="text-xs px-2 py-0.5 rounded bg-[#0091f3] bg-opacity-10 text-[#0091f3]">
                  {session.type}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {session.ageGroup}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{session.objectives}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel - Build/Edit Session */}
      <div className="flex-1 bg-white rounded-lg shadow p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {isCreatingNew ? 'Build a Session' : selectedSession ? 'Edit Session' : 'Select or Create a Session'}
        </h2>

        {(isCreatingNew || selectedSession) ? (
          <form className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  placeholder="e.g., Dynamic Warm-Up"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                >
                  <option value="Warm-Up">Warm-Up & Technical</option>
                  <option value="Technical">Skill Introduction</option>
                  <option value="Progressive">Progressive Development</option>
                  <option value="Game Application">Game Application</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  min="5"
                  max="60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Group *
                </label>
                <select
                  value={formData.ageGroup}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                >
                  <option value="U4-U6">U4-U6 (First Kicks)</option>
                  <option value="U7-U8">U7-U8 (Fun Football)</option>
                  <option value="U9-U12">U9-U12 (Junior)</option>
                  <option value="U13-U17">U13-U17 (Youth)</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills Focus
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="e.g., Passing, First Touch, Movement"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
            </div>

            {/* Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objectives *
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="What should players learn or achieve in this session?"
              />
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Needed
              </label>
              <textarea
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="e.g., Cones (20), Balls (1 per player), Bibs (2 colors)"
              />
            </div>

            {/* Setup Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Setup Instructions
              </label>
              <textarea
                value={formData.setup}
                onChange={(e) => setFormData({ ...formData, setup: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="How to set up the training area..."
              />
            </div>

            {/* Coaching Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coaching Points *
              </label>
              <textarea
                value={formData.coachingPoints}
                onChange={(e) => setFormData({ ...formData, coachingPoints: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="Key coaching points (one per line)..."
              />
            </div>

            {/* Variations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variations & Progressions
              </label>
              <textarea
                value={formData.variations}
                onChange={(e) => setFormData({ ...formData, variations: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="How to make it easier or harder..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-[#0091f3] text-white rounded-lg font-medium hover:bg-[#0077cc]"
              >
                Save Session
              </button>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setSelectedSession(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 mb-4">Select a session to edit or create a new one</p>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-[#0091f3] text-white rounded-lg font-medium hover:bg-[#0077cc]"
            >
              Create New Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
