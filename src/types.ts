export type AppTab = 'atm' | 'terminal' | 'code' | 'comparison' | 'report';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'inquiry';
  amount?: number;
  balanceAfter: number;
  date: Date;
  status: 'success' | 'failed';
  note?: string;
}

export interface TerminalLog {
  id: string;
  type: 'stdout' | 'stdin' | 'system' | 'error' | 'success';
  text: string;
  timestamp: string;
}
