import React from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Hexagon, 
  LayoutDashboard, 
  Battery, 
  Car, 
  Network, 
  Factory, 
  Leaf, 
  BrainCircuit, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  User,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useGetAlerts } from '@workspace/api-client-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <Hexagon className="w-8 h-8 text-cyan animate-pulse glow-cyan" />
        <div className="absolute inset-0 bg-cyan blur-lg opacity-20 rounded-full"></div>
      </div>
      <span className="text-xl font-bold tracking-widest text-foreground font-mono">AURA</span>
    </div>
  );
}

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Battery Intelligence', path: '/battery', icon: Battery },
  { name: 'Fleet Optimizer', path: '/fleet', icon: Car },
  { name: 'Supply Chain', path: '/supply-chain', icon: Network },
  { name: 'Manufacturing Quality', path: '/manufacturing', icon: Factory },
  { name: 'Carbon Intelligence', path: '/carbon', icon: Leaf },
  { name: 'AI Command Center', path: '/ai', icon: BrainCircuit, highlight: true },
];

const BOTTOM_ITEMS = [
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { data: alerts } = useGetAlerts({ severity: 'critical', limit: 5 });

  const activeAlertsCount = alerts?.length || 0;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/dashboard">
            <Logo />
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 px-3">Intelligence</div>
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} href={item.path} className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                isActive ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                item.highlight && !isActive && "text-cyan/80 hover:text-cyan"
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-cyan rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-5 h-5", item.highlight && "text-cyan")} />
                {item.name}
              </Link>
            );
          })}

          <div className="mt-8 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 px-3">System</div>
          {BOTTOM_ITEMS.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <Link key={item.path} href={item.path} className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "text-foreground bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}>
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 border border-border">
              <AvatarFallback className="bg-primary/20 text-primary font-mono">OP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Cmdr. Shepard</span>
              <span className="text-xs text-muted-foreground font-mono">Global Ops</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search assets, alerts, nodes... (⌘K)" 
                className="pl-9 bg-card border-border h-9 text-sm w-full focus-visible:ring-cyan"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border px-3 py-1.5 rounded-full font-mono">
              <div className="w-2 h-2 rounded-full bg-cyan animate-pulse"></div>
              AI Co-Pilot Active
            </div>
            
            <div className="h-5 w-px bg-border"></div>
            
            <button className="text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="w-5 h-5" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-destructive rounded-full border-2 border-background flex items-center justify-center text-[8px] font-bold text-white">
                  {activeAlertsCount}
                </span>
              )}
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Moon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background relative">
          {children}
        </main>
      </div>
    </div>
  );
}
