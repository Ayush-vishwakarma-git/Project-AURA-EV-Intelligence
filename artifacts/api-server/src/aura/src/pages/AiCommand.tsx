import React, { useEffect, useState } from 'react';
import { 
  useGetAiInsights, 
  useGetAgentFlow,
  useGetExecutiveSummary
} from '@workspace/api-client-react';
import { AiInsightCard } from '@/components/ui-custom/AiInsightCard';
import { BrainCircuit, Cpu, Sparkles, ServerCrash } from 'lucide-react';
import { ReactFlow, Background, Controls, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';

export default function AiCommand() {
  const { data: insights, isLoading: insightsLoading } = useGetAiInsights({ status: 'pending' });
  const { data: flow, isLoading: flowLoading } = useGetAgentFlow();
  const { data: summary, isLoading: summaryLoading } = useGetExecutiveSummary();

  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  useEffect(() => {
    if (flow) {
      const formattedNodes = flow.nodes.map(n => {
        const isProcessing = n.status === 'processing';
        return {
          id: n.id,
          position: n.position,
          data: { 
            label: (
              <div className="flex flex-col items-center p-1">
                <BrainCircuit className={`w-5 h-5 mb-1 ${isProcessing ? 'text-cyan animate-pulse' : 'text-muted-foreground'}`} />
                <span className="font-mono text-[10px] uppercase tracking-wider">{n.label}</span>
                {isProcessing && <span className="text-[8px] text-cyan mt-1 bg-cyan/10 px-1 rounded">ANALYZING</span>}
              </div>
            )
          },
          style: {
            background: '#1C1C2A',
            border: `1px solid ${isProcessing ? '#00D4FF' : '#2A2A3A'}`,
            color: '#F8FAFC',
            borderRadius: '8px',
            padding: '10px',
            minWidth: '120px',
            boxShadow: isProcessing ? '0 0 15px rgba(0, 212, 255, 0.4)' : 'none'
          }
        };
      });

      const formattedEdges = flow.edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: e.animated,
        label: e.label,
        style: { stroke: e.animated ? '#00D4FF' : '#4F8CFF', strokeWidth: e.animated ? 2 : 1 },
        markerEnd: { type: MarkerType.ArrowClosed, color: e.animated ? '#00D4FF' : '#4F8CFF' },
        labelStyle: { fill: '#00D4FF', fontSize: 9, fontFamily: 'monospace' },
        labelBgStyle: { fill: '#14141E', fillOpacity: 0.8 }
      }));

      setNodes(formattedNodes);
      setEdges(formattedEdges);
    }
  }, [flow]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-cyan flex items-center gap-2 glow-text">
            <Sparkles className="w-6 h-6 text-cyan" /> AURA AI Command Center
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-mono">Multi-agent reasoning and cross-domain intelligence.</p>
        </div>
        <div className="bg-cyan/10 border border-cyan/30 text-cyan px-4 py-2 rounded-lg font-mono text-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan animate-ping"></div>
          ORCHESTRATOR ONLINE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-medium mb-4 flex items-center gap-2 text-primary">
              <Cpu className="w-5 h-5" /> Executive Summary Generation
            </h2>
            {summaryLoading ? (
              <div className="h-24 bg-muted rounded animate-pulse w-full"></div>
            ) : (
              <div className="space-y-4">
                <p className="text-lg font-medium text-foreground leading-relaxed">
                  "{summary?.headline}"
                </p>
                <p className="text-secondary-foreground text-sm">
                  {summary?.summary}
                </p>
                <div className="text-xs font-mono text-muted-foreground pt-4 border-t border-border">
                  Generated at {summary ? new Date(summary.generatedAt).toLocaleString() : ''}
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <ServerCrash className="w-5 h-5 text-cyan" /> Pending Actionable Insights
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {insightsLoading ? (
                 Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-48 bg-muted rounded-xl animate-pulse"></div>
                 ))
              ) : insights?.length === 0 ? (
                <div className="text-center p-8 bg-card border border-border rounded-xl text-muted-foreground">
                  No pending insights. All agents idle.
                </div>
              ) : (
                insights?.map(insight => (
                  <AiInsightCard key={insight.id} insight={insight} />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 h-full min-h-[600px] bg-card border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border bg-sidebar flex justify-between items-center z-10">
            <h2 className="text-sm font-medium font-mono uppercase tracking-wider">Agent Collaboration Graph</h2>
          </div>
          <div className="flex-1 w-full bg-[#0A0A0F]">
            {flowLoading ? (
              <div className="w-full h-full flex items-center justify-center animate-pulse">
                <BrainCircuit className="w-10 h-10 text-muted opacity-50" />
              </div>
            ) : (
              <ReactFlow 
                nodes={nodes} 
                edges={edges}
                fitView
                className="dark"
                colorMode="dark"
                proOptions={{ hideAttribution: true }}
              >
                <Background color="#1C1C2A" gap={20} size={2} />
              </ReactFlow>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
