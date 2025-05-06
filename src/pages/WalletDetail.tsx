
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import ExpenseForm from '@/components/ExpenseForm';
import ExpensesList from '@/components/ExpensesList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

const WalletDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWalletById, updateWalletBalance, getTotalExpensesByWallet, getRemainingBalance } = useWallet();
  const { isAdmin, currentUser } = useAuth();
  
  const [newBalance, setNewBalance] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  if (!id) {
    navigate('/');
    return null;
  }
  
  const wallet = getWalletById(id);
  
  if (!wallet) {
    navigate('/');
    return null;
  }
  
  // Vérifier que l'utilisateur a accès à ce portefeuille
  if (!isAdmin && currentUser && wallet.agentId !== currentUser.id) {
    navigate('/');
    return null;
  }
  
  const totalExpenses = getTotalExpensesByWallet(id);
  const remainingBalance = getRemainingBalance(id);
  
  const handleUpdateBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const balanceValue = parseFloat(newBalance);
    if (!isNaN(balanceValue) && balanceValue >= 0) {
      updateWalletBalance(id, balanceValue);
    }
    
    setNewBalance('');
    setIsUpdating(false);
  };

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{wallet.name}</h1>
          <p className="text-muted-foreground">
            Créé le {new Date(wallet.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Solde total</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={wallet.balance} className="text-2xl font-bold" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dépenses totales</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={totalExpenses} className="text-2xl font-bold text-wallet-warning" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Solde restant</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={remainingBalance} className="text-2xl font-bold text-wallet-success" />
          </CardContent>
        </Card>
      </div>
      
      {isAdmin && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Modifier le solde</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateBalance} className="flex gap-2 items-end">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="newBalance">Nouveau solde (USD)</Label>
                  <Input
                    id="newBalance"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    placeholder={wallet.balance.toString()}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-wallet-primary hover:bg-wallet-secondary"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <ExpenseForm walletId={id} />
        </div>
        <div>
          <ExpensesList wallet={wallet} />
        </div>
      </div>
    </Layout>
  );
};

export default WalletDetail;
