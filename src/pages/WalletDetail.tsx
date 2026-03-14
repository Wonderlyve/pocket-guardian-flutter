
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
import { ArrowUpCircle, ArrowDownCircle, ArrowLeft, TrendingUp } from 'lucide-react';
import BankCard from '@/components/BankCard';
import { useState } from 'react';
import EntryForm from '@/components/EntryForm';
import EntriesList from '@/components/EntriesList';
import ChangePasswordForm from '@/components/ChangePasswordForm';

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
  
  if (!id) { navigate('/'); return null; }
  const wallet = getWalletById(id);
  if (!wallet) { navigate('/'); return null; }
  if (!isAdmin && currentUser && wallet.agentId !== currentUser.id) { navigate('/'); return null; }
  
  const totalExpenses = getTotalExpensesByWallet(id);
  const totalEntries = getTotalEntriesByWallet(id);
  const remainingBalance = getRemainingBalance(id);
  
  // L'admin peut effectuer des opérations uniquement sur ses propres wallets (type admin)
  const isAdminWallet = wallet.walletType === 'admin';
  const isOwnWallet = currentUser && wallet.agentId === currentUser.id;
  const canPerformOperations = isOwnWallet || (isAdmin && isAdminWallet);
  
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
      <div className="mb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-accent hover:bg-accent/80 transition-colors">
          <ArrowLeft className="h-5 w-5 text-primary" />
        </button>
        <h1 className="text-lg font-bold">Détails du portefeuille</h1>
      </div>

      <div className="mb-4">
        <BankCard wallet={wallet} />
      </div>

      <div className="grid gap-3 mb-4 grid-cols-3">
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-3 text-center">
            <ArrowDownCircle className="h-5 w-5 text-destructive mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Dépenses</p>
            <CurrencyDisplay amount={totalExpenses} className="text-sm font-bold text-destructive" />
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-3 text-center">
            <ArrowUpCircle className="h-5 w-5 text-wallet-success mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Encaissements</p>
            <CurrencyDisplay amount={totalEntries} className="text-sm font-bold text-wallet-success" />
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-border/50">
          <CardContent className="p-3 text-center">
            <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-[10px] text-muted-foreground">Solde</p>
            <CurrencyDisplay amount={remainingBalance} className="text-sm font-bold text-primary" />
          </CardContent>
        </Card>
      </div>
      
      {isAdmin && (
        <Card className="mb-4 rounded-2xl border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary">Modifier le solde</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateBalance} className="flex gap-2 items-end">
              <div className="space-y-1 flex-1">
                <Label htmlFor="newBalance" className="text-xs">Nouveau solde (USD)</Label>
                <Input
                  id="newBalance"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  placeholder={wallet.balance.toString()}
                  required
                  className="h-10 rounded-xl"
                />
              </div>
              <Button type="submit" className="rounded-xl bg-primary hover:bg-secondary h-10" disabled={isUpdating} size="sm">
                {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      
      {currentUser && wallet && currentUser.id === wallet.agentId && (
        <div className="mb-4">
          <ChangePasswordForm walletId={id} />
        </div>
      )}
      
      {canPerformOperations ? (
        <Tabs defaultValue="expenses" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-accent p-1">
            <TabsTrigger value="expenses" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1">
              <ArrowDownCircle className="h-4 w-4" /> Dépenses
            </TabsTrigger>
            <TabsTrigger value="entries" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1">
              <ArrowUpCircle className="h-4 w-4" /> Entrées
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="expenses" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <ExpenseForm walletId={id} />
              <ExpensesList wallet={wallet} />
            </div>
          </TabsContent>
          
          <TabsContent value="entries" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <EntryForm walletId={id} />
              <EntriesList wallet={wallet} />
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="mb-4">
          <Card className="rounded-2xl border-border/50 mb-4">
            <CardContent className="p-4 text-center text-muted-foreground">
              <p className="text-sm">👁️ Mode consultation uniquement — vous ne pouvez pas effectuer d'opérations sur ce portefeuille agent.</p>
            </CardContent>
          </Card>
          <Tabs defaultValue="expenses" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 rounded-xl bg-accent p-1">
              <TabsTrigger value="expenses" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1">
                <ArrowDownCircle className="h-4 w-4" /> Dépenses
              </TabsTrigger>
              <TabsTrigger value="entries" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-1">
                <ArrowUpCircle className="h-4 w-4" /> Entrées
              </TabsTrigger>
            </TabsList>
            <TabsContent value="expenses" className="mt-4">
              <ExpensesList wallet={wallet} />
            </TabsContent>
            <TabsContent value="entries" className="mt-4">
              <EntriesList wallet={wallet} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Layout>
  );
};

export default WalletDetail;
