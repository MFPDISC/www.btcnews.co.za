'use client';

import React, { useState, useEffect } from 'react';

interface ConversionCalculatorProps {
  btcUSD: number;
  usdZAR: number;
}

export default function ConversionCalculator({ btcUSD, usdZAR }: ConversionCalculatorProps) {
  const [zarAmount, setZarAmount] = useState<string>('10000');
  const [btcAmount, setBtcAmount] = useState<string>('0.1');
  const [activeTab, setActiveTab] = useState<'zar-to-btc' | 'btc-to-zar'>('zar-to-btc');

  const btcZAR = btcUSD * usdZAR;

  // Calculate conversions
  const zarToBtc = parseFloat(zarAmount) / btcZAR;
  const btcToZar = parseFloat(btcAmount) * btcZAR;

  // Fee estimation (typical exchange fee ~0.5%)
  const feePercentage = 0.5;
  const zarToBtcWithFees = zarToBtc * (1 - feePercentage / 100);
  const btcToZarWithFees = btcToZar * (1 - feePercentage / 100);

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatBTC = (num: number) => {
    if (isNaN(num) || !isFinite(num)) return '0';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    });
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">💱 Quick Converter</h2>
      
      {/* Tab Selector */}
      <div className="flex bg-gray-800 rounded-lg p-1 mb-4">
        <button
          onClick={() => setActiveTab('zar-to-btc')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'zar-to-btc'
              ? 'bg-orange-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          ZAR → BTC
        </button>
        <button
          onClick={() => setActiveTab('btc-to-zar')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'btc-to-zar'
              ? 'bg-orange-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          BTC → ZAR
        </button>
      </div>

      {activeTab === 'zar-to-btc' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              ZAR Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R</span>
              <input
                type="number"
                value={zarAmount}
                onChange={(e) => setZarAmount(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="10000"
              />
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">You get (before fees):</span>
              <span className="text-white font-mono">₿ {formatBTC(zarToBtc)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">After fees (~0.5%):</span>
              <span className="text-orange-400 font-mono font-semibold">₿ {formatBTC(zarToBtcWithFees)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Rate: R{formatNumber(btcZAR)} per BTC
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              BTC Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₿</span>
              <input
                type="number"
                value={btcAmount}
                onChange={(e) => setBtcAmount(e.target.value)}
                step="0.00000001"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.1"
              />
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">You get (before fees):</span>
              <span className="text-white font-mono">R{formatNumber(btcToZar)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">After fees (~0.5%):</span>
              <span className="text-orange-400 font-mono font-semibold">R{formatNumber(btcToZarWithFees)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Rate: R{formatNumber(btcZAR)} per BTC
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Amount Buttons */}
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">Quick amounts:</p>
        <div className="flex gap-2 flex-wrap">
          {activeTab === 'zar-to-btc' ? (
            <>
              {['1000', '5000', '10000', '50000', '100000'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setZarAmount(amount)}
                  className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                >
                  R{parseInt(amount).toLocaleString()}
                </button>
              ))}
            </>
          ) : (
            <>
              {['0.01', '0.05', '0.1', '0.5', '1'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBtcAmount(amount)}
                  className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                >
                  ₿{amount}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
