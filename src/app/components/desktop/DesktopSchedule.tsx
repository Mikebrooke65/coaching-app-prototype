import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ScheduleEvent {
  id: number;
  title: string;
  type: 'training' | 'game' | 'meeting' | 'event';
  team: string;
  date: string;
  time: string;
  location: string;
  participants?: number;
}

export function DesktopSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 2)); // March 2, 2026

  const events: ScheduleEvent[] = [
    {
      id: 1,
      title: "U10 Rangers Training",
      type: "training",
      team: "U10 Rangers",
      date: "Mar 2, 2026",
      time: "5:00 PM",
      location: "Field A",
      participants: 18
    },
    {
      id: 2,
      title: "U12 Blue vs City Knights",
      type: "game",
      team: "U12 Rangers Blue",
      date: "Mar 5, 2026",
      time: "10:00 AM",
      location: "Home Ground",
      participants: 16
    },
    {
      id: 3,
      title: "Coaches Meeting",
      type: "meeting",
      team: "All Teams",
      date: "Mar 3, 2026",
      time: "7:00 PM",
      location: "Club House",
      participants: 12
    },
    {
      id: 4,
      title: "U14 Rangers Training",
      type: "training",
      team: "U14 Rangers",
      date: "Mar 4, 2026",
      time: "6:00 PM",
      location: "Field B",
      participants: 20
    },
    {
      id: 5,
      title: "Season Opening Ceremony",
      type: "event",
      team: "All Teams",
      date: "Mar 6, 2026",
      time: "2:00 PM",
      location: "Main Stadium",
      participants: 150
    },
    {
      id: 6,
      title: "U16 Rangers Training",
      type: "training",
      team: "U16 Rangers",
      date: "Mar 2, 2026",
      time: "7:00 PM",
      location: "Field A",
      participants: 19
    },
    {
      id: 7,
      title: "U8 Rangers vs Junior Stars",
      type: "game",
      team: "U8 Rangers",
      date: "Mar 8, 2026",
      time: "9:00 AM",
      location: "Home Ground",
      participants: 15
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'training': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'game': return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' };
      case 'meeting': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'event': return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const getTypeIcon = (type: string) => {
    const colors = getTypeColor(type);
    const iconClass = `w-5 h-5 ${colors.text}`;
    
    switch (type) {
      case 'training':
        return <Users className={iconClass} />;
      case 'game':
        return <Calendar className={iconClass} />;
      default:
        return <Calendar className={iconClass} />;
    }
  };

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, ScheduleEvent[]>);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#06b6d4' }}>Schedule</h1>
        <p className="text-gray-600">View and manage training sessions, games, and events</p>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <Button variant="outline" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Today</Button>
            <Button className="gap-2 bg-[#0091f3] hover:bg-[#0081d8]" size="sm">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Events</h2>
            <div className="space-y-6">
              {Object.entries(groupedEvents).map(([date, dateEvents]) => (
                <div key={date}>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">{date}</h3>
                  <div className="space-y-3">
                    {dateEvents.map((event) => {
                      const colors = getTypeColor(event.type);
                      return (
                        <div
                          key={event.id}
                          className={`p-4 rounded-lg border ${colors.border} ${colors.bg} hover:shadow-md transition-all cursor-pointer`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                              {getTypeIcon(event.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                                  <p className="text-sm text-gray-600">{event.team}</p>
                                </div>
                                <Badge className={`${colors.bg} ${colors.text}`}>
                                  {event.type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {event.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </div>
                                {event.participants && (
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {event.participants}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">This Week</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Training</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {events.filter(e => e.type === 'training').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-900">Games</span>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {events.filter(e => e.type === 'game').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Meetings</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {events.filter(e => e.type === 'meeting').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Events</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {events.filter(e => e.type === 'event').length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Events</span>
                <span className="font-semibold text-gray-900">{events.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Teams Involved</span>
                <span className="font-semibold text-gray-900">
                  {new Set(events.map(e => e.team)).size}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Participants</span>
                <span className="font-semibold text-gray-900">
                  {events.reduce((sum, e) => sum + (e.participants || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}