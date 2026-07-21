import React from 'react';
import { cn } from '@/lib/utils';

export function DataTable({ 
  columns, 
  data, 
  loading,
  onRowClick
}: { 
  columns: { header: string; accessor: string | ((row: any) => React.ReactNode); className?: string }[];
  data: any[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
}) {
  return (
    <div className="w-full overflow-auto rounded-lg border border-border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-sidebar font-mono border-b border-border">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className={cn("px-4 py-3 font-medium tracking-wider", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border/50">
                {columns.map((_, j) => (
                  <td key={j} className="px-4 py-4">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr 
                key={i} 
                className={cn(
                  "border-b border-border/50 hover:bg-muted/50 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col, j) => (
                  <td key={j} className={cn("px-4 py-3", col.className)}>
                    {typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
