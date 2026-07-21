import React from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from 'lucide-react';
import { KpiMetricTrend } from '@workspace/api-client-react';
import { motion } from 'framer-motion';

export interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: KpiMetricTrend;
  changePercent?: number;
  sparkline?: number[];
  icon?: React.ReactNode;
  loading?: boolean;
}

export function KpiCard({ title, value, unit, trend, changePercent, sparkline, icon, loading }: KpiCardProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between min-h-[140px] animate-pulse">
        <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-muted rounded w-1/4"></div>
      </div>
    );
  }

  const trendColor = trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';
  const TrendIcon = trend === 'up' ? ArrowUpIcon : trend === 'down' ? ArrowDownIcon : MinusIcon;

  const sparklineData = sparkline ? sparkline.map((v, i) => ({ value: v, index: i })) : [];
  const sparklineColor = trend === 'up' ? 'hsl(var(--success))' : trend === 'down' ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border p-4 rounded-xl flex flex-col justify-between min-h-[140px] relative overflow-hidden"
    >
      <div className="flex justify-between items-start z-10">
        <h3 className="text-sm font-medium text-secondary-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      <div className="z-10 mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-mono font-semibold text-foreground tracking-tight">{value}</span>
        {unit && <span className="text-sm font-medium text-muted-foreground ml-1">{unit}</span>}
      </div>

      <div className="flex justify-between items-end mt-2 z-10">
        {trend && changePercent !== undefined && (
          <div className={`flex items-center text-xs font-medium ${trendColor}`}>
            <TrendIcon className="w-3 h-3 mr-1" />
            <span>{Math.abs(changePercent)}%</span>
            <span className="text-muted-foreground ml-1 font-normal">vs last month</span>
          </div>
        )}
      </div>

      {sparkline && sparkline.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-12 opacity-30 z-0 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`grad-${title.replace(/\s+/g, '-')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sparklineColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={sparklineColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={sparklineColor} 
                fill={`url(#grad-${title.replace(/\s+/g, '-')})`} 
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
