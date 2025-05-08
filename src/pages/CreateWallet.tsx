
import Layout from '@/components/Layout';
import CreateWalletForm from '@/components/CreateWalletForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

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
        <Alert className="mb-6 bg-wallet-light/30 border-wallet-primary/30">
          <Info className="h-4 w-4 text-wallet-primary" />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Lorsque vous créez un portefeuille pour un nouvel agent, un compte utilisateur sera automatiquement créé. 
            L'agent pourra se connecter avec l'email généré et le mot de passe que vous définissez.
          </AlertDescription>
        </Alert>
        
        <CreateWalletForm onSuccess={() => navigate('/wallets')} />
      </div>
    </Layout>
  );
};

export default CreateWallet;
