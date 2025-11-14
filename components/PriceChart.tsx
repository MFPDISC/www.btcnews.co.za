'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  time: string;
  price: number;
}

interface PriceChartProps {
  data: ChartData[];
}

export default function PriceChart({ data }: PriceChartProps) {
  // Show message when no data is available
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-2">📊 Chart data unavailable</p>
          <p className="text-gray-500 text-sm">Historical price data is temporarily unavailable due to API rate limiting.</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 text-sm">{payload[0].payload.time}</p>
          <p className="text-orange-400 font-bold text-lg">
            ${payload[0].value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  // Fallback: Simple CSS-based chart if Recharts fails
  const renderFallbackChart = () => {
    const maxPrice = Math.max(...data.map(d => d.price));
    const minPrice = Math.min(...data.map(d => d.price));
    const priceRange = maxPrice - minPrice;
    
    return (
      <div className="w-full h-64 bg-gray-800/30 rounded-lg p-4 relative overflow-hidden">
        <div className="flex items-end h-full space-x-1">
          {data.map((point, index) => {
            const height = ((point.price - minPrice) / priceRange) * 100;
            return (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-sm relative group cursor-pointer"
                style={{ height: `${Math.max(height, 2)}%` }}
                title={`${point.time}: $${point.price.toLocaleString()}`}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {point.time}<br/>${point.price.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute top-2 left-4 text-xs text-gray-400">
          High: ${maxPrice.toLocaleString()}
        </div>
        <div className="absolute bottom-2 left-4 text-xs text-gray-400">
          Low: ${minPrice.toLocaleString()}
        </div>
      </div>
    );
  };

  // Try to render Recharts, fallback to simple chart if it fails
  try {
    return (
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickLine={{ stroke: '#374151' }}
              interval="preserveStartEnd"
              tickMargin={10}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickLine={{ stroke: '#374151' }}
              domain={['dataMin - 500', 'dataMax + 500']}
              tickFormatter={(value) =>
                `$${value.toLocaleString('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                })}`
              }
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#f97316"
              strokeWidth={3}
              dot={false}
              fill="url(#colorPrice)"
              fillOpacity={1}
              activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } catch (error) {
    console.error('Recharts failed, using fallback chart:', error);
    return renderFallbackChart();
  }
}
