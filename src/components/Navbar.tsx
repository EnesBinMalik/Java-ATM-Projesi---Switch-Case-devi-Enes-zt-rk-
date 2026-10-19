import React from 'react';
import { AppTab } from '../types';
import { 
  Building2, 
  Terminal, 
  Code2, 
  FileText, 
  GitCompare, 
  Download, 
  Volume2, 
  VolumeX, 
  UserCheck 
} from 'lucide-react';
import { JAVA_SWITCH_CASE_CODE } from '../data/javaCode';

interface NavbarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  soundEnabled,
  onToggleSound,
}) => {
  const downloadJavaFile = () => {
    const blob = new Blob([JAVA_SWITCH_CASE_CODE], { type: 'text/x-java-source;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Main.java';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const navItems: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'atm', label: 'ATM Cihazı', icon: <Building2 className="w-4 h-4" /> },
    { id: 'terminal', label: 'Java Konsolu', icon: <Terminal className="w-4 h-4" /> },
    { id: 'code', label: 'Switch-Case Kodu', icon: <Code2 className="w-4 h-4" />, badge: 'Ödev' },
    { id: 'comparison', label: 'if-else vs Switch', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'report', label: 'Ödev Raporu', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  Kodluyoruz Bankası
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium">
                  Java 101 ATM
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-emerald-400 inline" />
                Hazırlayan: <span className="text-slate-200 font-medium">Enes Öztürk</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentTab === item.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={downloadJavaFile}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-md transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Main.java İndir</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-800 space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                currentTab === item.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-800/40'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
