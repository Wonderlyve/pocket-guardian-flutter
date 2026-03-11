
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Entry } from '@/types/wallet';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { formatDate, formatTime } from '@/lib/utils';
import { ArrowLeft, ArrowUpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EntryForm from '@/components/EntryForm';

const EncaissementsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWalletById, getEntriesByWallet, getTotalEntriesByWallet } = useWallet();
  const { isAdmin } = useAuth();

  if (!id) { navigate('/wallets'); return null; }
  const wallet = getWalletById(id);
  if (!wallet) { navigate('/wallets'); return null; }

  const entries = getEntriesByWallet(id);
  const totalEntries = getTotalEntriesByWallet(id);

  const groupedEntries: { [key: string]: Entry[] } = {};
  entries.forEach((entry) => {
    const dateStr = formatDate(new Date(entry.date));
    if (!groupedEntries[dateStr]) groupedEntries[dateStr] = [];
    groupedEntries[dateStr].push(entry);
  });

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
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
          <h1 className="text-lg font-bold">Encaissements</h1>
          <p className="text-sm text-muted-foreground">{wallet.name}</p>
        </div>
      </div>

      <Card className="rounded-2xl border-border/50 mb-4 bg-wallet-success/10">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-wallet-success/20">
            <ArrowUpCircle className="h-6 w-6 text-wallet-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total des encaissements</p>
            <CurrencyDisplay amount={totalEntries} className="text-xl font-bold text-wallet-success" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <EntryForm walletId={id} />
        
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Historique</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-auto">
            {sortedDates.length > 0 ? (
              sortedDates.map((date) => (
                <div key={date} className="mb-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 py-1 mb-2">{date}</h3>
                  <div className="space-y-0">
                    {groupedEntries[date].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-none">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-wallet-success/10">
                            <ArrowUpCircle className="h-4 w-4 text-wallet-success" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{entry.description}</p>
                            <p className="text-xs text-muted-foreground">{formatTime(new Date(entry.date))}</p>
                          </div>
                        </div>
                        <CurrencyDisplay amount={entry.amount} currency={entry.currency} showBothCurrencies={false} className="text-wallet-success font-semibold text-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">Aucun encaissement enregistré.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EncaissementsPage;
