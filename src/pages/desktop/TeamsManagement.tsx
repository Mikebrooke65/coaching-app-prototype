import { useState } from 'react';

// Mock teams data
const mockTeams = [
  {
    id: '1',
    name: 'Rangers U10 Blue',
    ageGroup: 'U9-U12',
    division: 'Community',
    gender: 'Mixed',
    coach: 'John Smith',
    coachId: 'c1',
    playerCount: 12,
    season: '2026',
  },
  {
    id: '2',
    name: 'Rangers U12 Red',
    ageGroup: 'U9-U12',
    division: 'Academy',
    gender: 'Mixed',
    coach: 'Sarah Johnson',
    coachId: 'c2',
    playerCount: 15,
    season: '2026',
  },
  {
    id: '3',
    name: 'Rangers U14 Girls',
    ageGroup: 'U13-U17',
    division: 'Community',
    gender: 'Female',
    coach: 'Mike Brown',
    coachId: 'c3',
    playerCount: 10,
    season: '2026',
  },
];

// Mock coaches
const mockCoaches = [
  { id: 'c1', name: 'John Smith' },
  { id: 'c2', name: 'Sarah Johnson' },
  { id: 'c3', name: 'Mike Brown' },
  { id: 'c4', name: 'Emma Wilson' },
];

export function TeamsManagement() {
  const [teams, setTeams] = useState(mockTeams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAge, setFilterAge] = useState('all');
  const [filterDivision, setFilterDivision] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: 'U9-U12',
    division: 'Community',
    gender: 'Mixed',
    coachId: '',
    season: '2026',
  });

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.coach.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAge = filterAge === 'all' || team.ageGroup === filterAge;
    const matchesDivision = filterDivision === 'all' || team.division === filterDivision;
    return matchesSearch && matchesAge && matchesDivision;
  });

  const handleOpenModal = (team?: any) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        ageGroup: team.ageGroup,
        division: team.division,
        gender: team.gender,
        coachId: team.coachId,
        season: team.season,
      });
    } else {
      setEditingTeam(null);
      setFormData({
        name: '',
        ageGroup: 'U9-U12',
        division: 'Community',
        gender: 'Mixed',
        coachId: '',
        season: '2026',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const handleSave = () => {
    const coach = mockCoaches.find((c) => c.id === formData.coachId);
    
    if (editingTeam) {
      // Update existing team
      setTeams(teams.map((t) =>
        t.id === editingTeam.id
          ? { ...t, ...formData, coach: coach?.name || 'Unassigned' }
          : t
      ));
    } else {
      // Create new team
      const newTeam = {
        id: `t${teams.length + 1}`,
        ...formData,
        coach: coach?.name || 'Unassigned',
        playerCount: 0,
      };
      setTeams([...teams, newTeam]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      setTeams(teams.filter((t) => t.id !== teamId));
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
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coach
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Players
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
                    <div className="text-sm text-gray-500">Season {team.season}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#0091f3] bg-opacity-10 text-[#0091f3]">
                      {team.ageGroup}
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
                    {team.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {team.coach}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {team.playerCount}
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

        {filteredTeams.length === 0 && (
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
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
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
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                  >
                    <option value="Mixed">Mixed</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Season *
                  </label>
                  <input
                    type="text"
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                    placeholder="2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Coach
                </label>
                <select
                  value={formData.coachId}
                  onChange={(e) => setFormData({ ...formData, coachId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                >
                  <option value="">Unassigned</option>
                  {mockCoaches.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.name}
                    </option>
                  ))}
                </select>
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
