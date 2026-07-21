import React, { useEffect, useState } from 'react';
import { 
  useGetCarbonOverview, 
  useGetCarbonEmissionTrend,
  useGetCarbonRegional
} from '@workspace/api-client-react';
import { KpiCard } from '@/components/ui-custom/KpiCard';
import { Leaf, Wind, ShieldCheck, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Carbon() {
  const { data: overview, isLoading: overviewLoading } = useGetCarbonOverview();
  const { data: trend, isLoading: trendLoading } = useGetCarbonEmissionTrend({ months: 12 });
  const { data: regional, isLoading: regionalLoading } = useGetCarbonRegional();

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-success flex items-center gap-2">
          <Leaf className="w-6 h-6" /> Carbon Intelligence
        </h1>
        <p className="text-muted-foreground mt-1 text-sm font-mono">Net-zero tracking and Scope 1-3 emission monitoring.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Emissions (CO2e)" 
          value={overview?.totalEmissions ? (overview.totalEmissions / 1000).toFixed(1) : 0} 
          unit="k Tonnes"
          icon={<Wind className="w-5 h-5 text-muted-foreground" />}
          loading={overviewLoading}
        />
        <KpiCard 
          title="Current Reduction" 
          value={overview?.currentReductionPercent ?? 0} 
          unit="%"
          icon={<TrendingDown className="w-5 h-5 text-success" />}
          loading={overviewLoading}
        />
        <KpiCard 
          title="Net Zero Target" 
          value={overview?.netZeroTargetYear ?? '-'} 
          icon={<ShieldCheck className="w-5 h-5 text-primary" />}
          loading={overviewLoading}
        />
        <KpiCard 
          title="Offsets Purchased" 
          value={overview?.offsetsPurchased ? (overview.offsetsPurchased / 1000).toFixed(1) : 0} 
          unit="k Tonnes"
          icon={<Leaf className="w-5 h-5 text-success" />}
          loading={overviewLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-medium mb-4">Emissions Trend by Scope</h2>
          <div className="h-[350px]">
            {trendLoading ? <div className="w-full h-full bg-muted animate-pulse rounded"></div> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="scope3" stackId="1" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="scope2" stackId="1" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="scope1" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded bg-primary opacity-60"></div> Scope 1 (Direct)</div>
            <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded bg-warning opacity-60"></div> Scope 2 (Indirect)</div>
            <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded bg-destructive opacity-60"></div> Scope 3 (Value Chain)</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
          <h2 className="text-base font-medium mb-4">Regional Intensity Heatmap</h2>
          <div className="flex-1 bg-background rounded-lg overflow-hidden border border-border z-0">
            {regionalLoading ? <div className="w-full h-full bg-muted animate-pulse rounded"></div> : (
              <MapContainer 
                center={[20, 0]} 
                zoom={1.5} 
                style={{ height: '100%', width: '100%', backgroundColor: '#0A0A0F' }}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {regional?.map((reg, idx) => (
                  <CircleMarker
                    key={idx}
                    center={[reg.lat, reg.lng]}
                    radius={Math.max(5, reg.emissions / 50000)}
                    pathOptions={{ 
                      color: 'hsl(var(--success))', 
                      fillColor: 'hsl(var(--success))', 
                      fillOpacity: 0.4,
                      weight: 1
                    }}
                  >
                    <LeafletTooltip className="bg-card text-foreground border-border">
                      <div className="font-medium">{reg.region}</div>
                      <div className="text-xs text-muted-foreground">{reg.emissions.toLocaleString()} Tonnes CO2e</div>
                    </LeafletTooltip>
                  </CircleMarker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
