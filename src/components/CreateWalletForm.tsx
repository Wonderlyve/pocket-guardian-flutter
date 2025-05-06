
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { createWallet } = useWallet();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const balanceValue = parseFloat(balance);
    if (isNaN(balanceValue) || balanceValue <= 0) {
      setIsLoading(false);
      return;
    }

    createWallet(name, balanceValue, agentId);

    // Réinitialiser le formulaire
    setName('');
    setBalance('');
    setAgentId('');
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

          <Button type="submit" className="w-full bg-wallet-primary hover:bg-wallet-secondary" disabled={isLoading}>
            {isLoading ? 'Création en cours...' : 'Créer le portefeuille'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateWalletForm;
