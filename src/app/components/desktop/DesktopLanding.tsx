import { User } from "../../App";
import { Calendar, MessageSquare, Trophy, BookOpen, TrendingUp, Bell } from "lucide-react";
import { Button } from "../ui/button";
import gannetBlue from "../../../assets/cdb7544de20d133944374bb8948c71879fef34b4.png";

interface DesktopLandingProps {
  user: User;
}

export function DesktopLanding({ user }: DesktopLandingProps) {
  // Mock data
  const announcements = [
    {
      id: 1,
      title: "Season Opening Match - This Saturday!",
      content: "Our U12 Rangers Blue team kicks off the season this Saturday at 10 AM. All families welcome!",
      date: "2 days ago",
      priority: "high"
    },
    {
      id: 2,
      title: "New Training Equipment Arrived",
      content: "We've received new training cones, bibs, and balls. Please ensure equipment is returned to the shed after each session.",
      date: "5 days ago",
      priority: "medium"
    },
    {
      id: 3,
      title: "Coaching Workshop - March 15th",
      content: "Join us for a professional development workshop on modern coaching techniques. RSVP by March 10th.",
      date: "1 week ago",
      priority: "medium"
    },
  ];

  const upcomingEvents = [
    { id: 1, type: "training", title: "U10 Rangers Training", time: "Today, 5:00 PM", location: "Field A" },
    { id: 2, type: "game", title: "U12 Blue vs Knights", time: "Saturday, 10:00 AM", location: "Home Ground" },
    { id: 3, type: "meeting", title: "Coaches Meeting", time: "Monday, 7:00 PM", location: "Club House" },
  ];

  const quickStats = [
    { label: "Upcoming Sessions", value: "12", icon: BookOpen, color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Games This Week", value: "3", icon: Trophy, color: "text-orange-600", bgColor: "bg-orange-100" },
    { label: "Active Players", value: "127", icon: TrendingUp, color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Unread Messages", value: "8", icon: MessageSquare, color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-[#0091f3] to-[#0081d8] rounded-2xl p-8 text-white">
        {/* Gannet Background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 opacity-10 pointer-events-none">
          <img 
            src={gannetBlue} 
            alt="" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-blue-100 text-lg">{user.teamName} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
          <div className="mt-6 flex gap-3">
            <Button className="bg-white text-[#0091f3] hover:bg-gray-100">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              <BookOpen className="w-4 h-4 mr-2" />
              Quick Lesson
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Announcements */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Club Announcements</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#0091f3] hover:bg-blue-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#0091f3]" />
                    <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                  </div>
                  {announcement.priority === 'high' && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                      Important
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2 ml-7">{announcement.content}</p>
                <p className="text-xs text-gray-500 ml-7">{announcement.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    event.type === 'training' ? 'bg-green-100' :
                    event.type === 'game' ? 'bg-orange-100' :
                    'bg-blue-100'
                  }`}>
                    {event.type === 'training' ? <BookOpen className="w-5 h-5 text-green-600" /> :
                     event.type === 'game' ? <Trophy className="w-5 h-5 text-orange-600" /> :
                     <Calendar className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{event.title}</h4>
                    <p className="text-xs text-gray-600 mb-1">{event.time}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6">
            View Full Schedule
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#0091f3]" />
            <span className="text-sm">Create Lesson</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <Trophy className="w-6 h-6 text-[#ea7800]" />
            <span className="text-sm">Log Game Result</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#545859]" />
            <span className="text-sm">Send Message</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
            <Calendar className="w-6 h-6 text-[#0091f3]" />
            <span className="text-sm">Schedule Event</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
