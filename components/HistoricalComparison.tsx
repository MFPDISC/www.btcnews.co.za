'use client';

import React, { useState, useEffect } from 'react';

interface HistoricalData {
  period: string;
  pastPrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
}

interface HistoricalComparisonProps {
  currentPrice: number;
}

export default function HistoricalComparison({ currentPrice }: HistoricalComparisonProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate mock historical data for demonstration
    // In a real implementation, you'd fetch this from your database
    const generateHistoricalData = () => {
      const now = Date.now();
      const periods = [
        { label: '24h ago', hours: 24 },
        { label: '7d ago', hours: 24 * 7 },
        { label: '30d ago', hours: 24 * 30 },
      ];

      const data = periods.map(period => {
        // Generate realistic price variations
        const variation = period.hours === 24 ? 
          (Math.random() - 0.5) * 0.06 : // ±3% for 24h
          period.hours === 24 * 7 ?
          (Math.random() - 0.5) * 0.2 : // ±10% for 7d
          (Math.random() - 0.5) * 0.4; // ±20% for 30d
        
        const pastPrice = currentPrice * (1 - variation);
        const change = currentPrice - pastPrice;
        const changePercent = (change / pastPrice) * 100;

        return {
          period: period.label,
          pastPrice,
          currentPrice,
          change,
          changePercent,
        };
      });

      setHistoricalData(data);
      setLoading(false);
    };

    if (currentPrice > 0) {
      generateHistoricalData();
    }
  }, [currentPrice]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatChange = (change: number) => {
    const formatted = Math.abs(change).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return change >= 0 ? `+$${formatted}` : `-$${formatted}`;
  };

  const formatPercent = (percent: number) => {
    const formatted = Math.abs(percent).toFixed(2);
    return percent >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  if (loading || historicalData.length === 0) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">📊 Historical Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">📊 Historical Comparison</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {historicalData.map((data, index) => {
          const isPositive = data.changePercent >= 0;
          const icons = ['🕐', '📅', '🗓️'];
          
          return (
            <div
              key={data.period}
              className={`bg-gray-800/50 rounded-lg p-4 border-l-4 ${
                isPositive 
                  ? 'border-green-500 bg-green-500/5' 
                  : 'border-red-500 bg-red-500/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-medium">
                  {icons[index]} {data.period}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  isPositive 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {formatPercent(data.changePercent)}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">Then:</span>
                  <span className="text-gray-300 text-sm font-mono">
                    {formatPrice(data.pastPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-xs">Now:</span>
                  <span className="text-white text-sm font-mono font-semibold">
                    {formatPrice(data.currentPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className="text-gray-500 text-xs">Change:</span>
                  <span className={`text-sm font-semibold ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatChange(data.change)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-blue-400 text-xs">
          💡 Historical data shows price trends over different time periods to help gauge market momentum.
        </p>
      </div>
    </div>
  );
}
