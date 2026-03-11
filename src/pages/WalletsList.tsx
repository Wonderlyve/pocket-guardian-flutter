
import Layout from '@/components/Layout';
import { useWallet } from '@/contexts/WalletContext';
import WalletCard from '@/components/WalletCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Wallet } from 'lucide-react';

const WalletsList = () => {
  const { wallets } = useWallet();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) { navigate('/'); return null; }

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Portefeuilles</h1>
        <Button onClick={() => navigate('/wallets/create')} className="rounded-xl bg-primary hover:bg-secondary flex items-center gap-2" size="sm">
          <PlusCircle className="h-4 w-4" /> Créer
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <WalletCard key={wallet.id} wallet={wallet} onClick={() => navigate(`/wallets/${wallet.id}`)} />
        ))}
      </div>

      {wallets.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground mb-4">Aucun portefeuille créé</p>
          <Button onClick={() => navigate('/wallets/create')} className="rounded-xl bg-primary hover:bg-secondary">
            Créer votre premier portefeuille
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default WalletsList;
