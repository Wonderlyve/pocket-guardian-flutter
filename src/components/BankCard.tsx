
import { Wallet } from '@/types/wallet';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { Card } from '@/components/ui/card';

interface BankCardProps {
  wallet: Wallet;
}

const BankCard: React.FC<BankCardProps> = ({ wallet }) => {
  return (
    <Card className="overflow-hidden w-full h-52 relative rounded-2xl shadow-lg bg-primary text-primary-foreground">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-[15px] border-primary-foreground/10" />
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full border-[8px] border-primary-foreground/5" />
        <div className="absolute bottom-8 right-8 grid grid-cols-4 gap-1">
          {Array(16).fill(0).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-primary-foreground/30 rounded-full" />
          ))}
        </div>
      </div>
      
      <div className="p-6 flex flex-col h-full justify-between relative z-10">
        <div>
          <p className="text-xs font-light opacity-70 uppercase tracking-wider">Portefeuille</p>
          <h2 className="text-2xl font-bold mt-1 tracking-tight">{wallet.name}</h2>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs opacity-70 mb-1">Solde débité</p>
            <CurrencyDisplay amount={wallet.balance} className="text-2xl font-bold" />
          </div>
          <div className="text-right">
            <p className="text-xs opacity-70 mb-1">Date de création</p>
            <p className="font-medium text-sm">{new Date(wallet.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BankCard;
