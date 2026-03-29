import { useNavigate } from 'react-router';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  category: string;
}

export function ReportCard({ title, description, icon: Icon, href, category }: ReportCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(href)}
      className="w-full text-left p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
              {category}
            </span>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
