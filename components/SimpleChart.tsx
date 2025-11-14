'use client';

import React from 'react';

interface ChartData {
  time: string;
  price: number;
}

interface SimpleChartProps {
  data: ChartData[];
}

export default function SimpleChart({ data }: SimpleChartProps) {
  console.log('SimpleChart received:', data?.length || 0, 'data points');
  
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-800/30 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">No chart data available</p>
          <p className="text-xs text-gray-500 mt-1">Data length: {data?.length || 'undefined'}</p>
        </div>
      </div>
    );
  }

  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));
  const priceRange = maxPrice - minPrice || 1; // Avoid division by zero
  
  return (
    <div className="w-full h-64 bg-gray-800/30 rounded-lg p-4 relative overflow-hidden">
      {/* Chart bars */}
      <div className="flex items-end h-full space-x-1">
        {data.map((point, index) => {
          const height = priceRange > 0 ? ((point.price - minPrice) / priceRange) * 100 : 50;
          return (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-sm relative group cursor-pointer transition-all hover:from-orange-400 hover:to-orange-200"
              style={{ height: `${Math.max(height, 2)}%` }}
              title={`${point.time}: $${point.price.toLocaleString()}`}
            >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                <div className="text-center">
                  <div>{point.time}</div>
                  <div className="font-semibold">${point.price.toLocaleString()}</div>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Price labels */}
      <div className="absolute top-2 left-4 text-xs text-gray-400 bg-gray-900/80 px-2 py-1 rounded">
        High: ${maxPrice.toLocaleString()}
      </div>
      <div className="absolute bottom-2 left-4 text-xs text-gray-400 bg-gray-900/80 px-2 py-1 rounded">
        Low: ${minPrice.toLocaleString()}
      </div>
      
      {/* Data info */}
      <div className="absolute top-2 right-4 text-xs text-gray-500 bg-gray-900/80 px-2 py-1 rounded">
        {data.length} points
      </div>
    </div>
  );
}
