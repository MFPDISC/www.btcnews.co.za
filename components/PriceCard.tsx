interface PriceCardProps {
  title: string;
  price: number;
  change: number;
  currency: string;
  icon: string;
  highlight?: boolean;
  showChange?: boolean;
}

export default function PriceCard({
  title,
  price,
  change,
  currency,
  icon,
  highlight = false,
  showChange = true,
}: PriceCardProps) {
  const isPositive = change >= 0;
  
  // Handle zero or invalid prices
  const isZero = price === 0 || isNaN(price) || !isFinite(price);
  
  const formattedPrice = isZero ? '0.00' : (() => {
    try {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: price > 1000 ? 0 : 2,
        maximumFractionDigits: price > 1000 ? 0 : 2,
      }).format(price);
    } catch (error) {
      console.warn('Price formatting error:', error, 'price:', price);
      return price.toFixed(2);
    }
  })();
  
  // Show loading state if price is 0
  const showLoading = isZero;

  return (
    <div
      className={`rounded-xl p-6 border backdrop-blur-sm transition-all duration-300 ${
        showLoading ? 'opacity-60' : 'hover:scale-105'
      } ${
        highlight
          ? 'bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/30 shadow-lg shadow-orange-500/10'
          : 'bg-gray-900/50 border-gray-800'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold text-white">
            {currency === 'ZAR' && 'R'}
            {currency === 'USD' && '$'}
            {formattedPrice}
          </p>
          {showLoading && <div className="animate-pulse text-xs text-gray-500">Loading...</div>}
        </div>
        {showChange && (
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold px-2 py-1 rounded ${
                isPositive
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
            </span>
            <span className="text-xs text-gray-500">24h change</span>
          </div>
        )}
      </div>
    </div>
  );
}
