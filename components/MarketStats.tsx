interface MarketStatsProps {
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
}

export default function MarketStats({
  high24h,
  low24h,
  volume24h,
  marketCap,
}: MarketStatsProps) {
  // Bitcoin Supply Constants
  const MAX_SUPPLY = 21000000; // 21 million BTC max supply
  const CURRENT_SUPPLY = 19789000; // Approximate current supply (updates ~every 10 minutes)
  const REMAINING_SUPPLY = MAX_SUPPLY - CURRENT_SUPPLY;
  const PERCENTAGE_MINED = (CURRENT_SUPPLY / MAX_SUPPLY) * 100;
  const PERCENTAGE_LEFT = 100 - PERCENTAGE_MINED;
  
  // Mining Analytics
  const BLOCKS_PER_DAY = 144; // ~6 blocks per hour * 24 hours
  const CURRENT_REWARD = 3.125; // BTC per block (after 2024 halving)
  const DAILY_NEW_BTC = BLOCKS_PER_DAY * CURRENT_REWARD;
  const NEXT_HALVING_BLOCK = 1050000; // Approximate next halving block
  const CURRENT_BLOCK = 870000; // Approximate current block height
  const BLOCKS_TO_HALVING = NEXT_HALVING_BLOCK - CURRENT_BLOCK;
  const DAYS_TO_HALVING = Math.floor(BLOCKS_TO_HALVING / BLOCKS_PER_DAY);

  // Predictions (multiple scenarios)
  const predictions = [
    {
      scenario: "Conservative",
      year: 2140,
      description: "Following current halving schedule",
      probability: "95%",
      color: "text-green-400"
    },
    {
      scenario: "Optimistic", 
      year: 2135,
      description: "Slightly faster mining efficiency",
      probability: "60%",
      color: "text-blue-400"
    },
    {
      scenario: "Pessimistic",
      year: 2145,
      description: "Network disruptions considered",
      probability: "30%",
      color: "text-yellow-400"
    }
  ];

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatBTC = (num: number) => {
    return `${num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} BTC`;
  };

  const formatPrice = (num: number) => {
    return `$${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Market stats (keeping the original ones)
  const marketStats = [
    { label: '24h High', value: formatPrice(high24h), color: 'text-green-400', icon: '📈' },
    { label: '24h Low', value: formatPrice(low24h), color: 'text-red-400', icon: '📉' },
    { label: '24h Volume', value: formatLargeNumber(volume24h), color: 'text-blue-400', icon: '💹' },
    { label: 'Market Cap', value: formatLargeNumber(marketCap), color: 'text-purple-400', icon: '💎' },
  ];

  // Bitcoin supply stats
  const supplyStats = [
    { 
      label: 'Total Mined', 
      value: formatBTC(CURRENT_SUPPLY), 
      color: 'text-orange-400', 
      icon: '⛏️',
      subtitle: `${PERCENTAGE_MINED.toFixed(2)}% of max supply`
    },
    { 
      label: 'Remaining', 
      value: formatBTC(REMAINING_SUPPLY), 
      color: 'text-cyan-400', 
      icon: '🔒',
      subtitle: `${PERCENTAGE_LEFT.toFixed(2)}% left to mine`
    },
    { 
      label: 'Daily Mining', 
      value: `${DAILY_NEW_BTC.toFixed(1)} BTC`, 
      color: 'text-yellow-400', 
      icon: '⚡',
      subtitle: `${BLOCKS_PER_DAY} blocks per day`
    },
    { 
      label: 'Next Halving', 
      value: `~${DAYS_TO_HALVING} days`, 
      color: 'text-red-400', 
      icon: '📅',
      subtitle: `Reward: ${CURRENT_REWARD} → ${CURRENT_REWARD/2} BTC`
    },
  ];

  return (
    <div className="space-y-6">
      {/* Market Statistics */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          📊 Market Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {marketStats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{stat.icon}</span>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bitcoin Supply & Mining Analytics */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          ⛏️ Bitcoin Supply & Mining Analytics
        </h2>
        
        {/* Supply Progress Bar - Always Visible */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-300">Mining Progress</h3>
            <span className="text-orange-400 font-bold text-lg">{PERCENTAGE_MINED.toFixed(3)}%</span>
          </div>
          
          <div className="relative w-full bg-gray-700 rounded-full h-6 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-1000"
              style={{ width: `${PERCENTAGE_MINED}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {formatBTC(CURRENT_SUPPLY)} / {formatBTC(MAX_SUPPLY)}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Genesis Block (2009)</span>
            <span>Current Supply</span>
            <span>Max Supply (21M)</span>
          </div>
        </div>

        {/* Dropdown for Detailed Analytics */}
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
            <span className="text-gray-300 font-medium flex items-center">
              <span className="mr-2">📊</span>
              View Detailed Mining Analytics
            </span>
            <span className="text-gray-400 group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>
          
          <div className="mt-4 space-y-6">
            {/* Supply Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {supplyStats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{stat.icon}</span>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
              ))}
            </div>

            {/* Multi-Outcome Predictions */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-300 mb-4 flex items-center">
                🔮 Final Bitcoin Mined - Predictions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {predictions.map((pred, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${pred.color}`}>{pred.scenario}</h4>
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded">{pred.probability}</span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{pred.year}</p>
                    <p className="text-xs text-gray-400">{pred.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm flex items-center">
                  <span className="mr-2">💡</span>
                  <strong>Key Insight:</strong> Due to Bitcoin's halving mechanism every ~4 years, 
                  mining rewards decrease exponentially. 99% of all Bitcoin will be mined by ~2032, 
                  with the final coins taking over 100 years to mine.
                </p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
