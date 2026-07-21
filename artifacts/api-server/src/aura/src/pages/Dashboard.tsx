import React from 'react';
import { useGetDashboardKpis, useGetDashboardActivity, useGetAlerts } from '@workspace/api-client-react';
import { KpiCard } from '@/components/ui-custom/KpiCard';
import { AlertBadge } from '@/components/ui-custom/AlertBadge';
import { Car, Battery, Network, Factory, Leaf, BrainCircuit, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = useGetDashboardKpis();
  const { data: activity, isLoading: activityLoading } = useGetDashboardActivity();
  const { data: alerts, isLoading: alertsLoading } = useGetAlerts({ severity: 'critical', limit: 5 });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Global Command Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">System fully operational. All sectors reporting.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono bg-success/10 text-success px-3 py-1.5 rounded border border-success/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            SYSTEM NORMAL
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Fleet Size" 
          value={kpis?.fleetSize.value ?? 0} 
          trend={kpis?.fleetSize.trend}
          changePercent={kpis?.fleetSize.changePercent}
          sparkline={kpis?.fleetSize.sparkline}
          icon={<Car className="w-5 h-5 text-primary" />}
          loading={kpisLoading}
        />
        <KpiCard 
          title="Avg. Battery Health (SOH)" 
          value={kpis?.avgBatterySoh.value ?? 0} 
          unit="%"
          trend={kpis?.avgBatterySoh.trend}
          changePercent={kpis?.avgBatterySoh.changePercent}
          sparkline={kpis?.avgBatterySoh.sparkline}
          icon={<Battery className="w-5 h-5 text-success" />}
          loading={kpisLoading}
        />
        <KpiCard 
          title="Supply Chain Risk" 
          value={kpis?.supplyChainRiskScore.value ?? 0} 
          unit="/ 100"
          trend={kpis?.supplyChainRiskScore.trend}
          changePercent={kpis?.supplyChainRiskScore.changePercent}
          sparkline={kpis?.supplyChainRiskScore.sparkline}
          icon={<Network className="w-5 h-5 text-warning" />}
          loading={kpisLoading}
        />
        <KpiCard 
          title="Carbon Reduction" 
          value={kpis?.carbonReduction.value ?? 0} 
          unit="%"
          trend={kpis?.carbonReduction.trend}
          changePercent={kpis?.carbonReduction.changePercent}
          sparkline={kpis?.carbonReduction.sparkline}
          icon={<Leaf className="w-5 h-5 text-success" />}
          loading={kpisLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              Global Activity Feed
            </h2>
            <div className="space-y-4">
              {activityLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-muted mt-2"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : (
                activity?.map((item, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={item.id} 
                    className="flex gap-4 relative group"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      item.severity === 'critical' ? 'bg-destructive' : 
                      item.severity === 'warning' ? 'bg-warning' : 'bg-primary'
                    }`} />
                    {i !== activity.length - 1 && (
                      <div className="absolute left-1 top-4 bottom-[-16px] w-px bg-border group-last:hidden" />
                    )}
                    <div>
                      <p className="text-sm text-foreground">{item.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground font-mono">{new Date(item.timestamp).toLocaleString()}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{item.type}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div className="bg-card border border-destructive/30 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-destructive"></div>
            <h2 className="text-lg font-medium flex items-center gap-2 mb-4 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Critical Alerts
            </h2>
            <div className="space-y-3">
              {alertsLoading ? (
                 Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                 ))
              ) : alerts?.length === 0 ? (
                <p className="text-sm text-muted-foreground">No critical alerts at this time.</p>
              ) : (
                alerts?.map(alert => (
                  <div key={alert.id} className="bg-background border border-border p-3 rounded-lg hover:border-destructive/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] uppercase font-mono text-muted-foreground">{alert.domain}</span>
                      <span className="text-xs text-muted-foreground font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">{alert.title}</p>
                    <p className="text-xs text-secondary-foreground line-clamp-2">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
