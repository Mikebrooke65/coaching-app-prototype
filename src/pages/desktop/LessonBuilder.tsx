import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Lesson {
  id: string;
  title: string;
  skill_category: string;
  age_group: string;
  division: string;
  allocated_age_groups?: string[];
}

// Mock sessions from Session Builder
const mockAvailableSessions = [
  { id: 's1', name: 'Dynamic Warm-Up', type: 'Warm-Up & Technical', duration: 10, ageGroup: 'U9-U12' },
  { id: 's2', name: 'Ball Mastery', type: 'Warm-Up & Technical', duration: 15, ageGroup: 'U9-U12' },
  { id: 's3', name: 'Passing in Pairs', type: 'Skill Introduction', duration: 15, ageGroup: 'U9-U12' },
  { id: 's4', name: 'Dribbling Technique', type: 'Skill Introduction', duration: 15, ageGroup: 'U9-U12' },
  { id: 's5', name: '3v3 Possession', type: 'Progressive Development', duration: 15, ageGroup: 'U9-U12' },
  { id: 's6', name: '1v1 Challenges', type: 'Progressive Development', duration: 20, ageGroup: 'U9-U12' },
  { id: 's7', name: 'Small-Sided Game', type: 'Game Application', duration: 15, ageGroup: 'U9-U12' },
  { id: 's8', name: 'Full Game', type: 'Game Application', duration: 20, ageGroup: 'U9-U12' },
];

const BLOCK_TYPES = [
  'Warm-Up & Technical',
  'Skill Introduction',
  'Progressive Development',
  'Game Application',
];

export function LessonBuilder() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAge, setFilterAge] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const [newLessonName, setNewLessonName] = useState('');

  // Load lessons from database
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      // Fetch lessons with their allocations
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, title, skill_category, age_group, division')
        .order('age_group')
        .order('title');

      if (lessonsError) throw lessonsError;

      // Fetch allocations for all lessons (gracefully handle if table doesn't exist)
      const { data: allocationsData, error: allocationsError } = await supabase
        .from('lesson_allocations')
        .select('lesson_id, age_group');

      let lessonsWithAllocations;
      // If allocations table doesn't exist yet, just show lessons without allocations
      if (allocationsError) {
        console.warn('Allocations table not found, showing lessons without allocation data:', allocationsError);
        lessonsWithAllocations = (lessonsData || []).map(lesson => ({ ...lesson, allocated_age_groups: [] }));
      } else {
        // Merge allocations into lessons
        lessonsWithAllocations = (lessonsData || []).map(lesson => ({
          ...lesson,
          allocated_age_groups: (allocationsData || [])
            .filter(a => a.lesson_id === lesson.id)
            .map(a => a.age_group)
        }));
      }

      setLessons(lessonsWithAllocations);
      return lessonsWithAllocations;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: 'U9',
    division: 'Community',
    skills: '',
    blocks: [
      { type: 'Warm-Up & Technical', sessionId: '', sessionName: '', duration: 0 },
      { type: 'Skill Introduction', sessionId: '', sessionName: '', duration: 0 },
      { type: 'Progressive Development', sessionId: '', sessionName: '', duration: 0 },
      { type: 'Game Application', sessionId: '', sessionName: '', duration: 0 },
    ],
  });

  const filteredLessons = lessons.filter((lesson) => {
    const matchesAge = filterAge === 'all' || lesson.age_group === filterAge;
    const matchesDivision = filterDivision === 'all' || lesson.division === filterDivision;
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.skill_category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAge && matchesDivision && matchesSearch;
  });

  const totalDuration = formData.blocks.reduce((sum, block) => sum + block.duration, 0);

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedLesson(null);
    setFormData({
      name: '',
      ageGroup: 'U9',
      division: 'Community',
      skills: '',
      blocks: [
        { type: 'Warm-Up & Technical', sessionId: '', sessionName: '', duration: 0 },
        { type: 'Skill Introduction', sessionId: '', sessionName: '', duration: 0 },
        { type: 'Progressive Development', sessionId: '', sessionName: '', duration: 0 },
        { type: 'Game Application', sessionId: '', sessionName: '', duration: 0 },
      ],
    });
  };

  const handleSelectSession = (blockIndex: number, sessionId: string) => {
    const session = mockAvailableSessions.find((s) => s.id === sessionId);
    if (session) {
      const newBlocks = [...formData.blocks];
      newBlocks[blockIndex] = {
        ...newBlocks[blockIndex],
        sessionId: session.id,
        sessionName: session.name,
        duration: session.duration,
      };
      setFormData({ ...formData, blocks: newBlocks });
    }
  };

  const getFilteredSessionsForBlock = (blockType: string) => {
    return mockAvailableSessions.filter(
      (session) => session.type === blockType && session.ageGroup === formData.ageGroup
    );
  };

  const handleSave = () => {
    console.log('Saving lesson:', formData);
    alert('Lesson saved! (This will save to database when connected)');
  };

  const handleSaveAsNew = () => {
    if (!newLessonName.trim()) {
      alert('Please enter a name for the new lesson');
      return;
    }
    console.log('Saving as new lesson:', { ...formData, name: newLessonName });
    alert(`New lesson "${newLessonName}" created! (This will save to database when connected)`);
    setShowSaveAsNew(false);
    setNewLessonName('');
  };

  const handleToggleAllocation = async (lessonId: string, ageGroup: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const isAllocated = lesson.allocated_age_groups?.includes(ageGroup);

    try {
      if (isAllocated) {
        // Remove allocation
        const { error } = await supabase
          .from('lesson_allocations')
          .delete()
          .eq('lesson_id', lessonId)
          .eq('age_group', ageGroup);

        if (error) throw error;
      } else {
        // Add allocation
        const { error } = await supabase
          .from('lesson_allocations')
          .insert({
            lesson_id: lessonId,
            age_group: ageGroup
          });

        if (error) throw error;
      }

      // Refresh lessons and update selectedLesson
      const updatedLessons = await fetchLessons();
      const updatedLesson = updatedLessons.find(l => l.id === lessonId);
      if (updatedLesson) {
        setSelectedLesson(updatedLesson);
      }
    } catch (error) {
      console.error('Error toggling allocation:', error);
      alert('Failed to update allocation');
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#22c55e]">Lesson Builder</h1>
        <p className="text-gray-600 mt-2">Build complete training lessons from your session library</p>
      </div>

      <div className="flex-1 flex gap-6">
      {/* Left Panel - Lessons Library */}
      <div className="w-1/3 flex flex-col bg-white rounded-lg shadow">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Lessons Library</h2>
            <button
              onClick={handleCreateNew}
              className="px-3 py-1.5 bg-[#0091f3] text-white rounded-lg text-sm font-medium hover:bg-[#0077cc] flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Lesson
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search lessons..."
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
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
            >
              <option value="all">All Ages</option>
              <option value="U4">U4</option>
              <option value="U5">U5</option>
              <option value="U6">U6</option>
              <option value="U7">U7</option>
              <option value="U8">U8</option>
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
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
            >
              <option value="all">All Divisions</option>
              <option value="Community">Community</option>
              <option value="Academy">Academy</option>
            </select>
          </div>
        </div>

        {/* Lessons List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22c55e]"></div>
            </div>
          ) : filteredLessons.length > 0 ? (
            filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className={`w-full text-left p-2 rounded-lg border transition-colors ${
                  selectedLesson?.id === lesson.id
                    ? 'border-[#0091f3] bg-[#0091f3] bg-opacity-5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <h3 className="font-medium text-gray-900 text-xs mb-1 truncate">{lesson.title}</h3>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[10px] px-1.5 py-0 rounded bg-[#0091f3] text-white">
                    {lesson.age_group}
                  </span>
                  <span className="text-[10px] px-1.5 py-0 rounded bg-gray-100 text-gray-600">
                    {lesson.division}
                  </span>
                  <span className="text-[10px] px-1.5 py-0 rounded bg-gray-50 text-gray-600">
                    {lesson.skill_category}
                  </span>
                  {lesson.allocated_age_groups && lesson.allocated_age_groups.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0 rounded bg-green-100 text-green-700">
                      ✓ {lesson.allocated_age_groups.length}
                    </span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No lessons found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Build/Edit Lesson */}
      <div className="flex-1 bg-white rounded-lg shadow p-6 overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {isCreatingNew ? 'Build a Lesson' : selectedLesson ? 'Edit Lesson' : 'Select or Create a Lesson'}
        </h2>

        {isCreatingNew || selectedLesson ? (
          <form className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  placeholder="e.g., Passing Fundamentals"
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
                  <option value="U4">U4</option>
                  <option value="U5">U5</option>
                  <option value="U6">U6</option>
                  <option value="U7">U7</option>
                  <option value="U8">U8</option>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Division *
                </label>
                <select
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                >
                  <option value="Community">Community</option>
                  <option value="Academy">Academy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Duration
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">
                  {totalDuration} minutes
                </div>
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
                placeholder="e.g., Passing, First Touch, Communication"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple skills with commas</p>
            </div>

            {/* 4 Session Blocks */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Blocks</h3>
              <div className="space-y-4">
                {formData.blocks.map((block, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#0091f3] text-white flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <h4 className="font-medium text-gray-900">{block.type}</h4>
                      </div>
                      {block.duration > 0 && (
                        <span className="text-sm text-gray-600">{block.duration} min</span>
                      )}
                    </div>

                    {block.sessionId ? (
                      <div className="bg-gray-50 rounded p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{block.sessionName}</p>
                            <p className="text-xs text-gray-600 mt-1">{block.duration} minutes</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectSession(index, '')}
                            className="text-xs text-[#0091f3] hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={block.sessionId}
                        onChange={(e) => handleSelectSession(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                      >
                        <option value="">Select a session...</option>
                        {getFilteredSessionsForBlock(block.type).map((session) => (
                          <option key={session.id} value={session.id}>
                            {session.name} ({session.duration} min)
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Allocation Section - Admin Only */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Lesson Allocation</h3>
              <p className="text-sm text-gray-600 mb-3">
                Select which age groups can access this lesson. Coaches will only see allocated lessons for their team's age group.
              </p>
              <div className="grid grid-cols-7 gap-2">
                {['U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17'].map((age) => {
                  const isAllocated = selectedLesson?.allocated_age_groups?.includes(age);
                  return (
                    <button
                      key={age}
                      type="button"
                      onClick={() => handleToggleAllocation(selectedLesson.id, age)}
                      className={`px-2 py-1.5 text-xs font-medium rounded border transition-colors ${
                        isAllocated
                          ? 'bg-green-100 border-green-300 text-green-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {isAllocated && '✓ '}{age}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {!isCreatingNew && selectedLesson && (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-[#0091f3] text-white rounded-lg font-medium hover:bg-[#0077cc]"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSaveAsNew(true)}
                    className="flex-1 px-4 py-2 bg-[#22c55e] text-white rounded-lg font-medium hover:bg-[#16a34a]"
                  >
                    Save as New
                  </button>
                </>
              )}
              {isCreatingNew && (
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-[#0091f3] text-white rounded-lg font-medium hover:bg-[#0077cc]"
                >
                  Create Lesson
                </button>
              )}
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
                  setSelectedLesson(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>

            {/* Save as New Modal */}
            {showSaveAsNew && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Save as New Lesson</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter a name for the new lesson. This will create a copy with your changes.
                  </p>
                  <input
                    type="text"
                    value={newLessonName}
                    onChange={(e) => setNewLessonName(e.target.value)}
                    placeholder="New lesson name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3] mb-4"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveAsNew}
                      className="flex-1 px-4 py-2 bg-[#22c55e] text-white rounded-lg font-medium hover:bg-[#16a34a]"
                    >
                      Create New Lesson
                    </button>
                    <button
                      onClick={() => {
                        setShowSaveAsNew(false);
                        setNewLessonName('');
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-gray-500 mb-4">Select a lesson to edit or create a new one</p>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-[#0091f3] text-white rounded-lg font-medium hover:bg-[#0077cc]"
            >
              Create New Lesson
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
