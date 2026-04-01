'use client';

import React, { useState } from 'react';

interface TermTooltipProps {
  term: string;
  children: React.ReactNode;
  className?: string;
}

const BITCOIN_TERMS: Record<string, { definition: string; example?: string; icon: string }> = {
  satoshi: {
    definition: "The smallest unit of Bitcoin. 1 Bitcoin = 100,000,000 satoshis (sats)",
    example: "If Bitcoin is $100,000, then 1 satoshi = $0.001",
    icon: "⚡"
  },
  hashrate: {
    definition: "The total computational power securing the Bitcoin network. Measured in hashes per second.",
    example: "Higher hash rate = more secure network",
    icon: "⛏️"
  },
  volatility: {
    definition: "A measure of how much Bitcoin's price fluctuates over time. Higher volatility = more price swings.",
    example: "30-day volatility of 80% means price typically moves ±80% annually",
    icon: "📊"
  },
  stocktoflow: {
    definition: "A model that predicts Bitcoin price based on scarcity. Stock = existing supply, Flow = new supply.",
    example: "Higher stock-to-flow ratio suggests higher price",
    icon: "📈"
  },
  whale: {
    definition: "Large Bitcoin holders (typically 1,000+ BTC) whose transactions can impact the market.",
    example: "When whales move Bitcoin, it often signals market changes",
    icon: "🐋"
  },
  halving: {
    definition: "Event every ~4 years where Bitcoin mining rewards are cut in half, reducing new supply.",
    example: "Next halving: 6.25 BTC → 3.125 BTC per block",
    icon: "📅"
  },
  dominance: {
    definition: "Bitcoin's market cap as a percentage of the total cryptocurrency market cap.",
    example: "60% dominance means Bitcoin is 60% of all crypto value",
    icon: "👑"
  }
};

export function TermTooltip({ term, children, className = "" }: TermTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const termData = BITCOIN_TERMS[term.toLowerCase()];

  if (!termData) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span 
      className={`relative inline-flex items-center cursor-help ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <span className="ml-1 text-xs text-orange-400 hover:text-orange-300 transition-colors">
        {termData.icon}
      </span>
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 p-4 bg-gray-900 border border-orange-500/30 rounded-lg shadow-xl z-50">
          <div className="text-sm">
            <div className="flex items-center mb-2">
              <span className="text-lg mr-2">{termData.icon}</span>
              <span className="font-semibold text-orange-400 capitalize">{term}</span>
            </div>
            <p className="text-gray-300 mb-2 leading-relaxed">
              {termData.definition}
            </p>
            {termData.example && (
              <div className="bg-gray-800/50 rounded p-2 border-l-2 border-orange-500">
                <p className="text-xs text-gray-400">
                  <span className="font-medium text-orange-300">Example:</span> {termData.example}
                </p>
              </div>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </span>
  );
}

// Quick reference component for the sidebar or footer
export function BitcoinGlossary() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-semibold text-white flex items-center">
          <span className="mr-2">📚</span>
          Bitcoin Terminology
        </h3>
        <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className="mt-4 space-y-3">
          {Object.entries(BITCOIN_TERMS).map(([term, data]) => (
            <div key={term} className="bg-gray-800/30 rounded-lg p-3">
              <div className="flex items-center mb-1">
                <span className="text-sm mr-2">{data.icon}</span>
                <span className="font-medium text-orange-400 capitalize">{term}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {data.definition}
              </p>
              {data.example && (
                <p className="text-xs text-gray-500 mt-1 italic">
                  {data.example}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
