
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, TransactionType } from '@/types/wallet';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { formatDate } from '@/lib/utils';
import { Home, Wallet, Settings, Bell, ArrowUpCircle, ArrowDownCircle, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const OperationsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWalletById, getTransactionsByWallet } = useWallet();
  const { isAdmin } = useAuth();

  if (!id) {
    navigate('/wallets');
    return null;
  }

  const wallet = getWalletById(id);
  if (!wallet) {
    navigate('/wallets');
    return null;
  }

  const transactions = getTransactionsByWallet(id);

  // Grouper les transactions par date
  const groupedTransactions: { [key: string]: Transaction[] } = {};
  transactions.forEach((transaction) => {
    const dateStr = formatDate(new Date(transaction.date));
    if (!groupedTransactions[dateStr]) {
      groupedTransactions[dateStr] = [];
    }
    groupedTransactions[dateStr].push(transaction);
  });

  // Trier les dates du plus récent au plus ancien
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('/'));
    const dateB = new Date(b.split('/').reverse().join('/'));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Opérations du portefeuille</h1>
          <p className="text-sm text-muted-foreground">{wallet.name}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate(`/wallets/${id}`)}
          size="sm"
        >
          Retour au portefeuille
        </Button>
      </div>

      <div className="space-y-6 mb-20">
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => (
            <div key={date}>
              <h2 className="text-sm font-medium bg-muted/30 px-4 py-2 rounded-md mb-2">
                {date}
              </h2>
              <Card>
                <CardContent className="py-4">
                  <div className="space-y-3">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aucune opération</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-4">
                Aucune opération n'a été enregistrée pour ce portefeuille.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-2 px-4 z-40">
        <div className="container mx-auto flex justify-around items-center">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="flex flex-col items-center space-y-0.5 w-16"
            size="sm"
          >
            <Home className="h-4 w-4 text-wallet-primary" />
            <span className="text-xs">Accueil</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/wallets')} 
            variant="ghost" 
            className="flex flex-col items-center space-y-0.5 w-16"
            size="sm"
          >
            <Wallet className="h-4 w-4 text-wallet-primary" />
            <span className="text-xs">Portefeuilles</span>
          </Button>
          
          <Button 
            onClick={() => navigate(`/encaissements/${id}`)} 
            variant="ghost" 
            className="flex flex-col items-center space-y-0.5 w-16"
            size="sm"
          >
            <ArrowUpCircle className="h-4 w-4 text-wallet-primary" />
            <span className="text-xs">Encaissements</span>
          </Button>
          
          {isAdmin && (
            <Button 
              onClick={() => navigate('/settings')} 
              variant="ghost" 
              className="flex flex-col items-center space-y-0.5 w-16"
              size="sm"
            >
              <Settings className="h-4 w-4 text-wallet-primary" />
              <span className="text-xs">Paramètres</span>
            </Button>
          )}
          
          <Button 
            onClick={() => navigate('/notifications')}
            variant="ghost" 
            className="flex flex-col items-center space-y-0.5 w-16"
            size="sm"
          >
            <Bell className="h-4 w-4 text-wallet-primary" />
            <span className="text-xs">Notifications</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case 'initial':
      case 'topup':
        return 'text-wallet-info';
      case 'expense':
        return 'text-wallet-warning';
      case 'entry':
        return 'text-wallet-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'initial':
        return '🏦';
      case 'topup':
        return '💰';
      case 'expense':
        return '📉';
      case 'entry':
        return '📈';
      default:
        return '🔄';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Afficher le montant original en CDF ou USD sans conversion
  const displayAmount = () => {
    const amount = transaction.originalAmount || Math.abs(transaction.amount);
    return (
      <span className={`font-medium ${getTransactionColor(transaction.type)}`}>
        {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {transaction.currency}
      </span>
    );
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-none">
      <div className="flex items-center space-x-3">
        <span className="text-xl">{getTransactionIcon(transaction.type)}</span>
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-xs text-muted-foreground">
            {formatTime(new Date(transaction.date))}
          </p>
        </div>
      </div>
      {displayAmount()}
    </div>
  );
};

export default OperationsPage;
