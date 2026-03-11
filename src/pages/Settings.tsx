
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
import { Globe, RefreshCw } from 'lucide-react';

const Settings = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [emailDomain, setEmailDomain] = useState<string>('pocketguardian.com');

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    const savedDomain = localStorage.getItem('emailDomain');
    if (savedDomain) setEmailDomain(savedDomain);
  }, [isAdmin, navigate]);
  
  const handleDomainChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailDomain || !emailDomain.includes('.')) {
      toast({ title: "Erreur", description: "Veuillez entrer un nom de domaine valide", variant: "destructive" });
      return;
    }
    const cleanDomain = emailDomain.replace('@', '');
    setEmailDomain(cleanDomain);
    localStorage.setItem('emailDomain', cleanDomain);
    toast({ title: "Domaine mis à jour", description: `Le domaine d'email a été mis à jour: ${cleanDomain}` });
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Configurez les paramètres de l'application</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <Card className="rounded-2xl border-border/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-accent">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">Domaine d'email</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDomainChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailDomain" className="text-sm">Domaine pour les emails des agents</Label>
                <Input
                  id="emailDomain"
                  type="text"
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  placeholder="wallet.com"
                  required
                  className="h-10 rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  Exemple: <span className="font-medium text-primary">nomportefeuille@{emailDomain}</span>
                </p>
              </div>
              <Button type="submit" className="w-full rounded-xl bg-primary hover:bg-secondary h-10">
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
