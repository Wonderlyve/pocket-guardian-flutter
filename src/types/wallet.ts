
export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Add password field for changing later
  role: UserRole;
}

export type WalletType = 'agent' | 'admin';

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  agentId: string;
  createdAt: Date;
  email?: string;
  password?: string;
  walletType?: WalletType;
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
