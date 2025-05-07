
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Wallet, Settings, Bell, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import BankCard from '@/components/BankCard';
import { useState } from 'react';
import EntryForm from '@/components/EntryForm';
import EntriesList from '@/components/EntriesList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Définition temporaire des entrées pour éviter les erreurs
interface Entry {
  id: string;
  walletId: string;
  amount: number;
  description: string;
  currency: 'USD' | 'CDF';
  date: Date;
}

const WalletDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWalletById, updateWalletBalance, getTotalExpensesByWallet, getRemainingBalance, getTotalEntriesByWallet, addEntry } = useWallet();
  const { isAdmin, currentUser } = useAuth();
  
  const [newBalance, setNewBalance] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("expenses");
  
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
  const totalEntries = getTotalEntriesByWallet(id);
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
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Détails du portefeuille</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          size="sm"
        >
          Retour
        </Button>
      </div>

      <div className="mb-4">
        <BankCard wallet={wallet} />
      </div>

      <div className="grid gap-4 mb-4 md:grid-cols-3">
        <Card className="bg-wallet-warning/10 border-wallet-warning/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-wallet-warning">Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={totalExpenses} className="text-xl font-bold text-wallet-warning" />
          </CardContent>
        </Card>
        
        <Card className="bg-wallet-success/10 border-wallet-success/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-wallet-success">Encaissements</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={totalEntries} className="text-xl font-bold text-wallet-success" />
          </CardContent>
        </Card>
        
        <Card className="bg-wallet-info/10 border-wallet-info/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-wallet-info">Solde restant</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={remainingBalance} className="text-xl font-bold text-wallet-info" />
          </CardContent>
        </Card>
      </div>
      
      {isAdmin && (
        <div className="mb-4">
          <Card className="bg-wallet-info/5 border-wallet-info/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-wallet-info">Modifier le solde</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateBalance} className="flex gap-2 items-end">
                <div className="space-y-1 flex-1">
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
                  size="sm"
                >
                  {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Tabs defaultValue="expenses" value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses" className="flex items-center gap-1">
            <ArrowDownCircle className="h-4 w-4" /> Dépenses
          </TabsTrigger>
          <TabsTrigger value="entries" className="flex items-center gap-1">
            <ArrowUpCircle className="h-4 w-4" /> Entrées
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <ExpenseForm walletId={id} />
            </div>
            <div>
              <ExpensesList wallet={wallet} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="entries" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <EntryForm walletId={id} />
            </div>
            <div>
              <EntriesList wallet={wallet} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg py-2 px-4 z-40">
        <div className="container mx-auto flex justify-around items-center">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="flex flex-col items-center space-y-0.5 w-16"
            size="sm"
          >
            <Home className="h-4 w-4 text-wallet-primary" />
            <span className="text-xs">Accueil</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/wallets')} 
            variant="ghost" 
            className="flex flex-col items-center space-y-0.5 w-16"
            size="sm"
          >
            <Wallet className="h-4 w-4 text-wallet-primary" />
            <span className="text-xs">Portefeuilles</span>
          </Button>
          
          <Button 
            onClick={() => navigate(`/operations/${id}`)} 
            variant="ghost" 
            className="flex flex-col items-center space-y-0.5 w-16"
            size="sm"
          >
            <ArrowUpCircle className="h-4 w-4 text-wallet-primary" />
            <span className="text-xs">Opérations</span>
          </Button>
          
          {isAdmin && (
            <Button 
              onClick={() => navigate('/settings')} 
              variant="ghost" 
              className="flex flex-col items-center space-y-0.5 w-16"
              size="sm"
            >
              <Settings className="h-4 w-4 text-wallet-primary" />
              <span className="text-xs">Paramètres</span>
            </Button>
          )}
          
          <Button 
            onClick={() => navigate('/notifications')}
            variant="ghost" 
            className="flex flex-col items-center space-y-0.5 w-16"
            size="sm"
          >
            <Bell className="h-4 w-4 text-wallet-primary" />
            <span className="text-xs">Notifications</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default WalletDetail;
