
import Layout from '@/components/Layout';
import CreateWalletForm from '@/components/CreateWalletForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const CreateWallet = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Créer un portefeuille</h1>
        <p className="text-muted-foreground">
          Créez un nouveau portefeuille et assignez-le à un agent
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <CreateWalletForm onSuccess={() => navigate('/wallets')} />
      </div>
    </Layout>
  );
};

export default CreateWallet;
