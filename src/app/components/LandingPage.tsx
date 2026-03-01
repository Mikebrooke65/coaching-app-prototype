import { useState } from 'react';
import { Home, BookOpen, Trophy, FolderOpen, Calendar, MessageSquare, Menu, LogOut, User, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import type { User as UserType } from '../App';

interface LandingPageProps {
  user: UserType;
  onLogout: () => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  fullVersionOnly: boolean;
}

const navigationItems: NavigationItem[] = [
  { id: 'landing', label: 'Home', icon: Home, fullVersionOnly: false },
  { id: 'lessons', label: 'Lessons', icon: BookOpen, fullVersionOnly: true },
  { id: 'games', label: 'Games', icon: Trophy, fullVersionOnly: true },
  { id: 'resources', label: 'Resources', icon: FolderOpen, fullVersionOnly: true },
  { id: 'schedule', label: 'Schedule', icon: Calendar, fullVersionOnly: false },
  { id: 'messaging', label: 'Messages', icon: MessageSquare, fullVersionOnly: false },
];

export function LandingPage({ user, onLogout }: LandingPageProps) {
  const [currentPage, setCurrentPage] = useState('landing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine if user has full version access
  const hasFullAccess = user.role === 'coach' || user.role === 'manager' || user.role === 'admin';

  // Filter navigation based on user role
  const availableNavigation = navigationItems.filter(
    item => !item.fullVersionOnly || hasFullAccess
  );

  const getRoleDisplay = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'coach': return 'default';
      case 'manager': return 'default';
      case 'player': return 'secondary';
      case 'caregiver': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-green-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-green-700">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 space-y-2">
                  {availableNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentPage(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          currentPage === item.id
                            ? 'bg-green-100 text-green-900'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                  <div className="pt-4 border-t">
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">West Coast Rangers FC</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-green-100">{user.teamName}</p>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40">
        <nav className="flex justify-around py-2">
          {availableNavigation.slice(0, hasFullAccess ? 5 : 3).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'text-green-600'
                    : 'text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 lg:pb-6">
        {/* User Info Card - Mobile */}
        <Card className="mb-6 sm:hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.teamName}</p>
              </div>
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {getRoleDisplay(user.role)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Welcome Section */}
        <Card className="mb-6 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to West Coast Rangers FC</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-50">
              Your hub for coaching excellence, team coordination, and player development. 
              {hasFullAccess 
                ? ' Access lesson plans, track games, and manage your team resources all in one place.'
                : ' Stay connected with your team schedule and important messages.'}
            </p>
          </CardContent>
        </Card>

        {/* Role Badge and Access Level */}
        <div className="mb-6 flex items-center gap-4">
          <Badge variant={getRoleBadgeVariant(user.role)} className="text-sm px-3 py-1">
            {getRoleDisplay(user.role)} Access
          </Badge>
          <span className="text-sm text-gray-600">
            {hasFullAccess ? 'Full Version - All Features' : 'Lite Version - Essential Features'}
          </span>
        </div>

        {/* Team Announcements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Team Announcements - {user.teamName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-blue-900">Practice Schedule Update</p>
                <Badge variant="outline" className="text-xs">2 days ago</Badge>
              </div>
              <p className="text-sm text-blue-800">
                This week's practice has been moved to Thursday at 5:00 PM due to field maintenance. 
                Please arrive 10 minutes early for warm-up drills.
              </p>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-green-900">Upcoming Tournament</p>
                <Badge variant="outline" className="text-xs">1 week ago</Badge>
              </div>
              <p className="text-sm text-green-800">
                Regional Championship Tournament is scheduled for March 15-16. 
                All players must submit their registration forms by March 1st.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-amber-900">Equipment Reminder</p>
                <Badge variant="outline" className="text-xs">2 weeks ago</Badge>
              </div>
              <p className="text-sm text-amber-800">
                Please ensure all players have shin guards and water bottles for every practice session. 
                Team jerseys will be distributed next week.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Available Features Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    currentPage === item.id ? 'ring-2 ring-green-600' : ''
                  }`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.label}</h3>
                        <p className="text-sm text-gray-600">
                          {item.id === 'landing' && 'Dashboard home'}
                          {item.id === 'lessons' && 'Training plans'}
                          {item.id === 'games' && 'Match records'}
                          {item.id === 'resources' && 'Coaching materials'}
                          {item.id === 'schedule' && 'Team calendar'}
                          {item.id === 'messaging' && 'Team chat'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Access Notice for Lite Users */}
        {!hasFullAccess && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Lite Version Access</h3>
                  <p className="text-sm text-blue-800">
                    You're using the lite version with access to Home, Schedule, and Messages. 
                    Coaches and managers have access to additional features like Lessons, Games, and Resources.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
