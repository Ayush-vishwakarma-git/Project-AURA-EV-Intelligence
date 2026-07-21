import React, { useRef } from 'react';
import { AiInsight, AiInsightStatus } from '@workspace/api-client-react';
import { useAcceptAiInsight, useDismissAiInsight } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowRight, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { getGetAiInsightsQueryKey } from '@workspace/api-client-react';

export function AiInsightCard({ insight }: { insight: AiInsight }) {
  const acceptMutation = useAcceptAiInsight();
  const dismissMutation = useDismissAiInsight();
  const queryClient = useQueryClient();

  const handleAccept = () => {
    acceptMutation.mutate(
      { insightId: insight.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetAiInsightsQueryKey() });
        }
      }
    );
  };

  const handleDismiss = () => {
    dismissMutation.mutate(
      { insightId: insight.id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetAiInsightsQueryKey() });
        }
      }
    );
  };

  const isPending = acceptMutation.isPending || dismissMutation.isPending;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-cyan/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,212,255,0.05)]"
    >
      <div className="p-5 border-b border-border flex justify-between items-start relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan"></div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="w-4 h-4 text-cyan" />
            <span className="text-xs font-mono text-cyan uppercase tracking-wider">AI Insight • {insight.domain}</span>
            {insight.priority === 'critical' && (
              <span className="text-[10px] uppercase font-bold bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">Critical</span>
            )}
          </div>
          <h3 className="text-lg font-medium text-foreground">{insight.title}</h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground mb-1">Confidence</div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-cyan" style={{ width: `${insight.confidenceScore}%` }}></div>
            </div>
            <span className="text-sm font-mono text-cyan">{insight.confidenceScore}%</span>
          </div>
        </div>
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs uppercase text-muted-foreground mb-1">Business Impact</h4>
          <p className="text-sm text-secondary-foreground">{insight.businessImpact}</p>
        </div>
        <div>
          <h4 className="text-xs uppercase text-muted-foreground mb-1">Recommended Action</h4>
          <p className="text-sm text-foreground font-medium">{insight.recommendedAction}</p>
        </div>
        
        {insight.rootCause && (
          <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-border/50">
            <h4 className="text-xs uppercase text-muted-foreground mb-1">Root Cause Analysis</h4>
            <p className="text-sm text-secondary-foreground italic border-l-2 border-muted pl-3 py-1">{insight.rootCause}</p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 bg-sidebar flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs text-muted-foreground block">Est. Savings</span>
            <span className="text-sm font-mono font-medium text-success">${insight.estimatedSavings.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block">Affected Assets</span>
            <span className="text-sm font-mono font-medium text-foreground">{insight.affectedAssets.length}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {insight.status === 'pending' ? (
            <>
              <Button size="sm" variant="outline" className="border-border hover:bg-muted" onClick={handleDismiss} disabled={isPending}>
                <X className="w-4 h-4 mr-1" /> Dismiss
              </Button>
              <Button size="sm" className="bg-cyan hover:bg-cyan/80 text-background" onClick={handleAccept} disabled={isPending}>
                <Check className="w-4 h-4 mr-1" /> Accept Action
              </Button>
            </>
          ) : (
            <span className={`text-xs px-2 py-1 rounded font-medium ${insight.status === 'accepted' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
              {insight.status.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
