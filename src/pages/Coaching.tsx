import { Link } from 'react-router';

export function Coaching() {
  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0091f3] to-[#0077cc] text-white p-6">
        <h1 className="text-2xl font-bold mb-1">Coaching</h1>
        <p className="text-blue-100 text-sm">
          Access lessons, AI coaching assistant, and training resources
        </p>
      </div>

      {/* Coaching Options */}
      <div className="p-4 space-y-3">
        <Link
          to="/lessons"
          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-[#0091f3] bg-opacity-10 flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-[#0091f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">Lessons</h3>
              <p className="text-sm text-gray-600">Browse structured lesson plans</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          to="/ai-coach"
          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-[#ea7800] bg-opacity-10 flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-[#ea7800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">AI Coach</h3>
              <p className="text-sm text-gray-600">Get AI-powered coaching tips</p>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Your Coaching Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0091f3]">12</div>
              <div className="text-xs text-gray-600">Lessons Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0091f3]">8</div>
              <div className="text-xs text-gray-600">Favorites</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
