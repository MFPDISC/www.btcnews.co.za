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
import HowToBuyBitcoin from '@/components/HowToBuyBitcoin';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import { BitcoinGlossary, TermTooltip } from '@/components/BitcoinTerminology';
import DCACalculator from '@/components/DCACalculator';
import BitcoinEconomics from '@/components/BitcoinEconomics';

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
  const [isScrolled, setIsScrolled] = useState(false);
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
      console.log('🔄 Fetching BTC data directly...');
      
      // Fetch BTC price and market data from CoinGecko
      const btcRes = await axios.get(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false',
        { timeout: 15000 }
      );
      
      // Fetch USDT/ZAR from Binance
      const usdtZarRes = await axios.get(
        'https://api.binance.com/api/v3/ticker/24hr?symbol=USDTZAR',
        { timeout: 15000 }
      );

      const btcUSD = btcRes.data.market_data.current_price.usd;
      const usdtZAR = parseFloat(usdtZarRes.data.lastPrice);
      const usdZAR = usdtZAR;
      const btcZAR = btcUSD * usdZAR;

      const priceData = {
        btcUSD,
        btcZAR,
        usdtZAR,
        usdZAR,
        change24h: btcRes.data.market_data.price_change_percentage_24h,
        high24h: btcRes.data.market_data.high_24h.usd,
        low24h: btcRes.data.market_data.low_24h.usd,
        volume24h: btcRes.data.market_data.total_volume.usd,
        marketCap: btcRes.data.market_data.market_cap.usd,
      };
      
      console.log('✅ Price data received:', priceData);
      
      // We will skip actual historical db calls for static export
      // and just use mock chart data
      const historyData = generateMockChartData(priceData.btcUSD);
      
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
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      <header className={`relative border-b border-orange-500/30 bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-md sticky top-0 z-50 shadow-2xl shadow-orange-500/10 transition-all duration-300 ${
        isScrolled ? 'shadow-xl' : ''
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled ? 'py-2 sm:py-3 lg:py-3' : 'py-3 sm:py-4 lg:py-4'
        }`}>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-2 sm:space-y-3 lg:space-y-0">
            {/* Logo and Branding */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Bitcoin Icon */}
              <div className={`bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25 transition-all duration-300 ${
                isScrolled ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-10 h-10 sm:w-12 sm:h-12'
              }`}>
                <span className={`font-bold text-black transition-all duration-300 ${
                  isScrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
                }`}>₿</span>
              </div>
              <div>
                <h1 className={`font-bold text-white tracking-tight transition-all duration-300 ${
                  isScrolled ? 'text-sm sm:text-base lg:text-lg' : 'text-base sm:text-lg lg:text-xl'
                }`}>
                  www.btcnews.co.za
                </h1>
                <p className={`text-orange-100 flex items-center transition-all duration-300 ${
                  isScrolled ? 'text-xs' : 'text-xs sm:text-sm'
                }`}>
                  🇿🇦 South Africa's Premier Bitcoin Dashboard
                </p>
              </div>
            </div>
            
            {/* Desktop Price Display */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="text-right">
                <div className={`text-white font-semibold transition-all duration-300 ${
                  isScrolled ? 'text-xs' : 'text-sm'
                }`}>
                  CURRENT BTC PRICE
                </div>
                <div className={`font-bold text-white transition-all duration-300 ${
                  isScrolled ? 'text-xl' : 'text-2xl'
                }`}>
                  ${btcData?.btcUSD?.toLocaleString() || '...'}
                </div>
                <div className={`flex items-center transition-all duration-300 ${
                  isScrolled ? 'text-xs' : 'text-sm'
                } ${
                  (btcData?.change24h || 0) >= 0 
                    ? 'text-green-200' 
                    : 'text-red-200'
                }`}>
                  {(btcData?.change24h || 0) >= 0 ? '📈' : '📉'} 
                  {Math.abs(btcData?.change24h || 0).toFixed(2)}%
                </div>
              </div>
              
              <div className={`text-right text-orange-100 transition-all duration-300 ${
                isScrolled ? 'text-xs' : 'text-xs'
              }`}>
                <div className={isScrolled ? 'hidden' : ''}>LAST UPDATED</div>
                <div className={`font-mono ${isScrolled ? 'text-xs' : ''}`}>
                  {new Date().toLocaleTimeString('en-ZA', {
                    hour12: false,
                    timeZone: 'Africa/Johannesburg'
                  })}
                </div>
                <div className={isScrolled ? 'hidden' : ''}>{new Date().toLocaleDateString('en-ZA')}</div>
              </div>
            </div>
            
            {/* Mobile Price Display */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between bg-gray-800/30 rounded-lg px-3 py-2 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-400 text-sm">₿</span>
                  <span className="text-white text-xs font-medium">BTC PRICE</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    ${btcData?.btcUSD?.toLocaleString() || '...'}
                  </div>
                  <div className="text-xs text-gray-300">
                    <TermTooltip term="satoshi">
                      1 sat = ${((btcData?.btcUSD || 0) / 100000000).toFixed(8)}
                    </TermTooltip>
                  </div>
                  <div className={`text-xs flex items-center justify-end space-x-1 ${
                    (btcData?.change24h || 0) >= 0 
                      ? 'text-green-200' 
                      : 'text-red-200'
                  }`}>
                    <span>{(btcData?.change24h || 0) >= 0 ? '↗' : '↘'}</span>
                    <span>{Math.abs(btcData?.change24h || 0).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400">⚠️ Error: {error}</p>
            <p className="text-red-300 text-sm mt-1">Retrying in 5 seconds...</p>
          </div>
        )}
        
        {/* Price Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <PriceCard
            title="Bitcoin (USD)"
            price={btcData?.btcUSD || 0}
            change={btcData?.change24h || 0}
            icon="₿"
            gradient="from-orange-500 to-yellow-500"
          />
          <PriceCard
            title="Bitcoin (ZAR)"
            price={btcData?.btcZAR || 0}
            change={btcData?.change24h || 0}
            icon="₿"
            gradient="from-green-500 to-emerald-500"
            currency="ZAR"
          />
          <PriceCard
            title="USD/ZAR Rate"
            price={btcData?.usdZAR || 0}
            change={0}
            icon="💱"
            gradient="from-blue-500 to-purple-500"
            currency="ZAR"
            isExchangeRate={true}
          />
        </div>

        {/* New Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
          {/* Conversion Calculator */}
          <ConversionCalculator 
            btcUSD={btcData?.btcUSD || 0}
            usdZAR={btcData?.usdZAR || 0}
          />
          
          {/* Fear & Greed Index */}
          <FearGreedIndex />
        </div>

        {/* Market Stats */}
        <MarketStats
          high24h={btcData?.high24h || 0}
          low24h={btcData?.low24h || 0}
          volume24h={btcData?.volume24h || 0}
          marketCap={btcData?.marketCap || 0}
        />

        {/* Historical Comparison */}
        <div className="mb-8">
          <HistoricalComparison currentPrice={btcData?.btcUSD || 0} />
        </div>

        {/* DCA Calculator */}
        <DCACalculator currentPrice={btcData?.btcUSD || 0} />

        {/* Bitcoin Economics 101 */}
        <BitcoinEconomics />

        {/* Advanced Analytics - Collapsible */}
        <AdvancedAnalytics currentPrice={btcData?.btcUSD || 0} />

        {/* Full Width TradingView Advanced Chart */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Advanced Trading Chart</h2>
          <TradingViewWidget advanced />
        </div>

        {/* Bitcoin Terminology Guide */}
        <div className="mb-8">
          <BitcoinGlossary />
        </div>

        {/* How to Buy Bitcoin Guide */}
        <HowToBuyBitcoin />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            {/* The Big Bluff Button */}
            <div className="mb-6">
              <a
                href="http://bigbluff.btcnews.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="text-xl">🎯</span>
                <span>Visit The Big Bluff</span>
                <span className="text-sm opacity-75">↗</span>
              </a>
              <p className="text-gray-400 text-xs mt-2">
                Explore our premium Bitcoin analysis platform
              </p>
            </div>
            
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
