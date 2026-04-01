'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { TermTooltip } from './BitcoinTerminology';

interface AdvancedAnalyticsProps {
  currentPrice: number;
}

export default function AdvancedAnalytics({ currentPrice }: AdvancedAnalyticsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hashrate');

  // Mock data generators (replace with real APIs later)
  const generateHashRateData = () => {
    const now = Date.now();
    return Array.from({ length: 30 }, (_, i) => {
      const daysAgo = 29 - i;
      const baseHashRate = 450; // EH/s
      const variation = (Math.random() - 0.5) * 0.1;
      const hashRate = baseHashRate * (1 + variation);
      return {
        date: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hashRate: Math.round(hashRate),
        difficulty: Math.round(hashRate * 0.8 * 1e12) // Approximate difficulty
      };
    });
  };

  const generateVolatilityData = () => {
    const now = Date.now();
    return Array.from({ length: 30 }, (_, i) => {
      const daysAgo = 29 - i;
      const baseVolatility = 60; // %
      const variation = (Math.random() - 0.5) * 0.4;
      const volatility = Math.max(20, baseVolatility * (1 + variation));
      return {
        date: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        volatility: Math.round(volatility * 10) / 10,
        btcPrice: currentPrice * (1 + (Math.random() - 0.5) * 0.2)
      };
    });
  };

  const generateStockToFlowData = () => {
    return Array.from({ length: 50 }, (_, i) => {
      const stockToFlow = 25 + i * 0.5;
      const predictedPrice = Math.pow(stockToFlow, 3.3) * 0.18; // S2F model approximation
      const actualPrice = predictedPrice * (0.5 + Math.random() * 1.5); // Add variance
      return {
        stockToFlow: Math.round(stockToFlow * 10) / 10,
        predictedPrice: Math.round(predictedPrice),
        actualPrice: Math.round(actualPrice),
        date: `2020-${String(Math.floor(i / 4) + 1).padStart(2, '0')}`
      };
    });
  };

  const generateWhaleData = () => {
    return Array.from({ length: 20 }, (_, i) => {
      const amount = 100 + Math.random() * 5000;
      const impact = Math.random() * 10;
      return {
        time: `${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        amount: Math.round(amount),
        impact: Math.round(impact * 10) / 10,
        type: Math.random() > 0.5 ? 'buy' : 'sell'
      };
    });
  };

  const [hashRateData] = useState(generateHashRateData());
  const [volatilityData] = useState(generateVolatilityData());
  const [stockToFlowData] = useState(generateStockToFlowData());
  const [whaleData] = useState(generateWhaleData());

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-orange-400 font-bold">
              {entry.name}: {entry.value.toLocaleString()}
              {entry.dataKey === 'hashRate' && ' EH/s'}
              {entry.dataKey === 'volatility' && '%'}
              {entry.dataKey === 'predictedPrice' && ' USD'}
              {entry.dataKey === 'actualPrice' && ' USD'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const tabs = [
    { id: 'hashrate', label: 'Hash Rate', icon: '⛏️' },
    { id: 'volatility', label: 'Volatility', icon: '📊' },
    { id: 'stocktoflow', label: 'Stock-to-Flow', icon: '📈' },
    { id: 'whales', label: 'Whale Activity', icon: '🐋' }
  ];

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-4"
      >
        <h2 className="text-2xl font-semibold text-white flex items-center">
          <span className="mr-3">🔬</span>
          Advanced Analytics
          <span className="ml-2 text-sm text-gray-400 font-normal">
            (Deep dive into Bitcoin metrics)
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Hash Rate Chart */}
          {activeTab === 'hashrate' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-white">
                  <TermTooltip term="hashrate">Network Hash Rate</TermTooltip>
                </h3>
                <span className="text-sm text-gray-400">Last 30 days</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hashRateData}>
                    <defs>
                      <linearGradient id="hashRateGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="hashRate"
                      stroke="#f97316"
                      strokeWidth={2}
                      fill="url(#hashRateGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-800/50 rounded p-3">
                  <p className="text-gray-400">Current Hash Rate</p>
                  <p className="text-orange-400 font-bold">{hashRateData[hashRateData.length - 1]?.hashRate} EH/s</p>
                </div>
                <div className="bg-gray-800/50 rounded p-3">
                  <p className="text-gray-400">Network Security</p>
                  <p className="text-green-400 font-bold">Extremely High</p>
                </div>
                <div className="bg-gray-800/50 rounded p-3">
                  <p className="text-gray-400">30d Change</p>
                  <p className="text-blue-400 font-bold">+2.3%</p>
                </div>
              </div>
            </div>
          )}

          {/* Volatility Chart */}
          {activeTab === 'volatility' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-white">
                  <TermTooltip term="volatility">30-Day Rolling Volatility</TermTooltip>
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={volatilityData}>
                    <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="volatility"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6, fill: '#f97316' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-800/50 rounded p-3">
                <p className="text-gray-300 text-sm">
                  <span className="font-medium text-orange-300">Current Volatility:</span> {volatilityData[volatilityData.length - 1]?.volatility}%
                  <span className="ml-4 text-gray-400">
                    Compared to S&P 500: ~15% | Gold: ~20%
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Stock-to-Flow Chart */}
          {activeTab === 'stocktoflow' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-white">
                  <TermTooltip term="stocktoflow">Stock-to-Flow Model</TermTooltip>
                </h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={stockToFlowData}>
                    <XAxis dataKey="stockToFlow" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter dataKey="predictedPrice" fill="#f97316" name="Predicted Price" />
                    <Scatter dataKey="actualPrice" fill="#10b981" name="Actual Price" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-gray-300">S2F Predicted</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-300">Actual Price</span>
                </div>
              </div>
            </div>
          )}

          {/* Whale Activity */}
          {activeTab === 'whales' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-white">
                  <TermTooltip term="whale">Large Transactions (24h)</TermTooltip>
                </h3>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {whaleData.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-800/30 rounded p-3">
                    <div className="flex items-center space-x-3">
                      <span className={`text-lg ${transaction.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type === 'buy' ? '📈' : '📉'}
                      </span>
                      <div>
                        <p className="text-white font-medium">{transaction.amount.toLocaleString()} BTC</p>
                        <p className="text-gray-400 text-sm">{transaction.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-400 font-medium">
                        ${(transaction.amount * currentPrice).toLocaleString()}
                      </p>
                      <p className="text-gray-400 text-sm">Impact: {transaction.impact}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
