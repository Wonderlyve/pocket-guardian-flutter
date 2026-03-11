
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useWallet } from '@/contexts/WalletContext';
import CurrencyDisplay from './CurrencyDisplay';
import { Wallet } from '@/types/wallet';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react';

interface WalletCardProps {
  wallet: Wallet;
  onClick?: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet, onClick }) => {
  const { getTotalExpensesByWallet, getRemainingBalance } = useWallet();
  
  const totalExpenses = getTotalExpensesByWallet(wallet.id);
  const remainingBalance = getRemainingBalance(wallet.id);
  const usagePercentage = wallet.balance > 0 ? (totalExpenses / wallet.balance) * 100 : 0;
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl border-border/50 hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader className="bg-primary text-primary-foreground pb-3 relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full border-[10px] border-primary-foreground/10" />
        <CardTitle className="text-lg relative z-10">{wallet.name}</CardTitle>
        <CardDescription className="text-primary-foreground/70 relative z-10">
          Créé le {new Date(wallet.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Solde total
            </span>
            <CurrencyDisplay amount={wallet.balance} className="text-xl font-bold text-foreground" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <ArrowDownCircle className="h-3.5 w-3.5" /> Dépenses
            </span>
            <CurrencyDisplay amount={totalExpenses} className="text-sm font-medium text-destructive" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <ArrowUpCircle className="h-3.5 w-3.5" /> Restant
            </span>
            <CurrencyDisplay amount={remainingBalance} className="text-sm font-medium text-wallet-success" />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Utilisation</span>
              <span>{Math.round(usagePercentage)}%</span>
            </div>
            <Progress value={usagePercentage} className="h-2 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
