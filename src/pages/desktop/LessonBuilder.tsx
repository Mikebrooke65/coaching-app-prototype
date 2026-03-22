import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

// ============================================================================
// TypeScript Interfaces and Data Models
// ============================================================================

// Database Session Model
interface DBSession {
  id: string;
  session_name: string;
  age_group: string;
  session_type: 'warmup' | 'skill_intro' | 'progressive' | 'game';
  duration: number;
  title: string;
  description: string | null;
  organisation: string;
  equipment: string[];
  coaching_points: string[];
  steps: string[];
  key_objectives: string[];
  pitch_layout_description: string;
  diagram_url: string | null;
  video_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Database Lesson Model
interface DBLesson {
  id: string;
  title: string;
  description: string | null;
  age_group: string;
  skill_category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  division: 'Community' | 'Academy';
  session_1_id: string;
  session_2_id: string;
  session_3_id: string;
  session_4_id: string;
  total_duration: number | null;
  objectives: string[];
  coaching_focus: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Lesson Allocation Model
interface LessonAllocation {
  id: string;
  lesson_id: string;
  age_group: string;
  created_at: string;
}

// UI Lesson Model (with allocations)
interface UILesson {
  id: string;
  title: string;
  skill_category: string;
  age_group: string;
  division: 'Community' | 'Academy';
  allocated_age_groups: string[];
}

// UI Session Block Model
interface SessionBlock {
  type: 'Warm-Up & Technical' | 'Skill Introduction' | 'Progressive Development' | 'Game Application';
  sessionId: string;
  sessionName: string;
  duration: number;
}

// Form State Model
interface LessonFormData {
  name: string;
  ageGroup: string;
  division: 'Community' | 'Academy';
  skills: string;
  blocks: SessionBlock[];
}

// Validation Errors Model
interface ValidationErrors {
  name?: string;
  ageGroup?: string;
  division?: string;
  skills?: string;
  block0?: string;
  block1?: string;
  block2?: string;
  block3?: string;
}

// Session Type Mapping: UI Block Type → Database session_type
const SESSION_TYPE_MAP: Record<string, 'warmup' | 'skill_intro' | 'progressive' | 'game'> = {
  'Warm-Up & Technical': 'warmup',
  'Skill Introduction': 'skill_intro',
  'Progressive Development': 'progressive',
  'Game Application': 'game',
};

// Error Messages
const ERROR_MESSAGES = {
  LESSON_NAME_REQUIRED: 'Lesson name is required',
  AGE_GROUP_REQUIRED: 'Age group is required',
  DIVISION_REQUIRED: 'Division is required',
  SKILLS_REQUIRED: 'Skills focus is required',
  SESSION_REQUIRED: (blockNum: number) => `Session ${blockNum} is required`,
  FETCH_LESSON_FAILED: 'Failed to load lesson data',
  FETCH_SESSIONS_FAILED: 'Failed to load sessions',
  SAVE_LESSON_FAILED: 'Failed to save lesson',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

export function LessonBuilder() {
  const [lessons, setLessons] = useState<UILesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<UILesson | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAge, setFilterAge] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const [newLessonName, setNewLessonName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [sessionsByType, setSessionsByType] = useState<Record<string, DBSession[]>>({});

  // Load lessons from database
  useEffect(() => {
    fetchLessons();
  }, []);

  // Form state
  const [formData, setFormData] = useState<LessonFormData>({
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
      setError(ERROR_MESSAGES.FETCH_LESSON_FAILED);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch single lesson with all four sessions
  const fetchLessonWithSessions = async (lessonId: string): Promise<{ lesson: DBLesson; sessions: DBSession[] } | null> => {
    try {
      // Fetch lesson
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      // Fetch all four sessions
      const sessionIds = [
        lesson.session_1_id,
        lesson.session_2_id,
        lesson.session_3_id,
        lesson.session_4_id
      ];

      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('id, title, duration, session_type, age_group')
        .in('id', sessionIds);

      if (sessionsError) throw sessionsError;

      // Map sessions to blocks in correct order
      const sessionMap = new Map(sessions.map(s => [s.id, s]));
      const orderedSessions = [
        sessionMap.get(lesson.session_1_id),
        sessionMap.get(lesson.session_2_id),
        sessionMap.get(lesson.session_3_id),
        sessionMap.get(lesson.session_4_id)
      ].filter((s): s is DBSession => s !== undefined);

      return { lesson, sessions: orderedSessions };
    } catch (error) {
      console.error('Error fetching lesson with sessions:', error);
      setError(ERROR_MESSAGES.FETCH_LESSON_FAILED);
      return null;
    }
  };

  // Fetch sessions filtered by age group and session type
  const fetchSessionsByTypeAndAge = async (
    ageGroup: string,
    sessionType: 'warmup' | 'skill_intro' | 'progressive' | 'game'
  ): Promise<DBSession[]> => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('id, title, duration, session_type, age_group')
        .eq('age_group', ageGroup)
        .eq('session_type', sessionType)
        .order('title');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError(ERROR_MESSAGES.FETCH_SESSIONS_FAILED);
      return [];
    }
  };

  // Load lesson data when a lesson is selected
  useEffect(() => {
    const loadLessonData = async () => {
      if (selectedLesson && !isCreatingNew) {
        const result = await fetchLessonWithSessions(selectedLesson.id);
        if (result) {
          const { lesson, sessions } = result;
          
          // Transform to form data
          setFormData({
            name: lesson.title,
            ageGroup: lesson.age_group,
            division: lesson.division,
            skills: lesson.skill_category,
            blocks: [
              {
                type: 'Warm-Up & Technical',
                sessionId: sessions[0]?.id || '',
                sessionName: sessions[0]?.title || '',
                duration: sessions[0]?.duration || 0,
              },
              {
                type: 'Skill Introduction',
                sessionId: sessions[1]?.id || '',
                sessionName: sessions[1]?.title || '',
                duration: sessions[1]?.duration || 0,
              },
              {
                type: 'Progressive Development',
                sessionId: sessions[2]?.id || '',
                sessionName: sessions[2]?.title || '',
                duration: sessions[2]?.duration || 0,
              },
              {
                type: 'Game Application',
                sessionId: sessions[3]?.id || '',
                sessionName: sessions[3]?.title || '',
                duration: sessions[3]?.duration || 0,
              },
            ],
          });
        }
      }
    };

    loadLessonData();
  }, [selectedLesson, isCreatingNew]);

  // Prefetch sessions when age group changes
  useEffect(() => {
    const prefetchSessions = async () => {
      const sessionTypes: Array<'warmup' | 'skill_intro' | 'progressive' | 'game'> = [
        'warmup',
        'skill_intro',
        'progressive',
        'game'
      ];

      for (const sessionType of sessionTypes) {
        const cacheKey = `${formData.ageGroup}-${sessionType}`;
        if (!sessionsByType[cacheKey]) {
          const sessions = await fetchSessionsByTypeAndAge(formData.ageGroup, sessionType);
          setSessionsByType(prev => ({ ...prev, [cacheKey]: sessions }));
        }
      }
    };

    prefetchSessions();
  }, [formData.ageGroup]);

  const filteredLessons = lessons.filter((lesson) => {
    const matchesAge = filterAge === 'all' || lesson.age_group === filterAge;
    const matchesDivision = filterDivision === 'all' || lesson.division === filterDivision;
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.skill_category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAge && matchesDivision && matchesSearch;
  });

  // Calculate total duration from all session blocks
  const calculateTotalDuration = (blocks: SessionBlock[]): number => {
    return blocks.reduce((sum, block) => sum + (block.duration || 0), 0);
  };

  const totalDuration = calculateTotalDuration(formData.blocks);

  // Validate lesson form data
  const validateLesson = (data: LessonFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!data.name.trim()) {
      errors.name = ERROR_MESSAGES.LESSON_NAME_REQUIRED;
    }

    if (!data.ageGroup) {
      errors.ageGroup = ERROR_MESSAGES.AGE_GROUP_REQUIRED;
    }

    if (!data.division) {
      errors.division = ERROR_MESSAGES.DIVISION_REQUIRED;
    }

    if (!data.skills.trim()) {
      errors.skills = ERROR_MESSAGES.SKILLS_REQUIRED;
    }

    data.blocks.forEach((block, index) => {
      if (!block.sessionId) {
        errors[`block${index}` as keyof ValidationErrors] = ERROR_MESSAGES.SESSION_REQUIRED(index + 1);
      }
    });

    return errors;
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    const errors = validateLesson(formData);
    return Object.keys(errors).length === 0;
  };

  // Create new lesson
  const createLesson = async (data: LessonFormData): Promise<DBLesson | null> => {
    try {
      const lessonData = {
        title: data.name,
        age_group: data.ageGroup,
        division: data.division,
        skill_category: data.skills,
        session_1_id: data.blocks[0].sessionId,
        session_2_id: data.blocks[1].sessionId,
        session_3_id: data.blocks[2].sessionId,
        session_4_id: data.blocks[3].sessionId,
        total_duration: calculateTotalDuration(data.blocks),
        level: 'Beginner' as const,
        objectives: [],
        coaching_focus: [],
      };

      const { data: lesson, error } = await supabase
        .from('lessons')
        .insert(lessonData)
        .select()
        .single();

      if (error) throw error;

      return lesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      setError(ERROR_MESSAGES.SAVE_LESSON_FAILED);
      return null;
    }
  };

  // Update existing lesson
  const updateLesson = async (lessonId: string, data: LessonFormData): Promise<DBLesson | null> => {
    try {
      const lessonData = {
        title: data.name,
        age_group: data.ageGroup,
        division: data.division,
        skill_category: data.skills,
        session_1_id: data.blocks[0].sessionId,
        session_2_id: data.blocks[1].sessionId,
        session_3_id: data.blocks[2].sessionId,
        session_4_id: data.blocks[3].sessionId,
        total_duration: calculateTotalDuration(data.blocks),
        updated_at: new Date().toISOString(),
      };

      const { data: lesson, error } = await supabase
        .from('lessons')
        .update(lessonData)
        .eq('id', lessonId)
        .select()
        .single();

      if (error) throw error;

      return lesson;
    } catch (error) {
      console.error('Error updating lesson:', error);
      setError(ERROR_MESSAGES.SAVE_LESSON_FAILED);
      return null;
    }
  };

  // Copy lesson with new name
  const copyLesson = async (newName: string, data: LessonFormData): Promise<DBLesson | null> => {
    try {
      const lessonData = {
        title: newName,
        age_group: data.ageGroup,
        division: data.division,
        skill_category: data.skills,
        session_1_id: data.blocks[0].sessionId,
        session_2_id: data.blocks[1].sessionId,
        session_3_id: data.blocks[2].sessionId,
        session_4_id: data.blocks[3].sessionId,
        total_duration: calculateTotalDuration(data.blocks),
        level: 'Beginner' as const,
        objectives: [],
        coaching_focus: [],
      };

      const { data: lesson, error } = await supabase
        .from('lessons')
        .insert(lessonData)
        .select()
        .single();

      if (error) throw error;

      return lesson;
    } catch (error) {
      console.error('Error copying lesson:', error);
      setError(ERROR_MESSAGES.SAVE_LESSON_FAILED);
      return null;
    }
  };

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
    setValidationErrors({});
    setError(null);
  };

  const handleCancel = () => {
    setIsCreatingNew(false);
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
    setValidationErrors({});
    setError(null);
  };

  const handleAgeGroupChange = (newAgeGroup: string) => {
    // Clear all session selections when age group changes
    setFormData({
      ...formData,
      ageGroup: newAgeGroup,
      blocks: [
        { type: 'Warm-Up & Technical', sessionId: '', sessionName: '', duration: 0 },
        { type: 'Skill Introduction', sessionId: '', sessionName: '', duration: 0 },
        { type: 'Progressive Development', sessionId: '', sessionName: '', duration: 0 },
        { type: 'Game Application', sessionId: '', sessionName: '', duration: 0 },
      ],
    });
  };

  const handleSelectSession = (blockIndex: number, sessionId: string) => {
    if (!sessionId) {
      // Clear selection
      const newBlocks = [...formData.blocks];
      newBlocks[blockIndex] = {
        ...newBlocks[blockIndex],
        sessionId: '',
        sessionName: '',
        duration: 0,
      };
      setFormData({ ...formData, blocks: newBlocks });
      return;
    }

    // Find session in cache
    const blockType = formData.blocks[blockIndex].type;
    const sessionType = SESSION_TYPE_MAP[blockType];
    const cacheKey = `${formData.ageGroup}-${sessionType}`;
    const sessions = sessionsByType[cacheKey] || [];
    const session = sessions.find((s) => s.id === sessionId);
    
    if (session) {
      const newBlocks = [...formData.blocks];
      newBlocks[blockIndex] = {
        ...newBlocks[blockIndex],
        sessionId: session.id,
        sessionName: session.title,
        duration: session.duration,
      };
      setFormData({ ...formData, blocks: newBlocks });
    }
  };

  const getFilteredSessionsForBlock = (blockType: string): DBSession[] => {
    // Map UI block type to database session_type
    const sessionType = SESSION_TYPE_MAP[blockType];
    if (!sessionType) return [];

    // Return cached sessions if available
    const cacheKey = `${formData.ageGroup}-${sessionType}`;
    if (sessionsByType[cacheKey]) {
      return sessionsByType[cacheKey];
    }

    // Fetch sessions asynchronously and cache them
    fetchSessionsByTypeAndAge(formData.ageGroup, sessionType).then((sessions) => {
      setSessionsByType(prev => ({ ...prev, [cacheKey]: sessions }));
    });

    return [];
  };

  const handleSave = async () => {
    // Validate form
    const errors = validateLesson(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fill in all required fields');
      return;
    }

    setValidationErrors({});

    try {
      if (isCreatingNew) {
        // Create new lesson
        const lesson = await createLesson(formData);
        if (lesson) {
          await fetchLessons();
          setIsCreatingNew(false);
          setSelectedLesson({
            id: lesson.id,
            title: lesson.title,
            skill_category: lesson.skill_category,
            age_group: lesson.age_group,
            division: lesson.division,
            allocated_age_groups: [],
          });
          setError(null);
          alert('Lesson created successfully!');
        }
      } else if (selectedLesson) {
        // Update existing lesson
        const lesson = await updateLesson(selectedLesson.id, formData);
        if (lesson) {
          await fetchLessons();
          setError(null);
          alert('Lesson updated successfully!');
        }
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  const handleSaveAsNew = async () => {
    if (!newLessonName.trim()) {
      alert('Please enter a name for the new lesson');
      return;
    }

    // Validate form
    const errors = validateLesson(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fill in all required fields');
      return;
    }

    setValidationErrors({});

    try {
      const lesson = await copyLesson(newLessonName, formData);
      if (lesson) {
        await fetchLessons();
        setShowSaveAsNew(false);
        setNewLessonName('');
        setSelectedLesson({
          id: lesson.id,
          title: lesson.title,
          skill_category: lesson.skill_category,
          age_group: lesson.age_group,
          division: lesson.division,
          allocated_age_groups: [],
        });
        setError(null);
        alert(`New lesson "${newLessonName}" created successfully!`);
      }
    } catch (error) {
      console.error('Error copying lesson:', error);
    }
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
                  onChange={(e) => handleAgeGroupChange(e.target.value)}
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
                            {session.title} ({session.duration} min)
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
                onClick={handleCancel}
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
