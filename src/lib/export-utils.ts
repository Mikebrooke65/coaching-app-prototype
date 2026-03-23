// ============================================================================
// Export Utilities for Reporting
// ============================================================================

export interface ExportOptions {
  format: 'csv' | 'pdf';
  filename: string;
  data: any[];
  columns: { key: string; label: string }[];
}

/**
 * Export data to CSV format
 */
export function exportToCSV(options: ExportOptions): void {
  const { data, columns, filename } = options;

  // Create CSV header from column labels
  const header = columns.map(col => col.label).join(',');

  // Create CSV rows
  const rows = data.map(row => 
    columns.map(col => {
      const value = row[col.key];
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        return '';
      }
      
      // Handle arrays (join with semicolon)
      if (Array.isArray(value)) {
        return `"${value.join('; ')}"`;
      }
      
      // Handle strings with commas or quotes
      if (typeof value === 'string') {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          // Escape quotes by doubling them
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }
      
      // Handle numbers and booleans
      return String(value);
    }).join(',')
  );

  // Combine header and rows
  const csv = [header, ...rows].join('\n');

  // Create blob and trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
}

/**
 * Format data for export (helper function)
 */
export function formatDataForExport(data: any[], columns: { key: string; label: string }[]): any[] {
  return data.map(row => {
    const formatted: any = {};
    columns.forEach(col => {
      formatted[col.key] = row[col.key];
    });
    return formatted;
  });
}

/**
 * Export data to PDF format (Phase 3 - placeholder)
 */
export async function exportToPDF(options: ExportOptions): Promise<void> {
  // TODO: Implement PDF export in Phase 3
  // Will use jsPDF and jspdf-autotable
  console.warn('PDF export not yet implemented');
  throw new Error('PDF export coming in Phase 3');
}
