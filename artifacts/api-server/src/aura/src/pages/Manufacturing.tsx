import React from 'react';
import { 
  useGetManufacturingKpis, 
  useGetQualityDrift,
  useGetDefectAnalysis,
  useGetInspectionResults
} from '@workspace/api-client-react';
import { KpiCard } from '@/components/ui-custom/KpiCard';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Factory, CheckCircle, AlertTriangle, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ReferenceArea, BarChart, Bar } from 'recharts';

export default function Manufacturing() {
  const { data: kpis, isLoading: kpisLoading } = useGetManufacturingKpis();
  const { data: drift, isLoading: driftLoading } = useGetQualityDrift({ days: 30 });
  const { data: defects, isLoading: defectsLoading } = useGetDefectAnalysis();
  const { data: inspections, isLoading: inspectionsLoading } = useGetInspectionResults();

  const inspColumns = [
    { header: 'Line', accessor: (row: any) => <span className="font-mono">{row.line}</span> },
    { header: 'Shift', accessor: (row: any) => <span className="capitalize">{row.shift}</span> },
    { header: 'Units', accessor: 'unitsInspected' },
    { header: 'Defects', accessor: (row: any) => (
      <span className={row.defectsFound > 0 ? 'text-destructive font-mono' : 'font-mono'}>{row.defectsFound}</span>
    )},
    { header: 'Pass Rate', accessor: (row: any) => (
      <span className={`font-mono ${row.passRate < 98 ? 'text-warning' : 'text-success'}`}>{row.passRate}%</span>
    )},
    { header: 'Inspector', accessor: 'inspector', className: 'text-muted-foreground' },
    { header: 'Anomaly', accessor: (row: any) => (
      row.anomalyDetected ? <StatusBadge status="warning" className="bg-warning/10 text-warning border-warning/20">Detected</StatusBadge> : <span className="text-muted-foreground text-xs">—</span>
    )},
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manufacturing Quality Intelligence</h1>
        <p className="text-muted-foreground mt-1 text-sm font-mono">Production line control and defect analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Overall Equipment Effectiveness" 
          value={kpis?.oee.value ?? 0} 
          unit="%"
          trend={kpis?.oee.trend}
          changePercent={kpis?.oee.changePercent}
          icon={<Factory className="w-5 h-5 text-primary" />}
          loading={kpisLoading}
        />
        <KpiCard 
          title="First-Pass Yield" 
          value={kpis?.firstPassYield.value ?? 0} 
          unit="%"
          trend={kpis?.firstPassYield.trend}
          changePercent={kpis?.firstPassYield.changePercent}
          icon={<CheckCircle className="w-5 h-5 text-success" />}
          loading={kpisLoading}
        />
        <KpiCard 
          title="Defect Rate" 
          value={kpis?.defectRate.value ?? 0} 
          unit="%"
          trend={kpis?.defectRate.trend}
          changePercent={kpis?.defectRate.changePercent}
          icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
          loading={kpisLoading}
        />
        <KpiCard 
          title="Mean Time To Repair (MTTR)" 
          value={kpis?.mttr.value ?? 0} 
          unit="hrs"
          trend={kpis?.mttr.trend}
          changePercent={kpis?.mttr.changePercent}
          icon={<TrendingDown className="w-5 h-5 text-warning" />}
          loading={kpisLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-medium mb-4 flex items-center gap-2">
            Quality Control Chart (Defect Rate)
          </h2>
          <div className="h-[300px]">
            {driftLoading ? <div className="w-full h-full bg-muted animate-pulse rounded"></div> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={drift}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  />
                  {drift && drift.length > 0 && (
                    <ReferenceArea 
                      y1={drift[0].target} 
                      y2={drift[0].upperLimit} 
                      fill="hsl(var(--warning))" 
                      fillOpacity={0.1} 
                    />
                  )}
                  <Line type="step" dataKey="defectRate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
                  <Line type="monotone" dataKey="target" stroke="hsl(var(--success))" strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="upperLimit" stroke="hsl(var(--destructive))" strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-medium mb-4">Defect Category Breakdown</h2>
          <div className="h-[300px]">
            {defectsLoading ? <div className="w-full h-full bg-muted animate-pulse rounded"></div> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defects} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="category" stroke="hsl(var(--foreground))" fontSize={11} tickLine={false} axisLine={false} width={100} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-lg font-medium mb-4">Recent Inspection Results</h2>
        <DataTable 
          columns={inspColumns} 
          data={inspections || []} 
          loading={inspectionsLoading} 
        />
      </div>
    </div>
  );
}
