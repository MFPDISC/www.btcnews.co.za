'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TradingViewWidget from '@/components/TradingViewWidget';
import PriceCard from '@/components/PriceCard';
import MarketStats from '@/components/MarketStats';
import PriceChart from '@/components/PriceChart';
import SimpleChart from '@/components/SimpleChart';
import ConversionCalculator from '@/components/ConversionCalculator';
import HistoricalComparison from '@/components/HistoricalComparison';
import FearGreedIndex from '@/components/FearGreedIndex';

interface PriceData {
  btcUSD: number;
  btcZAR: number;
  usdtZAR: number;
  usdZAR: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
}

async function getPriceData(): Promise<PriceData | null> {
  try {
    const response = await axios.get('/api/btc-price', {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price data:', error);
    return null;
  }
}

interface BTCData {
  btcUSD: number;
  btcZAR: number;
  usdtZAR: number;
  usdZAR: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
}

interface ChartData {
  time: string;
  price: number;
}

export default function Home() {
  const [btcData, setBtcData] = useState<BTCData | null>(null);
  // Generate initial mock chart data - memoized to avoid recreating on every render
  const generateMockChartData = React.useCallback((basePrice: number = 100000) => {
    const now = Date.now();
    return Array.from({ length: 48 }, (_, i) => {
      const hoursAgo = 47 - i;
      const variation = (Math.random() - 0.5) * 0.04; // ±2% variation
      const price = basePrice * (1 + variation);
      const timeStr = new Date(now - hoursAgo * 60 * 60 * 1000).toLocaleTimeString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
      });
      return {
        time: timeStr,
        price: Math.round(price)
      };
    });
  }, []);

  const [chartData, setChartData] = useState<ChartData[]>(() => generateMockChartData());
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      console.log('🔄 Fetching BTC data...');
      
      // Fetch price data (critical)
      const priceRes = await axios.get('/api/btc-price', {
        timeout: 15000,
      });
      
      console.log('✅ Price data received:', priceRes.data);
      
      // Fetch history data (optional - don't fail if this fails)
      let historyData = [];
      try {
        const historyRes = await axios.get('/api/btc-history?days=7', {
          timeout: 15000,
        });
        historyData = Array.isArray(historyRes.data) ? historyRes.data : [];
        console.log('✅ History data received:', historyData.length, 'records');
      } catch (historyError) {
        console.warn('⚠️ History data failed, generating mock data for chart:', historyError);
        // Generate mock data based on current price for demonstration
        const currentPrice = priceRes.data.btcUSD || 100000;
        historyData = generateMockChartData(currentPrice);
        console.log('📊 Generated mock chart data:', historyData.length, 'points');
      }

      const priceData = priceRes.data;
      
      if (!priceData.btcUSD) {
        throw new Error('Invalid price data received');
      }
      
      setBtcData({
        btcUSD: priceData.btcUSD || 0,
        btcZAR: priceData.btcZAR || 0,
        usdtZAR: priceData.usdtZAR || 0,
        usdZAR: priceData.usdZAR || 0,
        change24h: priceData.change24h || 0,
        high24h: priceData.high24h || 0,
        low24h: priceData.low24h || 0,
        volume24h: priceData.volume24h || 0,
        marketCap: priceData.marketCap || 0,
      });

      setChartData(historyData);
      setLoading(false);
      setLastUpdate(new Date());
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Error fetching data:', errorMsg);
      setError(errorMsg);
      setLoading(false);
      
      // Retry after 5 seconds
      setTimeout(() => {
        console.log('🔄 Retrying after error...');
        fetchData();
      }, 5000);
    }
  };

  useEffect(() => {
    // Initialize with mock chart data immediately
    setChartData(generateMockChartData());
    
    fetchData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading Bitcoin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="relative border-b border-orange-500/30 bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-sm sticky top-0 z-50 shadow-2xl shadow-orange-500/10">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            {/* Logo and Branding */}
            <div className="flex items-center space-x-4">
              {/* Bitcoin Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25">
                <span className="text-2xl font-bold text-black">₿</span>
              </div>
              
              <div>
                <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 bg-clip-text text-transparent tracking-tight">
                  www.btcnews.co.za
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <p className="text-gray-300 text-base font-medium">🇿🇦 South Africa's Premier Bitcoin Dashboard</p>
                  <div className="hidden sm:flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-semibold">LIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats and Update Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-2 sm:space-y-0 sm:space-x-6 lg:text-right">
              {/* Current Price Display */}
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-orange-500/20">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Current BTC Price</p>
                <p className="text-xl font-bold text-white">
                  {btcData ? `$${btcData.btcUSD.toLocaleString()}` : 'Loading...'}
                </p>
                {btcData && (
                  <p className={`text-sm font-semibold ${btcData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {btcData.change24h >= 0 ? '↗' : '↘'} {Math.abs(btcData.change24h).toFixed(2)}%
                  </p>
                )}
              </div>

              {/* Last Updated */}
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Last Updated</p>
                <p className="text-sm text-gray-300 font-medium">{lastUpdate.toLocaleTimeString()}</p>
                <p className="text-xs text-gray-500">{lastUpdate.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400">⚠️ Error: {error}</p>
            <p className="text-red-300 text-sm mt-1">Retrying in 5 seconds...</p>
          </div>
        )}
        
        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PriceCard
            title="Bitcoin Price (USD)"
            price={btcData?.btcUSD || 0}
            change={btcData?.change24h || 0}
            currency="USD"
            icon="₿"
          />
          <PriceCard
            title="Bitcoin Price (ZAR)"
            price={btcData?.btcZAR || 0}
            change={btcData?.change24h || 0}
            currency="ZAR"
            icon="₿"
            highlight
          />
          <PriceCard
            title="USD/ZAR Exchange Rate"
            price={btcData?.usdZAR || 0}
            change={0}
            currency="ZAR"
            icon="$"
            showChange={false}
          />
        </div>

        {/* Market Stats */}
        <MarketStats
          high24h={btcData?.high24h || 0}
          low24h={btcData?.low24h || 0}
          volume24h={btcData?.volume24h || 0}
          marketCap={btcData?.marketCap || 0}
        />

        {/* New Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Conversion Calculator */}
          <ConversionCalculator 
            btcUSD={btcData?.btcUSD || 0}
            usdZAR={btcData?.usdZAR || 0}
          />
          
          {/* Fear & Greed Index */}
          <FearGreedIndex />
        </div>

        {/* Historical Comparison */}
        <div className="mb-8">
          <HistoricalComparison currentPrice={btcData?.btcUSD || 0} />
        </div>

        {/* Full Width TradingView Advanced Chart */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
          <h2 className="text-2xl font-semibold text-white mb-6">Advanced Trading Chart</h2>
          <TradingViewWidget advanced />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 www.btcnews.co.za - Real-time Bitcoin market data and analytics
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Data provided by CoinGecko and Binance
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
