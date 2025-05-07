
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
import { Home, Wallet, Settings, Bell } from 'lucide-react';
import BankCard from '@/components/BankCard';
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
          <h1 className="text-2xl font-bold">Détails du portefeuille</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>
      </div>

      <div className="mb-6">
        <BankCard wallet={wallet} />
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <Card className="bg-wallet-warning/10 border-wallet-warning/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-wallet-warning">Dépenses totales</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={totalExpenses} className="text-2xl font-bold text-wallet-warning" />
          </CardContent>
        </Card>
        
        <Card className="bg-wallet-success/10 border-wallet-success/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-wallet-success">Solde restant</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={remainingBalance} className="text-2xl font-bold text-wallet-success" />
          </CardContent>
        </Card>
      </div>
      
      {isAdmin && (
        <div className="mb-6">
          <Card className="bg-wallet-info/5 border-wallet-info/20">
            <CardHeader>
              <CardTitle className="text-lg text-wallet-info">Modifier le solde</CardTitle>
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
      
      <div className="grid gap-6 md:grid-cols-2 mb-20">
        <div>
          <ExpenseForm walletId={id} />
        </div>
        <div>
          <ExpensesList wallet={wallet} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-2 px-4 z-50">
        <div className="container mx-auto flex justify-around items-center">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="flex flex-col items-center space-y-1"
          >
            <Home className="h-5 w-5 text-wallet-primary" />
            <span className="text-xs">Accueil</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/wallets')} 
            variant="ghost" 
            className="flex flex-col items-center space-y-1"
          >
            <Wallet className="h-5 w-5 text-wallet-primary" />
            <span className="text-xs">Portefeuilles</span>
          </Button>
          
          {isAdmin && (
            <Button 
              onClick={() => navigate('/settings')} 
              variant="ghost" 
              className="flex flex-col items-center space-y-1"
            >
              <Settings className="h-5 w-5 text-wallet-primary" />
              <span className="text-xs">Paramètres</span>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1"
          >
            <Bell className="h-5 w-5 text-wallet-primary" />
            <span className="text-xs">Notifications</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default WalletDetail;
