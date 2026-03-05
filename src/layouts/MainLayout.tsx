import { Outlet, NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import { SyncStatusIndicator } from '../components/SyncStatusIndicator';
import { LogoutButton } from '../components/LogoutButton';
import gannetWhite from '../assets/e2b3da3f33b0748e111b306a15bee82b12f28232.png';

export function MainLayout() {
  const { user } = useAuth();
  const { hasFullVersion, hasLiteVersion } = usePermissions();

  console.log('MainLayout rendering:', { user, hasFullVersion, hasLiteVersion });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-[#0091f3] text-white">
        <div className="px-4 py-3 flex justify-between items-center">
          {/* Logo & Title with Gannet Silhouette */}
          <div className="relative">
            {/* Gannet Silhouette Background */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-24 h-24 opacity-40 pointer-events-none">
              <img 
                src={gannetWhite} 
                alt="" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="relative z-10 pl-10">
              <h1 className="font-bold text-xl leading-tight" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                Urrah
              </h1>
              <p className="text-xs opacity-90" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                {user?.first_name} {user?.last_name} • {user?.role}
              </p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <SyncStatusIndicator />
            <LogoutButton className="text-white hover:bg-white/10 p-2 rounded-md transition-colors" />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-16">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-3 sm:grid-cols-6 max-w-lg mx-auto gap-2 p-2">
          {/* Full version navigation (Coach, Manager, Admin) */}
          {hasFullVersion && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-2 rounded-xl text-white transition-all ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`
                }
                style={{ backgroundColor: '#0091f3' }}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="text-[10px] font-normal leading-tight">Home</span>
              </NavLink>

              <NavLink
                to="/coaching"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-2 rounded-xl text-white transition-all ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`
                }
                style={{ backgroundColor: '#22c55e' }}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="text-[10px] font-normal leading-tight">Coaching</span>
              </NavLink>

              <NavLink
                to="/games"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-2 rounded-xl text-white transition-all ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`
                }
                style={{ backgroundColor: '#ea7800' }}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span className="text-[10px] font-normal leading-tight">Games</span>
              </NavLink>

              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-2 rounded-xl text-white transition-all ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`
                }
                style={{ backgroundColor: '#8b5cf6' }}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="text-[10px] font-normal leading-tight">Resources</span>
              </NavLink>

              <NavLink
                to="/schedule"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-2 rounded-xl text-white transition-all ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`
                }
                style={{ backgroundColor: '#06b6d4' }}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[10px] font-normal leading-tight">Schedule</span>
              </NavLink>

              <NavLink
                to="/messaging"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-2 rounded-xl text-white transition-all ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`
                }
                style={{ backgroundColor: '#545859' }}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span className="text-[10px] font-normal leading-tight">Messages</span>
              </NavLink>
            </>
          )}

          {/* Lite version navigation (Player, Caregiver) */}
          {hasLiteVersion && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-2 rounded-xl text-white transition-all ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`
                }
                style={{ backgroundColor: '#0091f3' }}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="text-[10px] font-normal leading-tight">Home</span>
              </NavLink>

              <NavLink
                to="/schedule"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-2 rounded-xl text-white transition-all ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`
                }
                style={{ backgroundColor: '#06b6d4' }}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-[10px] font-normal leading-tight">Schedule</span>
              </NavLink>

              <NavLink
                to="/messaging"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 px-2 rounded-xl text-white transition-all ${
                    isActive ? 'opacity-100' : 'opacity-70'
                  }`
                }
                style={{ backgroundColor: '#545859' }}
              >
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span className="text-[10px] font-normal leading-tight">Messages</span>
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
