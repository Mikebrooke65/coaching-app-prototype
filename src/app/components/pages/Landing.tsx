import { User } from "../../App";
import { Bell, TrendingUp, Users, Calendar } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface LandingProps {
  user: User;
}

export function Landing({ user }: LandingProps) {
  const announcements = [
    {
      id: 1,
      title: "Season Kickoff This Weekend",
      message: "All teams report to West Coast Stadium, Saturday 8:00 AM. Don't forget your gear!",
      date: "Feb 24, 2026",
      priority: "high" as const,
    },
    {
      id: 2,
      title: "New Training Drills Available",
      message: "Check out the updated passing drills in the Lessons section for U12-U16 teams.",
      date: "Feb 22, 2026",
      priority: "normal" as const,
    },
    {
      id: 3,
      title: "Parent-Coach Meeting",
      message: "Monthly meeting scheduled for March 5th at 6:00 PM in the clubhouse.",
      date: "Feb 20, 2026",
      priority: "normal" as const,
    },
  ];

  const stats = [
    { label: "Active Players", value: "180", icon: Users, color: "bg-blue-100 text-[#0091f3]" },
    { label: "Teams", value: "12", icon: TrendingUp, color: "bg-orange-100 text-[#ea7800]" },
    { label: "Upcoming Games", value: "8", icon: Calendar, color: "bg-gray-100 text-[#545859]" },
  ];

  return (
    <div className="px-4 py-6 pb-20">
      {/* Welcome Header */}
      <div className="mb-6 border-l-8 border-[#0091f3] pl-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome back, {user.name.split(' ')[0]}! 👋
        </h1>
        {/* Display multiple roles if available */}
        {user.roles && user.roles.length > 0 ? (
          <div className="space-y-1">
            {user.roles.map((roleInfo, index) => (
              <p key={index} className="text-gray-600 text-sm">
                {roleInfo.role.charAt(0).toUpperCase() + roleInfo.role.slice(1)} - {roleInfo.teamName}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            {user.teamName} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Announcements */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#0091f3]" />
            <h3 className="font-semibold text-gray-900">Announcements</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="px-4 py-4">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-semibold text-gray-900 text-sm flex items-center space-x-2 flex-1">
                  <span>{announcement.title}</span>
                  {announcement.priority === 'high' && (
                    <span className="bg-[#ea7800] text-white text-xs px-2 py-0.5 rounded-full">
                      !
                    </span>
                  )}
                </h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
              <span className="text-xs text-gray-500">{announcement.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}