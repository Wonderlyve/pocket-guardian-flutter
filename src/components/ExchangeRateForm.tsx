
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';

const ExchangeRateForm: React.FC = () => {
  const { exchangeRate, updateExchangeRate } = useWallet();
  const [rate, setRate] = useState<string>(exchangeRate.usdToCdf.toString());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const rateValue = parseFloat(rate);
    if (isNaN(rateValue) || rateValue <= 0) {
      setIsLoading(false);
      return;
    }

    updateExchangeRate(rateValue);
    setIsLoading(false);
  };

  const lastUpdated = new Date(exchangeRate.lastUpdated);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Taux de change</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Taux actuel: 1 USD = {exchangeRate.usdToCdf} CDF
          </p>
          <p className="text-xs text-muted-foreground">
            Dernière mise à jour: {lastUpdated.toLocaleDateString()} à {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exchangeRate">Nouveau taux (CDF pour 1 USD)</Label>
            <Input
              id="exchangeRate"
              type="number"
              step="0.01"
              min="1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Taux de change"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-wallet-primary hover:bg-wallet-secondary" disabled={isLoading}>
            {isLoading ? 'Mise à jour...' : 'Mettre à jour le taux'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExchangeRateForm;
