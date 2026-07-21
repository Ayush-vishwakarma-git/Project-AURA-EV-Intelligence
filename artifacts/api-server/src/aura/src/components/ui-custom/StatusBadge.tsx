import React from 'react';
import { cn } from '@/lib/utils';

export function StatusBadge({ status, className }: { status: string, className?: string }) {
  const s = status.toLowerCase();
  
  let colors = 'bg-muted text-muted-foreground border-border';
  
  if (s === 'healthy' || s === 'active' || s === 'completed' || s === 'operational') {
    colors = 'bg-success/10 text-success border-success/20';
  } else if (s === 'warning' || s === 'in-progress' || s === 'degraded' || s === 'charging') {
    colors = 'bg-warning/10 text-warning border-warning/20';
  } else if (s === 'critical' || s === 'error' || s === 'offline' || s === 'failed') {
    colors = 'bg-destructive/10 text-destructive border-destructive/20';
  } else if (s === 'maintenance' || s === 'idle' || s === 'pending') {
    colors = 'bg-primary/10 text-primary border-primary/20';
  } else if (s === 'processing') {
    colors = 'bg-cyan/10 text-cyan border-cyan/20 animate-pulse';
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border', colors, className)}>
      {status}
    </span>
  );
}

export function ConfidenceBar({ value, className }: { value: number, className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-cyan transition-all" style={{ width: `${value}%` }}></div>
      </div>
      <span className="text-xs font-mono text-cyan">{value}%</span>
    </div>
  );
}
