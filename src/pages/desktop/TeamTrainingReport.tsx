import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportFilters } from '../../components/reporting/ReportFilters';
import { ReportTable } from '../../components/reporting/ReportTable';
import { ExportButton } from '../../components/reporting/ExportButton';
import { reportingApi, ReportFilters as Filters, TeamTrainingRow } from '../../lib/reporting-api';

export function TeamTrainingReport() {
  const navigate = useNavigate();
  const [data, setData] = useState<TeamTrainingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (appliedFilters: Filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await reportingApi.getTeamTraining(appliedFilters);
      setData(result);
    } catch (err) {
      console.error('Error loading team training:', err);
      setError('Failed to load team training history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    loadData(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    loadData({});
  };

  // Calculate skill coverage
  const skillCoverage = data.reduce((acc, row) => {
    acc[row.skillCategory] = (acc[row.skillCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const columns = [
    { key: 'teamName', label: 'Team' },
    { key: 'ageGroup', label: 'Age Group' },
    { key: 'lessonName', label: 'Lesson' },
    { key: 'skillCategory', label: 'Skill Category' },
    { key: 'dateDelivered', label: 'Date Delivered' },
    { key: 'coachName', label: 'Coach' },
    { key: 'lessonVersion', label: 'Version' },
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/desktop/reporting')}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reports
        </button>
      </div>

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Team Training History</h1>
        <p className="text-gray-600 mt-2">
          Ensure balanced skill development and identify training gaps
        </p>
      </div>

      {/* Filters */}
      <ReportFilters
        availableFilters={['team', 'ageGroup', 'dateRange', 'skillCategory']}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Skill Coverage Summary */}
      {!loading && !error && Object.keys(skillCoverage).length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Skill Coverage</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(skillCoverage)
              .sort(([, a], [, b]) => b - a)
              .map(([skill, count]) => (
                <div key={skill} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{skill}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
          </div>
          <div className="flex gap-2 mt-4">
            <ExportButton
              format="csv"
              data={data}
              columns={columns}
              filename={`team-training-${new Date().toISOString().split('T')[0]}`}
            />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-red-800">{error}</p>
              <button
                onClick={() => loadData(filters)}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <ReportTable
        columns={columns}
        data={data}
        loading={loading}
      />
    </div>
  );
}
