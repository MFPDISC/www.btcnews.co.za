import { NextResponse } from 'next/server';
import axios from 'axios';
import { getHourlyPriceHistory } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    // First try to get from our database
    const dbData = getHourlyPriceHistory(days);

    if (dbData.length > 20) {
      // We have enough data from DB, use it
      const formattedData = dbData.map(item => ({
        time: new Date(item.hour_start).toLocaleTimeString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
        }),
        price: item.btc_usd,
      }));

      return NextResponse.json(formattedData);
    }

    // Fall back to CoinGecko API
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=hourly`,
        { timeout: 10000 }
      );

      const processedData = response.data.prices
        .slice(-48) // Last 48 hours
        .map((item: [number, number]) => ({
          time: new Date(item[0]).toLocaleTimeString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
          }),
          price: item[1],
        }));

      return NextResponse.json(processedData);
    } catch (apiError) {
      console.warn('CoinGecko API failed, returning empty data:', apiError);
      // Return empty array instead of error when API is rate limited
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching history:', error);
    // Return empty array instead of 500 error
    return NextResponse.json([]);
  }
}
