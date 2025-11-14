import axios from 'axios';

export const dynamic = 'force-dynamic';

interface PriceData {
  btcUSD: number;
  btcZAR: number;
  usdZAR: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
}

async function getPriceData(): Promise<PriceData | null> {
  try {
    // Use internal API endpoint instead of external APIs
    const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/api/btc-price`, {
      timeout: 10000,
    });
    
    return {
      btcUSD: response.data.btcUSD,
      btcZAR: response.data.btcZAR,
      usdZAR: response.data.usdZAR,
      change24h: response.data.change24h,
      high24h: response.data.high24h,
      low24h: response.data.low24h,
      volume24h: response.data.volume24h,
      marketCap: response.data.marketCap,
    };
  } catch (error) {
    console.error('Error fetching price data:', error);
    return null;
  }
}

export const revalidate = 30; // Revalidate every 30 seconds

export default async function DashboardPage() {
  const data = await getPriceData();

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl">❌ Error loading price data</p>
          <p className="text-gray-400 mt-2">Please refresh the page</p>
        </div>
      </div>
    );
  }

  const isPositive = data.change24h >= 0;
  const formatPrice = (num: number) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);

  const formatLargeNum = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    return `$${(num / 1e6).toFixed(2)}M`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                www.btcnews.co.za
              </h1>
              <p className="text-gray-400 text-sm mt-1">Real-time Bitcoin Market Data</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Last updated</p>
              <p className="text-sm text-gray-400">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* BTC/USD */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm font-medium">Bitcoin Price (USD)</p>
              <span className="text-3xl">₿</span>
            </div>
            <p className="text-4xl font-bold text-white mb-2">${formatPrice(data.btcUSD)}</p>
            <span className={`text-sm font-semibold px-2 py-1 rounded ${
              isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {isPositive ? '↑' : '↓'} {Math.abs(data.change24h).toFixed(2)}%
            </span>
          </div>

          {/* BTC/ZAR */}
          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-sm rounded-xl border border-orange-500/30 p-6 shadow-lg shadow-orange-500/10 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm font-medium">Bitcoin Price (ZAR)</p>
              <span className="text-3xl">₿</span>
            </div>
            <p className="text-4xl font-bold text-white mb-2">R{formatPrice(data.btcZAR)}</p>
            <span className={`text-sm font-semibold px-2 py-1 rounded ${
              isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {isPositive ? '↑' : '↓'} {Math.abs(data.change24h).toFixed(2)}%
            </span>
          </div>

          {/* USD/ZAR */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm font-medium">USD/ZAR Exchange Rate</p>
              <span className="text-3xl">$</span>
            </div>
            <p className="text-4xl font-bold text-white">R{data.usdZAR.toFixed(2)}</p>
          </div>
        </div>

        {/* Market Stats */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Market Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 text-sm">24h High</p>
              <p className="text-2xl font-bold text-green-400">${formatPrice(data.high24h)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">24h Low</p>
              <p className="text-2xl font-bold text-red-400">${formatPrice(data.low24h)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">24h Volume</p>
              <p className="text-2xl font-bold text-blue-400">{formatLargeNum(data.volume24h)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Market Cap</p>
              <p className="text-2xl font-bold text-purple-400">{formatLargeNum(data.marketCap)}</p>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <p className="text-blue-400">
            ℹ️ For interactive charts and live updates, visit the main dashboard at{' '}
            <a href="/" className="underline hover:text-blue-300">
              /
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 www.btcnews.co.za - Real-time Bitcoin market data and analytics
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
