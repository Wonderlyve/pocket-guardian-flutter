
import Layout from '@/components/Layout';
import ExchangeRateForm from '@/components/ExchangeRateForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Settings = () => {
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
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de l'application
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <ExchangeRateForm />
      </div>
    </Layout>
  );
};

export default Settings;
