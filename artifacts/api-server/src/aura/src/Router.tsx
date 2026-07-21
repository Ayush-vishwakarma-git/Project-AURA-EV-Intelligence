import React from 'react';
import { Switch, Route } from 'wouter';
import { Shell } from '@/components/layout/Shell';
import Dashboard from '@/pages/Dashboard';
import Battery from '@/pages/Battery';
import Fleet from '@/pages/Fleet';
import SupplyChain from '@/pages/SupplyChain';
import Manufacturing from '@/pages/Manufacturing';
import Carbon from '@/pages/Carbon';
import AiCommand from '@/pages/AiCommand';
import Login from '@/pages/Login';

function ReportsStub() {
  return <div className="p-8 text-center text-muted-foreground mt-20">Reports module initializing...</div>;
}

function SettingsStub() {
  return <div className="p-8 text-center text-muted-foreground mt-20">Settings module initializing...</div>;
}

export function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      
      <Route path="/:rest*">
        <Shell>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/battery" component={Battery} />
            <Route path="/fleet" component={Fleet} />
            <Route path="/supply-chain" component={SupplyChain} />
            <Route path="/manufacturing" component={Manufacturing} />
            <Route path="/carbon" component={Carbon} />
            <Route path="/ai" component={AiCommand} />
            <Route path="/reports" component={ReportsStub} />
            <Route path="/settings" component={SettingsStub} />
            <Route>
              <div className="p-8 text-center text-destructive mt-20">404 - Sector Not Found</div>
            </Route>
          </Switch>
        </Shell>
      </Route>
    </Switch>
  );
}
