
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Wallet, Expense, ExchangeRate, Entry, Transaction, TransactionType } from '@/types/wallet';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface WalletContextType {
  wallets: Wallet[];
  expenses: Expense[];
  entries: Entry[];
  transactions: Transaction[];
  exchangeRate: ExchangeRate;
  createWallet: (name: string, balance: number, agentId: string, email?: string, password?: string) => void;
  updateWalletBalance: (walletId: string, amount: number) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'convertedAmount'>) => void;
  addEntry: (entry: Omit<Entry, 'id' | 'convertedAmount'>) => void;
  getWalletById: (id: string) => Wallet | undefined;
  getWalletsByAgent: (agentId: string) => Wallet[];
  getExpensesByWallet: (walletId: string) => Expense[];
  getEntriesByWallet: (walletId: string) => Entry[];
  getTransactionsByWallet: (walletId: string) => Transaction[];
  getTotalExpensesByWallet: (walletId: string) => number;
  getTotalEntriesByWallet: (walletId: string) => number;
  getRemainingBalance: (walletId: string) => number;
  updateExchangeRate: (rate: number) => void;
  updateWalletPassword: (walletId: string, newPassword: string) => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Données initiales pour la démonstration
const INITIAL_WALLETS: Wallet[] = [
  {
    id: '1',
    name: 'Portefeuille Principal',
    balance: 10000,
    agentId: '1', // Admin
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Portefeuille Agent 1',
    balance: 2000,
    agentId: '2',
    createdAt: new Date(),
    email: 'agent1@example.com',
    password: 'password',
  },
  {
    id: '3',
    name: 'Portefeuille Agent 2',
    balance: 1500,
    agentId: '3',
    createdAt: new Date(),
    email: 'agent2@example.com',
    password: 'password',
  },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: '1',
    walletId: '2',
    amount: 150,
    description: 'Fournitures de bureau',
    currency: 'USD',
    date: new Date(),
  },
  {
    id: '2',
    walletId: '2',
    amount: 75,
    description: 'Transport',
    currency: 'USD',
    date: new Date(),
  },
  {
    id: '3',
    walletId: '3',
    amount: 200,
    description: 'Équipement',
    currency: 'USD',
    date: new Date(),
  },
];

const INITIAL_ENTRIES: Entry[] = [];
const INITIAL_TRANSACTIONS: Transaction[] = [];

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    usdToCdf: 2500, // 1 USD = 2500 CDF par défaut
    lastUpdated: new Date(),
  });

  useEffect(() => {
    // Chargement des données initiales
    const storedWallets = localStorage.getItem('wallets');
    const storedExpenses = localStorage.getItem('expenses');
    const storedEntries = localStorage.getItem('entries');
    const storedTransactions = localStorage.getItem('transactions');
    const storedExchangeRate = localStorage.getItem('exchangeRate');

    if (storedWallets) {
      setWallets(JSON.parse(storedWallets));
    } else {
      setWallets(INITIAL_WALLETS);
      localStorage.setItem('wallets', JSON.stringify(INITIAL_WALLETS));
    }

    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    } else {
      setExpenses(INITIAL_EXPENSES);
      localStorage.setItem('expenses', JSON.stringify(INITIAL_EXPENSES));
    }

    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    } else {
      setEntries(INITIAL_ENTRIES);
      localStorage.setItem('entries', JSON.stringify(INITIAL_ENTRIES));
    }

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.setItem('transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    }

    if (storedExchangeRate) {
      setExchangeRate(JSON.parse(storedExchangeRate));
    } else {
      localStorage.setItem('exchangeRate', JSON.stringify(exchangeRate));
    }
  }, []);

  // Mise à jour du localStorage quand les données changent
  useEffect(() => {
    if (wallets.length > 0) {
      localStorage.setItem('wallets', JSON.stringify(wallets));
    }
  }, [wallets]);

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('entries', JSON.stringify(entries));
    }
  }, [entries]);

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('exchangeRate', JSON.stringify(exchangeRate));
  }, [exchangeRate]);

  const createWallet = (name: string, balance: number, agentId: string, email?: string, password?: string) => {
    if (currentUser?.role !== 'admin') {
      toast({
        title: "Accès refusé",
        description: "Seul un administrateur peut créer un portefeuille",
        variant: "destructive",
      });
      return;
    }

    const newWallet: Wallet = {
      id: Date.now().toString(),
      name,
      balance,
      agentId,
      createdAt: new Date(),
      email,
      password,
    };

    setWallets((prev) => [...prev, newWallet]);
    
    // Ajouter une transaction pour la création du portefeuille
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      walletId: newWallet.id,
      type: 'initial',
      amount: balance,
      description: `Création du portefeuille ${name}`,
      currency: 'USD',
      date: new Date(),
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    
    toast({
      title: "Portefeuille créé",
      description: `Le portefeuille ${name} a été créé avec succès`,
    });
  };

  const updateWalletBalance = (walletId: string, amount: number) => {
    if (currentUser?.role !== 'admin') {
      toast({
        title: "Accès refusé",
        description: "Seul un administrateur peut modifier le solde d'un portefeuille",
        variant: "destructive",
      });
      return;
    }

    const wallet = getWalletById(walletId);
    if (!wallet) return;
    
    const oldBalance = wallet.balance;

    setWallets((prev) =>
      prev.map((wallet) =>
        wallet.id === walletId ? { ...wallet, balance: amount } : wallet
      )
    );

    // Ajouter une transaction pour la modification du solde
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      walletId,
      type: amount > oldBalance ? 'topup' : 'adjustment',
      amount: amount - oldBalance,
      description: `Modification du solde par l'administrateur`,
      currency: 'USD',
      date: new Date(),
    };
    
    setTransactions(prev => [...prev, newTransaction]);

    toast({
      title: "Portefeuille mis à jour",
      description: `Le solde a été modifié avec succès`,
    });
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'convertedAmount'>) => {
    const wallet = getWalletById(expense.walletId);

    if (!wallet) {
      toast({
        title: "Erreur",
        description: "Portefeuille non trouvé",
        variant: "destructive",
      });
      return;
    }
    
    // Vérifier que l'administrateur peut seulement faire des dépenses dans le portefeuille principal
    if (currentUser?.role === 'admin' && wallet.id !== '1') {
      toast({
        title: "Accès refusé",
        description: "Les administrateurs ne peuvent effectuer des dépenses que dans le portefeuille principal",
        variant: "destructive",
      });
      return;
    }
    
    // Vérifier que l'agent ne peut faire des dépenses que dans son propre portefeuille
    if (currentUser?.role !== 'admin' && currentUser?.id !== wallet.agentId) {
      toast({
        title: "Accès refusé",
        description: "Vous ne pouvez effectuer des dépenses que dans votre propre portefeuille",
        variant: "destructive",
      });
      return;
    }

    const totalExpenses = getTotalExpensesByWallet(expense.walletId);
    const totalEntries = getTotalEntriesByWallet(expense.walletId);
    const remainingBalance = wallet.balance + totalEntries - totalExpenses;

    let amountInUsd = expense.amount;
    if (expense.currency === 'CDF') {
      amountInUsd = expense.amount / exchangeRate.usdToCdf;
    }

    if (amountInUsd > remainingBalance) {
      toast({
        title: "Dépense refusée",
        description: "Le montant dépasse le solde disponible",
        variant: "destructive",
      });
      return;
    }

    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      convertedAmount: amountInUsd,
    };

    setExpenses((prev) => [...prev, newExpense]);
    
    // Ajouter une transaction pour la dépense
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      walletId: expense.walletId,
      type: 'expense',
      amount: -amountInUsd, // Montant négatif pour une dépense
      description: expense.description,
      currency: expense.currency,
      date: expense.date,
      originalAmount: expense.amount,
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    
    toast({
      title: "Dépense ajoutée",
      description: `Dépense de ${expense.amount} ${expense.currency} ajoutée`,
    });
  };
  
  const addEntry = (entry: Omit<Entry, 'id' | 'convertedAmount'>) => {
    const wallet = getWalletById(entry.walletId);

    if (!wallet) {
      toast({
        title: "Erreur",
        description: "Portefeuille non trouvé",
        variant: "destructive",
      });
      return;
    }
    
    // Vérifier que l'administrateur peut seulement faire des entrées dans le portefeuille principal
    if (currentUser?.role === 'admin' && wallet.id !== '1') {
      toast({
        title: "Accès refusé",
        description: "Les administrateurs ne peuvent effectuer des entrées que dans le portefeuille principal",
        variant: "destructive",
      });
      return;
    }

    // Vérifier que l'agent ne peut faire des entrées que dans son propre portefeuille
    if (currentUser?.role !== 'admin' && currentUser?.id !== wallet.agentId) {
      toast({
        title: "Accès refusé",
        description: "Vous ne pouvez effectuer des entrées que dans votre propre portefeuille",
        variant: "destructive",
      });
      return;
    }

    let amountInUsd = entry.amount;
    if (entry.currency === 'CDF') {
      amountInUsd = entry.amount / exchangeRate.usdToCdf;
    }

    const newEntry: Entry = {
      ...entry,
      id: Date.now().toString(),
      convertedAmount: amountInUsd,
    };

    setEntries((prev) => [...prev, newEntry]);
    
    // Ajouter une transaction pour l'entrée
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      walletId: entry.walletId,
      type: 'entry',
      amount: amountInUsd, // Montant positif pour une entrée
      description: entry.description,
      currency: entry.currency,
      date: entry.date,
      originalAmount: entry.amount,
    };
    
    setTransactions(prev => [...prev, newTransaction]);

    toast({
      title: "Entrée ajoutée",
      description: `Entrée de ${entry.amount} ${entry.currency} ajoutée`,
    });
  };

  const getWalletById = (id: string) => {
    return wallets.find((wallet) => wallet.id === id);
  };

  const getWalletsByAgent = (agentId: string) => {
    return wallets.filter((wallet) => wallet.agentId === agentId);
  };

  const getExpensesByWallet = (walletId: string) => {
    return expenses.filter((expense) => expense.walletId === walletId);
  };
  
  const getEntriesByWallet = (walletId: string) => {
    return entries.filter((entry) => entry.walletId === walletId);
  };
  
  const getTransactionsByWallet = (walletId: string) => {
    return transactions.filter((transaction) => transaction.walletId === walletId);
  };

  const getTotalExpensesByWallet = (walletId: string) => {
    return getExpensesByWallet(walletId).reduce((total, expense) => {
      const amountInUsd = expense.convertedAmount || 
        (expense.currency === 'USD' ? expense.amount : expense.amount / exchangeRate.usdToCdf);
      return total + amountInUsd;
    }, 0);
  };
  
  const getTotalEntriesByWallet = (walletId: string) => {
    return getEntriesByWallet(walletId).reduce((total, entry) => {
      const amountInUsd = entry.convertedAmount || 
        (entry.currency === 'USD' ? entry.amount : entry.amount / exchangeRate.usdToCdf);
      return total + amountInUsd;
    }, 0);
  };

  const getRemainingBalance = (walletId: string) => {
    const wallet = getWalletById(walletId);
    if (!wallet) return 0;
    
    const totalExpenses = getTotalExpensesByWallet(walletId);
    const totalEntries = getTotalEntriesByWallet(walletId);
    return wallet.balance + totalEntries - totalExpenses;
  };

  const updateExchangeRate = (rate: number) => {
    if (currentUser?.role !== 'admin') {
      toast({
        title: "Accès refusé",
        description: "Seul un administrateur peut modifier le taux de change",
        variant: "destructive",
      });
      return;
    }

    setExchangeRate({
      usdToCdf: rate,
      lastUpdated: new Date(),
    });

    toast({
      title: "Taux de change mis à jour",
      description: `Nouveau taux: 1 USD = ${rate} CDF`,
    });
  };

  // Add new function to update wallet password
  const updateWalletPassword = (walletId: string, newPassword: string): boolean => {
    if (!currentUser) {
      toast({
        title: "Erreur",
        description: "Utilisateur non connecté",
        variant: "destructive",
      });
      return false;
    }
    
    const wallet = getWalletById(walletId);
    
    if (!wallet) {
      toast({
        title: "Erreur",
        description: "Portefeuille non trouvé",
        variant: "destructive",
      });
      return false;
    }
    
    // Verify that only the wallet's agent can change their password
    if (wallet.agentId !== currentUser.id && currentUser.role !== 'admin') {
      toast({
        title: "Accès refusé",
        description: "Vous ne pouvez modifier que le mot de passe de votre propre portefeuille",
        variant: "destructive",
      });
      return false;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return false;
    }
    
    setWallets(prev => 
      prev.map(w => 
        w.id === walletId 
          ? { ...w, password: newPassword } 
          : w
      )
    );
    
    toast({
      title: "Mot de passe mis à jour",
      description: "Le mot de passe a été modifié avec succès",
    });
    
    return true;
  };

  return (
    <WalletContext.Provider
      value={{
        wallets,
        expenses,
        entries,
        transactions,
        exchangeRate,
        createWallet,
        updateWalletBalance,
        addExpense,
        addEntry,
        getWalletById,
        getWalletsByAgent,
        getExpensesByWallet,
        getEntriesByWallet,
        getTransactionsByWallet,
        getTotalExpensesByWallet,
        getTotalEntriesByWallet,
        getRemainingBalance,
        updateExchangeRate,
        updateWalletPassword,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
