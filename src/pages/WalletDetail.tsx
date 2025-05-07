
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

// Définition temporaire des entrées pour éviter les erreurs
interface Entry {
  id: string;
  walletId: string;
  amount: number;
  description: string;
  date: Date;
}

const WalletDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWalletById, updateWalletBalance, getTotalExpensesByWallet, getRemainingBalance } = useWallet();
  const { isAdmin, currentUser } = useAuth();
  
  const [newBalance, setNewBalance] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  // Pour la gestion des entrées
  const [newEntry, setNewEntry] = useState<string>('');
  const [entryDescription, setEntryDescription] = useState<string>('');
  const [entries, setEntries] = useState<Entry[]>([]);
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
  
  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entryAmount = parseFloat(newEntry);
    if (!isNaN(entryAmount) && entryAmount > 0 && entryDescription.trim()) {
      const newEntryItem: Entry = {
        id: Date.now().toString(),
        walletId: id,
        amount: entryAmount,
        description: entryDescription,
        date: new Date()
      };
      
      setEntries([...entries, newEntryItem]);
      
      // Dans un cas réel, il faudrait mettre à jour le solde du portefeuille
      updateWalletBalance(id, wallet.balance + entryAmount);
      
      setNewEntry('');
      setEntryDescription('');
    }
  };

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Détails du portefeuille</h1>
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

      <div className="grid gap-4 mb-4 md:grid-cols-2">
        <Card className="bg-wallet-warning/10 border-wallet-warning/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-wallet-warning">Dépenses totales</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={totalExpenses} className="text-xl font-bold text-wallet-warning" />
          </CardContent>
        </Card>
        
        <Card className="bg-wallet-success/10 border-wallet-success/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-wallet-success">Solde restant</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={remainingBalance} className="text-xl font-bold text-wallet-success" />
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Nouvelle entrée de caisse</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddEntry} className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="entryAmount">Montant (USD)</Label>
                      <Input
                        id="entryAmount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={newEntry}
                        onChange={(e) => setNewEntry(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="entryDescription">Description</Label>
                      <Input
                        id="entryDescription"
                        type="text"
                        value={entryDescription}
                        onChange={(e) => setEntryDescription(e.target.value)}
                        placeholder="Description de l'entrée"
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-wallet-success hover:bg-wallet-success/80">
                      Ajouter l'entrée
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Historique des entrées</CardTitle>
                </CardHeader>
                <CardContent>
                  {entries.length > 0 ? (
                    <ul className="space-y-2">
                      {entries.map(entry => (
                        <li key={entry.id} className="border-b pb-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{entry.description}</span>
                            <CurrencyDisplay amount={entry.amount} className="text-wallet-success" />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {entry.date.toLocaleDateString()} à {entry.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">Aucune entrée enregistrée</p>
                  )}
                </CardContent>
              </Card>
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
            className="flex flex-col items-center space-y-1"
            size="sm"
          >
            <Home className="h-4 w-4 text-wallet-primary" />
            <span className="text-xs">Accueil</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/wallets')} 
            variant="ghost" 
            className="flex flex-col items-center space-y-1"
            size="sm"
          >
            <Wallet className="h-4 w-4 text-wallet-primary" />
            <span className="text-xs">Portefeuilles</span>
          </Button>
          
          {isAdmin && (
            <Button 
              onClick={() => navigate('/settings')} 
              variant="ghost" 
              className="flex flex-col items-center space-y-1"
              size="sm"
            >
              <Settings className="h-4 w-4 text-wallet-primary" />
              <span className="text-xs">Paramètres</span>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1"
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
