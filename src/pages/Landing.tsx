import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { useResponsive } from '../hooks/useResponsive';
import { UserRole } from '../types/database';

export function Landing() {
  const { user } = useAuth();
  const { hasFullVersion } = usePermissions();
  const { isDesktop } = useResponsive();
  const navigate = useNavigate();

  // Redirect admins to desktop interface if on desktop screen
  useEffect(() => {
    if (user?.role === UserRole.ADMIN && isDesktop) {
      navigate('/desktop', { replace: true });
    }
  }, [user, isDesktop, navigate]);

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#0091f3] to-[#0077cc] text-white p-6">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {user?.first_name}!
        </h1>
        <p className="text-blue-100 text-sm">
          {user?.role === UserRole.COACH && 'Ready to inspire your team'}
          {user?.role === UserRole.MANAGER && 'Manage your teams and coaches'}
          {user?.role === UserRole.ADMIN && 'Admin Dashboard'}
          {user?.role === UserRole.PLAYER && 'Check your schedule and messages'}
          {user?.role === UserRole.CAREGIVER && 'Stay connected with your player'}
        </p>
      </div>

      {/* Quick Links */}
      {hasFullVersion && (
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/coaching"
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow"
            >
              <svg className="w-8 h-8 text-[#0091f3] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="text-sm font-medium text-gray-900">Coaching</span>
            </Link>

            <Link
              to="/games"
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow"
            >
              <svg className="w-8 h-8 text-[#0091f3] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-900">Games</span>
            </Link>

            <Link
              to="/resources"
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow"
            >
              <svg className="w-8 h-8 text-[#0091f3] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="text-sm font-medium text-gray-900">Resources</span>
            </Link>

            <Link
              to="/ai-coach"
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center hover:shadow-md transition-shadow"
            >
              <svg className="w-8 h-8 text-[#ea7800] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-900">AI Coach</span>
            </Link>
          </div>
        </div>
      )}

      {/* Announcements Section */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Announcements</h2>
        
        {/* Placeholder announcement */}
        <div className="bg-white rounded-lg shadow p-4 mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Welcome to Urrah!</h3>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Your coaching platform is now live. Explore lessons, track games, and connect with your team.
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <span>Admin Team</span>
          </div>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <p className="text-sm text-gray-500">No new announcements</p>
        </div>
      </div>
    </div>
  );
}
