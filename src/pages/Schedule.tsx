import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, HelpCircle, Plus } from 'lucide-react';
import { eventsApi } from '../lib/events-api';
import { useAuth } from '../contexts/AuthContext';
import type { Event, EventRsvp, Team } from '../types/database';

export function Schedule() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<Record<string, EventRsvp>>({});
  const [filter, setFilter] = useState<'all' | 'game' | 'training' | 'general'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'training' as 'game' | 'training' | 'general',
    event_date: '',
    event_time: '',
    location: '',
    opponent: '',
    home_away: 'home' as 'home' | 'away',
    target_teams: [] as string[],
  });

  useEffect(() => {
    loadEvents();
    loadTeams();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsApi.getEvents();
      setEvents(data);

      // Load RSVPs for all events
      const rsvpPromises = data.map(event => eventsApi.getUserRsvp(event.id));
      const rsvpResults = await Promise.all(rsvpPromises);
      
      const rsvpMap: Record<string, EventRsvp> = {};
      rsvpResults.forEach((rsvp, index) => {
        if (rsvp) {
          rsvpMap[data[index].id] = rsvp;
        }
      });
      setRsvps(rsvpMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadTeams = async () => {
    try {
      const teams = await eventsApi.getUserTeams();
      setUserTeams(teams);

      // If admin, also load all teams
      if (user?.role === 'admin') {
        const all = await eventsApi.getAllTeams();
        setAllTeams(all);
      }
    } catch (err) {
      console.error('Failed to load teams:', err);
    }
  };

  const handleCreateEvent = async () => {
    try {
      setError(null);

      // Validation
      if (!formData.title || !formData.event_date || !formData.event_time || !formData.location) {
        setError('Please fill in all required fields');
        return;
      }

      if (formData.event_type === 'game' && !formData.opponent) {
        setError('Please enter opponent name for game events');
        return;
      }

      if (formData.event_type === 'game' && formData.target_teams.length !== 1) {
        setError('Game events must be assigned to exactly one team');
        return;
      }

      // Combine date and time
      const eventDateTime = new Date(`${formData.event_date}T${formData.event_time}`).toISOString();

      const newEvent = await eventsApi.createEvent({
        title: formData.title,
        event_type: formData.event_type,
        event_date: eventDateTime,
        location: formData.location,
        opponent: formData.event_type === 'game' ? formData.opponent : undefined,
        home_away: formData.event_type === 'game' ? formData.home_away : undefined,
        target_teams: formData.target_teams,
        target_roles: [],
        target_divisions: [],
        target_age_groups: [],
      });

      setEvents([...events, newEvent]);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      event_type: 'training',
      event_date: '',
      event_time: '',
      location: '',
      opponent: '',
      home_away: 'home',
      target_teams: [],
    });
  };

  const handleRsvp = async (eventId: string, status: 'going' | 'not_going' | 'maybe') => {
    try {
      const rsvp = await eventsApi.setRsvp(eventId, status);
      setRsvps({ ...rsvps, [eventId]: rsvp });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update RSVP');
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    return event.event_type === filter;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => 
    new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'training':
        return 'bg-blue-100 text-blue-700';
      case 'game':
        return 'bg-green-100 text-green-700';
      case 'general':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRsvpIcon = (eventId: string) => {
    const rsvp = rsvps[eventId];
    const status = rsvp?.status || 'no_response';
    
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

  const getEventTitle = (event: Event) => {
    if (event.event_type !== 'game' || !event.opponent) {
      return event.title;
    }

    // Get team name from target_teams
    const teamId = event.target_teams[0];
    const team = userTeams.find(t => t.id === teamId) || allTeams.find(t => t.id === teamId);
    const teamName = team?.name || 'Your Team';

    if (event.home_away === 'home') {
      return `${teamName} vs ${event.opponent}`;
    } else {
      return `${event.opponent} vs ${teamName}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0091f3] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-4">
        <div className="border-l-8 border-[#06b6d4] pl-4">
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 text-sm">Team Events</p>
        </div>
        
        {/* New Event Button */}
        {(user?.role === 'admin' || user?.role === 'coach' || user?.role === 'manager') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0077cc] transition-colors"
          >
            <Plus className="w-5 h-5" />
            New
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

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
          onClick={() => setFilter('game')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'game'
              ? 'bg-[#0091f3] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Games
        </button>
        <button
          onClick={() => setFilter('general')}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === 'general'
              ? 'bg-[#0091f3] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          General
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="rounded-lg shadow p-4 border border-gray-200"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{getEventTitle(event)}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getTypeColor(event.event_type)}`}>
                    {event.event_type}
                  </span>
                </div>
              </div>
              {getRsvpIcon(event.id)}
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(event.event_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatTime(event.event_date)}</span>
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
                  onClick={() => handleRsvp(event.id, 'going')}
                  className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    rsvps[event.id]?.status === 'going'
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Going
                </button>
                <button
                  onClick={() => handleRsvp(event.id, 'maybe')}
                  className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    rsvps[event.id]?.status === 'maybe'
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  Maybe
                </button>
                <button
                  onClick={() => handleRsvp(event.id, 'not_going')}
                  className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    rsvps[event.id]?.status === 'not_going'
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

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-full flex items-start justify-center p-4 py-8">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create Event</h2>

              <div className="space-y-4">
                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type *
                  </label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  >
                    <option value="training">Training</option>
                    <option value="game">Game</option>
                    <option value="general">General</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                    placeholder="e.g., Team Training Session"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                    placeholder="e.g., Rangers Training Ground"
                  />
                </div>

                {/* Game-specific fields */}
                {formData.event_type === 'game' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opponent *
                      </label>
                      <input
                        type="text"
                        value={formData.opponent}
                        onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                        placeholder="e.g., City FC"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Home or Away *
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, home_away: 'home' })}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            formData.home_away === 'home'
                              ? 'bg-[#0091f3] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Home
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, home_away: 'away' })}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            formData.home_away === 'away'
                              ? 'bg-[#0091f3] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Away
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Team Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team{formData.event_type === 'game' ? ' *' : ' (optional)'}
                  </label>
                  <select
                    value={formData.target_teams[0] || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      target_teams: e.target.value ? [e.target.value] : [] 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  >
                    <option value="">All teams</option>
                    {(user?.role === 'admin' ? allTeams : userTeams).map(team => (
                      <option key={team.id} value={team.id}>
                        {team.age_group} {team.name}
                      </option>
                    ))}
                  </select>
                  {formData.event_type === 'game' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Game events must be assigned to exactly one team
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  className="flex-1 px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0077cc] transition-colors"
                >
                  Create Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
