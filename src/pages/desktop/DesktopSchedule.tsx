import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, Search, CheckCircle, XCircle, HelpCircle, Bell } from 'lucide-react';
import { MessagingProvider } from '../../contexts/MessagingContext';
import { ComposeForm } from '../../components/messaging/ComposeForm';

// Note: DesktopSchedule currently uses mock data. The "Send Reminder" button
// opens a ComposeForm pre-filled with event details. Once this page is
// connected to real data (with target_teams), the prefillTeamId will be
// populated from the event's target_teams array.

interface Event {
  id: string;
  type: 'training' | 'match' | 'meeting' | 'social';
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  team?: string;
  attendees: {
    total: number;
    going: number;
    maybe: number;
    notGoing: number;
  };
}

const mockEvents: Event[] = [
  {
    id: '1',
    type: 'training',
    title: 'Team Training Session',
    description: 'Focus on passing and positioning drills',
    date: '2026-03-08',
    time: '4:00 PM - 5:30 PM',
    location: 'Rangers Training Ground',
    team: 'U12 Boys',
    attendees: { total: 18, going: 15, maybe: 2, notGoing: 1 },
  },
  {
    id: '2',
    type: 'match',
    title: 'Match vs City FC',
    date: '2026-03-08',
    time: '2:00 PM',
    location: 'City Sports Complex',
    team: 'U12 Boys',
    attendees: { total: 18, going: 16, maybe: 1, notGoing: 1 },
  },
  {
    id: '3',
    type: 'training',
    title: 'Skills Development',
    description: 'Individual skills and ball control',
    date: '2026-03-10',
    time: '4:00 PM - 5:30 PM',
    location: 'Rangers Training Ground',
    team: 'U10 Girls',
    attendees: { total: 15, going: 12, maybe: 3, notGoing: 0 },
  },
  {
    id: '4',
    type: 'match',
    title: 'Match vs Coastal United',
    date: '2026-03-15',
    time: '10:00 AM',
    location: 'Rangers Home Ground',
    team: 'U12 Boys',
    attendees: { total: 18, going: 0, maybe: 0, notGoing: 0 },
  },
  {
    id: '5',
    type: 'meeting',
    title: 'Parent-Coach Meeting',
    description: 'Season review and upcoming events',
    date: '2026-03-12',
    time: '6:00 PM - 7:00 PM',
    location: 'Clubhouse',
    attendees: { total: 25, going: 18, maybe: 5, notGoing: 2 },
  },
];

export function DesktopSchedule() {
  const [filter, setFilter] = useState<'all' | 'training' | 'match' | 'meeting'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [reminderEvent, setReminderEvent] = useState<Event | null>(null);

  const filteredEvents = mockEvents.filter((event) => {
    const matchesFilter = filter === 'all' || event.type === filter;
    const matchesSearch =
      searchTerm === '' ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.team?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'training':
        return 'bg-blue-100 text-blue-700';
      case 'match':
        return 'bg-green-100 text-green-700';
      case 'meeting':
        return 'bg-purple-100 text-purple-700';
      case 'social':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#06b6d4]">Schedule Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0081d9] transition-colors">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Panel - Events List */}
        <div className="w-1/2 flex flex-col bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-[#0091f3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('training')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'training'
                    ? 'bg-[#0091f3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Training
              </button>
              <button
                onClick={() => setFilter('match')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'match'
                    ? 'bg-[#0091f3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Matches
              </button>
              <button
                onClick={() => setFilter('meeting')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'meeting'
                    ? 'bg-[#0091f3] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Meetings
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sortedEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedEvent?.id === event.id
                    ? 'border-[#0091f3] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                    {event.team && (
                      <p className="text-sm text-gray-600">{event.team}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{event.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    <span>{event.attendees.going}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-yellow-600" />
                    <span>{event.attendees.maybe}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>{event.attendees.notGoing}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Event Details */}
        <div className="w-1/2 bg-white rounded-lg shadow p-6">
          {selectedEvent ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEvent.title}
                  </h2>
                  {selectedEvent.team && (
                    <p className="text-gray-600">{selectedEvent.team}</p>
                  )}
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Event Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(selectedEvent.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getTypeColor(selectedEvent.type)}`}>
                        {selectedEvent.type}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Attendance</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{selectedEvent.attendees.total}</p>
                        <p className="text-xs text-gray-600 mt-1">Total</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{selectedEvent.attendees.going}</p>
                        <p className="text-xs text-gray-600 mt-1">Going</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-yellow-600">{selectedEvent.attendees.maybe}</p>
                        <p className="text-xs text-gray-600 mt-1">Maybe</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{selectedEvent.attendees.notGoing}</p>
                        <p className="text-xs text-gray-600 mt-1">Not Going</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <button
                    onClick={() => setReminderEvent(selectedEvent)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/30 hover:bg-[#06b6d4]/20 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    Send Reminder
                  </button>
                  <button className="w-full px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0081d9] transition-colors">
                    View Attendee List
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select an event to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Send Reminder Modal */}
      {reminderEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <MessagingProvider>
              <ComposeForm
                prefillTitle={`Reminder: ${reminderEvent.title}`}
                prefillBody={`Hi team,\n\nThis is a reminder about ${reminderEvent.title} on ${formatDate(reminderEvent.date)} at ${reminderEvent.time}.\n\nLocation: ${reminderEvent.location}\n\nPlease update your RSVP if you haven't already.`}
                onClose={() => setReminderEvent(null)}
                onSent={() => setReminderEvent(null)}
              />
            </MessagingProvider>
          </div>
        </div>
      )}
    </div>
  );
}
