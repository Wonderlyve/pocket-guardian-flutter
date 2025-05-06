
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense, Wallet } from '@/types/wallet';
import { useWallet } from '@/contexts/WalletContext';
import CurrencyDisplay from './CurrencyDisplay';

interface ExpensesListProps {
  wallet: Wallet;
}

const ExpensesList: React.FC<ExpensesListProps> = ({ wallet }) => {
  const { getExpensesByWallet } = useWallet();
  const expenses = getExpensesByWallet(wallet.id);
  
  // Trier les dépenses par date (la plus récente en premier)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedExpenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Aucune dépense enregistrée pour ce portefeuille.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Dépenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedExpenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ExpenseItem: React.FC<{ expense: Expense }> = ({ expense }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <div className="space-y-1">
        <p className="font-medium">{expense.description}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(expense.date).toLocaleDateString()} à {new Date(expense.date).toLocaleTimeString()}
        </p>
      </div>
      <CurrencyDisplay
        amount={expense.amount}
        currency={expense.currency}
        showBothCurrencies={true}
        className="text-right"
      />
    </div>
  );
};

export default ExpensesList;
