
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

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
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { createWallet } = useWallet();

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

    if (!email.includes('@') || email.length < 5) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide",
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

    createWallet(name, balanceValue, agentId, email, password);

    // Réinitialiser le formulaire
    setName('');
    setBalance('');
    setAgentId('');
    setEmail('');
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

          <div className="space-y-2">
            <Label htmlFor="agent">Agent assigné</Label>
            <Select
              value={agentId}
              onValueChange={setAgentId}
              required
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email de l'agent</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              required
            />
          </div>
          
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
      </CardContent>
    </Card>
  );
};

export default CreateWalletForm;
