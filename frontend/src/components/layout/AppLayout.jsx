import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CopilotDrawer } from '../copilot/CopilotDrawer';

export const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <Header onOpenCopilot={() => setCopilotOpen(true)} />
        <main className="flex-1 p-6 md:p-8 reveal">{children}</main>
      </div>
      <CopilotDrawer open={copilotOpen} onClose={() => setCopilotOpen(false)} />
    </div>
  );
};

export default AppLayout;
