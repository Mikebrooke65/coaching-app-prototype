import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';

// Mock lesson data - will be replaced with Supabase data
const mockLessonData: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Passing Fundamentals',
    ageGroup: 'U9-U12',
    duration: 60,
    level: 'Beginner',
    description: 'Build strong passing foundations with progressive drills that develop accuracy, weight of pass, and decision-making.',
    objectives: [
      'Develop accurate short passing technique',
      'Understand when to pass vs dribble',
      'Improve communication with teammates',
    ],
    sessions: [
      {
        id: 1,
        name: 'Warm-Up & Technical',
        duration: 15,
        description: 'Dynamic warm-up focusing on ball mastery and basic passing technique',
        equipment: ['Cones (20)', 'Balls (1 per player)', 'Bibs (2 colors)'],
        coachingPoints: [
          'Inside of foot contact for accuracy',
          'Non-kicking foot beside the ball',
          'Follow through towards target',
          'Head up to see teammates',
        ],
      },
      {
        id: 2,
        name: 'Skill Introduction',
        duration: 15,
        description: 'Introduce passing patterns in pairs and small groups',
        equipment: ['Cones (12)', 'Balls (1 per pair)', 'Small goals (4)'],
        coachingPoints: [
          'Weight of pass - not too hard, not too soft',
          'Receive across your body',
          'First touch away from pressure',
          'Communicate before receiving',
        ],
      },
      {
        id: 3,
        name: 'Progressive Development',
        duration: 15,
        description: 'Small-sided games with passing conditions',
        equipment: ['Cones (16)', 'Balls (4)', 'Bibs (3 colors)', 'Small goals (4)'],
        coachingPoints: [
          'Create passing angles',
          'Move after you pass',
          'Support the ball carrier',
          'Look for forward passes first',
        ],
      },
      {
        id: 4,
        name: 'Game Application',
        duration: 15,
        description: 'Full game with focus on passing principles',
        equipment: ['Cones (8)', 'Balls (2)', 'Bibs (2 colors)', 'Goals (2)'],
        coachingPoints: [
          'Apply passing technique in game situations',
          'Make good decisions under pressure',
          'Celebrate successful passing combinations',
          'Encourage positive communication',
        ],
      },
    ],
  },
  '2': {
    id: '2',
    title: 'Dribbling Mastery',
    ageGroup: 'U9-U12',
    duration: 45,
    level: 'Intermediate',
    description: 'Develop close control and dribbling confidence through fun, progressive activities.',
    objectives: [
      'Master basic dribbling moves',
      'Develop close ball control',
      'Learn when to dribble vs pass',
    ],
    sessions: [
      {
        id: 1,
        name: 'Warm-Up & Technical',
        duration: 10,
        description: 'Ball mastery warm-up with various touches',
        equipment: ['Balls (1 per player)', 'Cones (20)'],
        coachingPoints: [
          'Keep ball close',
          'Use all parts of foot',
          'Head up between touches',
        ],
      },
      {
        id: 2,
        name: 'Skill Introduction',
        duration: 10,
        description: 'Introduce 2-3 dribbling moves',
        equipment: ['Balls (1 per player)', 'Cones (16)'],
        coachingPoints: [
          'Sell the move with body feint',
          'Accelerate after the move',
          'Practice both feet',
        ],
      },
      {
        id: 3,
        name: 'Progressive Development',
        duration: 15,
        description: '1v1 dribbling challenges',
        equipment: ['Balls (4)', 'Cones (12)', 'Bibs (2 colors)'],
        coachingPoints: [
          'Attack defender at speed',
          'Use moves to beat defender',
          'Protect ball with body',
        ],
      },
      {
        id: 4,
        name: 'Game Application',
        duration: 10,
        description: 'Small-sided game with dribbling zones',
        equipment: ['Balls (2)', 'Cones (8)', 'Bibs (2 colors)', 'Small goals (4)'],
        coachingPoints: [
          'Recognize when to dribble',
          'Take on defenders in attacking third',
          'Keep possession when under pressure',
        ],
      },
    ],
  },
};

export function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const lesson = mockLessonData[id || ''];

  if (!lesson) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lesson not found</h2>
          <button
            onClick={() => navigate('/lessons')}
            className="text-[#0091f3] hover:underline"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-50 min-h-full pb-4">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <button
            onClick={() => navigate('/lessons')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-3"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lessons
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0091f3] text-white">
                  {lesson.ageGroup}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {lesson.level}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {lesson.duration} min
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              <svg
                className={`w-6 h-6 ${isFavorite ? 'fill-[#ea7800] text-[#ea7800]' : 'text-gray-400'}`}
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </button>
            <button className="flex-1 flex items-center justify-center px-4 py-2 bg-[#0091f3] text-white rounded-lg text-sm font-medium hover:bg-[#0077cc]">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Objectives */}
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Learning Objectives</h2>
          <ul className="space-y-2">
            {lesson.objectives.map((objective: string, index: number) => (
              <li key={index} className="flex items-start text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {objective}
              </li>
            ))}
          </ul>
        </div>

        {/* Session Blocks */}
        <h2 className="font-semibold text-gray-900 mb-3">Session Plan</h2>
        <div className="space-y-3">
          {lesson.sessions.map((session: any, index: number) => (
            <div key={session.id} className="bg-white rounded-lg shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#0091f3] text-white flex items-center justify-center font-semibold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.name}</h3>
                      <p className="text-xs text-gray-500">{session.duration} minutes</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{session.description}</p>

                {/* Equipment */}
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Equipment</h4>
                  <div className="flex flex-wrap gap-1">
                    {session.equipment.map((item: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Coaching Points */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">Coaching Points</h4>
                  <ul className="space-y-1">
                    {session.coachingPoints.map((point: string, i: number) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <span className="text-[#0091f3] mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
