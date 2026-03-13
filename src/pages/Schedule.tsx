import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, HelpCircle, Plus, Users, Bell } from 'lucide-react';
import { eventsApi } from '../lib/events-api';
import { messagingApi } from '../lib/messaging-api';
import { useAuth } from '../contexts/AuthContext';
import { MessagingProvider } from '../contexts/MessagingContext';
import { ComposeForm } from '../components/messaging/ComposeForm';
import type { Event, EventRsvp, Team } from '../types/database';

export function Schedule() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<Record<string, EventRsvp>>({});
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>({});
  const [totalMemberCounts, setTotalMemberCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<'all' | 'game' | 'training' | 'general'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);

  // Send Reminder modal state
  const [reminderEvent, setReminderEvent] = useState<Event | null>(null);

  // Decline reason modal state
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineEventId, setDeclineEventId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState<'late' | 'sick' | 'injured' | 'holiday' | 'other'>('sick');
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

      // Load attendee counts
      const counts = await eventsApi.getAttendeeCounts(data.map(e => e.id));
      setAttendeeCounts(counts);

      // Load total eligible member counts
      const totals = await eventsApi.getTotalMemberCounts(data);
      setTotalMemberCounts(totals);
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

      if (editingEventId) {
        // Update existing event
        const oldEvent = events.find(e => e.id === editingEventId);
        const updatedEvent = await eventsApi.updateEvent(editingEventId, {
          title: formData.title,
          event_type: formData.event_type,
          event_date: eventDateTime,
          location: formData.location,
          opponent: formData.event_type === 'game' ? formData.opponent : undefined,
          home_away: formData.event_type === 'game' ? formData.home_away : undefined,
          target_teams: formData.target_teams,
        });

        setEvents(events.map(e => e.id === editingEventId ? updatedEvent : e));

        // Send change notification if event details changed
        if (oldEvent && formData.target_teams.length > 0) {
          await sendChangeNotification(oldEvent, updatedEvent, formData.target_teams[0]);
        }
      } else {
        // Create new event
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
      }

      setIsModalOpen(false);
      setEditingEventId(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
    }
  };

  const handleEditEvent = (event: Event) => {
    // Extract time from ISO date
    const eventDate = new Date(event.event_date);
    const dateStr = eventDate.toISOString().split('T')[0];
    const timeStr = eventDate.toTimeString().slice(0, 5);

    setFormData({
      title: event.title,
      event_type: event.event_type,
      event_date: dateStr,
      event_time: timeStr,
      location: event.location,
      opponent: event.opponent || '',
      home_away: event.home_away || 'home',
      target_teams: event.target_teams || [],
    });
    setEditingEventId(event.id);
    setIsModalOpen(true);
  };

  const sendChangeNotification = async (oldEvent: Event, newEvent: Event, teamId: string) => {
    console.log('sendChangeNotification called', { oldEvent, newEvent, teamId });
    
    const changes: string[] = [];
    
    if (oldEvent.title !== newEvent.title) changes.push(`Title: ${oldEvent.title} → ${newEvent.title}`);
    if (oldEvent.event_date !== newEvent.event_date) {
      const oldDate = new Date(oldEvent.event_date);
      const newDate = new Date(newEvent.event_date);
      changes.push(`Date/Time: ${formatDate(oldDate.toISOString())} ${formatTime(oldDate.toISOString())} → ${formatDate(newDate.toISOString())} ${formatTime(newDate.toISOString())}`);
    }
    if (oldEvent.location !== newEvent.location) changes.push(`Location: ${oldEvent.location} → ${newEvent.location}`);
    if (oldEvent.opponent !== newEvent.opponent) changes.push(`Opponent: ${oldEvent.opponent} → ${newEvent.opponent}`);

    console.log('Changes detected:', changes);

    if (changes.length === 0) {
      console.log('No changes detected, skipping notification');
      return;
    }

    try {
      console.log('Sending message to team:', teamId);
      // Send automatic message to team about event changes
      const message = await messagingApi.createMessage({
        title: `Event Updated: ${newEvent.title}`,
        body: `The following details have changed:\n\n${changes.join('\n')}`,
        team_id: teamId,
        targeting_type: 'whole_team',
        recipient_user_ids: [],
      });
      console.log('Message sent successfully:', message);
    } catch (err) {
      console.error('Failed to send change notification:', err);
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
    if (status === 'not_going') {
      setDeclineEventId(eventId);
      setDeclineReason('sick');
      setDeclineModalOpen(true);
      return;
    }
    try {
      const oldStatus = rsvps[eventId]?.status;
      const rsvp = await eventsApi.setRsvp(eventId, status);
      setRsvps({ ...rsvps, [eventId]: rsvp });
      // Update attendee count locally
      let count = attendeeCounts[eventId] || 0;
      if (oldStatus === 'going' && status !== 'going') count--;
      if (oldStatus !== 'going' && status === 'going') count++;
      setAttendeeCounts({ ...attendeeCounts, [eventId]: Math.max(0, count) });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update RSVP');
    }
  };

  const handleDeclineConfirm = async () => {
    if (!declineEventId) return;
    try {
      const oldStatus = rsvps[declineEventId]?.status;
      const rsvp = await eventsApi.setRsvp(declineEventId, 'not_going', declineReason);
      setRsvps({ ...rsvps, [declineEventId]: rsvp });
      if (oldStatus === 'going') {
        const count = (attendeeCounts[declineEventId] || 1) - 1;
        setAttendeeCounts({ ...attendeeCounts, [declineEventId]: Math.max(0, count) });
      }
      setDeclineModalOpen(false);
      setDeclineEventId(null);
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
    const teamName = team ? `${team.age_group} ${team.name}` : 'Your Team';

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
      <div className="space-y-2">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            className="rounded-lg shadow-sm px-3 py-2 border border-gray-200"
            style={{ backgroundColor: 'rgba(6, 182, 212, 0.2)' }}
          >
            {/* Title row */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{getEventTitle(event)}</h3>
                <span className={`px-1.5 py-0 rounded text-[10px] font-medium capitalize flex-shrink-0 ${getTypeColor(event.event_type)}`}>
                  {event.event_type}
                </span>
              </div>
              {getRsvpIcon(event.id)}
            </div>

            {/* Details row - single line */}
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-1.5">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(event.event_date)}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(event.event_date)}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
            </div>

            {/* Attendees row */}
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <Users className="w-3 h-3" />
              <span>{attendeeCounts[event.id] || 0}/{totalMemberCounts[event.id] || '?'} attending</span>
            </div>

            {/* RSVP Buttons - compact */}
            <div className="flex gap-1.5">
              <button
                onClick={() => handleRsvp(event.id, 'going')}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  rsvps[event.id]?.status === 'going'
                    ? 'bg-green-500 text-white'
                    : 'bg-white/70 text-gray-600 border border-gray-200 hover:bg-green-50'
                }`}
              >
                <CheckCircle className="w-3 h-3" />
                Going
              </button>
              <button
                onClick={() => handleRsvp(event.id, 'maybe')}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  rsvps[event.id]?.status === 'maybe'
                    ? 'bg-gray-500 text-white'
                    : 'bg-white/70 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-3 h-3" />
                Maybe
              </button>
              <button
                onClick={() => handleRsvp(event.id, 'not_going')}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                  rsvps[event.id]?.status === 'not_going'
                    ? 'bg-red-500 text-white'
                    : 'bg-white/70 text-gray-600 border border-gray-200 hover:bg-red-50'
                }`}
              >
                <XCircle className="w-3 h-3" />
                Can't Go
              </button>
            </div>

            {/* Send Reminder Button - visible to coach/manager/admin */}
            {(user?.role === 'coach' || user?.role === 'manager' || user?.role === 'admin') && (
              <div className="flex gap-1.5 mt-1.5">
                <button
                  onClick={() => setReminderEvent(event)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30 hover:bg-[#06b6d4]/30 transition-colors"
                >
                  <Bell className="w-3 h-3" />
                  Send Reminder
                </button>
                <button
                  onClick={() => handleEditEvent(event)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{editingEventId ? 'Edit Event' : 'Create Event'}</h2>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                {/* Team Selection - FIRST */}
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

                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type *
                  </label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => {
                      const newType = e.target.value as any;
                      setFormData({ 
                        ...formData, 
                        event_type: newType,
                        title: newType === 'game' ? 'Game' : formData.title
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  >
                    <option value="training">Training</option>
                    <option value="game">Game</option>
                    <option value="general">General</option>
                  </select>
                </div>

                {/* Title - only show for non-game events */}
                {formData.event_type !== 'game' && (
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
                )}

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
                  <select
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  >
                    <option value="">Select time</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="08:30">8:30 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="09:30">9:30 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="14:30">2:30 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="15:30">3:30 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="16:30">4:30 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  >
                    <option value="">Select venue</option>
                    <option value="Fred Taylor Park">Fred Taylor Park</option>
                    <option value="Huapai Domain">Huapai Domain</option>
                    <option value="Massey Park">Massey Park</option>
                    <option value="Rosebank Park">Rosebank Park</option>
                    <option value="Waitakere Stadium">Waitakere Stadium</option>
                    <option value="Henderson Park">Henderson Park</option>
                    <option value="Ranui Domain">Ranui Domain</option>
                    <option value="Custom">Custom (enter below)</option>
                  </select>
                  {formData.location === 'Custom' && (
                    <input
                      type="text"
                      placeholder="Enter custom venue"
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3] mt-2"
                    />
                  )}
                </div>

                {/* Field Number - for games only */}
                {formData.event_type === 'game' && formData.location && formData.location !== 'Custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Number (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., No 5"
                      onChange={(e) => {
                        const fieldNum = e.target.value;
                        const baseVenue = formData.location.split(' No')[0];
                        setFormData({ 
                          ...formData, 
                          location: fieldNum ? `${baseVenue} No ${fieldNum}` : baseVenue
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                    />
                  </div>
                )}

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
              </div>
            </div>

            {/* Pinned Footer with Buttons */}
            <div className="p-6 pt-4 border-t border-gray-200 bg-white rounded-b-lg">
              <div className="flex gap-3">
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
                  {editingEventId ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Reason Modal */}
      {declineModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Can't make it?</h3>
            <p className="text-sm text-gray-500 mb-4">Please select a reason:</p>
            <div className="space-y-2 mb-5">
              {(['late', 'sick', 'injured', 'holiday', 'other'] as const).map((reason) => (
                <button
                  key={reason}
                  onClick={() => setDeclineReason(reason)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    declineReason === reason
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {reason.charAt(0).toUpperCase() + reason.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setDeclineModalOpen(false); setDeclineEventId(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclineConfirm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Reminder Modal */}
      {reminderEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-full flex items-start justify-center p-4 py-8">
            <div className="max-w-md w-full">
              <MessagingProvider>
                <ComposeForm
                  prefillTitle={`Reminder: ${getEventTitle(reminderEvent)}`}
                  prefillBody={`Hi team,\n\nThis is a reminder about ${getEventTitle(reminderEvent)} on ${formatDate(reminderEvent.event_date)} at ${formatTime(reminderEvent.event_date)}.\n\nLocation: ${reminderEvent.location}\n\nPlease update your RSVP if you haven't already.`}
                  prefillTeamId={reminderEvent.target_teams[0]}
                  onClose={() => setReminderEvent(null)}
                  onSent={() => setReminderEvent(null)}
                />
              </MessagingProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
