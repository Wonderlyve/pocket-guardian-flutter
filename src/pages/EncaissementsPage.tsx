
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Entry } from '@/types/wallet';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { formatDate, formatTime } from '@/lib/utils';
import { Home, Wallet, Settings, Bell, ArrowUpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EntryForm from '@/components/EntryForm';

const EncaissementsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWalletById, getEntriesByWallet, getTotalEntriesByWallet } = useWallet();
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

  const entries = getEntriesByWallet(id);
  const totalEntries = getTotalEntriesByWallet(id);

  // Grouper les entrées par date
  const groupedEntries: { [key: string]: Entry[] } = {};
  entries.forEach((entry) => {
    const dateStr = formatDate(new Date(entry.date));
    if (!groupedEntries[dateStr]) {
      groupedEntries[dateStr] = [];
    }
    groupedEntries[dateStr].push(entry);
  });

  // Trier les dates du plus récent au plus ancien
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('/'));
    const dateB = new Date(b.split('/').reverse().join('/'));
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Encaissements</h1>
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

      <Card className="bg-wallet-success/10 border-wallet-success/30 mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-wallet-success">Total des encaissements</CardTitle>
        </CardHeader>
        <CardContent>
          <CurrencyDisplay amount={totalEntries} className="text-xl font-bold text-wallet-success" />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <EntryForm walletId={id} />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historique des encaissements</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-auto">
            {sortedDates.length > 0 ? (
              sortedDates.map((date) => (
                <div key={date} className="mb-4">
                  <h3 className="text-xs font-medium bg-muted/30 px-3 py-1 rounded-md mb-2">
                    {date}
                  </h3>
                  <div className="space-y-2">
                    {groupedEntries[date].sort((a, b) => 
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                    ).map((entry) => (
                      <EntryItem key={entry.id} entry={entry} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Aucun encaissement n'a été enregistré pour ce portefeuille.
              </p>
            )}
          </CardContent>
        </Card>
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
            onClick={() => navigate(`/operations/${id}`)} 
            variant="ghost" 
            className="flex flex-col items-center space-y-0.5 w-16"
            size="sm"
          >
            <ArrowUpCircle className="h-4 w-4 text-wallet-primary" />
            <span className="text-xs">Opérations</span>
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

const EntryItem: React.FC<{ entry: Entry }> = ({ entry }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-none">
      <div className="space-y-1">
        <p className="font-medium">{entry.description}</p>
        <p className="text-xs text-muted-foreground">
          {formatTime(new Date(entry.date))}
        </p>
      </div>
      <CurrencyDisplay
        amount={entry.amount}
        currency={entry.currency}
        showBothCurrencies={false}
        className="text-wallet-success font-medium"
      />
    </div>
  );
};

export default EncaissementsPage;
