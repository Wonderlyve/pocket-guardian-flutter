
import { useWallet } from '@/contexts/WalletContext';
import { formatCurrency } from '@/lib/utils';
import React from 'react';

interface CurrencyDisplayProps {
  amount: number;
  currency?: 'USD' | 'CDF';
  showBothCurrencies?: boolean;
  className?: string;
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency = 'USD',
  showBothCurrencies = false,
  className = '',
}) => {
  const { exchangeRate } = useWallet();

  if (currency === 'USD') {
    if (showBothCurrencies) {
      return (
        <div className={`space-y-1 ${className}`}>
          <div>{formatCurrency(amount, 'USD')}</div>
          <div className="text-sm text-muted-foreground">
            {formatCurrency(amount * exchangeRate.usdToCdf, 'CDF')}
          </div>
        </div>
      );
    }
    return <span className={className}>{formatCurrency(amount, 'USD')}</span>;
  } else {
    if (showBothCurrencies) {
      return (
        <div className={`space-y-1 ${className}`}>
          <div>{formatCurrency(amount, 'CDF')}</div>
          <div className="text-sm text-muted-foreground">
            {formatCurrency(amount / exchangeRate.usdToCdf, 'USD')}
          </div>
        </div>
      );
    }
    return <span className={className}>{formatCurrency(amount, 'CDF')}</span>;
  }
};

export default CurrencyDisplay;
