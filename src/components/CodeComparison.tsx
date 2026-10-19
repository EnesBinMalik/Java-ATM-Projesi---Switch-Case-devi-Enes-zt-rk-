import React, { useState } from 'react';
import { GitCompare, CheckCircle2, ArrowRight, Code2 } from 'lucide-react';

export const CodeComparison: React.FC = () => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'focused'>('side-by-side');

  const ifElseSnippet = `// ESKİ KOD (if - else if Merdiveni)
if (select == 1) {
    System.out.print("Para miktarı : ");
    int price = input.nextInt();
    balance += price;
} else if (select == 2) {
    System.out.print("Para miktarı : ");
    int price = input.nextInt();
    if (price > balance) {
        System.out.println("Bakiye yetersiz.");
    } else {
        balance -= price;
    }
} else if (select == 3) {
    System.out.println("Bakiyeniz : " + balance);
}`;

  const switchCaseSnippet = `// YENİ KOD (Ödev Çözümü: Switch - Case Yapısı)
// Hazırlayan: Enes Öztürk
switch (select) {
    case 1:
        System.out.print("Para miktarı : ");
        int depositAmount = input.nextInt();
        balance += depositAmount;
        System.out.println("Para yatırma başarılı. Güncel: " + balance + " TL");
        break;

    case 2:
        System.out.print("Para miktarı : ");
        int withdrawAmount = input.nextInt();
        if (withdrawAmount > balance) {
            System.out.println("Bakiye yetersiz.");
        } else {
            balance -= withdrawAmount;
            System.out.println("Paranızı alınız. Güncel: " + balance + " TL");
        }
        break;

    case 3:
        System.out.println("Bakiyeniz : " + balance + " TL");
        break;

    case 4:
        System.out.println("Tekrar görüşmek üzere.");
        break;

    default:
        System.out.println("Geçersiz bir işlem seçtiniz!");
        break;
}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-emerald-400" />
            Kod Karşılaştırması: if-else vs. switch-case
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ödev kapsamında değiştirilen blokların doğrudan yan yana analizi.
          </p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'side-by-side' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Yan Yana Görünüm
          </button>
          <button
            onClick={() => setViewMode('focused')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewMode === 'focused' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Özet Tablo
          </button>
        </div>
      </div>

      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Original if-else */}
          <div className="bg-slate-950 rounded-2xl border border-rose-900/40 overflow-hidden shadow-xl">
            <div className="bg-rose-950/40 px-4 py-3 border-b border-rose-900/40 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300 font-mono">
                1. Orijinal Kod (if - else if)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Eski Durum
              </span>
            </div>
            <div className="p-4 bg-[#0d1117] font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed">
              <pre className="text-rose-200/90 whitespace-pre">
                <code>{ifElseSnippet}</code>
              </pre>
            </div>
            <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="text-rose-400 font-semibold">• Dezavantajlar:</div>
              <div>- Her bir şart için ayrı ayrı <code>if (select == X)</code> kontrolü yapılır.</div>
              <div>- 1, 2, 3 dışında hatalı bir değer girildiğinde tepki vermez (default durumu yok).</div>
              <div>- Çok sayıda menü seçeneği olduğunda okunabilirlik düşer.</div>
            </div>
          </div>

          {/* Right: New switch-case */}
          <div className="bg-slate-950 rounded-2xl border border-emerald-500/40 overflow-hidden shadow-xl">
            <div className="bg-emerald-950/40 px-4 py-3 border-b border-emerald-500/40 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 font-mono">
                2. Ödev Çözümü (switch - case) — Enes Öztürk
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Yeni Durum (Teslim)
              </span>
            </div>
            <div className="p-4 bg-[#0d1117] font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed">
              <pre className="text-emerald-200/90 whitespace-pre">
                <code>{switchCaseSnippet}</code>
              </pre>
            </div>
            <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Avantajlar &amp; Yenilikler:</span>
              </div>
              <div>- <code>select</code> değişkeni bir kez değerlendirilir ve doğrudan ilgili case'e atlar.</div>
              <div>- <code>break;</code> komutları ile case çakışmaları engellenir.</div>
              <div>- <code>default:</code> bloğu sayesinde geçersiz tuşlamalar anında yakalanır.</div>
              <div>- Kod çok daha modüler, temiz ve kurumsal bankacılık standartlarına uygundur.</div>
            </div>
          </div>
        </div>
      ) : (
        /* Summary Table */
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 overflow-x-auto shadow-xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-300 font-mono">
                <th className="pb-3 font-semibold">Özellik / Kriter</th>
                <th className="pb-3 font-semibold text-rose-300">if - else if Yaklaşımı</th>
                <th className="pb-3 font-semibold text-emerald-400">switch - case Yaklaşımı (Ödev)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-3 font-medium text-slate-200">Okunabilirlik &amp; Düzen</td>
                <td className="py-3 text-slate-400">Çoklu else if blokları kod kalabalığı yaratır.</td>
                <td className="py-3 text-emerald-300 font-medium">Her seçenek bağımsız bir <code>case</code> etiketiyle son derece derli topludur.</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-slate-200">Hatalı Değer Yakalama</td>
                <td className="py-3 text-slate-400">Özel bir <code>else</code> yazılmazsa hatalı girişler yutulur.</td>
                <td className="py-3 text-emerald-300 font-medium"><code>default:</code> bloğu ile 1-4 dışındaki tüm seçimler yakalanır.</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-slate-200">JVM Performansı</td>
                <td className="py-3 text-slate-400">Koşullar sırayla tek tek test edilir (O(N)).</td>
                <td className="py-3 text-emerald-300 font-medium">Derleyici <code>tableswitch</code> ile doğrudan adrese zıplar (O(1)).</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-slate-200">Akış Kontrolü</td>
                <td className="py-3 text-slate-400">Parantez blokları ile sonlanır.</td>
                <td className="py-3 text-emerald-300 font-medium">Her case sonundaki <code>break;</code> ile döngüye kontrollü dönüş sağlanır.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Signature Card */}
      <div className="mt-8 p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            EÖ
          </div>
          <div>
            <div className="text-sm font-bold text-slate-100">Enes Öztürk</div>
            <div className="text-xs text-slate-400">Patika.dev / Kodluyoruz Java 101 Öğrencisi</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
            Ödev Başarıyla Tamamlandı
          </span>
        </div>
      </div>
    </div>
  );
};
