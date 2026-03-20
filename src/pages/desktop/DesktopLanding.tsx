import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Stats {
  totalUsers: number;
  totalTeams: number;
  totalLessons: number;
  totalSessions: number;
  deliveriesThisWeek: number;
  feedbackThisMonth: number;
}

export function DesktopLanding() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalTeams: 0,
    totalLessons: 0,
    totalSessions: 0,
    deliveriesThisWeek: 0,
    feedbackThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Get total users
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get total teams
      const { count: teamsCount } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true });

      // Get total lessons
      const { count: lessonsCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true });

      // Get total sessions
      const { count: sessionsCount } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true });

      // Get deliveries this week (lesson_deliveries from this week)
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);

      const { count: deliveriesCount } = await supabase
        .from('lesson_deliveries')
        .select('*', { count: 'exact', head: true })
        .gte('delivered_at', startOfWeek.toISOString());

      // Get feedback this month (game_feedback from this month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: feedbackCount } = await supabase
        .from('game_feedback')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      setStats({
        totalUsers: usersCount || 0,
        totalTeams: teamsCount || 0,
        totalLessons: lessonsCount || 0,
        totalSessions: sessionsCount || 0,
        deliveriesThisWeek: deliveriesCount || 0,
        feedbackThisMonth: feedbackCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#0091f3] mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {loading ? '...' : stats.totalUsers}
          </p>
          <p className="text-sm text-gray-500 mt-2">Active users in system</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Teams</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {loading ? '...' : stats.totalTeams}
          </p>
          <p className="text-sm text-gray-500 mt-2">Registered teams</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Lessons</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {loading ? '...' : stats.totalLessons}
          </p>
          <p className="text-sm text-gray-500 mt-2">Published lessons</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Sessions</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {loading ? '...' : stats.totalSessions}
          </p>
          <p className="text-sm text-gray-500 mt-2">Available sessions</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Deliveries This Week</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {loading ? '...' : stats.deliveriesThisWeek}
          </p>
          <p className="text-sm text-gray-500 mt-2">Lesson deliveries</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Feedback Received</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {loading ? '...' : stats.feedbackThisMonth}
          </p>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-600">Activity feed will appear here</p>
      </div>
    </div>
  );
}
