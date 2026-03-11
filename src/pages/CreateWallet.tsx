
import Layout from '@/components/Layout';
import CreateWalletForm from '@/components/CreateWalletForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Info } from "lucide-react";

const CreateWallet = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Créer un portefeuille</h1>
        <p className="text-sm text-muted-foreground">Créez un nouveau portefeuille et assignez-le à un agent</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="mb-4 p-4 bg-accent rounded-2xl flex gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            Lorsque vous créez un portefeuille pour un nouvel agent, un compte sera automatiquement créé. 
            L'agent pourra se connecter avec l'email généré et le mot de passe défini.
          </p>
        </div>
        
        <CreateWalletForm onSuccess={() => navigate('/wallets')} />
      </div>
    </Layout>
  );
};

export default CreateWallet;
