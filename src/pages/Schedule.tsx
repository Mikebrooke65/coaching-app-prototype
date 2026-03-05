import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface Event {
  id: string;
  type: 'training' | 'match' | 'meeting' | 'social';
  title: string;
  date: string;
  time: string;
  location: string;
  rsvpStatus?: 'going' | 'not_going' | 'maybe' | 'no_response';
}

const mockEvents: Event[] = [
  {
    id: '1',
    type: 'training',
    title: 'Team Training Session',
    date: '2026-03-08',
    time: '4:00 PM - 5:30 PM',
    location: 'Rangers Training Ground',
    rsvpStatus: 'going',
  },
  {
    id: '2',
    type: 'match',
    title: 'Match vs City FC',
    date: '2026-03-08',
    time: '2:00 PM',
    location: 'City Sports Complex',
    rsvpStatus: 'going',
  },
  {
    id: '3',
    type: 'training',
    title: 'Skills Development',
    date: '2026-03-10',
    time: '4:00 PM - 5:30 PM',
    location: 'Rangers Training Ground',
    rsvpStatus: 'maybe',
  },
  {
    id: '4',
    type: 'match',
    title: 'Match vs Coastal United',
    date: '2026-03-15',
    time: '10:00 AM',
    location: 'Rangers Home Ground',
    rsvpStatus: 'no_response',
  },
  {
    id: '5',
    type: 'meeting',
    title: 'Parent-Coach Meeting',
    date: '2026-03-12',
    time: '6:00 PM - 7:00 PM',
    location: 'Clubhouse',
    rsvpStatus: 'not_going',
  },
];

export function Schedule() {
  const [filter, setFilter] = useState<'all' | 'training' | 'match' | 'meeting'>('all');

  const filteredEvents = mockEvents.filter((event) => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
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

  const getRsvpIcon = (status?: string) => {
    switch (status) {
      case 'going':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'not_going':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'maybe':
        return <HelpCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="border-l-8 border-[#06b6d4] pl-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-[#0091f3] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('training')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'training'
              ? 'bg-[#0091f3] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Training
        </button>
        <button
          onClick={() => setFilter('match')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'match'
              ? 'bg-[#0091f3] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Matches
        </button>
        <button
          onClick={() => setFilter('meeting')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'meeting'
              ? 'bg-[#0091f3] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Meetings
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{event.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
              </div>
              {getRsvpIcon(event.rsvpStatus)}
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            </div>

            {/* RSVP Buttons */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Your Response:</p>
              <div className="flex gap-2">
                <button
                  className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    event.rsvpStatus === 'going'
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Going
                </button>
                <button
                  className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    event.rsvpStatus === 'maybe'
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Maybe
                </button>
                <button
                  className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    event.rsvpStatus === 'not_going'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Can't Go
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No events scheduled</p>
        </div>
      )}
    </div>
  );
}
