import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ReportFilters } from '../../components/reporting/ReportFilters';
import { ExportButton } from '../../components/reporting/ExportButton';
import { reportingApi, ReportFilters as Filters, GameFeedbackRow } from '../../lib/reporting-api';

export function GameFeedbackReport() {
  const navigate = useNavigate();
  const [data, setData] = useState<GameFeedbackRow[]>([]);
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
      const result = await reportingApi.getGameFeedback(appliedFilters);
      setData(result);
    } catch (err) {
      console.error('Error loading game feedback:', err);
      setError('Failed to load game feedback. Please try again.');
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

  // Export columns for CSV
  const exportColumns = [
    { key: 'teamName', label: 'Team' },
    { key: 'gameDate', label: 'Date' },
    { key: 'opponent', label: 'Opponent' },
    { key: 'coachName', label: 'Coach' },
    { key: 'attackingWww', label: 'Attacking WWW' },
    { key: 'attackingEbi', label: 'Attacking EBI' },
    { key: 'transitionAdWww', label: 'Transition A→D WWW' },
    { key: 'transitionAdEbi', label: 'Transition A→D EBI' },
    { key: 'defendingWww', label: 'Defending WWW' },
    { key: 'defendingEbi', label: 'Defending EBI' },
    { key: 'transitionDaWww', label: 'Transition D→A WWW' },
    { key: 'transitionDaEbi', label: 'Transition D→A EBI' },
    { key: 'keyAreas', label: 'Key Areas' },
    { key: 'comments', label: 'Comments' },
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
        <h1 className="text-3xl font-bold text-gray-900">Game Feedback</h1>
        <p className="text-gray-600 mt-2">
          View post-match analysis using the 4 Moments framework
        </p>
      </div>

      {/* Filters */}
      <ReportFilters
        availableFilters={['dateRange', 'team', 'coach', 'ageGroup']}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Summary Stats */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Game Feedback Entries</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
            <div className="flex gap-2">
              <ExportButton
                format="csv"
                data={data}
                columns={exportColumns}
                filename={`game-feedback-${new Date().toISOString().split('T')[0]}`}
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

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && data.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No game feedback found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No results match your filters. Try adjusting your criteria.
          </p>
        </div>
      )}

      {/* Game Feedback Cards */}
      {!loading && !error && data.length > 0 && (
        <div className="space-y-6">
          {data.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Card Header */}
              <div className="px-6 py-4 border-b" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{feedback.teamName}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(feedback.gameDate).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                      {feedback.opponent && ` vs ${feedback.opponent}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Coach</p>
                    <p className="text-sm font-medium text-gray-900">{feedback.coachName}</p>
                  </div>
                </div>
              </div>

              {/* 4 Moments Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Attacking */}
                  <MomentCard
                    title="Attacking"
                    www={feedback.attackingWww}
                    ebi={feedback.attackingEbi}
                    color="green"
                  />

                  {/* Transition: Attack to Defend */}
                  <MomentCard
                    title="Transition: Attack → Defend"
                    www={feedback.transitionAdWww}
                    ebi={feedback.transitionAdEbi}
                    color="yellow"
                  />

                  {/* Defending */}
                  <MomentCard
                    title="Defending"
                    www={feedback.defendingWww}
                    ebi={feedback.defendingEbi}
                    color="red"
                  />

                  {/* Transition: Defend to Attack */}
                  <MomentCard
                    title="Transition: Defend → Attack"
                    www={feedback.transitionDaWww}
                    ebi={feedback.transitionDaEbi}
                    color="blue"
                  />
                </div>

                {/* Key Areas & Comments */}
                {(feedback.keyAreas || feedback.comments) && (
                  <div className="mt-4 pt-4 border-t">
                    {feedback.keyAreas && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700">Key Areas for Improvement</p>
                        <p className="text-sm text-gray-600 mt-1">{feedback.keyAreas}</p>
                      </div>
                    )}
                    {feedback.comments && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Additional Comments</p>
                        <p className="text-sm text-gray-600 mt-1">{feedback.comments}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper component for 4 Moments display
function MomentCard({ 
  title, 
  www, 
  ebi, 
  color 
}: { 
  title: string; 
  www: string | null; 
  ebi: string | null; 
  color: 'green' | 'yellow' | 'red' | 'blue';
}) {
  const colorStyles = {
    green: { bg: 'rgba(34, 197, 94, 0.1)', border: 'border-green-200', text: 'text-green-800' },
    yellow: { bg: 'rgba(234, 179, 8, 0.1)', border: 'border-yellow-200', text: 'text-yellow-800' },
    red: { bg: 'rgba(239, 68, 68, 0.1)', border: 'border-red-200', text: 'text-red-800' },
    blue: { bg: 'rgba(59, 130, 246, 0.1)', border: 'border-blue-200', text: 'text-blue-800' },
  };

  const styles = colorStyles[color];

  return (
    <div 
      className={`rounded-lg border ${styles.border} p-4`}
      style={{ backgroundColor: styles.bg }}
    >
      <h4 className={`text-sm font-semibold ${styles.text} mb-3`}>{title}</h4>
      <div className="space-y-2">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">What Went Well</p>
          <p className="text-sm text-gray-700">{www || '-'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Even Better If</p>
          <p className="text-sm text-gray-700">{ebi || '-'}</p>
        </div>
      </div>
    </div>
  );
}
