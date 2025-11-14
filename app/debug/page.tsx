'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DebugPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 [DEBUG] Fetching from /api/btc-price...');
        const response = await axios.get('/api/btc-price', {
          timeout: 10000,
        });
        
        console.log('✅ [DEBUG] Response received:', response.data);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ [DEBUG] Error:', errorMsg);
        setError(errorMsg);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🐛 BTCnews Debug Page</h1>

      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">API Status</h2>
          {loading && <p className="text-yellow-400">⏳ Loading...</p>}
          {error && <p className="text-red-400">❌ Error: {error}</p>}
          {data && <p className="text-green-400">✅ API Working</p>}
        </div>

        {data && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">API Response Data</h2>
            <div className="font-mono text-sm space-y-2 bg-black p-4 rounded">
              <div><span className="text-yellow-400">BTC/USD:</span> <span className="text-green-400">${data.btcUSD?.toLocaleString()}</span></div>
              <div><span className="text-yellow-400">BTC/ZAR:</span> <span className="text-green-400">R{data.btcZAR?.toLocaleString('en-ZA', {maximumFractionDigits: 2})}</span></div>
              <div><span className="text-yellow-400">USD/ZAR:</span> <span className="text-green-400">{data.usdZAR?.toFixed(2)}</span></div>
              <div><span className="text-yellow-400">24h Change:</span> <span className="text-cyan-400">{data.change24h?.toFixed(2)}%</span></div>
              <div><span className="text-yellow-400">24h High:</span> <span className="text-blue-400">${data.high24h?.toLocaleString()}</span></div>
              <div><span className="text-yellow-400">24h Low:</span> <span className="text-blue-400">${data.low24h?.toLocaleString()}</span></div>
              <div><span className="text-yellow-400">24h Volume:</span> <span className="text-purple-400">${(data.volume24h / 1e9).toFixed(2)}B</span></div>
              <div><span className="text-yellow-400">Market Cap:</span> <span className="text-purple-400">${(data.marketCap / 1e12).toFixed(2)}T</span></div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Browser Console</h2>
          <p className="text-gray-400 text-sm">
            Open your browser DevTools (F12) and check the Console tab for debug logs.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Look for messages starting with [DEBUG], ✅, or ❌
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Quick Tests</h2>
          <div className="space-y-2">
            <a
              href="/api/btc-price"
              className="block bg-blue-600 hover:bg-blue-700 p-3 rounded text-center"
              target="_blank"
            >
              View Raw API Response
            </a>
            <a
              href="/api/db-stats"
              className="block bg-purple-600 hover:bg-purple-700 p-3 rounded text-center"
              target="_blank"
            >
              View Database Stats
            </a>
            <a
              href="/"
              className="block bg-orange-600 hover:bg-orange-700 p-3 rounded text-center"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
