import React, { useState } from 'react';
import { 
  JAVA_SWITCH_CASE_CODE, 
  HOMEWORK_DETAILS 
} from '../data/javaCode';
import { 
  Copy, 
  Check, 
  Download, 
  Code2, 
  FileCode, 
  UserCheck, 
  Sparkles,
  Layers
} from 'lucide-react';

interface CodeViewerProps {
  onCopySuccess?: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JAVA_SWITCH_CASE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-emerald-400" />
              Main.java — Switch-Case Ödev Çözümü
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              Hazır Kod
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>İmza: <strong className="text-slate-200">Enes Öztürk</strong></span>
            <span>•</span>
            <span>Konu: Patika Java 101 Switch-Case Dönüşümü</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
          </button>
          <button
            onClick={downloadFile}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-md transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Main.java Dosyasını İndir</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden mb-8">
        {/* Editor Tab Bar */}
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-3 text-xs font-mono text-slate-300 font-medium">Main.java</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Java 11+</span>
          </div>

          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>İmzalı: Enes Öztürk</span>
          </div>
        </div>

        {/* Code Content with Syntax Coloring */}
        <div className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-300 bg-[#0d1117]">
          <pre className="selection:bg-emerald-500/30">
            <code>
              {JAVA_SWITCH_CASE_CODE.split('\n').map((line, idx) => {
                // Color comments
                const isComment = line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*');
                const isSwitch = line.includes('switch (select)');
                const isCase = line.trim().startsWith('case ');
                const isBreak = line.includes('break;');
                const isDefault = line.trim().startsWith('default:');

                let lineStyle = 'text-slate-300';
                if (isComment) lineStyle = 'text-slate-500 italic';
                else if (isSwitch) lineStyle = 'text-amber-400 font-bold bg-amber-500/10 py-0.5 px-1 rounded';
                else if (isCase) lineStyle = 'text-cyan-400 font-semibold';
                else if (isBreak) lineStyle = 'text-rose-400 font-semibold';
                else if (isDefault) lineStyle = 'text-purple-400 font-semibold';

                return (
                  <div key={idx} className="flex hover:bg-slate-800/40 px-2 rounded -mx-2 transition-colors">
                    <span className="select-none text-slate-600 w-8 flex-shrink-0 text-right pr-4 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className={lineStyle}>{line}</span>
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      </div>

      {/* Code Architecture Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">Switch-Case Bloğu</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Menü seçimlerini <code>switch (select)</code> altında 1 (Yatır), 2 (Çek), 3 (Bakiye), 4 (Çıkış) ve <code>default</code> olarak dallandırır.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Code2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">break; İfadesi</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Seçilen işlem tamamlandığında diğer case'lerin çalıştırılmasını önleyerek akışı do-while döngüsünün koşul kontrolüne yönlendirir.
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">default: Güvenliği</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kullanıcı 1-4 aralığı dışında herhangi bir sayı girdiğinde sistemi çökertmeden uyarı mesajı üretir.
          </p>
        </div>
      </div>
    </div>
  );
};
