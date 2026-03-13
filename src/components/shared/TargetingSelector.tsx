import React, { useState, useEffect } from 'react';
import { Users, User, Search, X } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  age_group: string;
  division: string;
  team_type: string;
}

interface TeamMember {
  user_id: string;
  first_name: string;
  last_name: string;
  role: string;
  team_id: string;
}

export interface TargetingData {
  target_roles: string[];
  target_team_types: string[];
  target_divisions: string[];
  target_age_groups: string[];
  target_team_ids: string[];
  target_user_ids: string[];
}

interface TargetingSelectorProps {
  value: TargetingData;
  onChange: (data: TargetingData) => void;
  enableIndividualSelection?: boolean;
  title?: string;
  description?: string;
}

export function TargetingSelector({
  value,
  onChange,
  enableIndividualSelection = false,
  title = "Who should see this?",
  description = "leave empty for all users"
}: TargetingSelectorProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);

  useEffect(() => {
    fetchTeams();
    if (enableIndividualSelection) {
      fetchAllTeamMembers();
    }
  }, [enableIndividualSelection]);

  const fetchTeams = async () => {
    try {
      const { supabase } = await import('../../lib/supabase');
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, age_group, division, team_type')
        .order('age_group');

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchAllTeamMembers = async () => {
    try {
      const { supabase } = await import('../../lib/supabase');
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          user_id,
          team_id,
          users!inner(first_name, last_name, role)
        `);

      if (error) throw error;
      
      const members: TeamMember[] = (data || []).map((row: any) => ({
        user_id: row.user_id,
        team_id: row.team_id,
        first_name: row.users.first_name,
        last_name: row.users.last_name,
        role: row.users.role,
      }));
      
      setTeamMembers(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const toggleArrayValue = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter(v => v !== value);
    } else {
      return [...array, value];
    }
  };

  const updateTargeting = (field: keyof TargetingData, newValue: string[]) => {
    onChange({
      ...value,
      [field]: newValue
    });
  };

  // Filter users based on search and selected teams
  const filteredUsers = teamMembers.filter(member => {
    // If specific teams are selected, only show users from those teams
    if (value.target_team_ids.length > 0 && !value.target_team_ids.includes(member.team_id)) {
      return false;
    }
    
    // Apply search filter
    if (userSearch.trim()) {
      const searchTerm = userSearch.toLowerCase();
      const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
      return fullName.includes(searchTerm);
    }
    
    return true;
  });

  // Get selected user names for display
  const getSelectedUserNames = () => {
    return value.target_user_ids.map(userId => {
      const member = teamMembers.find(m => m.user_id === userId);
      return member ? `${member.first_name} ${member.last_name}` : userId;
    });
  };

  return (
    <div className="border-b border-gray-200 pb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        {title} ({description})
      </h3>

      {/* User Roles */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">User Roles</label>
        <div className="flex flex-wrap gap-2">
          {['coach', 'manager', 'admin', 'player', 'caregiver'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => updateTargeting('target_roles', toggleArrayValue(value.target_roles, role))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                value.target_roles.includes(role)
                  ? 'bg-[#0091f3] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Team Types */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Team Types</label>
        <div className="flex flex-wrap gap-2">
          {['First Kicks', 'Fun Football', 'Junior', 'Youth', 'Senior'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateTargeting('target_team_types', toggleArrayValue(value.target_team_types, type))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                value.target_team_types.includes(type)
                  ? 'bg-[#0091f3] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Divisions */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Divisions</label>
        <div className="flex flex-wrap gap-2">
          {['Community', 'Academy'].map((division) => (
            <button
              key={division}
              type="button"
              onClick={() => updateTargeting('target_divisions', toggleArrayValue(value.target_divisions, division))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                value.target_divisions.includes(division)
                  ? 'bg-[#0091f3] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {division}
            </button>
          ))}
        </div>
      </div>

      {/* Age Groups */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Age Groups</label>
        <div className="flex flex-wrap gap-2">
          {['U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17'].map((age) => (
            <button
              key={age}
              type="button"
              onClick={() => updateTargeting('target_age_groups', toggleArrayValue(value.target_age_groups, age))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                value.target_age_groups.includes(age)
                  ? 'bg-[#0091f3] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* Specific Teams */}
      <div className={enableIndividualSelection ? 'mb-4' : ''}>
        <label className="block text-sm font-medium text-gray-700 mb-2">Specific Teams</label>
        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
          {teams.map((team) => (
            <label key={team.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={value.target_team_ids.includes(team.id)}
                onChange={() => updateTargeting('target_team_ids', toggleArrayValue(value.target_team_ids, team.id))}
                className="w-4 h-4 text-[#0091f3] border-gray-300 rounded focus:ring-[#0091f3]"
              />
              <span className="ml-2 text-sm text-gray-700">{team.age_group} {team.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Individual Users - Only show if enabled */}
      {enableIndividualSelection && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Individual Players</label>
            <button
              type="button"
              onClick={() => setShowUserSearch(!showUserSearch)}
              className="text-sm text-[#0091f3] hover:text-[#0077cc] flex items-center gap-1"
            >
              <User className="w-4 h-4" />
              {showUserSearch ? 'Hide' : 'Add Players'}
            </button>
          </div>

          {/* Selected users display */}
          {value.target_user_ids.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {getSelectedUserNames().map((name, index) => (
                <span
                  key={value.target_user_ids[index]}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#0091f3] text-white text-xs rounded-full"
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => updateTargeting('target_user_ids', value.target_user_ids.filter(id => id !== value.target_user_ids[index]))}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* User search */}
          {showUserSearch && (
            <div className="border border-gray-200 rounded-lg p-2">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
                />
              </div>
              
              <div className="max-h-32 overflow-y-auto space-y-1">
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-2">
                    {value.target_team_ids.length > 0 ? 'No players in selected teams' : 'No players found'}
                  </p>
                ) : (
                  filteredUsers.map((member) => {
                    const team = teams.find(t => t.id === member.team_id);
                    return (
                      <label key={member.user_id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value.target_user_ids.includes(member.user_id)}
                          onChange={() => updateTargeting('target_user_ids', toggleArrayValue(value.target_user_ids, member.user_id))}
                          className="w-4 h-4 text-[#0091f3] border-gray-300 rounded focus:ring-[#0091f3]"
                        />
                        <div className="ml-2 flex-1">
                          <div className="text-sm text-gray-900">{member.first_name} {member.last_name}</div>
                          <div className="text-xs text-gray-500">
                            {team ? `${team.age_group} ${team.name}` : 'Unknown Team'} • {member.role}
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}