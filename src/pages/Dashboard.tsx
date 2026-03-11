
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import Layout from '@/components/Layout';
import WalletCard from '@/components/WalletCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, ArrowRight, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const { wallets, getWalletsByAgent } = useWallet();
  const navigate = useNavigate();

  if (!currentUser) {
    return <div>Chargement...</div>;
  }

  const userWallets = isAdmin ? wallets : getWalletsByAgent(currentUser.id);
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  
  return (
    <Layout>
      {isAdmin && (
        <div className="grid gap-4 mb-6 grid-cols-2">
          <Card className="rounded-2xl border-border/50 col-span-2 bg-primary text-primary-foreground relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full border-[12px] border-primary-foreground/10" />
            <CardHeader className="pb-2">
              <CardDescription className="text-primary-foreground/70">Trésorerie totale</CardDescription>
            </CardHeader>
            <CardContent>
              <CurrencyDisplay amount={totalBalance} className="text-3xl font-bold" />
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-muted-foreground">Portefeuilles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-accent">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{wallets.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-border/50 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/wallets/create')}>
            <CardHeader className="pb-2">
              <CardDescription className="text-muted-foreground">Action rapide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-accent">
                  <PlusCircle className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-semibold">Créer</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          {isAdmin ? "Portefeuilles" : "Vos portefeuilles"}
        </h2>
        {isAdmin && (
          <Button 
            onClick={() => navigate('/wallets')}
            variant="ghost"
            size="sm"
            className="text-primary font-medium"
          >
            Voir tout <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {userWallets.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">Aucun portefeuille disponible.</p>
            {isAdmin && (
              <Button onClick={() => navigate('/wallets/create')} className="rounded-xl bg-primary hover:bg-secondary">
                Créer votre premier portefeuille
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userWallets.map((wallet) => (
            <WalletCard key={wallet.id} wallet={wallet} onClick={() => navigate(`/wallets/${wallet.id}`)} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
