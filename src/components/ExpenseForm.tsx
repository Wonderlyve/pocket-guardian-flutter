
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CurrencyDisplay from './CurrencyDisplay';

interface ExpenseFormProps {
  walletId: string;
  onSuccess?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ walletId, onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'CDF'>('USD');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { addExpense, getWalletById, getRemainingBalance, exchangeRate } = useWallet();
  const { currentUser } = useAuth();

  const wallet = getWalletById(walletId);
  const remainingBalance = getRemainingBalance(walletId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet || !currentUser) return;

    setIsLoading(true);
    
    let convertedAmount = parseFloat(amount);
    if (isNaN(convertedAmount) || convertedAmount <= 0) {
      setIsLoading(false);
      return;
    }

    // Si le montant est en CDF, conversion en USD pour vérification
    let amountInUSD = currency === 'USD' ? convertedAmount : convertedAmount / exchangeRate.usdToCdf;

    if (amountInUSD > remainingBalance) {
      // La vérification du solde suffisant se fait aussi dans le contexte, 
      // mais c'est bien de le faire aussi ici pour l'expérience utilisateur
      setIsLoading(false);
      return;
    }

    addExpense({
      walletId: wallet.id,
      amount: convertedAmount,
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
        <CardTitle className="text-lg">Ajouter une dépense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Montant</Label>
              <span className="text-sm text-muted-foreground">
                Solde débité: <CurrencyDisplay amount={remainingBalance} />
              </span>
            </div>
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
              placeholder="Décrivez cette dépense..."
              required
            />
          </div>

          <Button type="submit" className="w-full bg-wallet-primary hover:bg-wallet-secondary" disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer la dépense'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
