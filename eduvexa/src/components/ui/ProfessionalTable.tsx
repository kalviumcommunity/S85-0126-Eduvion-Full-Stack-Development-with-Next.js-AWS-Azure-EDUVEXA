import React from 'react';

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface ProfessionalTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  hover?: boolean;
  striped?: boolean;
  compact?: boolean;
}

export default function ProfessionalTable<T>({
  data,
  columns,
  className = '',
  hover = true,
  striped = true,
  compact = false,
}: ProfessionalTableProps<T>) {
  const tableStyles = 'w-full border-collapse';
  const headerStyles = 'text-left text-xs font-medium text-neutral-700 uppercase tracking-wider bg-neutral-50';
  const cellStyles = compact ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-sm text-neutral-600';
  const rowHoverStyles = hover ? 'hover:bg-neutral-50' : '';
  const stripedStyles = striped ? 'even:bg-neutral-50/50' : '';

  return (
    <div className={`overflow-hidden border border-neutral-200 rounded-xl ${className}`}>
      <table className={tableStyles}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`${headerStyles} ${column.className || ''}`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-surface-0 divide-y divide-neutral-200">
          {data.map((row, index) => (
            <tr
              key={index}
              className={`${rowHoverStyles} ${stripedStyles} transition-colors duration-150`}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`${cellStyles} ${column.className || ''}`}
                >
                  {column.render 
                    ? column.render(row[column.key], row)
                    : String(row[column.key] || '')
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}
