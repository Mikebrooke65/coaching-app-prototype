import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ReportFilters } from '../../components/reporting/ReportFilters';
import { ReportTable } from '../../components/reporting/ReportTable';
import { ExportButton } from '../../components/reporting/ExportButton';
import { reportingApi, ReportFilters as Filters, LessonDeliveryRow } from '../../lib/reporting-api';

export function LessonDeliveryReport() {
  const navigate = useNavigate();
  const [data, setData] = useState<LessonDeliveryRow[]>([]);
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
      const result = await reportingApi.getLessonDeliveries(appliedFilters);
      setData(result);
    } catch (err) {
      console.error('Error loading lesson deliveries:', err);
      setError('Failed to load lesson deliveries. Please try again.');
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

  const columns = [
    { key: 'lessonName', label: 'Lesson Name' },
    { key: 'skillCategory', label: 'Skill Category' },
    { key: 'coachName', label: 'Coach' },
    { key: 'teamName', label: 'Team' },
    { key: 'ageGroup', label: 'Age Group' },
    { key: 'dateDelivered', label: 'Date Delivered' },
    { key: 'lessonVersion', label: 'Version' },
    { key: 'notes', label: 'Notes' },
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
        <h1 className="text-3xl font-bold text-gray-900">Lesson Delivery Summary</h1>
        <p className="text-gray-600 mt-2">
          View lesson deliveries across teams and coaches
        </p>
      </div>

      {/* Filters */}
      <ReportFilters
        availableFilters={['dateRange', 'team', 'coach', 'ageGroup', 'skillCategory']}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Summary Stats */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
            <div className="flex gap-2">
              <ExportButton
                format="csv"
                data={data}
                columns={columns}
                filename={`lesson-deliveries-${new Date().toISOString().split('T')[0]}`}
              />
            </div>
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
