
import Layout from '@/components/Layout';
import { useWallet } from '@/contexts/WalletContext';
import WalletCard from '@/components/WalletCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des portefeuilles</h1>
        <Button 
          onClick={() => navigate('/wallets/create')}
          className="bg-wallet-primary hover:bg-wallet-secondary"
        >
          Créer un portefeuille
        </Button>
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
