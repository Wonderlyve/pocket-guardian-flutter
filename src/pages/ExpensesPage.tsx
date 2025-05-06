
import Layout from '@/components/Layout';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { formatCurrency } from '@/lib/utils';

const ExpensesPage = () => {
  const { currentUser } = useAuth();
  const { getWalletsByAgent, expenses, getWalletById } = useWallet();
  
  if (!currentUser) {
    return <div>Chargement...</div>;
  }
  
  const userWallets = getWalletsByAgent(currentUser.id);
  
  // Obtenir toutes les dépenses de l'agent
  const userExpenses = expenses.filter(expense => {
    const wallet = getWalletById(expense.walletId);
    return wallet && wallet.agentId === currentUser.id;
  });
  
  // Trier les dépenses par date (la plus récente en premier)
  const sortedExpenses = [...userExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Calculer le total des dépenses
  const totalExpensesAmount = userExpenses.reduce((total, expense) => {
    const amountInUsd = expense.convertedAmount || 
      (expense.currency === 'USD' ? expense.amount : 0); // On ne devrait jamais avoir à calculer ici
    return total + amountInUsd;
  }, 0);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Historique des dépenses</h1>
        <p className="text-muted-foreground">
          Consultez toutes vos dépenses
        </p>
      </div>
      
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={totalExpensesAmount} className="text-2xl font-bold" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nombre de dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userExpenses.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Portefeuilles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{userWallets.length}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Toutes les dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedExpenses.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              Aucune dépense enregistrée.
            </p>
          ) : (
            <div className="space-y-4">
              {sortedExpenses.map((expense) => {
                const wallet = getWalletById(expense.walletId);
                return (
                  <div key={expense.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <div className="text-xs text-muted-foreground">
                        <p>{new Date(expense.date).toLocaleDateString()} à {new Date(expense.date).toLocaleTimeString()}</p>
                        <p>Portefeuille: {wallet?.name || 'Inconnu'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(expense.amount, expense.currency)}</p>
                      {expense.currency === 'CDF' && expense.convertedAmount && (
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(expense.convertedAmount, 'USD')}
                        </p>
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
