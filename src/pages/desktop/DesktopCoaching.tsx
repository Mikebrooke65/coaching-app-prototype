import { Link } from 'react-router';

export function DesktopCoaching() {
  console.log('DesktopCoaching rendering');
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#22c55e]">Coaching Hub</h1>
        <p className="text-gray-600 mt-1">Access lessons, AI coaching assistant, and training resources</p>
      </div>

      {/* Coaching Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Link
          to="/desktop/lesson-builder"
          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-[#0091f3] bg-opacity-10 flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-[#0091f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-xl mb-1">Lesson Builder</h3>
              <p className="text-sm text-gray-600">Create and manage lesson plans</p>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          to="/desktop/session-builder"
          className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-[#ea7800] bg-opacity-10 flex items-center justify-center mr-4">
              <svg className="w-8 h-8 text-[#ea7800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-xl mb-1">Session Builder</h3>
              <p className="text-sm text-gray-600">Build individual training sessions</p>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Coaching Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Sessions</span>
              <span className="text-2xl font-bold text-[#0091f3]">87</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Lessons</span>
              <span className="text-2xl font-bold text-[#0091f3]">28</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Coaches</span>
              <span className="text-2xl font-bold text-[#0091f3]">18</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span>New lesson created</span>
            </div>
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              <span>Session updated</span>
            </div>
            <div className="flex items-center text-gray-600">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
              <span>Lesson published</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link
              to="/desktop/session-builder"
              className="block w-full px-4 py-2 text-sm text-center bg-[#0091f3] text-white rounded-lg hover:bg-[#0077cc]"
            >
              New Session
            </Link>
            <Link
              to="/desktop/lesson-builder"
              className="block w-full px-4 py-2 text-sm text-center border border-[#0091f3] text-[#0091f3] rounded-lg hover:bg-[#0091f3] hover:bg-opacity-5"
            >
              New Lesson
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
