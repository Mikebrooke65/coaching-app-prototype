import { useAuth } from '../../contexts/AuthContext';

export function DesktopLanding() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#0091f3] mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">--</p>
          <p className="text-sm text-gray-500 mt-2">Active users in system</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Total Teams</h3>
          <p className="text-3xl font-bold text-indigo-600">--</p>
          <p className="text-sm text-gray-500 mt-2">Registered teams</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Lessons</h3>
          <p className="text-3xl font-bold text-indigo-600">--</p>
          <p className="text-sm text-gray-500 mt-2">Published lessons</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Sessions</h3>
          <p className="text-3xl font-bold text-indigo-600">--</p>
          <p className="text-sm text-gray-500 mt-2">Available sessions</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Deliveries This Week</h3>
          <p className="text-3xl font-bold text-indigo-600">--</p>
          <p className="text-sm text-gray-500 mt-2">Lesson deliveries</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Feedback Received</h3>
          <p className="text-3xl font-bold text-indigo-600">--</p>
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
