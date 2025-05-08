
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet } from '@/contexts/WalletContext';
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Utilisateurs simulés (à remplacer par une vraie API)
const MOCK_AGENTS = [
  { id: '2', name: 'Agent One' },
  { id: '3', name: 'Agent Two' },
];

interface CreateWalletFormProps {
  onSuccess?: () => void;
}

const CreateWalletForm: React.FC<CreateWalletFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState<string>('');
  const [balance, setBalance] = useState<string>('');
  const [agentId, setAgentId] = useState<string>('');
  const [newAgentName, setNewAgentName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [agentMode, setAgentMode] = useState<'existing' | 'new'>('existing');
  const [emailDomain, setEmailDomain] = useState<string>('pocketguardian.com');

  const { createWallet } = useWallet();
  
  useEffect(() => {
    // Charger le domaine depuis localStorage
    const savedDomain = localStorage.getItem('emailDomain');
    if (savedDomain) {
      setEmailDomain(savedDomain);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const balanceValue = parseFloat(balance);
    if (isNaN(balanceValue) || balanceValue <= 0) {
      toast({
        title: "Erreur",
        description: "Le solde initial doit être un nombre positif",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Générer l'email basé sur le nom du portefeuille et le domaine
    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const timestamp = new Date().getTime().toString().slice(-4);
    const email = `${sanitizedName}${timestamp}@${emailDomain}`;
    
    // Déterminer l'ID de l'agent
    let selectedAgentId: string;
    let selectedAgentName: string;
    
    if (agentMode === 'new') {
      if (!newAgentName.trim()) {
        toast({
          title: "Erreur",
          description: "Veuillez entrer un nom pour le nouvel agent",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Générer un ID pour le nouvel agent (dans une vraie application, cela viendrait de la base de données)
      selectedAgentId = `agent-${Date.now()}`;
      selectedAgentName = newAgentName;
      
      // Dans une vraie application, vous créeriez l'agent dans la base de données ici
      // pour l'instant, on simule juste
    } else {
      if (!agentId) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un agent",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      selectedAgentId = agentId;
    }

    createWallet(name, balanceValue, selectedAgentId, email, password);

    // Réinitialiser le formulaire
    setName('');
    setBalance('');
    setAgentId('');
    setNewAgentName('');
    setPassword('');
    setIsLoading(false);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Créer un portefeuille</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="existing" onValueChange={(value) => setAgentMode(value as 'existing' | 'new')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="existing">Agent existant</TabsTrigger>
            <TabsTrigger value="new">Nouvel agent</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du portefeuille</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du portefeuille"
                required
              />
              {name && (
                <p className="text-xs text-muted-foreground">
                  Email généré: {name.toLowerCase().replace(/[^a-z0-9]/g, '')}{new Date().getTime().toString().slice(-4)}@{emailDomain}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="balance">Solde initial (USD)</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                min="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <TabsContent value="existing" className="space-y-2 mt-4">
              <Label htmlFor="agent">Agent assigné</Label>
              <Select
                value={agentId}
                onValueChange={setAgentId}
                required={agentMode === 'existing'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un agent" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_AGENTS.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>
            
            <TabsContent value="new" className="space-y-2 mt-4">
              <Label htmlFor="newAgentName">Nom du nouvel agent</Label>
              <Input
                id="newAgentName"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                placeholder="Nom de l'agent"
                required={agentMode === 'new'}
              />
            </TabsContent>
          
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full bg-wallet-primary hover:bg-wallet-secondary" disabled={isLoading}>
              {isLoading ? 'Création en cours...' : 'Créer le portefeuille'}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CreateWalletForm;
