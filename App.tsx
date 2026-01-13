import React, { useState } from 'react';
import { Tab } from './types';
import { Overview } from './views/Overview';
import { Process } from './views/Process';
import { Visualization } from './views/Visualization';
import { Advanced } from './views/Advanced';
import { LayoutDashboard, Activity, Terminal, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.OVERVIEW);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.OVERVIEW: return <Overview />;
      case Tab.PROCESS: return <Process />;
      case Tab.VISUALIZATION: return <Visualization />;
      case Tab.ADVANCED: return <Advanced />;
      default: return <Overview />;
    }
  };

  const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${active 
          ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-blue-200 shadow-md">
              O
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">
              OFDM<span className="text-blue-600">Sim</span>
            </h1>
          </div>

          <nav className="hidden md:flex space-x-1">
            <TabButton 
              active={activeTab === Tab.OVERVIEW} 
              onClick={() => setActiveTab(Tab.OVERVIEW)} 
              icon={<LayoutDashboard size={18} />}
              label="Overview" 
            />
            <TabButton 
              active={activeTab === Tab.PROCESS} 
              onClick={() => setActiveTab(Tab.PROCESS)} 
              icon={<Terminal size={18} />}
              label="Process" 
            />
            <TabButton 
              active={activeTab === Tab.VISUALIZATION} 
              onClick={() => setActiveTab(Tab.VISUALIZATION)} 
              icon={<Activity size={18} />}
              label="Simulation" 
            />
            <TabButton 
              active={activeTab === Tab.ADVANCED} 
              onClick={() => setActiveTab(Tab.ADVANCED)} 
              icon={<Zap size={18} />}
              label="Advanced" 
            />
          </nav>

          {/* Mobile Menu Icon Placeholder (for responsiveness in future) */}
          <div className="md:hidden">
             <Activity className="text-slate-600" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
      
      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-slate-400 text-sm border-t border-slate-200 mt-12 bg-white">
        <p>© 2026 OFDM Educational Platform. Designed for Signal Processing Courses.</p>
      </footer>
    </div>
  );
};

export default App;