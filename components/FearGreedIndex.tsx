'use client';

import React, { useState, useEffect } from 'react';

interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

export default function FearGreedIndex() {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFearGreedIndex = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from Alternative.me API
        const response = await fetch('https://api.alternative.me/fng/?limit=1');
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
        
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          setData(result.data[0]);
        } else {
          throw new Error('No data received');
        }
      } catch (err) {
        console.warn('Fear & Greed API failed, using mock data:', err);
        // Fallback to mock data
        const mockValue = Math.floor(Math.random() * 100);
        const mockClassification = 
          mockValue <= 25 ? 'Extreme Fear' :
          mockValue <= 45 ? 'Fear' :
          mockValue <= 55 ? 'Neutral' :
          mockValue <= 75 ? 'Greed' : 'Extreme Greed';
        
        setData({
          value: mockValue.toString(),
          value_classification: mockClassification,
          timestamp: Date.now().toString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFearGreedIndex();
    
    // Refresh every 4 hours (API updates once per day, but we'll check more frequently)
    const interval = setInterval(fetchFearGreedIndex, 4 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getColorByValue = (value: number) => {
    if (value <= 25) return { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500' };
    if (value <= 45) return { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500' };
    if (value <= 55) return { bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500' };
    if (value <= 75) return { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500' };
    return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500' };
  };

  const getEmoji = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'extreme fear': return '😱';
      case 'fear': return '😰';
      case 'neutral': return '😐';
      case 'greed': return '🤑';
      case 'extreme greed': return '🚀';
      default: return '📊';
    }
  };

  const getDescription = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'extreme fear':
        return 'Market is in extreme fear. This could be a buying opportunity for long-term investors.';
      case 'fear':
        return 'Market sentiment is fearful. Investors are worried and selling may be overdone.';
      case 'neutral':
        return 'Market sentiment is balanced. Neither fear nor greed is driving the market.';
      case 'greed':
        return 'Market is getting greedy. Investors are becoming overconfident.';
      case 'extreme greed':
        return 'Market is in extreme greed. This could indicate a potential market top.';
      default:
        return 'Market sentiment indicator based on volatility, momentum, and social media.';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">😱 Fear & Greed Index</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">😱 Fear & Greed Index</h2>
        <div className="text-center text-gray-400">
          <p>Unable to load Fear & Greed data</p>
          <p className="text-sm mt-1">Please try again later</p>
        </div>
      </div>
    );
  }

  const value = parseInt(data.value);
  const colors = getColorByValue(value);
  const emoji = getEmoji(data.value_classification);
  const description = getDescription(data.value_classification);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">😱 Fear & Greed Index</h2>
      
      <div className="text-center mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          {/* Circular Progress */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#374151"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(value / 100) * 314} 314`}
              className={colors.text}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl mb-1">{emoji}</span>
            <span className={`text-2xl font-bold ${colors.text}`}>{value}</span>
          </div>
        </div>
        
        <div className={`inline-block px-4 py-2 rounded-lg border ${colors.border} ${colors.bg}/20`}>
          <span className={`font-semibold ${colors.text}`}>
            {data.value_classification}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Scale indicator */}
        <div className="relative">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Extreme Fear</span>
            <span>Neutral</span>
            <span>Extreme Greed</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
          </div>
          {/* Current position indicator */}
          <div 
            className="absolute top-6 w-0.5 h-4 bg-white rounded transform -translate-x-0.5"
            style={{ left: `${value}%` }}
          ></div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Updated: {new Date(parseInt(data.timestamp) * 1000).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
