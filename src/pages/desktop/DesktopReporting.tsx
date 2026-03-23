import { ReportCard } from '../../components/reporting/ReportCard';
import { 
  BookOpen, 
  TrendingUp, 
  Star, 
  Users, 
  Calendar, 
  MessageSquare 
} from 'lucide-react';

export function DesktopReporting() {
  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reporting Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor coaching activities and assess content effectiveness
        </p>
      </div>

      {/* Phase 1: Essential Reports */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Essential Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ReportCard
            title="Lesson Delivery Summary"
            description="View lesson deliveries across teams and coaches"
            icon={BookOpen}
            href="/desktop/reporting/lesson-deliveries"
            category="Lesson Reports"
          />
          <ReportCard
            title="Coach Activity Summary"
            description="Monitor coach engagement and identify support needs"
            icon={Users}
            href="/desktop/reporting/coach-activity"
            category="Coach Reports"
          />
          <ReportCard
            title="Team Training History"
            description="Ensure balanced skill development and identify gaps"
            icon={Calendar}
            href="/desktop/reporting/team-training"
            category="Team Reports"
          />
        </div>
      </div>

      {/* Phase 2: Feedback Analysis (Coming Soon) */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ReportCard
            title="Lesson Effectiveness"
            description="Assess lesson quality based on coach feedback"
            icon={TrendingUp}
            href="/desktop/reporting/lesson-effectiveness"
            category="Lesson Reports"
          />
          <ReportCard
            title="Session Ratings"
            description="Identify which sessions work well and need improvement"
            icon={Star}
            href="/desktop/reporting/session-ratings"
            category="Session Reports"
          />
          <ReportCard
            title="Game Feedback"
            description="View post-match analysis using 4 Moments framework"
            icon={MessageSquare}
            href="/desktop/reporting/game-feedback"
            category="Game Reports"
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-900">About Reports</h3>
            <p className="text-sm text-blue-700 mt-1">
              All reports can be filtered by date range, team, coach, and age group. 
              Export data as CSV for further analysis in Excel or other tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
