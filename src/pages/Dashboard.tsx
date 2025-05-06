
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import Layout from '@/components/Layout';
import WalletCard from '@/components/WalletCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { currentUser, isAdmin } = useAuth();
  const { wallets, getWalletsByAgent } = useWallet();
  const navigate = useNavigate();

  if (!currentUser) {
    return <div>Chargement...</div>;
  }

  const userWallets = isAdmin 
    ? wallets 
    : getWalletsByAgent(currentUser.id);

  // Calcul des totaux pour l'administrateur
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Bienvenue, {currentUser.name}
        </h1>
        <p className="text-muted-foreground">
          {isAdmin ? "Gérez vos portefeuilles et suivez les dépenses de vos agents." : "Suivez vos dépenses et gérez votre portefeuille."}
        </p>
      </div>

      {isAdmin && (
        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Trésorerie totale</CardTitle>
              <CardDescription>Montant total des fonds</CardDescription>
            </CardHeader>
            <CardContent>
              <CurrencyDisplay amount={totalBalance} className="text-2xl font-bold" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Portefeuilles</CardTitle>
              <CardDescription>Nombre de portefeuilles actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{wallets.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Actions rapides</CardTitle>
              <CardDescription>Gérer les portefeuilles</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button 
                className="w-full bg-wallet-primary hover:bg-wallet-secondary"
                onClick={() => navigate('/wallets')}
              >
                Voir tous les portefeuilles
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/settings')}
              >
                Paramètres
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {isAdmin ? "Tous les portefeuilles" : "Vos portefeuilles"}
        </h2>
        {isAdmin && (
          <Button 
            onClick={() => navigate('/wallets/create')}
            className="bg-wallet-primary hover:bg-wallet-secondary"
          >
            Créer un portefeuille
          </Button>
        )}
      </div>

      {userWallets.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Aucun portefeuille disponible.</p>
            {isAdmin && (
              <Button 
                onClick={() => navigate('/wallets/create')}
                className="mt-4 bg-wallet-primary hover:bg-wallet-secondary"
              >
                Créer votre premier portefeuille
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userWallets.map((wallet) => (
            <WalletCard 
              key={wallet.id} 
              wallet={wallet} 
              onClick={() => navigate(`/wallets/${wallet.id}`)}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
