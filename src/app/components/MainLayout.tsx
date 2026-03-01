import { Outlet, Link, useLocation } from "react-router";
import { Home, BookOpen, Trophy, FolderOpen, Calendar, MessageSquare, LogOut } from "lucide-react";
import { User } from "../App";
import logo from "figma:asset/cdb7544de20d133944374bb8948c71879fef34b4.png";
import gannetWhite from "figma:asset/e2b3da3f33b0748e111b306a15bee82b12f28232.png";

interface MainLayoutProps {
  user: User;
  onLogout: () => void;
}

export function MainLayout({ user, onLogout }: MainLayoutProps) {
  const location = useLocation();

  // Full access for coaches, managers, and admins
  const hasFullAccess = ['coach', 'manager', 'admin'].includes(user.role);

  const navigation = [
    { name: 'Home', href: '/', icon: Home, available: true, bgColor: '#0091f3', hoverColor: '#0081d8' },
    { name: 'Coaching', href: '/lessons', icon: BookOpen, available: hasFullAccess, bgColor: '#22c55e', hoverColor: '#16a34a' },
    { name: 'Games', href: '/games', icon: Trophy, available: hasFullAccess, bgColor: '#ea7800', hoverColor: '#d66d00' },
    { name: 'Resources', href: '/resources', icon: FolderOpen, available: hasFullAccess, bgColor: '#8b5cf6', hoverColor: '#7c3aed' },
    { name: 'Schedule', href: '/schedule', icon: Calendar, available: true, bgColor: '#06b6d4', hoverColor: '#0891b2' },
    { name: 'Messaging', href: '/messaging', icon: MessageSquare, available: true, bgColor: '#545859', hoverColor: '#3e4142' },
  ].filter(item => item.available);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Simple Top Bar - Mobile App Style */}
      <header className="bg-[#0091f3] text-white safe-area-top">
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
                {user.teamName}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content - with bottom padding for tab bar */}
      <main className="flex-1 pb-16 overflow-auto">
        <Outlet />
      </main>

      {/* Bottom Tab Navigation - Mobile App Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
        <div className="grid grid-cols-3 sm:grid-cols-6 max-w-lg mx-auto gap-2 p-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className="flex flex-col items-center justify-center py-3 px-2 rounded-xl text-white transition-colors"
                style={{ 
                  backgroundColor: item.bgColor,
                  opacity: isActive ? 1 : 0.7
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = item.hoverColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.bgColor}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-normal'} leading-tight`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}