import { useState } from 'react';
import { Link } from 'react-router';

// Mock data - will be replaced with real data from Supabase
const mockLessons = [
  {
    id: '1',
    title: 'Passing Fundamentals',
    ageGroup: 'U9-U12',
    duration: 60,
    skills: ['Passing', 'First Touch', 'Communication'],
    description: 'Build strong passing foundations with progressive drills',
    level: 'Beginner',
  },
  {
    id: '2',
    title: 'Dribbling Mastery',
    ageGroup: 'U9-U12',
    duration: 45,
    skills: ['Dribbling', 'Ball Control', 'Agility'],
    description: 'Develop close control and dribbling confidence',
    level: 'Intermediate',
  },
  {
    id: '3',
    title: 'Shooting Techniques',
    ageGroup: 'U13-U17',
    duration: 60,
    skills: ['Shooting', 'Finishing', 'Power'],
    description: 'Master various shooting techniques and finishing',
    level: 'Intermediate',
  },
];

export function Lessons() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  // Filter lessons based on search and filters
  const filteredLessons = mockLessons.filter((lesson) => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAge = selectedAgeGroup === 'all' || lesson.ageGroup === selectedAgeGroup;
    const matchesLevel = selectedLevel === 'all' || lesson.level === selectedLevel;
    
    return matchesSearch && matchesAge && matchesLevel;
  });

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900">Lessons</h1>
        <p className="text-sm text-gray-600 mt-1">Browse coaching lesson plans</p>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search lessons or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3] focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex gap-2 overflow-x-auto">
          <select
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
          >
            <option value="all">All Ages</option>
            <option value="U4-U6">U4-U6</option>
            <option value="U7-U8">U7-U8</option>
            <option value="U9-U12">U9-U12</option>
            <option value="U13-U17">U13-U17</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Lessons List */}
      <div className="p-4 space-y-3">
        {filteredLessons.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500">No lessons found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredLessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/lessons/${lesson.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{lesson.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0091f3] text-white">
                    {lesson.ageGroup}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {lesson.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {lesson.duration} min
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Add Lesson Button (for admins - will add permission check later) */}
      <div className="fixed bottom-20 right-4">
        <button className="bg-[#0091f3] text-white rounded-full p-4 shadow-lg hover:bg-[#0077cc] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
