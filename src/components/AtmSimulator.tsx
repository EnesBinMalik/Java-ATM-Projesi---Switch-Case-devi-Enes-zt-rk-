import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  LogOut, 
  Printer, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Keyboard,
  Coins
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { Transaction } from '../types';

interface AtmSimulatorProps {
  soundEnabled: boolean;
  onViewReceipt: (transaction: Transaction) => void;
  onCodeInspect: (lineNum: number) => void;
}

type ScreenState = 'card_prompt' | 'login' | 'menu' | 'deposit' | 'withdraw' | 'balance' | 'exit' | 'blocked';

export const AtmSimulator: React.FC<AtmSimulatorProps> = ({
  soundEnabled,
  onViewReceipt,
}) => {
  // Java State Variables
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [right, setRight] = useState(3);
  const [balance, setBalance] = useState(1500);
  const [select, setSelect] = useState<number | null>(null);

  // UI Flow State
  const [screen, setScreen] = useState<ScreenState>('login');
  const [amountInput, setAmountInput] = useState('');
  const [cardInserted, setCardInserted] = useState(true);
  const [dispensingCash, setDispensingCash] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx-0',
      type: 'inquiry',
      balanceAfter: 1500,
      date: new Date(Date.now() - 3600000),
      status: 'success',
      note: 'Hesap Açılış Bakiyesi',
    },
  ]);
  const [lastReceipt, setLastReceipt] = useState<Transaction | null>(null);

  const triggerSound = (type: 'beep' | 'card' | 'cash' | 'success' | 'error' | 'click') => {
    if (soundEnabled) {
      playSound(type);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  // Reset System to initial Java main() state
  const resetAtm = () => {
    triggerSound('click');
    setUserName('');
    setPassword('');
    setRight(3);
    setBalance(1500);
    setSelect(null);
    setAmountInput('');
    setScreen('login');
    setCardInserted(true);
    setNotification(null);
    showNotification('ATM Sistemi Sıfırlandı (int right = 3, balance = 1500)', 'info');
  };

  // Login handler mimicking Java while(right > 0)
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    triggerSound('beep');

    if (userName === 'patika' && password === 'dev123') {
      triggerSound('success');
      setScreen('menu');
      showNotification('Merhaba, Kodluyoruz Bankasına Hoşgeldiniz!', 'success');
    } else {
      triggerSound('error');
      const newRight = right - 1;
      setRight(newRight);
      if (newRight === 0) {
        setScreen('blocked');
      } else {
        showNotification(`Hatalı kullanıcı adı veya şifre! Kalan Hakkınız: ${newRight}`, 'error');
      }
    }
  };

  const autoFillCredentials = () => {
    triggerSound('click');
    setUserName('patika');
    setPassword('dev123');
  };

  // Switch-case execution handler
  const handleMenuSelect = (option: number) => {
    setSelect(option);
    triggerSound('click');

    switch (option) {
      case 1: // Para Yatırma
        setScreen('deposit');
        setAmountInput('');
        break;
      case 2: // Para Çekme
        setScreen('withdraw');
        setAmountInput('');
        break;
      case 3: // Bakiye Sorgula
        setScreen('balance');
        const inquiryTx: Transaction = {
          id: `tx-${Date.now()}`,
          type: 'inquiry',
          balanceAfter: balance,
          date: new Date(),
          status: 'success',
          note: 'Bakiye Sorgulama',
        };
        setTransactions((prev) => [inquiryTx, ...prev]);
        setLastReceipt(inquiryTx);
        break;
      case 4: // Çıkış Yap
        triggerSound('card');
        setScreen('exit');
        setTimeout(() => {
          setScreen('login');
          setUserName('');
          setPassword('');
          setSelect(null);
        }, 3000);
        break;
      default:
        triggerSound('error');
        showNotification('Geçersiz seçim! Lütfen 1-4 arasında seçim yapınız.', 'error');
        break;
    }
  };

  // Case 1: Para Yatırma (balance += price)
  const executeDeposit = () => {
    const price = parseInt(amountInput, 10);
    if (isNaN(price) || price <= 0) {
      triggerSound('error');
      showNotification('Lütfen geçerli bir para miktarı giriniz.', 'error');
      return;
    }

    triggerSound('cash');
    const newBalance = balance + price;
    setBalance(newBalance);

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      amount: price,
      balanceAfter: newBalance,
      date: new Date(),
      status: 'success',
      note: 'Nakit Para Yatırma',
    };
    setTransactions((prev) => [tx, ...prev]);
    setLastReceipt(tx);

    triggerSound('success');
    showNotification(`${price} TL başarıyla yatırıldı. Güncel bakiye: ${newBalance} TL`, 'success');
    setAmountInput('');
    setScreen('menu');
  };

  // Case 2: Para Çekme (price > balance ? Bakiye yetersiz : balance -= price)
  const executeWithdraw = () => {
    const price = parseInt(amountInput, 10);
    if (isNaN(price) || price <= 0) {
      triggerSound('error');
      showNotification('Lütfen geçerli bir para miktarı giriniz.', 'error');
      return;
    }

    if (price > balance) {
      triggerSound('error');
      showNotification('Bakiye yetersiz.', 'error');
      const failedTx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'withdraw',
        amount: price,
        balanceAfter: balance,
        date: new Date(),
        status: 'failed',
        note: 'Yetersiz Bakiye Reddi',
      };
      setTransactions((prev) => [failedTx, ...prev]);
      return;
    }

    // Dispense cash animation
    setDispensingCash(true);
    triggerSound('cash');

    const newBalance = balance - price;
    setBalance(newBalance);

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'withdraw',
      amount: price,
      balanceAfter: newBalance,
      date: new Date(),
      status: 'success',
      note: 'Nakit Para Çekme',
    };
    setTransactions((prev) => [tx, ...prev]);
    setLastReceipt(tx);

    setTimeout(() => {
      setDispensingCash(false);
      triggerSound('success');
      showNotification(`Lütfen paranızı alınız (${price} TL). Güncel bakiye: ${newBalance} TL`, 'success');
      setAmountInput('');
      setScreen('menu');
    }, 1800);
  };

  // Physical keypad input helper
  const handleKeypadPress = (key: string) => {
    triggerSound('beep');
    if (screen === 'login') {
      setPassword((prev) => prev + key);
    } else if (screen === 'deposit' || screen === 'withdraw') {
      setAmountInput((prev) => prev + key);
    }
  };

  const handleKeypadClear = () => {
    triggerSound('click');
    if (screen === 'login') {
      setPassword('');
    } else if (screen === 'deposit' || screen === 'withdraw') {
      setAmountInput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner: Assignment Context */}
      <div className="mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Java ATM Projesi - Switch-Case Simülatörü
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Canlı Java Modeli
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Patika.dev Java 101 ödevinde istenen switch-case mimarisi, döngü kontrolleri ve bakiye mekaniği.
            </p>
          </div>
        </div>

        {/* Live Java Variables Pill Deck */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400">
            right: <span className={`font-bold ${right === 0 ? 'text-red-400' : right === 1 ? 'text-amber-400' : 'text-emerald-400'}`}>{right}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-[11px] font-mono text-slate-400">
            balance: <span className="font-bold text-teal-300">{balance} TL</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-[11px] font-mono text-slate-400">
            select: <span className="font-bold text-amber-300">{select ?? 'null'}</span>
          </div>
          <button
            onClick={resetAtm}
            className="ml-2 flex items-center gap-1 text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition"
            title="Sistemi başlangıç değerlerine sıfırla"
          >
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Main ATM Machine Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ATM Physical Body (Left / Center) */}
        <div className="lg:col-span-8 bg-slate-900 border-4 border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl shadow-black/60 relative overflow-hidden">
          {/* Top Bank Header Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm">
                KB
              </div>
              <div>
                <div className="text-sm font-bold tracking-wider text-slate-200">KODLUYORUZ BANKASI</div>
                <div className="text-[10px] text-slate-400 tracking-wide">ATM CİHAZ NO: #KB-3401 • ENES ÖZTÜRK ŞUBESİ</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider">ÇEVRİMİÇİ</span>
            </div>
          </div>

          {/* ATM Screen Bezel & Screen Glass */}
          <div className="bg-slate-950 border-4 border-slate-800 rounded-2xl p-4 sm:p-6 relative shadow-inner">
            {/* Screen Glass Reflection Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none rounded-xl" />

            {/* Notification alert on screen */}
            {notification && (
              <div
                className={`mb-3 p-2.5 rounded-lg text-xs flex items-center gap-2 transition-all ${
                  notification.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                    : notification.type === 'error'
                    ? 'bg-rose-950/80 border border-rose-500/40 text-rose-300'
                    : 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300'
                }`}
              >
                {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                {notification.type === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                {notification.type === 'info' && <Sparkles className="w-4 h-4 flex-shrink-0" />}
                <span className="font-mono">{notification.message}</span>
              </div>
            )}

            {/* SCREEN 1: LOGIN (while right > 0) */}
            {screen === 'login' && (
              <div className="py-2 text-slate-100">
                <div className="text-center mb-5">
                  <h2 className="text-lg font-bold text-teal-300 font-mono tracking-tight">KODLUYORUZ BANKASI</h2>
                  <p className="text-xs text-slate-400">Lütfen kullanıcı bilgilerinizi doğrulayınız</p>
                </div>

                <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Kullanıcı Adınız :
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="patika"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-mono text-slate-300">
                        Parolanız :
                      </label>
                      <span className="text-[10px] text-amber-400 font-mono">
                        Kalan Hak: {right}/3
                      </span>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="dev123"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono tracking-widest focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-700/30"
                    >
                      <span>Giriş Yap (Enter)</span>
                    </button>
                    <button
                      type="button"
                      onClick={autoFillCredentials}
                      className="bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs py-2 px-3 rounded-lg border border-teal-500/30 flex items-center justify-center gap-1 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hazır Bilgileri Doldur (patika / dev123)</span>
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center text-[11px] text-slate-500 font-mono">
                  Java Kodu: userName.equals("patika") &amp;&amp; password.equals("dev123")
                </div>
              </div>
            )}

            {/* SCREEN: BLOCKED (right === 0) */}
            {screen === 'blocked' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-rose-400 font-mono">
                    HESABINIZ BLOKE OLMUŞTUR
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                    3 defa hatalı kullanıcı adı veya şifre girildiği için hesabınız kilitlenmiştir. Lütfen banka ile iletişime geçiniz.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={resetAtm}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hesabı Sıfırla ve Yeniden Dene</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 2: MAIN MENU (do-while / Switch-Case 1-4) */}
            {screen === 'menu' && (
              <div className="py-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-teal-300 font-mono">
                      Merhaba, Kodluyoruz Bankasına Hoşgeldiniz!
                    </h3>
                    <p className="text-[11px] text-slate-400">Lütfen yapmak istediğiniz işlemi seçiniz:</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-mono">Güncel Bakiye</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono">{balance} TL</div>
                  </div>
                </div>

                {/* 4 Interactive ATM Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                  <button
                    onClick={() => handleMenuSelect(1)}
                    className="p-3.5 bg-slate-900/90 hover:bg-emerald-950/60 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl text-left transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs font-mono group-hover:scale-105 transition">
                        1
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition">
                          Para Yatırma
                        </div>
                        <div className="text-[10px] text-slate-400">case 1: balance += price</div>
                      </div>
                    </div>
                    <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
                  </button>

                  <button
                    onClick={() => handleMenuSelect(2)}
                    className="p-3.5 bg-slate-900/90 hover:bg-teal-950/60 border border-slate-700/80 hover:border-teal-500/50 rounded-xl text-left transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs font-mono group-hover:scale-105 transition">
                        2
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-teal-300 transition">
                          Para Çekme
                        </div>
                        <div className="text-[10px] text-slate-400">case 2: balance -= price</div>
                      </div>
                    </div>
                    <ArrowUpCircle className="w-4 h-4 text-teal-400" />
                  </button>

                  <button
                    onClick={() => handleMenuSelect(3)}
                    className="p-3.5 bg-slate-900/90 hover:bg-cyan-950/60 border border-slate-700/80 hover:border-cyan-500/50 rounded-xl text-left transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono group-hover:scale-105 transition">
                        3
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition">
                          Bakiye Sorgula
                        </div>
                        <div className="text-[10px] text-slate-400">case 3: Bakiyeniz: {balance}</div>
                      </div>
                    </div>
                    <Wallet className="w-4 h-4 text-cyan-400" />
                  </button>

                  <button
                    onClick={() => handleMenuSelect(4)}
                    className="p-3.5 bg-slate-900/90 hover:bg-rose-950/60 border border-slate-700/80 hover:border-rose-500/50 rounded-xl text-left transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs font-mono group-hover:scale-105 transition">
                        4
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-rose-300 transition">
                          Çıkış Yap
                        </div>
                        <div className="text-[10px] text-slate-400">case 4: Tekrar görüşmek üzere</div>
                      </div>
                    </div>
                    <LogOut className="w-4 h-4 text-rose-400" />
                  </button>
                </div>

                <div className="mt-4 p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Döngü Koşulu: while (select != 4)</span>
                  <span className="text-emerald-400">Switch-Case Aktif</span>
                </div>
              </div>
            )}

            {/* SCREEN 3: DEPOSIT (case 1) */}
            {screen === 'deposit' && (
              <div className="py-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">CASE 1</span>
                    <h3 className="text-sm font-bold text-slate-200 font-mono">Para Yatırma</h3>
                  </div>
                  <button
                    onClick={() => setScreen('menu')}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    ← Menüye Dön
                  </button>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Para miktarı (TL) :
                    </label>
                    <input
                      type="number"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-lg font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Quick amount shortcuts */}
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 200, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          triggerSound('click');
                          setAmountInput(amt.toString());
                        }}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition"
                      >
                        +{amt} TL
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={executeDeposit}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-700/30"
                    >
                      <ArrowDownCircle className="w-4 h-4" />
                      <span>Parayı Yatır (balance += price)</span>
                    </button>
                    <button
                      onClick={() => setScreen('menu')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 rounded-lg transition"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 4: WITHDRAW (case 2) */}
            {screen === 'withdraw' && (
              <div className="py-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 text-xs font-mono font-bold">CASE 2</span>
                    <h3 className="text-sm font-bold text-slate-200 font-mono">Para Çekme</h3>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Bakiye: <span className="text-emerald-400 font-bold">{balance} TL</span>
                  </div>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Para miktarı (TL) :
                    </label>
                    <input
                      type="number"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-lg font-mono text-teal-300 font-bold focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  {/* Fast cash buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 200, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          triggerSound('click');
                          setAmountInput(amt.toString());
                        }}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition"
                      >
                        {amt} TL
                      </button>
                    ))}
                  </div>

                  <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-400">
                    Koşul Kontrolü: <span className="text-amber-400">if (price &gt; balance) Bakiye yetersiz else balance -= price</span>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={executeWithdraw}
                      disabled={dispensingCash}
                      className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-teal-700/30 disabled:opacity-50"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      <span>{dispensingCash ? 'Para Hazırlanıyor...' : 'Parayı Çek'}</span>
                    </button>
                    <button
                      onClick={() => setScreen('menu')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 rounded-lg transition"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 5: BALANCE INQUIRY (case 3) */}
            {screen === 'balance' && (
              <div className="py-4 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                    CASE 3: BAKİYE SORGULAMA
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                    {balance} TL
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Hesap Sahibi: Enes Öztürk / Patika Dev</p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  {lastReceipt && (
                    <button
                      onClick={() => onViewReceipt(lastReceipt)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg text-xs flex items-center gap-1.5 transition"
                    >
                      <Printer className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Makbuzu Görüntüle</span>
                    </button>
                  )}
                  <button
                    onClick={() => setScreen('menu')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                  >
                    Menüye Dön
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 6: EXIT (case 4) */}
            {screen === 'exit' && (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-teal-300 font-mono">
                  Tekrar görüşmek üzere.
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Kartınız iade ediliyor... Lütfen kartınızı ve fişinizi almayı unutmayınız.
                </p>
                <div className="text-[10px] text-slate-500 font-mono pt-2">
                  Döngü sonlandı (select == 4) • Program başarıyla bitti.
                </div>
              </div>
            )}
          </div>

          {/* Physical ATM Hardware Slots & Keypad */}
          <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Left Hardware: Cash Dispenser Slot & Receipt Slot */}
            <div className="space-y-4">
              {/* Cash Dispenser Slot */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    Para Giriş / Çıkış Bölmesi
                  </span>
                  {dispensingCash && (
                    <span className="text-emerald-400 animate-pulse text-[10px]">Para Veriliyor...</span>
                  )}
                </div>
                <div
                  className={`h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                    dispensingCash
                      ? 'border-emerald-500 bg-emerald-500/20 shadow-lg shadow-emerald-500/30'
                      : 'border-slate-800 bg-slate-900'
                  }`}
                >
                  {dispensingCash ? (
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300 animate-pulse">
                      💵 {amountInput || '100'} TL Veriliyor...
                    </div>
                  ) : (
                    <div className="w-24 h-1 bg-slate-800 rounded-full" />
                  )}
                </div>
              </div>

              {/* Receipt Slot & Card Slot */}
              <div className="grid grid-cols-2 gap-3">
                {/* Card Slot */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-mono text-slate-400 mb-1">Kart Yuvası</div>
                  <div
                    className={`h-6 rounded border flex items-center justify-center transition cursor-pointer ${
                      cardInserted ? 'border-emerald-500/60 bg-emerald-950/40' : 'border-slate-800 bg-slate-900'
                    }`}
                    onClick={() => {
                      triggerSound('card');
                      setCardInserted(!cardInserted);
                    }}
                    title="Karta tıkla (Çıkar / Tak)"
                  >
                    <CreditCard className={`w-3.5 h-3.5 ${cardInserted ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </div>
                  <div className="text-[9px] text-slate-500 mt-1">
                    {cardInserted ? 'Kart Takılı' : 'Kart Yok'}
                  </div>
                </div>

                {/* Receipt Printer Slot */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-[10px] font-mono text-slate-400 mb-1">Bilgi Fişi</div>
                  <button
                    onClick={() => {
                      if (lastReceipt) {
                        triggerSound('click');
                        onViewReceipt(lastReceipt);
                      } else {
                        showNotification('Henüz bir işlem makbuzu yok.', 'info');
                      }
                    }}
                    className={`h-6 w-full rounded border flex items-center justify-center transition ${
                      lastReceipt ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-600'
                    }`}
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-[9px] text-slate-500 mt-1">
                    {lastReceipt ? 'Fiş Hazır (Tıkla)' : 'Fiş Bekleniyor'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hardware: ATM Metal Keypad */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Keyboard className="w-3.5 h-3.5 text-slate-400" />
                  ATM Tuş Takımı (PinPad)
                </span>
                <span className="text-[9px] text-slate-500">Sesli / Dokunmatik</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleKeypadPress(digit)}
                    className="h-9 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-slate-200 font-mono font-bold text-sm rounded-lg border border-slate-700 shadow-sm transition active:scale-95"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={handleKeypadClear}
                  className="h-9 bg-amber-950/70 hover:bg-amber-900 text-amber-300 font-mono text-xs font-semibold rounded-lg border border-amber-700/60 transition active:scale-95"
                >
                  Düzelt
                </button>
                <button
                  onClick={() => handleKeypadPress('0')}
                  className="h-9 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-slate-200 font-mono font-bold text-sm rounded-lg border border-slate-700 shadow-sm transition active:scale-95"
                >
                  0
                </button>
                <button
                  onClick={() => {
                    if (screen === 'login') handleLogin();
                    else if (screen === 'deposit') executeDeposit();
                    else if (screen === 'withdraw') executeWithdraw();
                    else triggerSound('click');
                  }}
                  className="h-9 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 font-mono text-xs font-semibold rounded-lg border border-emerald-700/60 transition active:scale-95"
                >
                  Giriş
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bank Card Mockup & Live Java State Inspector */}
        <div className="lg:col-span-4 space-y-6">
          {/* Animated Bank Card Widget */}
          <div className="relative group">
            <div className="h-48 rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 border border-emerald-500/40 shadow-xl text-white flex flex-col justify-between overflow-hidden">
              {/* Background watermark */}
              <div className="absolute right-[-20px] bottom-[-20px] text-white/5 font-black text-8xl pointer-events-none select-none">
                KB
              </div>

              {/* Card top row */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono tracking-widest text-emerald-400 font-bold">KODLUYORUZ BANKASI</div>
                  <div className="text-[10px] text-slate-400">Debit / Platinum Card</div>
                </div>
                <div className="w-10 h-7 rounded bg-amber-400/90 border border-amber-300/80 flex items-center justify-center shadow-inner">
                  <div className="w-6 h-4 border border-amber-600/60 rounded grid grid-cols-2 gap-0.5">
                    <div className="border-r border-b border-amber-700/40" />
                    <div className="border-b border-amber-700/40" />
                  </div>
                </div>
              </div>

              {/* Card Number */}
              <div className="font-mono text-base tracking-widest text-slate-200">
                5421 •••• •••• 1923
              </div>

              {/* Card Bottom Row */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">KART SAHİBİ</div>
                  <div className="text-xs font-bold font-mono tracking-wide text-slate-100">ENES ÖZTÜRK</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">SON KULLANMA</div>
                  <div className="text-xs font-mono text-slate-200">10/29</div>
                </div>
              </div>
            </div>
          </div>

          {/* Java Live Variable Tracker Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Java Değişken Durumu (RAM)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Main.class</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400">String userName</span>
                <span className="text-emerald-400 font-semibold">{userName ? `"${userName}"` : 'null'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400">String password</span>
                <span className="text-emerald-400 font-semibold">{password ? `"${'*'.repeat(password.length)}"` : 'null'}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400">int right</span>
                <span className={`font-bold ${right === 0 ? 'text-red-400' : 'text-teal-300'}`}>{right}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400">int balance</span>
                <span className="font-bold text-emerald-400">{balance} TL</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                <span className="text-slate-400">int select</span>
                <span className="font-bold text-amber-400">{select !== null ? select : 'null'}</span>
              </div>
            </div>

            {/* Switch-case flow hint */}
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-slate-300">
              <span className="font-bold text-emerald-400">Aktif Akış:</span>{' '}
              {select === null
                ? 'Giriş bekleniyor'
                : select === 1
                ? 'switch(1) -> Para Yatırma'
                : select === 2
                ? 'switch(2) -> Para Çekme'
                : select === 3
                ? 'switch(3) -> Bakiye Sorgulama'
                : select === 4
                ? 'switch(4) -> Çıkış Yap'
                : 'default -> Geçersiz Seçim'}
            </div>
          </div>

          {/* Quick Transaction History Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Hesap Hareketleri
              </span>
              <span className="text-[10px] text-slate-400">{transactions.length} İşlem</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-800/60 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    {tx.type === 'deposit' && <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    {tx.type === 'withdraw' && <ArrowUpCircle className="w-3.5 h-3.5 text-teal-400" />}
                    {tx.type === 'inquiry' && <Wallet className="w-3.5 h-3.5 text-cyan-400" />}
                    <div>
                      <div className="text-slate-200 text-[11px]">{tx.note || tx.type}</div>
                      <div className="text-[9px] text-slate-500">
                        {tx.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {tx.amount && (
                      <div className={tx.type === 'deposit' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {tx.type === 'deposit' ? '+' : '-'}{tx.amount} TL
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400">{tx.balanceAfter} TL</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
