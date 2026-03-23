import { useState } from 'react';
import { exportToCSV, exportToPDF, ExportOptions } from '../../lib/export-utils';

interface ExportButtonProps {
  format: 'csv' | 'pdf';
  data: any[];
  columns: { key: string; label: string }[];
  filename: string;
  disabled?: boolean;
}

export function ExportButton({ format, data, columns, filename, disabled }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);

      const options: ExportOptions = {
        format,
        data,
        columns,
        filename,
      };

      if (format === 'csv') {
        exportToCSV(options);
      } else if (format === 'pdf') {
        await exportToPDF(options);
      }

      // Show success toast (optional - could use a toast library)
      console.log(`${format.toUpperCase()} export successful`);
    } catch (err) {
      console.error('Export error:', err);
      setError(`Failed to export ${format.toUpperCase()}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={disabled || loading || data.length === 0}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          format === 'csv'
            ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
            : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export {format.toUpperCase()}
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
