
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRightLeft, Send } from 'lucide-react';
import CurrencyDisplay from '@/components/CurrencyDisplay';

const TransferPage = () => {
  const navigate = useNavigate();
  const { wallets, transferFunds, getRemainingBalance } = useWallet();
  const { isAdmin } = useAuth();

  const [fromWalletId, setFromWalletId] = useState('');
  const [toWalletId, setToWalletId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const fromWallet = wallets.find(w => w.id === fromWalletId);
  const toWallet = wallets.find(w => w.id === toWalletId);
  const availableBalance = fromWalletId ? getRemainingBalance(fromWalletId) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromWalletId || !toWalletId || !amount) return;
    setIsSubmitting(true);
    transferFunds(fromWalletId, toWalletId, parseFloat(amount), description || 'Transfert de fonds');
    setAmount('');
    setDescription('');
    setFromWalletId('');
    setToWalletId('');
    setIsSubmitting(false);
  };

  const swapWallets = () => {
    const temp = fromWalletId;
    setFromWalletId(toWalletId);
    setToWalletId(temp);
  };

  return (
    <Layout>
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors">
          <ArrowLeft className="h-5 w-5 text-primary" />
        </button>
        <h1 className="text-lg font-bold">Transfert de fonds</h1>
      </div>

      <Card className="rounded-2xl border-border/50 mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Nouveau transfert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Portefeuille source</Label>
              <Select value={fromWalletId} onValueChange={setFromWalletId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Sélectionner le portefeuille source" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.filter(w => w.id !== toWalletId).map(w => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name} {w.walletType === 'admin' ? '(Admin)' : '(Agent)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fromWallet && (
                <p className="text-xs text-muted-foreground">
                  Solde disponible: <CurrencyDisplay amount={availableBalance} className="font-semibold text-primary" />
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <button type="button" onClick={swapWallets} className="p-2 rounded-full bg-accent hover:bg-accent/80 transition-colors">
                <ArrowRightLeft className="h-4 w-4 text-primary" />
              </button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Portefeuille destinataire</Label>
              <Select value={toWalletId} onValueChange={setToWalletId}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Sélectionner le portefeuille destinataire" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.filter(w => w.id !== fromWalletId).map(w => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name} {w.walletType === 'admin' ? '(Admin)' : '(Agent)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Montant (USD)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max={availableBalance}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Description</Label>
              <Input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Motif du transfert"
                className="rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !fromWalletId || !toWalletId || !amount || fromWalletId === toWalletId}
              className="w-full rounded-xl gap-2"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Transfert en cours...' : 'Effectuer le transfert'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default TransferPage;
