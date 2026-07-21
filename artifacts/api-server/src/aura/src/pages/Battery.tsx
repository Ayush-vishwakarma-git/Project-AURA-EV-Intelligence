import React, { useState } from 'react';
import { 
  useGetBatteryAssets, 
  useGetBatteryHealthSummary, 
  useGetBatteryDegradationTrend,
  useGetBatteryAlerts
} from '@workspace/api-client-react';
import { KpiCard } from '@/components/ui-custom/KpiCard';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Battery, Zap, Clock, Activity, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, LineChart, Line, CartesianGrid, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';

export default function BatteryIntelligence() {
  const { data: summary, isLoading: summaryLoading } = useGetBatteryHealthSummary();
  const { data: assets, isLoading: assetsLoading } = useGetBatteryAssets({ limit: 10 });
  const { data: trend, isLoading: trendLoading } = useGetBatteryDegradationTrend({ months: 12 });
  const { data: alerts, isLoading: alertsLoading } = useGetBatteryAlerts();

  const columns = [
    { header: 'Asset ID', accessor: (row: any) => <span className="font-mono text-cyan">{row.batteryId}</span> },
    { header: 'Vehicle', accessor: 'vehicleId' },
    { header: 'SOH', accessor: (row: any) => (
      <div className="flex items-center gap-2">
        <span className={`font-mono ${row.soh < 80 ? 'text-warning' : row.soh < 70 ? 'text-destructive' : 'text-success'}`}>{row.soh}%</span>
        <div className="w-16 h-1 bg-muted rounded-full">
          <div className={`h-full rounded-full ${row.soh < 80 ? 'bg-warning' : row.soh < 70 ? 'bg-destructive' : 'bg-success'}`} style={{ width: `${row.soh}%` }}></div>
        </div>
      </div>
    )},
    { header: 'Cycles', accessor: (row: any) => <span className="font-mono">{row.cycles}</span> },
    { header: 'Temp', accessor: (row: any) => (
      <span className={`font-mono ${row.temperature > 35 ? 'text-destructive' : ''}`}>{row.temperature}°C</span>
    )},
    { header: 'Status', accessor: (row: any) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Battery Asset Performance</h1>
        <p className="text-muted-foreground mt-1 text-sm font-mono">Predictive analytics and health monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Monitored Assets" 
          value={summary?.totalAssets ?? 0} 
          icon={<Battery className="w-5 h-5 text-primary" />}
          loading={summaryLoading}
        />
        <KpiCard 
          title="Average SOH" 
          value={summary?.avgSoh ?? 0} 
          unit="%"
          icon={<Activity className="w-5 h-5 text-success" />}
          loading={summaryLoading}
        />
        <KpiCard 
          title="Average RUL" 
          value={summary?.avgRul ?? 0} 
          unit="Days"
          icon={<Clock className="w-5 h-5 text-cyan" />}
          loading={summaryLoading}
        />
        <KpiCard 
          title="Critical Alerts" 
          value={alerts?.length ?? 0} 
          icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
          loading={alertsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-medium mb-4">SOH Distribution</h2>
          <div className="h-[250px]">
            {summaryLoading ? <div className="w-full h-full bg-muted animate-pulse rounded"></div> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary?.sohDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-medium mb-4 flex items-center gap-2">
            Degradation Trend
            <span className="text-[10px] bg-cyan/10 text-cyan px-2 py-0.5 rounded font-mono uppercase">AI Predicted</span>
          </h2>
          <div className="h-[250px]">
            {trendLoading ? <div className="w-full h-full bg-muted animate-pulse rounded"></div> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[60, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  />
                  <ReferenceLine y={80} stroke="hsl(var(--warning))" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Warning Threshold', fill: 'hsl(var(--warning))', fontSize: 10 }} />
                  <ReferenceLine y={70} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Critical Threshold', fill: 'hsl(var(--destructive))', fontSize: 10 }} />
                  <Line type="monotone" dataKey="avgSoh" stroke="hsl(var(--cyan))" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Asset Inventory</h2>
          <button className="text-sm text-cyan hover:underline">View All Assets</button>
        </div>
        <DataTable 
          columns={columns} 
          data={assets?.data || []} 
          loading={assetsLoading} 
        />
      </div>
    </div>
  );
}
