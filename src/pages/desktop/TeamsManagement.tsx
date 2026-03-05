import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Team {
  id: string;
  name: string;
  age_group: string;
  division: string;
  training_ground: string;
  training_time: string;
  coach?: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
  };
  player_count?: number;
}

interface Coach {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}

export function TeamsManagement() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAge, setFilterAge] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age_group: 'U9-U12',
    division: 'Community',
    training_ground: '',
    training_time: '',
    coach_id: '',
  });

  // Fetch teams and coaches
  useEffect(() => {
    fetchTeams();
    fetchCoaches();
  }, []);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoaches = async () => {
    try {
      // Fetch users with coach or admin role
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, role')
        .in('role', ['coach', 'admin'])
        .eq('active', true)
        .order('first_name');

      if (error) throw error;
      setCoaches(data || []);
    } catch (error) {
      console.error('Error fetching coaches:', error);
    }
  };

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAge = filterAge === 'all' || team.age_group === filterAge;
    const matchesDivision = filterDivision === 'all' || team.division === filterDivision;
    return matchesSearch && matchesAge && matchesDivision;
  });

  const handleOpenModal = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        age_group: team.age_group,
        division: team.division,
        training_ground: team.training_ground,
        training_time: team.training_time,
        coach_id: '',
      });
    } else {
      setEditingTeam(null);
      setFormData({
        name: '',
        age_group: 'U9-U12',
        division: 'Community',
        training_ground: '',
        training_time: '',
        coach_id: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const handleSave = async () => {
    try {
      if (editingTeam) {
        // Update existing team
        const { error } = await supabase
          .from('teams')
          .update({
            name: formData.name,
            age_group: formData.age_group,
            division: formData.division,
            training_ground: formData.training_ground,
            training_time: formData.training_time,
          })
          .eq('id', editingTeam.id);

        if (error) throw error;
      } else {
        // Create new team
        const { error } = await supabase
          .from('teams')
          .insert({
            name: formData.name,
            age_group: formData.age_group,
            division: formData.division,
            training_ground: formData.training_ground,
            training_time: formData.training_time,
          });

        if (error) throw error;
      }

      // Refresh teams list
      await fetchTeams();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Failed to save team. Please try again.');
    }
  };

  const handleDelete = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;

      // Refresh teams list
      await fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team. Please try again.');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teams Management</h1>
            <p className="text-gray-600 mt-1">Manage team rosters and assignments</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#0091f3] text-white rounded-lg font-medium hover:bg-[#0077cc] flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Team
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search teams or coaches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
          >
            <option value="all">All Age Groups</option>
            <option value="U4-U6">U4-U6</option>
            <option value="U7-U8">U7-U8</option>
            <option value="U9-U12">U9-U12</option>
            <option value="U13-U17">U13-U17</option>
          </select>

          <select
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
          >
            <option value="all">All Divisions</option>
            <option value="Community">Community</option>
            <option value="Academy">Academy</option>
          </select>
        </div>
      </div>

      {/* Teams Table */}
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0091f3]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Division
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Training Ground
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Training Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeams.map((team) => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{team.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#0091f3] bg-opacity-10 text-[#0091f3]">
                        {team.age_group}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        team.division === 'Academy'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {team.division}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {team.training_ground}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {team.training_time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(team)}
                        className="text-[#0091f3] hover:text-[#0077cc] mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(team.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredTeams.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-500">No teams found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingTeam ? 'Edit Team' : 'Add New Team'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  placeholder="e.g., Rangers U10 Blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Group *
                  </label>
                  <select
                    value={formData.age_group}
                    onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  >
                    <option value="U4-U6">U4-U6 (First Kicks)</option>
                    <option value="U7-U8">U7-U8 (Fun Football)</option>
                    <option value="U9-U12">U9-U12 (Junior)</option>
                    <option value="U13-U17">U13-U17 (Youth)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Division *
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  >
                    <option value="Community">Community</option>
                    <option value="Academy">Academy/Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Training Ground *
                  </label>
                  <input
                    type="text"
                    value={formData.training_ground}
                    onChange={(e) => setFormData({ ...formData, training_ground: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                    placeholder="e.g., West Coast Stadium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Training Time *
                  </label>
                  <input
                    type="text"
                    value={formData.training_time}
                    onChange={(e) => setFormData({ ...formData, training_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                    placeholder="e.g., Saturdays 9:00 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Coach (Optional)
                </label>
                <select
                  value={formData.coach_id}
                  onChange={(e) => setFormData({ ...formData, coach_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                >
                  <option value="">Unassigned</option>
                  {coaches.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.first_name} {coach.last_name} ({coach.role})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Both coaches and admins can be assigned to teams
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#0091f3] text-white rounded-lg font-medium hover:bg-[#0077cc]"
              >
                {editingTeam ? 'Save Changes' : 'Create Team'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
