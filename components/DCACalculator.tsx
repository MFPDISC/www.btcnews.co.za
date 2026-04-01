'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TermTooltip } from './BitcoinTerminology';

interface DCACalculatorProps {
  currentPrice: number;
}

export default function DCACalculator({ currentPrice }: DCACalculatorProps) {
  const [monthlyAmount, setMonthlyAmount] = useState(100);
  const [startDate, setStartDate] = useState('2020-01-01');
  const [isOpen, setIsOpen] = useState(false);

  // Generate historical DCA data (replace with real API later)
  const generateDCAData = (monthly: number, start: string) => {
    const startTime = new Date(start).getTime();
    const now = Date.now();
    const monthsElapsed = Math.floor((now - startTime) / (30 * 24 * 60 * 60 * 1000));
    
    let totalInvested = 0;
    let totalBTC = 0;
    const data = [];
    
    // Mock historical prices (replace with real data)
    const mockPrices = [
      { date: '2020-01', price: 7200 },
      { date: '2020-06', price: 9500 },
      { date: '2021-01', price: 29000 },
      { date: '2021-06', price: 35000 },
      { date: '2021-11', price: 67000 },
      { date: '2022-06', price: 20000 },
      { date: '2023-01', price: 16500 },
      { date: '2023-06', price: 30000 },
      { date: '2024-01', price: 42000 },
      { date: '2024-06', price: 65000 },
      { date: '2024-11', price: currentPrice }
    ];

    for (let i = 0; i < Math.min(monthsElapsed, mockPrices.length); i++) {
      const priceData = mockPrices[i];
      totalInvested += monthly;
      const btcBought = monthly / priceData.price;
      totalBTC += btcBought;
      
      const currentValue = totalBTC * currentPrice;
      const profit = currentValue - totalInvested;
      const roi = ((currentValue - totalInvested) / totalInvested) * 100;
      
      data.push({
        date: priceData.date,
        invested: totalInvested,
        value: Math.round(currentValue),
        profit: Math.round(profit),
        roi: Math.round(roi * 10) / 10,
        btcAmount: Math.round(totalBTC * 100000000) / 100000000, // 8 decimals
        price: priceData.price
      });
    }
    
    return data;
  };

  // Generate comparison data for S&P 500 and Gold
  const generateComparisonData = (monthly: number) => {
    // Mock annual returns (replace with real data)
    const returns = {
      bitcoin: 160, // Average annual return since 2020
      sp500: 12,    // Average S&P 500 return
      gold: 8,      // Average gold return
      savings: 0.5  // Savings account
    };

    const years = 4; // Since 2020
    const months = years * 12;
    
    const results: Record<string, {
      totalInvested: number;
      finalValue: number;
      profit: number;
      roi: number;
    }> = {};
    
    Object.entries(returns).forEach(([asset, annualReturn]) => {
      const monthlyReturn = annualReturn / 100 / 12;
      let totalValue = 0;
      
      for (let i = 0; i < months; i++) {
        totalValue = (totalValue + monthly) * (1 + monthlyReturn);
      }
      
      results[asset] = {
        totalInvested: monthly * months,
        finalValue: Math.round(totalValue),
        profit: Math.round(totalValue - (monthly * months)),
        roi: Math.round(((totalValue - (monthly * months)) / (monthly * months)) * 100)
      };
    });
    
    return results;
  };

  const dcaData = generateDCAData(monthlyAmount, startDate);
  const comparisonData = generateComparisonData(monthlyAmount);
  const latestData = dcaData[dcaData.length - 1];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-orange-400 font-bold">
              {entry.name}: ${entry.value.toLocaleString()}
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
          <span className="mr-3">💰</span>
          Dollar Cost Averaging Calculator
          <span className="ml-2 text-sm text-gray-400 font-normal">
            (Learn about systematic investing)
          </span>
        </h2>
        <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="space-y-6">
          {/* Input Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800/30 rounded-lg">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Monthly Investment Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  min="1"
                  max="10000"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Start Date
              </label>
              <input
                type="month"
                value={startDate.slice(0, 7)}
                onChange={(e) => setStartDate(e.target.value + '-01')}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                min="2020-01"
                max="2024-11"
              />
            </div>
          </div>

          {/* Results Summary */}
          {latestData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Total Invested</p>
                <p className="text-white text-xl font-bold">${latestData.invested.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Current Value</p>
                <p className="text-orange-400 text-xl font-bold">${latestData.value.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">Total Profit</p>
                <p className={`text-xl font-bold ${latestData.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${latestData.profit.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">ROI</p>
                <p className={`text-xl font-bold ${latestData.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {latestData.roi}%
                </p>
              </div>
            </div>
          )}

          {/* DCA Performance Chart */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Investment Growth Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dcaData}>
                  <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="invested"
                    stroke="#6b7280"
                    strokeWidth={2}
                    dot={false}
                    name="Amount Invested"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={false}
                    name="Portfolio Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset Comparison */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">
              Compare: ${monthlyAmount}/month since {startDate.slice(0, 7)}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(comparisonData).map(([asset, data]) => (
                <div key={asset} className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-sm mr-2">
                      {asset === 'bitcoin' ? '₿' : asset === 'sp500' ? '📈' : asset === 'gold' ? '🥇' : '🏦'}
                    </span>
                    <span className="font-medium text-gray-300 capitalize">
                      {asset === 'sp500' ? 'S&P 500' : asset}
                    </span>
                  </div>
                  <p className="text-white font-bold text-lg">${data.finalValue.toLocaleString()}</p>
                  <p className={`text-sm ${data.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.roi >= 0 ? '+' : ''}{data.roi}% ROI
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Content */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
              <span className="mr-2">🎓</span>
              What is Dollar Cost Averaging?
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              DCA is an investment strategy where you invest a fixed amount regularly, regardless of price. 
              This reduces the impact of volatility by spreading purchases over time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-green-400 font-medium">✅ Benefits:</p>
                <ul className="text-gray-400 mt-1 space-y-1">
                  <li>• Reduces timing risk</li>
                  <li>• Smooths out volatility</li>
                  <li>• Builds discipline</li>
                  <li>• No need to time the market</li>
                </ul>
              </div>
              <div>
                <p className="text-yellow-400 font-medium">⚠️ Considerations:</p>
                <ul className="text-gray-400 mt-1 space-y-1">
                  <li>• May miss big dips</li>
                  <li>• Requires long-term commitment</li>
                  <li>• Past performance ≠ future results</li>
                  <li>• Consider your risk tolerance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
