
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, TransactionType } from '@/types/wallet';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const OperationsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWalletById, getTransactionsByWallet } = useWallet();
  const { isAdmin } = useAuth();

  if (!id) { navigate('/wallets'); return null; }
  const wallet = getWalletById(id);
  if (!wallet) { navigate('/wallets'); return null; }

  const transactions = getTransactionsByWallet(id);

  const groupedTransactions: { [key: string]: Transaction[] } = {};
  transactions.forEach((transaction) => {
    const dateStr = formatDate(new Date(transaction.date));
    if (!groupedTransactions[dateStr]) groupedTransactions[dateStr] = [];
    groupedTransactions[dateStr].push(transaction);
  });

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('/'));
    const dateB = new Date(b.split('/').reverse().join('/'));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Layout>
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(`/wallets/${id}`)} className="p-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors">
          <ArrowLeft className="h-5 w-5 text-primary" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Opérations</h1>
          <p className="text-sm text-muted-foreground">{wallet.name}</p>
        </div>
      </div>

      <div className="space-y-4 mb-20">
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => (
            <div key={date}>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2 mb-2">
                {date}
              </h2>
              <Card className="rounded-2xl border-border/50">
                <CardContent className="py-3 px-4">
                  <div className="space-y-0">
                    {groupedTransactions[date].sort((a, b) => 
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                    ).map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <Card className="rounded-2xl">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Aucune opération enregistrée.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case 'initial': case 'topup': return 'text-primary';
      case 'expense': return 'text-destructive';
      case 'entry': return 'text-wallet-success';
      default: return 'text-muted-foreground';
    }
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'expense': return <ArrowDownCircle className="h-5 w-5 text-destructive" />;
      case 'entry': return <ArrowUpCircle className="h-5 w-5 text-wallet-success" />;
      default: return <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">💰</div>;
    }
  };

  const formatTime = (date: Date) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const displayAmount = () => {
    const amount = transaction.originalAmount || Math.abs(transaction.amount);
    return (
      <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
        {transaction.type === 'expense' ? '-' : '+'}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {transaction.currency}
      </span>
    );
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-none">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-accent">
          {getTransactionIcon(transaction.type)}
        </div>
        <div>
          <p className="font-medium text-sm">{transaction.description}</p>
          <p className="text-xs text-muted-foreground">{formatTime(new Date(transaction.date))}</p>
        </div>
      </div>
      {displayAmount()}
    </div>
  );
};

export default OperationsPage;
