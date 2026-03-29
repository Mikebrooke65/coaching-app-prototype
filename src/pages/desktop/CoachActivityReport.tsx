import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ReportFilters } from '../../components/reporting/ReportFilters';
import { ReportTable } from '../../components/reporting/ReportTable';
import { ExportButton } from '../../components/reporting/ExportButton';
import { reportingApi, ReportFilters as Filters, CoachActivityRow } from '../../lib/reporting-api';

export function CoachActivityReport() {
  const navigate = useNavigate();
  const [data, setData] = useState<CoachActivityRow[]>([]);
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
      const result = await reportingApi.getCoachActivity(appliedFilters);
      setData(result);
    } catch (err) {
      console.error('Error loading coach activity:', err);
      setError('Failed to load coach activity. Please try again.');
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

  // Calculate averages
  const avgLessons = data.length > 0 
    ? (data.reduce((sum, row) => sum + row.lessonsDelivered, 0) / data.length).toFixed(1)
    : '0';
  
  const avgFeedback = data.length > 0
    ? (data.reduce((sum, row) => sum + row.gameFeedbackCount, 0) / data.length).toFixed(1)
    : '0';

  const columns = [
    { key: 'coachName', label: 'Coach Name' },
    { key: 'lessonsDelivered', label: 'Lessons Delivered' },
    { key: 'gameFeedbackCount', label: 'Game Feedback' },
    { key: 'lastActivityDate', label: 'Last Activity' },
    { key: 'teamsCoached', label: 'Teams Coached' },
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
        <h1 className="text-3xl font-bold text-gray-900">Coach Activity Summary</h1>
        <p className="text-gray-600 mt-2">
          Monitor coach engagement and identify support needs
        </p>
      </div>

      {/* Filters */}
      <ReportFilters
        availableFilters={['dateRange', 'ageGroup', 'coach']}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Summary Stats */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Coaches</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Lessons per Coach</p>
              <p className="text-2xl font-bold text-gray-900">{avgLessons}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Game Feedback per Coach</p>
              <p className="text-2xl font-bold text-gray-900">{avgFeedback}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <ExportButton
              format="csv"
              data={data}
              columns={columns}
              filename={`coach-activity-${new Date().toISOString().split('T')[0]}`}
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
