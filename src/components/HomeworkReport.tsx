import React from 'react';
import { 
  HOMEWORK_DETAILS, 
  JAVA_SWITCH_CASE_CODE 
} from '../data/javaCode';
import { 
  FileCheck, 
  Printer, 
  Award, 
  CheckCircle, 
  BookOpen, 
  GraduationCap, 
  Download 
} from 'lucide-react';

export const HomeworkReport: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  const downloadReportTxt = () => {
    const content = `=====================================================
PATİKA.DEV - JAVA 101 ATM PROJESİ ÖDEVİ
=====================================================
Öğrenci: ${HOMEWORK_DETAILS.studentName}
Konu: ${HOMEWORK_DETAILS.topic}
Tarih: ${HOMEWORK_DETAILS.date}

[1. ÖDEVİN AMACI VE ÖZETİ]
${HOMEWORK_DETAILS.summary}

[2. TEKNİK DEĞİŞİKLİKLER VE SWITCH-CASE ANALİZİ]
${HOMEWORK_DETAILS.differences.map((d) => `\n${d.title}\n${d.description}`).join('\n')}

[3. KAYNAK KOD (Main.java)]
${JAVA_SWITCH_CASE_CODE}

-----------------------------------------------------
Hazırlayan: Enes Öztürk
Kodluyoruz / Patika.dev
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Enes_Ozturk_Java_ATM_Odevi.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Report Paper Container */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Top Header Badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase">
                Ödev Teslim Belgesi
              </div>
              <h1 className="text-xl font-bold text-slate-100">
                Java 101: ATM Projesi (Switch-Case)
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5 text-teal-400" />
              <span>Yazdır / PDF</span>
            </button>
            <button
              onClick={downloadReportTxt}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Raporu İndir (.txt)</span>
            </button>
          </div>
        </div>

        {/* Student Meta Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-800 text-xs">
          <div>
            <div className="text-slate-400">Hazırlayan</div>
            <div className="font-bold text-slate-100 text-sm mt-0.5">{HOMEWORK_DETAILS.studentName}</div>
          </div>
          <div>
            <div className="text-slate-400">Eğitim / Platform</div>
            <div className="font-bold text-emerald-400 text-sm mt-0.5">Patika.dev / Kodluyoruz</div>
          </div>
          <div>
            <div className="text-slate-400">Ders</div>
            <div className="font-bold text-slate-100 text-sm mt-0.5">Java 101 Temelleri</div>
          </div>
          <div>
            <div className="text-slate-400">Durum</div>
            <div className="font-bold text-teal-300 text-sm mt-0.5 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Tamamlandı
            </div>
          </div>
        </div>

        {/* Section 1: Summary */}
        <div className="py-6 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            1. Proje ve Ödev Açıklaması
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {HOMEWORK_DETAILS.summary}
          </p>
        </div>

        {/* Section 2: Technical Breakdown */}
        <div className="py-6 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            2. Switch-Case Yapısına Geçişin Teknik Nedenleri
          </h3>

          <div className="space-y-4">
            {HOMEWORK_DETAILS.differences.map((diff, index) => (
              <div key={index} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-teal-300 mb-1">{diff.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{diff.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Loop Mechanism */}
        <div className="py-6 border-t border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4" />
            3. Kullanılan Döngülerin Mantığı
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="font-bold text-amber-400 font-mono">while (right &gt; 0)</span>
              <p className="mt-1 text-slate-400 leading-relaxed">
                Kullanıcı adı ve şifre doğrulaması için çalışır. Şifre hatalı girildikçe <code>right--</code> azaltılır. 3 hakkın tamamı bittiğinde hesap bloke edilir.
              </p>
            </div>
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <span className="font-bold text-teal-400 font-mono">do ... while (select != 4)</span>
              <p className="mt-1 text-slate-400 leading-relaxed">
                Menünün kullanıcıya en az bir kez gösterilmesini garanti eder (do bloğu önce çalışır). Kullanıcı 4 (Çıkış Yap) değerini girene kadar işlem menüsü döngüde kalır.
              </p>
            </div>
          </div>
        </div>

        {/* Formal Signature Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            <div>Teslim Eden: <strong className="text-slate-100 font-serif text-base ml-1">Enes Öztürk</strong></div>
            <div className="text-[11px] text-slate-500 mt-0.5">Öğrenci No / İmza: E.OZT-2026</div>
          </div>
          <div className="text-right">
            <div className="text-emerald-400 font-mono font-bold">KODLUYORUZ &amp; PATİKA.DEV</div>
            <div className="text-[10px] text-slate-500">Java 101 Kurs Sonu Ödevi</div>
          </div>
        </div>
      </div>
    </div>
  );
};
