'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TermTooltip } from './BitcoinTerminology';

export default function BitcoinEconomics() {
  const [activeSection, setActiveSection] = useState('scarcity');
  const [isOpen, setIsOpen] = useState(false);

  // Generate supply curve data
  const generateSupplyCurve = () => {
    const data = [];
    let totalSupply = 0;
    const startYear = 2009;
    const currentYear = 2024;
    
    for (let year = startYear; year <= 2140; year += 4) {
      // Halving every 4 years
      const halvingCycle = Math.floor((year - startYear) / 4);
      const reward = 50 / Math.pow(2, halvingCycle);
      const blocksPerYear = 365.25 * 24 * 6; // ~6 blocks per hour
      const yearlySupply = reward * blocksPerYear;
      
      if (year <= currentYear) {
        totalSupply += yearlySupply * 4; // 4 years of mining
      } else {
        totalSupply += yearlySupply * 4;
      }
      
      // Cap at 21 million
      totalSupply = Math.min(totalSupply, 21000000);
      
      data.push({
        year,
        supply: Math.round(totalSupply),
        reward,
        isHistorical: year <= currentYear
      });
    }
    
    return data;
  };

  // Generate Bitcoin vs USD purchasing power data
  const generatePurchasingPowerData = () => {
    return [
      { year: '2010', btcValue: 1, usdValue: 100, item: 'Pizza (2 pizzas)' },
      { year: '2012', btcValue: 1, usdValue: 95, item: 'Pizza (2 pizzas)' },
      { year: '2014', btcValue: 1, usdValue: 90, item: 'Pizza (2 pizzas)' },
      { year: '2016', btcValue: 1, usdValue: 85, item: 'Pizza (2 pizzas)' },
      { year: '2018', btcValue: 1, usdValue: 80, item: 'Pizza (2 pizzas)' },
      { year: '2020', btcValue: 1, usdValue: 75, item: 'Pizza (2 pizzas)' },
      { year: '2022', btcValue: 1, usdValue: 65, item: 'Pizza (2 pizzas)' },
      { year: '2024', btcValue: 1, usdValue: 55, item: 'Pizza (2 pizzas)' }
    ];
  };

  // Generate Bitcoin vs Gold comparison
  const generateBitcoinVsGoldData = () => {
    return [
      { year: '2010', bitcoin: 100, gold: 100 },
      { year: '2012', bitcoin: 150, gold: 105 },
      { year: '2014', bitcoin: 800, gold: 95 },
      { year: '2016', bitcoin: 600, gold: 110 },
      { year: '2018', bitcoin: 2000, gold: 115 },
      { year: '2020', bitcoin: 1500, gold: 125 },
      { year: '2022', bitcoin: 3500, gold: 130 },
      { year: '2024', bitcoin: 12000, gold: 140 }
    ];
  };

  // Generate energy comparison data
  const generateEnergyData = () => {
    return [
      { category: 'Bitcoin Mining', energy: 150, color: '#f97316' },
      { category: 'Banking System', energy: 260, color: '#6b7280' },
      { category: 'Gold Mining', energy: 240, color: '#fbbf24' },
      { category: 'Data Centers', energy: 200, color: '#3b82f6' }
    ];
  };

  const supplyData = generateSupplyCurve();
  const purchasingPowerData = generatePurchasingPowerData();
  const bitcoinVsGoldData = generateBitcoinVsGoldData();
  const energyData = generateEnergyData();

  const sections = [
    { id: 'scarcity', label: 'Why 21 Million?', icon: '🔒' },
    { id: 'storeofvalue', label: 'Store of Wealth', icon: '🏦' },
    { id: 'purchasing', label: 'vs USD Power', icon: '💵' },
    { id: 'gold', label: 'vs Gold', icon: '🥇' },
    { id: 'energy', label: 'Energy Truth', icon: '⚡' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-orange-400 font-bold">
              {entry.name}: {entry.value.toLocaleString()}
              {entry.dataKey === 'supply' && ' BTC'}
              {entry.dataKey === 'energy' && ' TWh/year'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <h2 className="text-2xl font-semibold text-white flex items-center">
          <span className="mr-3">🎓</span>
          Bitcoin Economics 101
          <span className="ml-2 text-sm text-gray-400 font-normal">
            (Understanding Bitcoin's design)
          </span>
        </h2>
        <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeSection === section.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{section.icon}</span>
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </div>

          {/* Why 21 Million Section */}
          {activeSection === 'scarcity' && (
            <div className="space-y-6">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center">
                  <span className="mr-2">🔒</span>
                  Why Exactly 21 Million Bitcoin?
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Satoshi Nakamoto chose 21 million as Bitcoin's maximum supply to create <strong>absolute scarcity</strong>. 
                    Unlike fiat currencies that can be printed infinitely, Bitcoin has a hard cap built into its code.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded p-4">
                      <h4 className="text-orange-400 font-semibold mb-2">🧮 The Math</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Starting reward: 50 BTC per block</li>
                        <li>• <TermTooltip term="halving">Halving every 210,000 blocks</TermTooltip> (~4 years)</li>
                        <li>• 50 → 25 → 12.5 → 6.25 → 3.125...</li>
                        <li>• Mathematical limit: 20,999,999.9769 BTC</li>
                      </ul>
                    </div>
                    <div className="bg-gray-800/50 rounded p-4">
                      <h4 className="text-orange-400 font-semibold mb-2">💡 The Purpose</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Creates digital scarcity</li>
                        <li>• Prevents inflation by design</li>
                        <li>• Incentivizes early adoption</li>
                        <li>• Ensures predictable supply</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supply Curve Chart */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Bitcoin Supply Curve (2009-2140)</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={supplyData}>
                      <defs>
                        <linearGradient id="supplyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="year" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                      <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="supply"
                        stroke="#f97316"
                        strokeWidth={2}
                        fill="url(#supplyGradient)"
                        name="Total Supply"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-gray-400 text-sm">
                  📊 Notice how the curve flattens over time due to halving events. 99% of Bitcoin will be mined by ~2032.
                </p>
              </div>
            </div>
          )}

          {/* Store of Wealth vs Payments */}
          {activeSection === 'storeofvalue' && (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                  <span className="mr-2">🏦</span>
                  Bitcoin: Store of Wealth, Not Payment System
                </h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed text-lg">
                    <strong>Bitcoin was designed as digital gold, not digital cash.</strong> It's a store of value and settlement layer, 
                    not a day-to-day payment system.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-blue-400 font-semibold text-lg">🏦 Store of Wealth Properties</h4>
                      <div className="space-y-3">
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-green-400 mr-2">✅</span>
                            <span className="font-medium">Scarcity</span>
                          </div>
                          <p className="text-sm text-gray-400">Fixed supply of 21 million, unlike fiat currencies</p>
                        </div>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-green-400 mr-2">✅</span>
                            <span className="font-medium">Durability</span>
                          </div>
                          <p className="text-sm text-gray-400">Digital, cannot degrade or be destroyed</p>
                        </div>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-green-400 mr-2">✅</span>
                            <span className="font-medium">Portability</span>
                          </div>
                          <p className="text-sm text-gray-400">Can be moved globally in minutes</p>
                        </div>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-green-400 mr-2">✅</span>
                            <span className="font-medium">Divisibility</span>
                          </div>
                          <p className="text-sm text-gray-400">Divisible to 8 decimal places (100M satoshis)</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-yellow-400 font-semibold text-lg">⚡ Payment System Limitations</h4>
                      <div className="space-y-3">
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-400 mr-2">⚠️</span>
                            <span className="font-medium">Transaction Speed</span>
                          </div>
                          <p className="text-sm text-gray-400">~7 transactions per second (by design for security)</p>
                        </div>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-400 mr-2">⚠️</span>
                            <span className="font-medium">Transaction Fees</span>
                          </div>
                          <p className="text-sm text-gray-400">Can be high during network congestion</p>
                        </div>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-400 mr-2">⚠️</span>
                            <span className="font-medium">Confirmation Time</span>
                          </div>
                          <p className="text-sm text-gray-400">~10 minutes per block, 6 confirmations recommended</p>
                        </div>
                        <div className="bg-gray-800/50 rounded p-3">
                          <div className="flex items-center mb-2">
                            <span className="text-yellow-400 mr-2">⚠️</span>
                            <span className="font-medium">Price Volatility</span>
                          </div>
                          <p className="text-sm text-gray-400">Too volatile for stable day-to-day pricing</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-orange-500">
                    <h5 className="text-orange-400 font-semibold mb-2">💡 Key Insight</h5>
                    <p className="text-sm leading-relaxed">
                      Think of Bitcoin like digital gold. You don't buy coffee with gold bars - you store wealth in gold and use 
                      dollars for daily transactions. Similarly, Bitcoin excels as a store of value and settlement layer, 
                      while other solutions (Lightning Network, stablecoins) handle everyday payments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bitcoin vs USD Purchasing Power */}
          {activeSection === 'purchasing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Bitcoin vs USD Purchasing Power (Inflation Protection)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={purchasingPowerData}>
                    <XAxis dataKey="year" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="btcValue"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={false}
                      name="Bitcoin (1 BTC)"
                    />
                    <Line
                      type="monotone"
                      dataKey="usdValue"
                      stroke="#6b7280"
                      strokeWidth={3}
                      dot={false}
                      name="USD ($100)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-gray-400 text-sm">
                💡 While $100 loses purchasing power over time due to inflation, 1 Bitcoin maintains or increases its purchasing power.
              </p>
            </div>
          )}

          {/* Bitcoin vs Gold */}
          {activeSection === 'gold' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Bitcoin vs Gold Performance (Store of Value)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bitcoinVsGoldData}>
                    <XAxis dataKey="year" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="bitcoin"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={false}
                      name="Bitcoin (% gain)"
                    />
                    <Line
                      type="monotone"
                      dataKey="gold"
                      stroke="#fbbf24"
                      strokeWidth={3}
                      dot={false}
                      name="Gold (% gain)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded p-4">
                  <h4 className="text-orange-400 font-semibold mb-2">₿ Bitcoin Advantages</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Digital, easily transferable</li>
                    <li>• Perfectly divisible</li>
                    <li>• Transparent supply</li>
                    <li>• No storage costs</li>
                  </ul>
                </div>
                <div className="bg-gray-800/50 rounded p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">🥇 Gold Advantages</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 5000+ years of history</li>
                    <li>• Physical, tangible asset</li>
                    <li>• Lower volatility</li>
                    <li>• Industrial uses</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Energy Usage */}
          {activeSection === 'energy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Energy Usage: Bitcoin vs Traditional Systems</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyData}>
                    <XAxis dataKey="category" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="energy" fill="#f97316" name="Energy (TWh/year)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-2 flex items-center">
                  <span className="mr-2">🌱</span>
                  Energy Usage Context
                </h4>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>• Bitcoin uses ~150 TWh/year - less than the traditional banking system (~260 TWh/year)</li>
                  <li>• Bitcoin incentivizes renewable energy use (miners seek cheapest electricity)</li>
                  <li>• Bitcoin secures a $1+ trillion network with this energy</li>
                  <li>• Energy usage is a feature, not a bug - it provides security</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
