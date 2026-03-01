import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, CheckCircle, XCircle, HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

export function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 26)); // Feb 26, 2026
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'training' | 'match' | 'meeting'>('all');
  const [userRsvp, setUserRsvp] = useState<Record<number, 'going' | 'not-going' | 'pending'>>({
    1: 'pending',
    2: 'going',
    3: 'pending',
    4: 'going',
    5: 'pending',
    6: 'pending',
    7: 'pending',
  });
  const [showReasonModal, setShowReasonModal] = useState<number | null>(null);
  const [notGoingReasons, setNotGoingReasons] = useState<Record<number, string>>({});

  const events = [
    {
      id: 1,
      title: "U14 Blue Training Session",
      type: "training" as const,
      date: "Feb 26, 2026",
      time: "4:00 PM - 5:30 PM",
      location: "West Coast Stadium - Field 1",
      attendees: 18,
      attendeeList: [
        { name: "Coach Sarah Williams", role: "Coach", status: "going" as const },
        { name: "Manager Tom Anderson", role: "Manager", status: "going" as const },
        { name: "Alex Thompson", role: "Player", status: "going" as const },
        { name: "Jordan Martinez", role: "Player", status: "going" as const },
        { name: "Sam Chen", role: "Player", status: "not-going" as const, reason: "Sick" },
        { name: "Riley Johnson", role: "Player", status: "going" as const },
        { name: "Morgan Davis", role: "Player", status: "pending" as const },
        { name: "Casey O'Brien", role: "Player", status: "going" as const },
        { name: "Taylor Williams", role: "Player", status: "pending" as const },
        { name: "Dakota Brown", role: "Player", status: "going" as const },
      ],
    },
    {
      id: 2,
      title: "U12 White vs Harbor United",
      type: "match" as const,
      date: "Feb 28, 2026",
      time: "11:30 AM - 1:00 PM",
      location: "West Coast Stadium - Field 2",
      attendees: 16,
      attendeeList: [
        { name: "Coach Mike Roberts", role: "Coach", status: "going" as const },
        { name: "Manager Lisa Chen", role: "Manager", status: "going" as const },
        { name: "Avery Wilson", role: "Player", status: "going" as const },
        { name: "Quinn Anderson", role: "Player", status: "going" as const },
        { name: "Cameron Lee", role: "Player", status: "going" as const },
        { name: "Jamie Robinson", role: "Player", status: "not-going" as const, reason: "Injured" },
        { name: "River Thompson", role: "Player", status: "pending" as const },
        { name: "Skylar Martinez", role: "Player", status: "going" as const },
      ],
    },
    {
      id: 3,
      title: "Coaches Meeting",
      type: "meeting" as const,
      date: "Feb 27, 2026",
      time: "7:00 PM - 8:30 PM",
      location: "Clubhouse - Conference Room",
      attendees: 12,
      attendeeList: [
        { name: "Head Coach David Miller", role: "Coach", status: "going" as const },
        { name: "Coach Sarah Williams", role: "Coach", status: "going" as const },
        { name: "Coach Mike Roberts", role: "Coach", status: "going" as const },
        { name: "Coach Emma Thompson", role: "Coach", status: "pending" as const },
        { name: "Coach James Wilson", role: "Coach", status: "going" as const },
        { name: "Manager Tom Anderson", role: "Manager", status: "not-going" as const, reason: "Holiday" },
      ],
    },
    {
      id: 4,
      title: "U16 Rangers Training",
      type: "training" as const,
      date: "Feb 27, 2026",
      time: "5:00 PM - 6:30 PM",
      location: "West Coast Stadium - Field 1",
      attendees: 20,
      attendeeList: [
        { name: "Coach Emma Thompson", role: "Coach", status: "going" as const },
        { name: "Assistant Coach Mark Davis", role: "Coach", status: "going" as const },
        { name: "Blake Morrison", role: "Player", status: "going" as const },
        { name: "Charlie Rodriguez", role: "Player", status: "going" as const },
        { name: "Devon Singh", role: "Player", status: "pending" as const },
        { name: "Ellis Park", role: "Player", status: "going" as const },
      ],
    },
    {
      id: 5,
      title: "U10 Blue Training Session",
      type: "training" as const,
      date: "Feb 26, 2026",
      time: "3:00 PM - 4:00 PM",
      location: "West Coast Stadium - Field 2",
      attendees: 14,
      attendeeList: [
        { name: "Coach James Wilson", role: "Coach", status: "going" as const },
        { name: "Finley Cooper", role: "Player", status: "going" as const },
        { name: "Harper Bailey", role: "Player", status: "going" as const },
        { name: "Indigo Reed", role: "Player", status: "not-going" as const, reason: "Late" },
        { name: "Jules Morgan", role: "Player", status: "pending" as const },
      ],
    },
    {
      id: 6,
      title: "Peninsula FC vs U16 Rangers",
      type: "match" as const,
      date: "Mar 1, 2026",
      time: "2:00 PM - 4:00 PM",
      location: "Peninsula Sports Complex",
      attendees: 20,
      attendeeList: [
        { name: "Coach Emma Thompson", role: "Coach", status: "going" as const },
        { name: "Manager Sarah Lopez", role: "Manager", status: "going" as const },
        { name: "Blake Morrison", role: "Player", status: "going" as const },
        { name: "Charlie Rodriguez", role: "Player", status: "pending" as const },
        { name: "Devon Singh", role: "Player", status: "going" as const },
      ],
    },
    {
      id: 7,
      title: "Parent-Coach Meeting",
      type: "meeting" as const,
      date: "Mar 5, 2026",
      time: "6:00 PM - 7:30 PM",
      location: "Clubhouse - Main Hall",
      attendees: 45,
      attendeeList: [
        { name: "Head Coach David Miller", role: "Coach", status: "going" as const },
        { name: "Coach Sarah Williams", role: "Coach", status: "going" as const },
        { name: "Parent Rep - John Smith", role: "Parent", status: "going" as const },
        { name: "Parent Rep - Maria Garcia", role: "Parent", status: "pending" as const },
      ],
    },
  ];

  const getEventColor = (type: string) => {
    switch (type) {
      case 'training':
        return 'bg-[#0091f3] text-white';
      case 'match':
        return 'bg-[#ea7800] text-white';
      case 'meeting':
        return 'bg-[#545859] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getEventBorderColor = (type: string) => {
    switch (type) {
      case 'training':
        return 'border-l-[#0091f3]';
      case 'match':
        return 'border-l-[#ea7800]';
      case 'meeting':
        return 'border-l-[#545859]';
      default:
        return 'border-l-gray-500';
    }
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="px-4 py-6 pb-20">
      {/* Header */}
      <div className="mb-6 border-l-8 border-[#06b6d4] pl-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Schedule</h1>
        <p className="text-sm text-gray-600">Training sessions and events</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          className={`px-4 py-2 ${
            activeFilter === 'all' ? 'bg-[#0091f3] text-white' : 'bg-white text-gray-700 border border-gray-200'
          } rounded-full text-sm font-medium whitespace-nowrap`}
          onClick={() => setActiveFilter('all')}
        >
          All Events
        </button>
        <button
          className={`px-4 py-2 ${
            activeFilter === 'training' ? 'bg-[#0091f3] text-white' : 'bg-white text-gray-700 border border-gray-200'
          } rounded-full text-sm font-medium whitespace-nowrap`}
          onClick={() => setActiveFilter('training')}
        >
          Training
        </button>
        <button
          className={`px-4 py-2 ${
            activeFilter === 'match' ? 'bg-[#ea7800] text-white' : 'bg-white text-gray-700 border border-gray-200'
          } rounded-full text-sm font-medium whitespace-nowrap`}
          onClick={() => setActiveFilter('match')}
        >
          Matches
        </button>
        <button
          className={`px-4 py-2 ${
            activeFilter === 'meeting' ? 'bg-[#545859] text-white' : 'bg-white text-gray-700 border border-gray-200'
          } rounded-full text-sm font-medium whitespace-nowrap`}
          onClick={() => setActiveFilter('meeting')}
        >
          Meetings
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {events
          .filter(event => activeFilter === 'all' || event.type === activeFilter)
          .map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className={`h-1 ${getEventColor(event.type)}`} />
              <button
                onClick={() => setSelectedEventId(selectedEventId === event.id ? null : event.id)}
                className="w-full text-left p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-sm text-gray-900 flex-1">{event.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      event.type === 'training' ? 'bg-blue-100 text-[#0091f3]' :
                      event.type === 'match' ? 'bg-orange-100 text-[#ea7800]' :
                      'bg-gray-100 text-[#545859]'
                    }`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                      selectedEventId === event.id ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
              </button>

              {/* RSVP Selection */}
              <div className="px-4 pb-4">
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserRsvp({ ...userRsvp, [event.id]: 'going' });
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      userRsvp[event.id] === 'going'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4 mx-auto mb-1" />
                    Going
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserRsvp({ ...userRsvp, [event.id]: 'not-going' });
                      setShowReasonModal(event.id);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      userRsvp[event.id] === 'not-going'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <XCircle className="w-4 h-4 mx-auto mb-1" />
                    Not Going
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserRsvp({ ...userRsvp, [event.id]: 'pending' });
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      userRsvp[event.id] === 'pending'
                        ? 'bg-gray-400 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 mx-auto mb-1" />
                    Maybe
                  </button>
                </div>
              </div>

              {/* Expanded Attendee List */}
              {selectedEventId === event.id && (
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                  <h5 className="font-bold text-xs text-gray-700 mb-3 uppercase tracking-wide">
                    Attendee Status
                  </h5>
                  <div className="space-y-2">
                    {event.attendeeList.map((attendee, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{attendee.name}</p>
                          <p className="text-xs text-gray-500">{attendee.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {attendee.status === 'going' && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {attendee.status === 'not-going' && (
                            <>
                              <span className="text-xs font-medium text-red-600">
                                {'reason' in attendee ? attendee.reason : ''}
                              </span>
                              <XCircle className="w-5 h-5 text-red-500" />
                            </>
                          )}
                          {attendee.status === 'pending' && (
                            <HelpCircle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Reason Modal */}
      {showReasonModal !== null && (
        <div className="fixed inset-0 bg-[#0091f3] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Reason for Not Attending</h3>
              <p className="text-sm text-gray-600 mb-4">Please select a reason:</p>
              
              <div className="space-y-2">
                {['Late', 'Sick', 'Injured', 'Holiday', 'Other'].map((reason) => (
                  <button
                    key={reason}
                    onClick={() => {
                      setNotGoingReasons({ ...notGoingReasons, [showReasonModal]: reason });
                      setShowReasonModal(null);
                    }}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-left font-medium text-gray-900 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={() => setShowReasonModal(null)}
                className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}