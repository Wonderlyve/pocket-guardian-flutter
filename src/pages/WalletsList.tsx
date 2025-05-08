
import Layout from '@/components/Layout';
import { useWallet } from '@/contexts/WalletContext';
import WalletCard from '@/components/WalletCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Users } from 'lucide-react';

const WalletsList = () => {
  const { wallets } = useWallet();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Gestion des portefeuilles</h1>
        <div className="flex items-center gap-4 mt-4">
          <Button 
            onClick={() => navigate('/wallets/create')}
            className="bg-wallet-primary hover:bg-wallet-secondary flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Créer un portefeuille
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <WalletCard 
            key={wallet.id} 
            wallet={wallet} 
            onClick={() => navigate(`/wallets/${wallet.id}`)}
          />
        ))}
      </div>

      {wallets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Aucun portefeuille créé</p>
          <Button 
            onClick={() => navigate('/wallets/create')}
            className="bg-wallet-primary hover:bg-wallet-secondary"
          >
            Créer votre premier portefeuille
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default WalletsList;
