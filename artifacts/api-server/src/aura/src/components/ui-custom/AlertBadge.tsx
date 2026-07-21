import React from 'react';
import { AlertSeverity } from '@workspace/api-client-react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AlertBadgeProps {
  severity: AlertSeverity | 'critical' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function AlertBadge({ severity, children, className }: AlertBadgeProps) {
  const Icon = severity === 'critical' ? AlertTriangle : severity === 'warning' ? AlertCircle : Info;
  
  const colors = {
    critical: 'bg-destructive/10 text-destructive border-destructive/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    info: 'bg-primary/10 text-primary border-primary/20',
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border', colors[severity], className)}>
      <Icon className="w-3 h-3 mr-1.5" />
      {children}
    </span>
  );
}
