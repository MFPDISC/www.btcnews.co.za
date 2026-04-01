interface PriceCardProps {
  title: string;
  price: number;
  change: number;
  currency?: string;
  icon: string;
  highlight?: boolean;
  showChange?: boolean;
  gradient?: string;
  isExchangeRate?: boolean;
}

export default function PriceCard({
  title,
  price,
  change,
  currency = 'USD',
  icon,
  highlight = false,
  showChange = true,
  gradient,
  isExchangeRate = false,
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

  const bgGradient = gradient || (highlight 
    ? 'from-orange-500 to-red-600' 
    : 'from-gray-800 to-gray-900');

  return (
    <div className={`relative overflow-hidden rounded-xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 bg-gradient-to-br ${bgGradient} shadow-lg`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-full -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/90">
            {title}
          </h3>
          <span className="text-xl sm:text-2xl text-white/80">
            {icon}
          </span>
        </div>
        
        <div className="text-2xl sm:text-3xl font-bold mb-2 text-white">
          {currency === 'ZAR' ? 'R' : '$'}{formattedPrice}
        </div>
        
        {showChange && !isExchangeRate && (
          <div className={`flex items-center space-x-1 text-sm font-semibold ${
            isPositive 
              ? 'text-green-200'
              : 'text-red-200'
          }`}>
            <span>{isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(change).toFixed(2)}%</span>
            <span className="text-xs opacity-75">24h</span>
          </div>
        )}
        
        {isExchangeRate && (
          <div className="text-xs sm:text-sm text-white/70">
            Exchange Rate
          </div>
        )}
      </div>
    </div>
  );
}
