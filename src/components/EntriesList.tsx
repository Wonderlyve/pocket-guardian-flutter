
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Entry, Wallet } from '@/types/wallet';
import { useWallet } from '@/contexts/WalletContext';
import CurrencyDisplay from './CurrencyDisplay';
import { formatDate, formatTime } from '@/lib/utils';

interface EntriesListProps {
  wallet: Wallet;
}

const EntriesList: React.FC<EntriesListProps> = ({ wallet }) => {
  const { getEntriesByWallet } = useWallet();
  const entries = getEntriesByWallet(wallet.id);
  
  // Trier les entrées par date (la plus récente en premier)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Entrées</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Aucune entrée enregistrée pour ce portefeuille.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Entrées</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEntries.map((entry) => (
            <EntryItem key={entry.id} entry={entry} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const EntryItem: React.FC<{ entry: Entry }> = ({ entry }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <div className="space-y-1">
        <p className="font-medium">{entry.description}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(new Date(entry.date))} à {formatTime(new Date(entry.date))}
        </p>
      </div>
      <CurrencyDisplay
        amount={entry.amount}
        currency={entry.currency}
        showBothCurrencies={true}
        className="text-right text-wallet-success"
      />
    </div>
  );
};

export default EntriesList;
