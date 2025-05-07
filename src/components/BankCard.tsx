
import { Wallet } from '@/types/wallet';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { Card } from '@/components/ui/card';

interface BankCardProps {
  wallet: Wallet;
}

const BankCard: React.FC<BankCardProps> = ({ wallet }) => {
  return (
    <Card className="overflow-hidden w-full h-56 relative rounded-xl shadow-lg bg-gradient-to-r from-wallet-card-gradient-from to-wallet-card-gradient-to text-white">
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-1/4 left-6 w-12 h-12 rounded-full border-2 border-white/30"></div>
        <div className="absolute top-1/4 left-12 w-12 h-12 rounded-full border-2 border-white/20"></div>
        <div className="absolute bottom-8 right-8 grid grid-cols-4 gap-1">
          {Array(16).fill(0).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white/40 rounded-full"></div>
          ))}
        </div>
      </div>
      
      <div className="p-6 flex flex-col h-full justify-between relative z-10">
        <div>
          <p className="text-xs font-light text-white/80 uppercase tracking-wider">Portefeuille</p>
          <h2 className="text-2xl font-bold mt-1 tracking-tight">{wallet.name}</h2>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-white/80 mb-1">Solde débité</p>
            <CurrencyDisplay amount={wallet.balance} className="text-2xl font-bold" />
          </div>
          <div className="text-right">
            <p className="text-xs text-white/80 mb-1">Date de création</p>
            <p className="font-medium">{new Date(wallet.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BankCard;
