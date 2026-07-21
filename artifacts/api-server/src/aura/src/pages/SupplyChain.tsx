import React, { useEffect, useState } from 'react';
import { 
  useGetSupplyChainRiskSummary, 
  useGetMineralRisks,
  useGetGeopoliticalAlerts,
  useGetSupplyChainNetwork
} from '@workspace/api-client-react';
import { KpiCard } from '@/components/ui-custom/KpiCard';
import { AlertBadge } from '@/components/ui-custom/AlertBadge';
import { DataTable } from '@/components/ui-custom/DataTable';
import { Network, Globe, AlertTriangle, ShieldAlert } from 'lucide-react';
import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';

const nodeTypes = {}; // Use default

export default function SupplyChain() {
  const { data: summary, isLoading: summaryLoading } = useGetSupplyChainRiskSummary();
  const { data: minerals, isLoading: mineralsLoading } = useGetMineralRisks();
  const { data: alerts, isLoading: alertsLoading } = useGetGeopoliticalAlerts();
  const { data: network, isLoading: networkLoading } = useGetSupplyChainNetwork();

  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  useEffect(() => {
    if (network) {
      const formattedNodes = network.nodes.map(n => {
        let bgColor = '#1C1C2A'; // card
        let borderColor = '#2A2A3A'; // border
        
        if (n.riskScore > 80) {
          borderColor = '#FF4560'; // destructive
          bgColor = 'rgba(255, 69, 96, 0.1)';
        } else if (n.riskScore > 60) {
          borderColor = '#FEB019'; // warning
          bgColor = 'rgba(254, 176, 25, 0.1)';
        }

        return {
          id: n.id,
          position: n.position,
          data: { 
            label: (
              <div className="flex flex-col items-center">
                <span className="font-semibold text-[10px] uppercase tracking-wider">{n.label}</span>
                <span className="text-[9px] text-muted-foreground mt-1">{n.country}</span>
              </div>
            )
          },
          style: {
            background: bgColor,
            border: `1px solid ${borderColor}`,
            color: '#F8FAFC',
            borderRadius: '6px',
            padding: '8px 12px',
            minWidth: '120px',
            boxShadow: n.riskScore > 80 ? '0 0 10px rgba(255, 69, 96, 0.3)' : 'none'
          }
        };
      });

      const formattedEdges = network.edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: true,
        label: e.label,
        style: { stroke: '#4F8CFF', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#4F8CFF' },
        labelStyle: { fill: '#F8FAFC', fontSize: 10, fontWeight: 500 },
        labelBgStyle: { fill: '#14141E' }
      }));

      setNodes(formattedNodes);
      setEdges(formattedEdges);
    }
  }, [network]);

  const mineralColumns = [
    { header: 'Mineral', accessor: 'mineral', className: 'font-semibold' },
    { header: 'Primary Source', accessor: 'primaryCountry' },
    { header: 'Risk Score', accessor: (row: any) => (
      <span className={`font-mono ${row.riskScore > 80 ? 'text-destructive' : row.riskScore > 60 ? 'text-warning' : 'text-success'}`}>
        {row.riskScore}/100
      </span>
    )},
    { header: 'Alternatives', accessor: 'alternatives' },
    { header: 'Criticality', accessor: (row: any) => (
      <div className="w-12 h-1.5 bg-muted rounded-full">
        <div className="h-full bg-cyan rounded-full" style={{ width: `${row.criticalityScore}%` }}></div>
      </div>
    )},
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Supply Chain Intelligence</h1>
        <p className="text-muted-foreground mt-1 text-sm font-mono">Global material sourcing and risk tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Overall Risk Score" 
          value={summary?.overallRisk ?? 0} 
          unit="/ 100"
          icon={<ShieldAlert className="w-5 h-5 text-warning" />}
          loading={summaryLoading}
        />
        <KpiCard 
          title="Critical Suppliers" 
          value={summary?.criticalSuppliers ?? 0} 
          icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
          loading={summaryLoading}
        />
        <KpiCard 
          title="High Risk Minerals" 
          value={summary?.highRiskMinerals ?? 0} 
          icon={<Network className="w-5 h-5 text-primary" />}
          loading={summaryLoading}
        />
        <KpiCard 
          title="Geopolitical Alerts" 
          value={alerts?.length ?? 0} 
          icon={<Globe className="w-5 h-5 text-destructive" />}
          loading={alertsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center bg-card z-10">
            <h2 className="text-base font-medium">Supply Chain Network Flow</h2>
            <div className="flex gap-2">
              <span className="flex items-center text-[10px] text-muted-foreground"><div className="w-2 h-2 rounded-full bg-destructive mr-1"></div> High Risk</span>
              <span className="flex items-center text-[10px] text-muted-foreground"><div className="w-2 h-2 rounded-full bg-warning mr-1"></div> Medium Risk</span>
            </div>
          </div>
          <div className="flex-1 w-full h-full bg-[#0A0A0F]">
            {networkLoading ? (
              <div className="w-full h-full flex items-center justify-center animate-pulse">
                <Network className="w-10 h-10 text-muted opacity-50" />
              </div>
            ) : (
              <ReactFlow 
                nodes={nodes} 
                edges={edges}
                fitView
                className="dark"
                colorMode="dark"
              >
                <Background color="#2A2A3A" gap={16} />
                <Controls showInteractive={false} className="bg-card border-border fill-foreground" />
              </ReactFlow>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border bg-card">
            <h2 className="text-base font-medium text-destructive flex items-center gap-2">
              <Globe className="w-4 h-4" /> Geopolitical Alerts
            </h2>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {alertsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>)
            ) : alerts?.map(alert => (
              <div key={alert.id} className="border-l-2 border-destructive bg-background p-3 rounded-r">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-bold">{alert.country}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{new Date(alert.timestamp).toLocaleDateString()}</span>
                </div>
                <h3 className="text-sm font-medium mb-1">{alert.title}</h3>
                <p className="text-xs text-secondary-foreground line-clamp-2">{alert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-lg font-medium mb-4">Mineral Risk Matrix</h2>
        <DataTable 
          columns={mineralColumns} 
          data={minerals || []} 
          loading={mineralsLoading} 
        />
      </div>
    </div>
  );
}
