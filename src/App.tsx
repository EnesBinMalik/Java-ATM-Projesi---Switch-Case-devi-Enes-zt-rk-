import React, { useState } from 'react';
import { AppTab, Transaction } from './types';
import { Navbar } from './components/Navbar';
import { AtmSimulator } from './components/AtmSimulator';
import { ConsoleRunner } from './components/ConsoleRunner';
import { CodeViewer } from './components/CodeViewer';
import { CodeComparison } from './components/CodeComparison';
import { HomeworkReport } from './components/HomeworkReport';
import { ReceiptModal } from './components/ReceiptModal';
import { Building2, UserCheck, Heart, Sparkles, Terminal, Code2, GitCompare, FileText } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('atm');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeReceipt, setActiveReceipt] = useState<Transaction | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Header Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'atm' && (
          <AtmSimulator
            soundEnabled={soundEnabled}
            onViewReceipt={(tx) => setActiveReceipt(tx)}
            onCodeInspect={() => setCurrentTab('code')}
          />
        )}

        {currentTab === 'terminal' && (
          <ConsoleRunner soundEnabled={soundEnabled} />
        )}

        {currentTab === 'code' && (
          <CodeViewer />
        )}

        {currentTab === 'comparison' && (
          <CodeComparison />
        )}

        {currentTab === 'report' && (
          <HomeworkReport />
        )}
      </main>

      {/* Receipt Modal */}
      <ReceiptModal
        transaction={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-200">Kodluyoruz Bankası ATM Projesi</span>
            <span className="text-slate-600">•</span>
            <span>Java 101 Döngüler ve Switch-Case</span>
          </div>

          <div className="flex items-center space-x-1 text-slate-300">
            <span>Hazırlayan &amp; İmza:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 inline" />
              Enes Öztürk
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('atm')}
              className={`hover:text-emerald-400 transition ${currentTab === 'atm' ? 'text-emerald-400 font-bold' : ''}`}
            >
              ATM Cihazı
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('terminal')}
              className={`hover:text-emerald-400 transition ${currentTab === 'terminal' ? 'text-emerald-400 font-bold' : ''}`}
            >
              Terminal
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('code')}
              className={`hover:text-emerald-400 transition ${currentTab === 'code' ? 'text-emerald-400 font-bold' : ''}`}
            >
              Java Kodu
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('report')}
              className={`hover:text-emerald-400 transition ${currentTab === 'report' ? 'text-emerald-400 font-bold' : ''}`}
            >
              Ödev Raporu
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
