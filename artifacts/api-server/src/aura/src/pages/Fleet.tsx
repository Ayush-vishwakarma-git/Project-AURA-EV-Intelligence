import React from 'react';
import { 
  useGetFleetReadiness, 
  useGetFleetVehicles,
  useGetFleetFinancialSavings,
  useGetChargingAnalysis,
  useGetEvRecommendations
} from '@workspace/api-client-react';
import { KpiCard } from '@/components/ui-custom/KpiCard';
import { DataTable } from '@/components/ui-custom/DataTable';
import { StatusBadge } from '@/components/ui-custom/StatusBadge';
import { Car, Zap, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, AreaChart, Area } from 'recharts';

export default function Fleet() {
  const { data: readiness, isLoading: readinessLoading } = useGetFleetReadiness();
  const { data: vehicles, isLoading: vehiclesLoading } = useGetFleetVehicles({ limit: 10 });
  const { data: financials, isLoading: financialsLoading } = useGetFleetFinancialSavings();
  const { data: charging, isLoading: chargingLoading } = useGetChargingAnalysis();
  const { data: recommendations, isLoading: recLoading } = useGetEvRecommendations();

  const vehicleColumns = [
    { header: 'Vehicle ID', accessor: (row: any) => <span className="font-mono text-primary">{row.vehicleId}</span> },
    { header: 'Make/Model', accessor: (row: any) => `${row.make} ${row.model}` },
    { header: 'Type', accessor: (row: any) => (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${row.type === 'BEV' ? 'bg-success/20 text-success' : row.type === 'ICE' ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary'}`}>{row.type}</span>
    )},
    { header: 'Readiness', accessor: (row: any) => (
      row.electrificationScore ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full w-16">
            <div className="h-full bg-cyan transition-all" style={{ width: `${row.electrificationScore}%` }}></div>
          </div>
          <span className="text-xs font-mono text-cyan">{row.electrificationScore}%</span>
        </div>
      ) : <span className="text-muted-foreground text-xs">—</span>
    )},
    { header: 'Status', accessor: (row: any) => <StatusBadge status={row.status} /> },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fleet Electrification Optimizer</h1>
        <p className="text-muted-foreground mt-1 text-sm font-mono">Transition planning and operational readiness.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Electrification Readiness" 
          value={readiness?.overallScore ?? 0} 
          unit="/ 100"
          icon={<TrendingUp className="w-5 h-5 text-cyan" />}
          loading={readinessLoading}
        />
        <KpiCard 
          title="Active EVs" 
          value={readiness?.evCount ?? 0} 
          icon={<Car className="w-5 h-5 text-success" />}
          loading={readinessLoading}
        />
        <KpiCard 
          title="Projected 5Yr Savings" 
          value={`$${((financials?.totalSavings ?? 0) / 1000000).toFixed(1)}M`} 
          icon={<DollarSign className="w-5 h-5 text-primary" />}
          loading={financialsLoading}
        />
        <KpiCard 
          title="Charging Utilization" 
          value={charging?.utilizationRate ?? 0} 
          unit="%"
          icon={<Zap className="w-5 h-5 text-warning" />}
          loading={chargingLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-medium mb-4">Financial Projections</h2>
            <div className="h-[300px]">
              {financialsLoading ? <div className="w-full h-full bg-muted animate-pulse rounded"></div> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financials?.projections}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Savings']}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg font-medium mb-4">Current Fleet Status</h2>
            <DataTable 
              columns={vehicleColumns} 
              data={vehicles?.data || []} 
              loading={vehiclesLoading} 
            />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-medium flex items-center gap-2 mb-4 text-cyan">
              <Zap className="w-4 h-4" /> AI Recommendations
            </h2>
            <div className="space-y-4">
              {recLoading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
                 ))
              ) : recommendations?.slice(0, 3).map(rec => (
                <div key={rec.id} className="border border-border/50 bg-background rounded-lg p-4 hover:border-cyan/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{rec.make} {rec.model}</h3>
                      <span className="text-xs text-muted-foreground">{rec.type}</span>
                    </div>
                    <span className="bg-cyan/10 text-cyan text-xs font-mono px-2 py-1 rounded">Score: {rec.score}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div><span className="text-muted-foreground block">Range</span> <span className="font-mono">{rec.range} mi</span></div>
                    <div><span className="text-muted-foreground block">Charge Spd</span> <span className="font-mono">{rec.chargingSpeed} kW</span></div>
                    <div className="col-span-2"><span className="text-muted-foreground block">5Yr TCO</span> <span className="font-mono text-success">${rec.tco5Year.toLocaleString()}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
