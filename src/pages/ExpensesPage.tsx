
import Layout from '@/components/Layout';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { formatCurrency } from '@/lib/utils';
import { ArrowDownCircle, Hash, Wallet } from 'lucide-react';

const ExpensesPage = () => {
  const { currentUser } = useAuth();
  const { getWalletsByAgent, expenses, getWalletById } = useWallet();
  
  if (!currentUser) return <div>Chargement...</div>;
  
  const userWallets = getWalletsByAgent(currentUser.id);
  const userExpenses = expenses.filter(expense => {
    const wallet = getWalletById(expense.walletId);
    return wallet && wallet.agentId === currentUser.id;
  });
  
  const sortedExpenses = [...userExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalExpensesAmount = userExpenses.reduce((total, expense) => {
    const amountInUsd = expense.convertedAmount || (expense.currency === 'USD' ? expense.amount : 0);
    return total + amountInUsd;
  }, 0);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Historique des dépenses</h1>
        <p className="text-sm text-muted-foreground">Consultez toutes vos dépenses</p>
      </div>
      
      <div className="grid gap-3 mb-6 grid-cols-3">
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-3 text-center">
            <ArrowDownCircle className="h-5 w-5 text-destructive mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Total</p>
            <CurrencyDisplay amount={totalExpensesAmount} className="text-sm font-bold" />
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-3 text-center">
            <Hash className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Nombre</p>
            <p className="text-sm font-bold">{userExpenses.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-3 text-center">
            <Wallet className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Portefeuilles</p>
            <p className="text-sm font-bold">{userWallets.length}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="rounded-2xl border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Toutes les dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedExpenses.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">Aucune dépense enregistrée.</p>
          ) : (
            <div className="space-y-0">
              {sortedExpenses.map((expense) => {
                const wallet = getWalletById(expense.walletId);
                return (
                  <div key={expense.id} className="flex justify-between items-center py-3 border-b border-border/50 last:border-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-destructive/10">
                        <ArrowDownCircle className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{expense.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()} · {wallet?.name || 'Inconnu'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-destructive">-{formatCurrency(expense.amount, expense.currency)}</p>
                      {expense.currency === 'CDF' && expense.convertedAmount && (
                        <p className="text-xs text-muted-foreground">{formatCurrency(expense.convertedAmount, 'USD')}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ExpensesPage;
