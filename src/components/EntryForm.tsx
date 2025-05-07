
import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CurrencyDisplay from './CurrencyDisplay';

interface EntryFormProps {
  walletId: string;
  onSuccess?: () => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ walletId, onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'CDF'>('USD');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addEntry, getWalletById, exchangeRate } = useWallet();
  const { currentUser } = useAuth();

  const wallet = getWalletById(walletId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet || !currentUser) return;

    setIsLoading(true);
    
    const entryAmount = parseFloat(amount);
    if (isNaN(entryAmount) || entryAmount <= 0) {
      setIsLoading(false);
      return;
    }

    addEntry({
      walletId: wallet.id,
      amount: entryAmount,
      description,
      currency,
      date: new Date(),
    });

    // Réinitialiser le formulaire
    setAmount('');
    setDescription('');
    setCurrency('USD');
    setIsLoading(false);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  if (!wallet) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ajouter une entrée</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <div className="flex space-x-2">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1"
                required
              />
              <Select
                value={currency}
                onValueChange={(val) => setCurrency(val as 'USD' | 'CDF')}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="CDF">CDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez cette entrée..."
              required
            />
          </div>

          <Button type="submit" className="w-full bg-wallet-success hover:bg-wallet-success/80" disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer l\'entrée'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EntryForm;
