import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  CornerDownLeft, 
  Sparkles, 
  Code2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface ConsoleRunnerProps {
  soundEnabled: boolean;
}

type StepType = 
  | 'WAITING_USER_NAME'
  | 'WAITING_PASSWORD'
  | 'WAITING_SELECT'
  | 'WAITING_DEPOSIT_PRICE'
  | 'WAITING_WITHDRAW_PRICE'
  | 'FINISHED'
  | 'BLOCKED';

interface ConsoleLine {
  id: string;
  type: 'output' | 'input' | 'prompt' | 'system' | 'highlight';
  text: string;
}

export const ConsoleRunner: React.FC<ConsoleRunnerProps> = ({ soundEnabled }) => {
  // Java application state variables
  const [right, setRight] = useState(3);
  const [balance, setBalance] = useState(1500);
  const [select, setSelect] = useState(0);
  const [step, setStep] = useState<StepType>('WAITING_USER_NAME');
  const [tempUserName, setTempUserName] = useState('');

  // Terminal history & input
  const [history, setHistory] = useState<ConsoleLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeJavaLine, setActiveJavaLine] = useState<string>('while (right > 0)');

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerSound = (type: 'beep' | 'card' | 'cash' | 'success' | 'error' | 'click') => {
    if (soundEnabled) playSound(type);
  };

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  // Initialize terminal on mount
  useEffect(() => {
    initProgram();
  }, []);

  const initProgram = () => {
    triggerSound('click');
    setRight(3);
    setBalance(1500);
    setSelect(0);
    setStep('WAITING_USER_NAME');
    setTempUserName('');
    setInputValue('');
    setActiveJavaLine('System.out.print("Kullanıcı Adınız : ");');

    setHistory([
      { id: '1', type: 'system', text: '$ javac Main.java && java Main' },
      { id: '2', type: 'system', text: '// Program başlatıldı. Başlangıç bakiyesi: 1500 TL, Kalan hak: 3' },
      { id: '3', type: 'prompt', text: 'Kullanıcı Adınız : ' },
    ]);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Helper to add lines to terminal
  const appendLines = (lines: { type: ConsoleLine['type']; text: string }[]) => {
    setHistory((prev) => [
      ...prev,
      ...lines.map((l, idx) => ({
        id: `${Date.now()}-${idx}-${Math.random()}`,
        type: l.type,
        text: l.text,
      })),
    ]);
  };

  const handleInputSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = inputValue.trim();
    if (step === 'FINISHED' || step === 'BLOCKED') return;

    triggerSound('beep');

    // Echo the user input into the terminal
    appendLines([{ type: 'input', text: val }]);
    setInputValue('');

    processInput(val);
  };

  const processInput = (val: string) => {
    if (step === 'WAITING_USER_NAME') {
      setTempUserName(val);
      setActiveJavaLine('System.out.print("Parolanız : ");');
      setStep('WAITING_PASSWORD');
      appendLines([{ type: 'prompt', text: 'Parolanız : ' }]);
      return;
    }

    if (step === 'WAITING_PASSWORD') {
      setActiveJavaLine('if (userName.equals("patika") && password.equals("dev123"))');
      const isAuth = tempUserName === 'patika' && val === 'dev123';

      if (isAuth) {
        triggerSound('success');
        setActiveJavaLine('do { ... switch(select) ... } while(select != 4);');
        setStep('WAITING_SELECT');
        appendLines([
          { type: 'output', text: 'Merhaba, Kodluyoruz Bankasına Hoşgeldiniz!' },
          {
            type: 'output',
            text: '1-Para yatırma\n2-Para Çekme\n3-Bakiye Sorgula\n4-Çıkış Yap',
          },
          { type: 'prompt', text: 'Lütfen yapmak istediğiniz işlemi seçiniz : ' },
        ]);
      } else {
        triggerSound('error');
        const newRight = right - 1;
        setRight(newRight);
        if (newRight === 0) {
          setStep('BLOCKED');
          setActiveJavaLine('System.out.println("Hesabınız bloke olmuştur...");');
          appendLines([
            { type: 'output', text: 'Hatalı kullanıcı adı veya şifre. Tekrar deneyiniz.' },
            {
              type: 'output',
              text: 'Hesabınız bloke olmuştur lütfen banka ile iletişime geçiniz.',
            },
            { type: 'system', text: '// Program sonlandı. Çıkış kodu 1.' },
          ]);
        } else {
          setActiveJavaLine('System.out.println("Kalan Hakkınız : " + right);');
          setStep('WAITING_USER_NAME');
          appendLines([
            { type: 'output', text: 'Hatalı kullanıcı adı veya şifre. Tekrar deneyiniz.' },
            { type: 'output', text: `Kalan Hakkınız : ${newRight}` },
            { type: 'prompt', text: 'Kullanıcı Adınız : ' },
          ]);
        }
      }
      return;
    }

    if (step === 'WAITING_SELECT') {
      const selNum = parseInt(val, 10);
      setSelect(selNum);

      switch (selNum) {
        case 1:
          setActiveJavaLine('case 1: System.out.print("Para miktarı : ");');
          setStep('WAITING_DEPOSIT_PRICE');
          appendLines([{ type: 'prompt', text: 'Para miktarı : ' }]);
          break;

        case 2:
          setActiveJavaLine('case 2: System.out.print("Para miktarı : ");');
          setStep('WAITING_WITHDRAW_PRICE');
          appendLines([{ type: 'prompt', text: 'Para miktarı : ' }]);
          break;

        case 3:
          triggerSound('click');
          setActiveJavaLine('case 3: System.out.println("Bakiyeniz : " + balance);');
          appendLines([
            { type: 'output', text: `Bakiyeniz : ${balance}` },
            {
              type: 'output',
              text: '1-Para yatırma\n2-Para Çekme\n3-Bakiye Sorgula\n4-Çıkış Yap',
            },
            { type: 'prompt', text: 'Lütfen yapmak istediğiniz işlemi seçiniz : ' },
          ]);
          break;

        case 4:
          triggerSound('success');
          setActiveJavaLine('case 4: System.out.println("Tekrar görüşmek üzere.");');
          setStep('FINISHED');
          appendLines([
            { type: 'output', text: 'Tekrar görüşmek üzere.' },
            { type: 'system', text: '// Program sonlandı. (select == 4) do-while döngüsünden çıkıldı.' },
          ]);
          break;

        default:
          triggerSound('error');
          setActiveJavaLine('default: System.out.println("Geçersiz bir işlem seçtiniz!");');
          appendLines([
            { type: 'output', text: 'Geçersiz bir işlem seçtiniz! Lütfen 1-4 arasında bir seçim yapınız.' },
            {
              type: 'output',
              text: '1-Para yatırma\n2-Para Çekme\n3-Bakiye Sorgula\n4-Çıkış Yap',
            },
            { type: 'prompt', text: 'Lütfen yapmak istediğiniz işlemi seçiniz : ' },
          ]);
          break;
      }
      return;
    }

    if (step === 'WAITING_DEPOSIT_PRICE') {
      const price = parseInt(val, 10);
      if (isNaN(price) || price < 0) {
        appendLines([
          { type: 'output', text: 'Hatalı miktar! Lütfen pozitif bir sayı giriniz.' },
          { type: 'prompt', text: 'Para miktarı : ' },
        ]);
        return;
      }
      triggerSound('cash');
      const newBal = balance + price;
      setBalance(newBal);
      setActiveJavaLine('balance += price; break;');
      setStep('WAITING_SELECT');
      appendLines([
        { type: 'output', text: `Para yatırma başarılı. Güncel Bakiyeniz: ${newBal} TL` },
        {
          type: 'output',
          text: '1-Para yatırma\n2-Para Çekme\n3-Bakiye Sorgula\n4-Çıkış Yap',
        },
        { type: 'prompt', text: 'Lütfen yapmak istediğiniz işlemi seçiniz : ' },
      ]);
      return;
    }

    if (step === 'WAITING_WITHDRAW_PRICE') {
      const price = parseInt(val, 10);
      if (isNaN(price) || price < 0) {
        appendLines([
          { type: 'output', text: 'Hatalı miktar! Lütfen pozitif bir sayı giriniz.' },
          { type: 'prompt', text: 'Para miktarı : ' },
        ]);
        return;
      }

      if (price > balance) {
        triggerSound('error');
        setActiveJavaLine('if (price > balance) { System.out.println("Bakiye yetersiz."); }');
        setStep('WAITING_SELECT');
        appendLines([
          { type: 'output', text: 'Bakiye yetersiz.' },
          {
            type: 'output',
            text: '1-Para yatırma\n2-Para Çekme\n3-Bakiye Sorgula\n4-Çıkış Yap',
          },
          { type: 'prompt', text: 'Lütfen yapmak istediğiniz işlemi seçiniz : ' },
        ]);
      } else {
        triggerSound('cash');
        const newBal = balance - price;
        setBalance(newBal);
        setActiveJavaLine('balance -= price; break;');
        setStep('WAITING_SELECT');
        appendLines([
          { type: 'output', text: `Lütfen paranızı alınız. Güncel Bakiyeniz: ${newBal} TL` },
          {
            type: 'output',
            text: '1-Para yatırma\n2-Para Çekme\n3-Bakiye Sorgula\n4-Çıkış Yap',
          },
          { type: 'prompt', text: 'Lütfen yapmak istediğiniz işlemi seçiniz : ' },
        ]);
      }
      return;
    }
  };

  const copyConsoleOutput = () => {
    const text = history.map((h) => h.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Preset Scenario Runner
  const runScenario = (scenario: 'success' | 'deposit' | 'blocked') => {
    initProgram();
    setTimeout(() => {
      if (scenario === 'success') {
        // patika -> dev123 -> 3 -> 4
        setHistory([
          { id: 's1', type: 'system', text: '$ javac Main.java && java Main' },
          { id: 's2', type: 'prompt', text: 'Kullanıcı Adınız : ' },
          { id: 's3', type: 'input', text: 'patika' },
          { id: 's4', type: 'prompt', text: 'Parolanız : ' },
          { id: 's5', type: 'input', text: 'dev123' },
          { id: 's6', type: 'output', text: 'Merhaba, Kodluyoruz Bankasına Hoşgeldiniz!' },
          { id: 's7', type: 'output', text: '1-Para yatırma\n2-Para Çekme\n3-Bakiye Sorgula\n4-Çıkış Yap' },
          { id: 's8', type: 'prompt', text: 'Lütfen yapmak istediğiniz işlemi seçiniz : ' },
          { id: 's9', type: 'input', text: '3' },
          { id: 's10', type: 'output', text: 'Bakiyeniz : 1500' },
          { id: 's11', type: 'output', text: '1-Para yatırma\n2-Para Çekme\n3-Bakiye Sorgula\n4-Çıkış Yap' },
          { id: 's12', type: 'prompt', text: 'Lütfen yapmak istediğiniz işlemi seçiniz : ' },
          { id: 's13', type: 'input', text: '4' },
          { id: 's14', type: 'output', text: 'Tekrar görüşmek üzere.' },
        ]);
        setStep('FINISHED');
        setActiveJavaLine('case 4: System.out.println("Tekrar görüşmek üzere."); break;');
      } else if (scenario === 'deposit') {
        setHistory([
          { id: 's1', type: 'system', text: '$ javac Main.java && java Main' },
          { id: 's2', type: 'prompt', text: 'Kullanıcı Adınız : ' },
          { id: 's3', type: 'input', text: 'patika' },
          { id: 's4', type: 'prompt', text: 'Parolanız : ' },
          { id: 's5', type: 'input', text: 'dev123' },
          { id: 's6', type: 'output', text: 'Merhaba, Kodluyoruz Bankasına Hoşgeldiniz!' },
          { id: 's7', type: 'output', text: '1-Para yatırma\n2-Para Çekme\n3-Bakiye Sorgula\n4-Çıkış Yap' },
          { id: 's8', type: 'prompt', text: 'Lütfen yapmak istediğiniz işlemi seçiniz : ' },
          { id: 's9', type: 'input', text: '1' },
          { id: 's10', type: 'prompt', text: 'Para miktarı : ' },
          { id: 's11', type: 'input', text: '500' },
          { id: 's12', type: 'output', text: 'Para yatırma başarılı. Güncel Bakiyeniz: 2000 TL' },
          { id: 's13', type: 'output', text: '1-Para yatırma\n2-Para Çekme\n3-Bakiye Sorgula\n4-Çıkış Yap' },
          { id: 's14', type: 'prompt', text: 'Lütfen yapmak istediğiniz işlemi seçiniz : ' },
        ]);
        setBalance(2000);
        setStep('WAITING_SELECT');
        setActiveJavaLine('balance += depositAmount; break;');
      } else if (scenario === 'blocked') {
        setHistory([
          { id: 's1', type: 'system', text: '$ javac Main.java && java Main' },
          { id: 's2', type: 'prompt', text: 'Kullanıcı Adınız : ' },
          { id: 's3', type: 'input', text: 'patika' },
          { id: 's4', type: 'prompt', text: 'Parolanız : ' },
          { id: 's5', type: 'input', text: 'yanlis1' },
          { id: 's6', type: 'output', text: 'Hatalı kullanıcı adı veya şifre. Tekrar deneyiniz.\nKalan Hakkınız : 2' },
          { id: 's7', type: 'prompt', text: 'Kullanıcı Adınız : ' },
          { id: 's8', type: 'input', text: 'patika' },
          { id: 's9', type: 'prompt', text: 'Parolanız : ' },
          { id: 's10', type: 'input', text: 'yanlis2' },
          { id: 's11', type: 'output', text: 'Hatalı kullanıcı adı veya şifre. Tekrar deneyiniz.\nKalan Hakkınız : 1' },
          { id: 's12', type: 'prompt', text: 'Kullanıcı Adınız : ' },
          { id: 's13', type: 'input', text: 'patika' },
          { id: 's14', type: 'prompt', text: 'Parolanız : ' },
          { id: 's15', type: 'input', text: 'yanlis3' },
          { id: 's16', type: 'output', text: 'Hatalı kullanıcı adı veya şifre. Tekrar deneyiniz.\nHesabınız bloke olmuştur lütfen banka ile iletişime geçiniz.' },
        ]);
        setRight(0);
        setStep('BLOCKED');
        setActiveJavaLine('System.out.println("Hesabınız bloke olmuştur...");');
      }
    }, 150);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Quick Preset Scenarios */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Java CLI Konsol Simülatörü
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              Scanner input = new Scanner(System.in);
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Kodu derlemeden doğrudan tarayıcıda çalıştırın. Girişleri klavyenizle yazabilir veya hazır senaryoları test edebilirsiniz.
          </p>
        </div>

        {/* Preset scenario shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => runScenario('success')}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900 transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Senaryo: Başarılı Giriş &amp; Çıkış</span>
          </button>
          <button
            onClick={() => runScenario('deposit')}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-teal-950/70 border border-teal-500/30 text-teal-300 hover:bg-teal-900 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Senaryo: Para Yatırma</span>
          </button>
          <button
            onClick={() => runScenario('blocked')}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-rose-950/70 border border-rose-500/30 text-rose-300 hover:bg-rose-900 transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Senaryo: 3 Kez Hatalı Şifre (Bloke)</span>
          </button>
        </div>
      </div>

      {/* Terminal Box */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm">
        {/* Terminal Title Bar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-xs text-slate-400 font-mono">bash — java Main (Enes Öztürk)</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyConsoleOutput}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition"
              title="Konsol Çıktısını Kopyala"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
            <button
              onClick={initProgram}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition"
              title="Yeniden Başlat"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
              <span>Yeniden Başlat</span>
            </button>
          </div>
        </div>

        {/* Live Java Code Pointer Sub-bar */}
        <div className="bg-slate-900/40 px-4 py-2 border-b border-slate-850 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <Code2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
            <span className="text-slate-500">Çalıştırılan Kod Satırı:</span>
            <span className="text-teal-300 font-bold truncate">{activeJavaLine}</span>
          </div>
          <div className="text-[11px] text-slate-400 flex-shrink-0 ml-2">
            Bakiye: <span className="text-emerald-400">{balance} TL</span> | Kalan Hak: <span className="text-amber-400">{right}</span>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div className="p-4 sm:p-6 min-h-[360px] max-h-[500px] overflow-y-auto space-y-1.5 text-slate-200">
          {history.map((line) => {
            if (line.type === 'system') {
              return (
                <div key={line.id} className="text-slate-500 italic text-xs">
                  {line.text}
                </div>
              );
            }
            if (line.type === 'input') {
              return (
                <div key={line.id} className="text-teal-300 font-bold flex items-center gap-1">
                  <span className="text-slate-600">→</span>
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.type === 'prompt') {
              return (
                <div key={line.id} className="text-slate-300">
                  {line.text}
                </div>
              );
            }
            return (
              <div key={line.id} className="whitespace-pre-line text-emerald-400/90">
                {line.text}
              </div>
            );
          })}

          {/* Interactive input row if not finished */}
          {step !== 'FINISHED' && step !== 'BLOCKED' && (
            <form onSubmit={handleInputSubmit} className="flex items-center pt-2">
              <span className="text-emerald-400 font-bold mr-2">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  step === 'WAITING_USER_NAME'
                    ? 'Kullanıcı adı yazınız (örn: patika)...'
                    : step === 'WAITING_PASSWORD'
                    ? 'Şifrenizi yazınız (örn: dev123)...'
                    : step === 'WAITING_SELECT'
                    ? 'Seçim yapınız (1, 2, 3 veya 4)...'
                    : 'Miktar giriniz...'
                }
                className="flex-1 bg-transparent border-none text-emerald-300 focus:outline-none placeholder-slate-600 font-mono text-sm"
                autoFocus
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs flex items-center gap-1 ml-2 transition"
              >
                <span>Gönder</span>
                <CornerDownLeft className="w-3 h-3" />
              </button>
            </form>
          )}

          {/* Program Finished or Blocked Notice */}
          {(step === 'FINISHED' || step === 'BLOCKED') && (
            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={initProgram}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-semibold flex items-center gap-2 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Konsolu Sıfırla ve Baştan Başlat</span>
              </button>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
