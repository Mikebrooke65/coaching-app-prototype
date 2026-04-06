import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ReportFilters } from '../../components/reporting/ReportFilters';
import { ReportTable } from '../../components/reporting/ReportTable';
import { ExportButton } from '../../components/reporting/ExportButton';
import { DrillDownModal } from '../../components/reporting/DrillDownModal';
import { 
  reportingApi, 
  ReportFilters as Filters, 
  SessionRatingsRow,
  FeedbackDetail 
} from '../../lib/reporting-api';

export function SessionRatingsReport() {
  const navigate = useNavigate();
  const [data, setData] = useState<SessionRatingsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  
  // Drill-down modal state
  const [selectedSession, setSelectedSession] = useState<SessionRatingsRow | null>(null);
  const [feedbackDetails, setFeedbackDetails] = useState<FeedbackDetail[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (appliedFilters: Filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await reportingApi.getSessionRatings(appliedFilters);
      setData(result);
    } catch (err) {
      console.error('Error loading session ratings:', err);
      setError('Failed to load session ratings. Please try again.');
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

  const handleRowClick = async (row: SessionRatingsRow) => {
    setSelectedSession(row);
    setDetailsLoading(true);
    try {
      const details = await reportingApi.getSessionFeedbackDetails(row.sessionId);
      setFeedbackDetails(details);
    } catch (err) {
      console.error('Error loading feedback details:', err);
      setFeedbackDetails([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedSession(null);
    setFeedbackDetails([]);
  };

  // Calculate averages
  const sessionsWithFeedback = data.filter(d => d.averageRating !== null);
  const avgRating = sessionsWithFeedback.length > 0
    ? (sessionsWithFeedback.reduce((sum, d) => sum + (d.averageRating || 0), 0) / sessionsWithFeedback.length).toFixed(1)
    : '-';

  const columns = [
    { key: 'sessionName', label: 'Session Name' },
    { key: 'sessionType', label: 'Type' },
    { key: 'skillCategory', label: 'Skill Category' },
    { key: 'deliveryCount', label: 'Times Used' },
    { key: 'feedbackCount', label: 'Feedback Count' },
    { key: 'averageRating', label: 'Avg Rating' },
  ];

  // Format data for display
  const displayData = data.map(row => ({
    ...row,
    averageRating: row.averageRating !== null ? row.averageRating.toFixed(1) : 'No feedback',
  }));

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
        <h1 className="text-3xl font-bold text-gray-900">Session Ratings</h1>
        <p className="text-gray-600 mt-2">
          Identify which sessions work well and which need improvement
        </p>
      </div>

      {/* Filters */}
      <ReportFilters
        availableFilters={['dateRange', 'skillCategory']}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Summary Stats */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sessions with Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{sessionsWithFeedback.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <ExportButton
              format="csv"
              data={displayData}
              columns={columns}
              filename={`session-ratings-${new Date().toISOString().split('T')[0]}`}
            />
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-blue-700">
          Click on a row to view detailed feedback comments for that session.
        </p>
      </div>

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
        data={displayData}
        loading={loading}
        onRowClick={(row) => handleRowClick(data.find(d => d.sessionId === row.sessionId)!)}
      />

      {/* Drill-Down Modal */}
      {selectedSession && (
        <DrillDownModal
          title={`Feedback for: ${selectedSession.sessionName}`}
          data={feedbackDetails}
          loading={detailsLoading}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
