
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Wallet, Expense, ExchangeRate } from '@/types/wallet';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface WalletContextType {
  wallets: Wallet[];
  expenses: Expense[];
  exchangeRate: ExchangeRate;
  createWallet: (name: string, balance: number, agentId: string) => void;
  updateWalletBalance: (walletId: string, amount: number) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'convertedAmount'>) => void;
  getWalletById: (id: string) => Wallet | undefined;
  getWalletsByAgent: (agentId: string) => Wallet[];
  getExpensesByWallet: (walletId: string) => Expense[];
  getTotalExpensesByWallet: (walletId: string) => number;
  getRemainingBalance: (walletId: string) => number;
  updateExchangeRate: (rate: number) => void;
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
  },
  {
    id: '3',
    name: 'Portefeuille Agent 2',
    balance: 1500,
    agentId: '3',
    createdAt: new Date(),
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

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    usdToCdf: 2500, // 1 USD = 2500 CDF par défaut
    lastUpdated: new Date(),
  });

  useEffect(() => {
    // Chargement des données initiales
    const storedWallets = localStorage.getItem('wallets');
    const storedExpenses = localStorage.getItem('expenses');
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
    localStorage.setItem('exchangeRate', JSON.stringify(exchangeRate));
  }, [exchangeRate]);

  const createWallet = (name: string, balance: number, agentId: string) => {
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
    };

    setWallets((prev) => [...prev, newWallet]);
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

    setWallets((prev) =>
      prev.map((wallet) =>
        wallet.id === walletId ? { ...wallet, balance: amount } : wallet
      )
    );

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

    const totalExpenses = getTotalExpensesByWallet(expense.walletId);
    const remainingBalance = wallet.balance - totalExpenses;

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
    toast({
      title: "Dépense ajoutée",
      description: `Dépense de ${expense.amount} ${expense.currency} ajoutée`,
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

  const getTotalExpensesByWallet = (walletId: string) => {
    return getExpensesByWallet(walletId).reduce((total, expense) => {
      const amountInUsd = expense.convertedAmount || 
        (expense.currency === 'USD' ? expense.amount : expense.amount / exchangeRate.usdToCdf);
      return total + amountInUsd;
    }, 0);
  };

  const getRemainingBalance = (walletId: string) => {
    const wallet = getWalletById(walletId);
    if (!wallet) return 0;
    
    const totalExpenses = getTotalExpensesByWallet(walletId);
    return wallet.balance - totalExpenses;
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

  return (
    <WalletContext.Provider
      value={{
        wallets,
        expenses,
        exchangeRate,
        createWallet,
        updateWalletBalance,
        addExpense,
        getWalletById,
        getWalletsByAgent,
        getExpensesByWallet,
        getTotalExpensesByWallet,
        getRemainingBalance,
        updateExchangeRate,
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
