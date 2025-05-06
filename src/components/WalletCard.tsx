
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useWallet } from '@/contexts/WalletContext';
import CurrencyDisplay from './CurrencyDisplay';
import { Wallet } from '@/types/wallet';

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
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="bg-gradient-to-r from-wallet-primary to-wallet-secondary text-white pb-2">
        <CardTitle className="text-lg">{wallet.name}</CardTitle>
        <CardDescription className="text-white opacity-80">
          Créé le {new Date(wallet.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Solde total</span>
            <CurrencyDisplay amount={wallet.balance} className="text-xl font-bold" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Dépenses</span>
            <CurrencyDisplay amount={totalExpenses} className="text-md text-wallet-warning" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Restant</span>
            <CurrencyDisplay amount={remainingBalance} className="text-md text-wallet-success" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Utilisation</span>
              <span>{Math.round(usagePercentage)}%</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
