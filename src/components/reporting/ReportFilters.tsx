import { useState, useEffect } from 'react';
import { reportingApi, ReportFilters as Filters, FilterOptions } from '../../lib/reporting-api';

interface ReportFiltersProps {
  availableFilters: ('dateRange' | 'team' | 'coach' | 'ageGroup' | 'skillCategory' | 'minDeliveries')[];
  onApplyFilters: (filters: Filters) => void;
  onClearFilters: () => void;
}

export function ReportFilters({ availableFilters, onApplyFilters, onClearFilters }: ReportFiltersProps) {
  const [filters, setFilters] = useState<Filters>({});
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      setLoading(true);
      const options = await reportingApi.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error('Error loading filter options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleClear = () => {
    setFilters({});
    onClearFilters();
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  const ageGroups = ['U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'U17'];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFilterCount > 0 && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            {activeFilterCount} active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Range */}
        {availableFilters.includes('dateRange') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {/* Team */}
        {availableFilters.includes('team') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team
            </label>
            <select
              value={filters.teamId || ''}
              onChange={(e) => setFilters({ ...filters, teamId: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Teams</option>
              {filterOptions?.teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Coach */}
        {availableFilters.includes('coach') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coach
            </label>
            <select
              value={filters.coachId || ''}
              onChange={(e) => setFilters({ ...filters, coachId: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Coaches</option>
              {filterOptions?.coaches.map(coach => (
                <option key={coach.id} value={coach.id}>
                  {coach.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Age Group */}
        {availableFilters.includes('ageGroup') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Group
            </label>
            <select
              value={filters.ageGroup || ''}
              onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Age Groups</option>
              {ageGroups.map(age => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Skill Category */}
        {availableFilters.includes('skillCategory') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Category
            </label>
            <select
              value={filters.skillCategory || ''}
              onChange={(e) => setFilters({ ...filters, skillCategory: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Skills</option>
              {filterOptions?.skillCategories.map(skill => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Min Deliveries */}
        {availableFilters.includes('minDeliveries') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Deliveries
            </label>
            <input
              type="number"
              min="0"
              value={filters.minDeliveries || ''}
              onChange={(e) => setFilters({ ...filters, minDeliveries: parseInt(e.target.value) || undefined })}
              placeholder="e.g., 3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
