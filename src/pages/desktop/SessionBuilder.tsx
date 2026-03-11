import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Session {
  id: string;
  session_name: string;
  title: string;
  age_group: string;
  session_type: string;
  duration: number;
  organisation: string;
  equipment: string[];
  coaching_points: string[];
  key_objectives: string[];
}

export function SessionBuilder() {
  console.log('SessionBuilder rendering');
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    sessionName: '',
    title: '',
    type: 'warmup',
    duration: 15,
    ageGroup: 'U9',
    organisation: '',
    equipment: '',
    coachingPoints: '',
    steps: '',
    keyObjectives: '',
    pitchLayout: '',
  });

  const [diagramFile, setDiagramFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('age_group')
        .order('session_type');

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesType = filterType === 'all' || session.session_type === filterType;
    const matchesAge = filterAge === 'all' || session.age_group === filterAge;
    const sessionDivision = session.session_name.startsWith('session-academy-') ? 'Academy' : 'Community';
    const matchesDivision = filterDivision === 'all' || sessionDivision === filterDivision;
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.session_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesAge && matchesDivision && matchesSearch;
  });

  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
    setFormData({
      sessionName: session.session_name,
      title: session.title,
      type: session.session_type,
      duration: session.duration,
      ageGroup: session.age_group,
      organisation: session.organisation || '',
      equipment: session.equipment?.join('\n') || '',
      coachingPoints: session.coaching_points?.join('\n') || '',
      steps: session.steps?.join('\n') || '',
      keyObjectives: session.key_objectives?.join('\n') || '',
      pitchLayout: session.pitch_layout_description || '',
    });
  };

  const handleClearForm = () => {
    setSelectedSession(null);
    setDiagramFile(null);
    setVideoFile(null);
    setFormData({
      sessionName: '',
      title: '',
      type: 'warmup',
      duration: 15,
      ageGroup: 'U9',
      organisation: '',
      equipment: '',
      coachingPoints: '',
      steps: '',
      keyObjectives: '',
      pitchLayout: '',
    });
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.sessionName || !formData.title || !formData.organisation || !formData.coachingPoints || !formData.keyObjectives) {
        alert('Please fill in all required fields (marked with *)');
        return;
      }

      let diagramUrl = selectedSession?.diagram_url || null;
      let videoUrl = selectedSession?.video_url || null;

      // Upload diagram if provided
      if (diagramFile) {
        const fileExt = diagramFile.name.split('.').pop();
        const fileName = `${formData.sessionName}.${fileExt}`;
        const filePath = `pitch-diagrams/${formData.ageGroup}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('lesson-media')
          .upload(filePath, diagramFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('lesson-media')
          .getPublicUrl(filePath);

        diagramUrl = publicUrl;
      }

      // Upload video if provided
      if (videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${formData.sessionName}.${fileExt}`;
        const filePath = `videos/${formData.ageGroup}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('lesson-media')
          .upload(filePath, videoFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('lesson-media')
          .getPublicUrl(filePath);

        videoUrl = publicUrl;
      }

      // Prepare session data
      const sessionData = {
        session_name: formData.sessionName,
        title: formData.title,
        session_type: formData.type,
        duration: formData.duration,
        age_group: formData.ageGroup,
        organisation: formData.organisation,
        equipment: formData.equipment.split('\n').filter(line => line.trim()),
        coaching_points: formData.coachingPoints.split('\n').filter(line => line.trim()),
        steps: formData.steps.split('\n').filter(line => line.trim()),
        key_objectives: formData.keyObjectives.split('\n').filter(line => line.trim()),
        pitch_layout_description: formData.pitchLayout || null,
        diagram_url: diagramUrl,
        video_url: videoUrl,
      };

      if (selectedSession) {
        // Update existing session
        const { error } = await supabase
          .from('sessions')
          .update(sessionData)
          .eq('id', selectedSession.id);

        if (error) throw error;
        alert('Session updated successfully!');
      } else {
        // Create new session
        const { error } = await supabase
          .from('sessions')
          .insert(sessionData);

        if (error) throw error;
        alert('Session created successfully!');
      }

      // Refresh sessions list and clear form
      await fetchSessions();
      handleClearForm();
    } catch (error: any) {
      console.error('Error saving session:', error);
      alert(`Failed to save session: ${error.message}`);
    }
  };

  const sessionTypeLabels: Record<string, string> = {
    warmup: 'Warm-Up',
    skill_intro: 'Skill Intro',
    progressive: 'Progressive',
    game: 'Game',
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      {/* Page Header with Search and New Button */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
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

          <button
            onClick={handleClearForm}
            className="px-4 py-2 bg-[#0091f3] text-white rounded-lg font-medium hover:bg-[#0077cc] flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Session
          </button>
        </div>
      </div>

      {/* Middle Section - Sessions List with Filters */}
      <div className="flex-shrink-0">
        <div className="bg-white rounded-lg shadow">
          {/* Sessions Header with Filters */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Sessions</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                >
                  <option value="all">All Types</option>
                  <option value="warmup">Warm-Up</option>
                  <option value="skill_intro">Skill Intro</option>
                  <option value="progressive">Progressive</option>
                  <option value="game">Game</option>
                </select>

                <select
                  value={filterAge}
                  onChange={(e) => setFilterAge(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                >
                  <option value="all">All Ages</option>
                  <option value="U9">U9</option>
                  <option value="U10">U10</option>
                  <option value="U11">U11</option>
                  <option value="U12">U12</option>
                  <option value="U13">U13</option>
                  <option value="U14">U14</option>
                  <option value="U15">U15</option>
                  <option value="U16">U16</option>
                  <option value="U17">U17</option>
                </select>

                <select
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                >
                  <option value="all">All Divisions</option>
                  <option value="Community">Community</option>
                  <option value="Academy">Academy</option>
                </select>
              </div>

              <div className="text-xs text-gray-500">
                {filteredSessions.length} of {sessions.length} sessions
              </div>
            </div>
          </div>

          {/* Compact Session List - One line per session */}
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0091f3]"></div>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
                No sessions found
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredSessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between gap-4 ${
                      selectedSession?.id === session.id ? 'bg-blue-50 border-l-4 border-[#0091f3]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs px-2 py-1 rounded bg-[#0091f3] bg-opacity-10 text-[#0091f3] whitespace-nowrap">
                        {sessionTypeLabels[session.session_type] || session.session_type}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 whitespace-nowrap">
                        {session.age_group}
                      </span>
                      <span className="font-medium text-gray-900 text-sm truncate">
                        {session.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {session.duration} min
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section - Session Form */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedSession ? `Edit: ${selectedSession.title}` : 'Create New Session'}
            </h2>
            {selectedSession && (
              <button
                onClick={handleClearForm}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear & Create New
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Name *
                </label>
                <input
                  type="text"
                  value={formData.sessionName}
                  onChange={(e) => setFormData({ ...formData, sessionName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  placeholder="e.g., session_1_warmup"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  placeholder="e.g., Get Moving"
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
                  <option value="warmup">Warm-Up & Technical</option>
                  <option value="skill_intro">Skill Introduction</option>
                  <option value="progressive">Progressive Development</option>
                  <option value="game">Game Application</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 15 })}
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
                  <option value="U9">U9</option>
                  <option value="U10">U10</option>
                </select>
              </div>
            </div>

            {/* Organisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organisation / How It Runs *
              </label>
              <textarea
                value={formData.organisation}
                onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="Describe how the session is organized and runs..."
              />
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment (one per line)
              </label>
              <textarea
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="Cones (20)&#10;Football (soccer balls) - 1 per player&#10;Bibs (2 colors)"
              />
            </div>

            {/* Coaching Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coaching Points (one per line) *
              </label>
              <textarea
                value={formData.coachingPoints}
                onChange={(e) => setFormData({ ...formData, coachingPoints: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="Key coaching points..."
              />
            </div>

            {/* Steps */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Steps (one per line)
              </label>
              <textarea
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="Step-by-step instructions..."
              />
            </div>

            {/* Key Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Objectives (one per line) *
              </label>
              <textarea
                value={formData.keyObjectives}
                onChange={(e) => setFormData({ ...formData, keyObjectives: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="What players should learn..."
              />
            </div>

            {/* Pitch Layout Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pitch Layout Description
              </label>
              <textarea
                value={formData.pitchLayout}
                onChange={(e) => setFormData({ ...formData, pitchLayout: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                placeholder="Describe the pitch setup, player positions, etc..."
              />
            </div>

            {/* Media Uploads */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pitch Diagram (Image)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDiagramFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                />
                {diagramFile && (
                  <p className="mt-1 text-xs text-gray-600">Selected: {diagramFile.name}</p>
                )}
                {selectedSession?.diagram_url && !diagramFile && (
                  <p className="mt-1 text-xs text-green-600">✓ Diagram uploaded</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  PNG format, 4:5 or 1:1 aspect ratio, min 800px resolution
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Demonstration Video (Optional)
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                />
                {videoFile && (
                  <p className="mt-1 text-xs text-gray-600">Selected: {videoFile.name}</p>
                )}
                {selectedSession?.video_url && !videoFile && (
                  <p className="mt-1 text-xs text-green-600">✓ Video uploaded</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  MP4 format recommended, max 50MB, keep under 2 minutes
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-[#0091f3] text-white rounded-lg font-medium hover:bg-[#0077cc]"
              >
                {selectedSession ? 'Update Session' : 'Create Session'}
              </button>
              <button
                type="button"
                onClick={handleClearForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
