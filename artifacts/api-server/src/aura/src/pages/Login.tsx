import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Logo } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Hexagon, Lock, Mail, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLocation('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden text-foreground">
      {/* Background tech grids */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="z-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <Logo className="scale-150 mb-6" />
          <h1 className="text-3xl font-bold tracking-tight mb-2">Project AURA</h1>
          <p className="text-muted-foreground font-mono text-sm tracking-widest uppercase">Global Operations Center</p>
        </div>

        <div className="bg-card/80 backdrop-blur-xl border border-border p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan to-primary"></div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Operator ID / Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input required type="email" placeholder="admin@aura.ops" className="pl-10 bg-background/50 border-border h-11" defaultValue="admin@aura.ops" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Access Clearance</label>
                <a href="#" className="text-xs text-primary hover:text-cyan transition-colors">Forgot Clearance?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input required type="password" placeholder="••••••••••••" className="pl-10 bg-background/50 border-border h-11" defaultValue="password123" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-11 bg-primary hover:bg-cyan text-primary-foreground font-semibold text-base transition-all relative overflow-hidden group">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Hexagon className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span>Initialize Uplink</span>
              )}
            </Button>
            
            <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground pt-4 border-t border-border/50">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Level 5 Clearance Required</span>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
