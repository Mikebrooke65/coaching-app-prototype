import { Outlet, Link, useLocation } from "react-router";
import { 
  Home, BookOpen, Trophy, FolderOpen, Calendar, MessageSquare, 
  Users, UserCog, BarChart3, PenTool, LogOut, ChevronDown, Menu, Layers, Megaphone
} from "lucide-react";
import { User } from "../App";
import { useState } from "react";
import gannetBlue from "figma:asset/26aba82ad8cef7a800d00e3c7f31a52dfc18b8b4.png";

interface DesktopLayoutProps {
  user: User;
  onLogout: () => void;
}

export function DesktopLayout({ user, onLogout }: DesktopLayoutProps) {
  const location = useLocation();
  const [coachingOpen, setCoachingOpen] = useState(true);
  const [adminOpen, setAdminOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const coachingNav = [
    { name: 'Landing', href: '/desktop', icon: Home, devProgress: 80, color: '#0091f3' },
    { name: 'Coaching', href: '/desktop/coaching', icon: BookOpen, devProgress: 80, color: '#22c55e' },
    { name: 'Games', href: '/desktop/games', icon: Trophy, devProgress: 70, color: '#ea7800' },
    { name: 'Resources', href: '/desktop/resources', icon: FolderOpen, devProgress: 70, color: '#8b5cf6' },
    { name: 'Schedule', href: '/desktop/schedule', icon: Calendar, devProgress: 80, color: '#06b6d4' },
    { name: 'Messaging', href: '/desktop/messaging', icon: MessageSquare, devProgress: 60, color: '#545859' },
  ];

  const adminNav = [
    { name: 'Teams Management', href: '/desktop/teams', icon: Users, devProgress: 10 },
    { name: 'User Management', href: '/desktop/users', icon: UserCog, devProgress: 10 },
    { name: 'Reporting', href: '/desktop/reporting', icon: BarChart3, devProgress: 5 },
    { name: 'Announcements', href: '/desktop/announcements', icon: Megaphone, devProgress: 70 },
    { name: 'Session Builder', href: '/desktop/session-builder', icon: Layers, devProgress: 80 },
    { name: 'Lesson Builder', href: '/desktop/lesson-builder', icon: PenTool, devProgress: 80 },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Header with Logo and Gannet */}
        <div className="p-4 border-b border-gray-200 bg-[#0091f3] text-white relative overflow-hidden">
          {/* Gannet Background */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-32 h-32 opacity-20 pointer-events-none">
            <img 
              src={gannetBlue} 
              alt="" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg leading-tight" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                  Urrah
                </h1>
                <p className="text-xs opacity-90 mt-0.5" style={{ fontFamily: "'Exo 2', sans-serif" }}>
                  West Coast Rangers FC
                </p>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          {/* Coaching Tools Section */}
          <div className="mb-4">
            <button
              onClick={() => setCoachingOpen(!coachingOpen)}
              className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
            >
              {!sidebarCollapsed && <span>Coaching Tools</span>}
              <ChevronDown className={`w-4 h-4 transition-transform ${coachingOpen ? '' : '-rotate-90'} ${sidebarCollapsed ? 'mx-auto' : ''}`} />
            </button>
            {coachingOpen && (
              <div className="mt-1 space-y-1">
                {coachingNav.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  
                  // Determine color based on progress
                  let progressColor = '';
                  if (item.devProgress >= 60) {
                    progressColor = 'text-green-600';
                  } else if (item.devProgress >= 20) {
                    progressColor = 'text-orange-500';
                  } else {
                    progressColor = 'text-red-500';
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-3 py-2 pl-3 pr-3 rounded-lg transition-colors relative ${
                        isActive 
                          ? 'bg-gray-100 text-gray-900' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      {/* Vertical color bar */}
                      <div 
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-r transition-all ${isActive ? 'opacity-100' : 'opacity-40'}`}
                        style={{ backgroundColor: item.color }}
                      />
                      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: isActive ? item.color : undefined }} />
                      {!sidebarCollapsed && (
                        <span className="text-sm font-medium flex items-center gap-2">
                          {item.name}
                          <span className={`text-xs font-bold ${isActive ? 'text-gray-600' : progressColor}`}>
                            ({item.devProgress}%)
                          </span>
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Admin Section */}
          <div>
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className="w-full flex items-center justify-between px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
            >
              {!sidebarCollapsed && <span>Admin</span>}
              <ChevronDown className={`w-4 h-4 transition-transform ${adminOpen ? '' : '-rotate-90'} ${sidebarCollapsed ? 'mx-auto' : ''}`} />
            </button>
            {adminOpen && (
              <div className="mt-1 space-y-1">
                {adminNav.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  
                  // Determine color based on progress
                  let progressColor = '';
                  if (item.devProgress >= 60) {
                    progressColor = 'text-green-600';
                  } else if (item.devProgress >= 20) {
                    progressColor = 'text-orange-500';
                  } else {
                    progressColor = 'text-red-500';
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-[#0091f3] text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="ml-3 text-sm font-medium flex items-center gap-2">
                          {item.name}
                          <span className={`text-xs font-bold ${isActive ? 'text-white/90' : progressColor}`}>
                            ({item.devProgress}%)
                          </span>
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-200">
          {!sidebarCollapsed ? (
            <div className="mb-3 px-2">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-500 mt-0.5">{user.teamName}</p>
            </div>
          ) : null}
          <button
            onClick={onLogout}
            className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="ml-3 text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}