
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ExchangeRateForm from '@/components/ExchangeRateForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Settings = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [emailDomain, setEmailDomain] = useState<string>('pocketguardian.com');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    // Charger le domaine depuis localStorage
    const savedDomain = localStorage.getItem('emailDomain');
    if (savedDomain) {
      setEmailDomain(savedDomain);
    }
  }, [isAdmin, navigate]);
  
  const handleDomainChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailDomain || !emailDomain.includes('.')) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom de domaine valide",
        variant: "destructive",
      });
      return;
    }
    
    // Ensure the domain doesn't include @
    const cleanDomain = emailDomain.replace('@', '');
    setEmailDomain(cleanDomain);
    
    // Sauvegarder le domaine dans localStorage
    localStorage.setItem('emailDomain', cleanDomain);
    
    toast({
      title: "Domaine mis à jour",
      description: `Le domaine d'email a été mis à jour: ${cleanDomain}`,
    });
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de l'application
        </p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Domaine d'email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDomainChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailDomain">Domaine pour les emails des agents</Label>
                <Input
                  id="emailDomain"
                  type="text"
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  placeholder="wallet.com"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Ce domaine sera utilisé pour générer les adresses email des agents lors de la création de portefeuilles.
                </p>
                <p className="text-xs text-muted-foreground">
                  Example: <span className="font-medium">nomportefeuille@{emailDomain}</span>
                </p>
              </div>
              <Button type="submit" className="w-full bg-wallet-primary hover:bg-wallet-secondary">
                Enregistrer
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <ExchangeRateForm />
      </div>
    </Layout>
  );
};

export default Settings;
