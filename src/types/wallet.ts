
export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  agentId: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  walletId: string;
  amount: number;
  description: string;
  currency: 'USD' | 'CDF';
  date: Date;
  convertedAmount?: number;
}

export interface Entry {
  id: string;
  walletId: string;
  amount: number;
  description: string;
  currency: 'USD' | 'CDF';
  date: Date;
  convertedAmount?: number;
}

export type TransactionType = 'initial' | 'topup' | 'adjustment' | 'expense' | 'entry';

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  description: string;
  currency: 'USD' | 'CDF';
  date: Date;
  originalAmount?: number;
}

export interface ExchangeRate {
  usdToCdf: number;
  lastUpdated: Date;
}
