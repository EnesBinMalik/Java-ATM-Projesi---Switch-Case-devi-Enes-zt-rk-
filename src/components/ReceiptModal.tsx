import React from 'react';
import { Transaction } from '../types';
import { X, Printer, CheckCircle } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Paper Thermal Receipt Look */}
        <div className="bg-white text-slate-900 rounded-2xl p-5 font-mono shadow-inner border border-slate-300">
          <div className="text-center pb-3 border-b-2 border-dashed border-slate-400">
            <div className="font-extrabold text-sm tracking-widest uppercase">
              KODLUYORUZ BANKASI
            </div>
            <div className="text-[10px] text-slate-600">ATM NO: KB-3401 / ENES ÖZTÜRK ŞB</div>
            <div className="text-[10px] text-slate-500 mt-1">
              {transaction.date.toLocaleDateString('tr-TR')} {transaction.date.toLocaleTimeString('tr-TR')}
            </div>
          </div>

          <div className="py-3 space-y-1.5 text-xs border-b-2 border-dashed border-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-600">İŞLEM TÜRÜ:</span>
              <span className="font-bold uppercase">
                {transaction.type === 'deposit'
                  ? 'PARA YATIRMA'
                  : transaction.type === 'withdraw'
                  ? 'PARA ÇEKME'
                  : 'BAKİYE SORGULAMA'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">HESAP SAHİBİ:</span>
              <span className="font-bold">ENES ÖZTÜRK</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-600">KULLANICI:</span>
              <span>patika</span>
            </div>

            {transaction.amount !== undefined && (
              <div className="flex justify-between text-sm font-bold pt-1">
                <span>İŞLEM TUTARI:</span>
                <span>{transaction.amount} TL</span>
              </div>
            )}

            <div className="flex justify-between font-bold pt-1 text-emerald-700">
              <span>GÜNCEL BAKİYE:</span>
              <span>{transaction.balanceAfter} TL</span>
            </div>

            <div className="flex justify-between text-[11px] text-slate-600">
              <span>DURUM:</span>
              <span className="font-semibold text-emerald-600">BAŞARILI (OK)</span>
            </div>
          </div>

          <div className="pt-3 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-700 font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>İşleminiz Gerçekleştirilmiştir</span>
            </div>
            <div className="text-[9px] text-slate-500">
              Bizi tercih ettiğiniz için teşekkür ederiz.
            </div>
            <div className="text-[8px] text-slate-400 tracking-widest pt-1">
              *** ENES ÖZTÜRK JAVA 101 PROJESİ ***
            </div>
          </div>
        </div>

        {/* Modal buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5 text-teal-400" />
            <span>Yazdır</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-semibold transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
