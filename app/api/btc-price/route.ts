import { NextResponse } from 'next/server';
import axios from 'axios';
import { savePriceSnapshot, getLatestSnapshot, saveHourlyPrice } from '@/lib/db';

export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
  try {
    // Fetch BTC price and market data from CoinGecko
    const btcResponse = await axios.get(
      'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false',
      { timeout: 10000 }
    );

    // Fetch USDT/ZAR from Binance
    const usdtZarResponse = await axios.get(
      'https://api.binance.com/api/v3/ticker/24hr?symbol=USDTZAR',
      { timeout: 10000 }
    );

    const btcUSD = btcResponse.data.market_data.current_price.usd;
    const usdtZAR = parseFloat(usdtZarResponse.data.lastPrice);
    const usdZAR = usdtZAR;
    const btcZAR = btcUSD * usdZAR;

    const priceData = {
      btcUSD,
      btcZAR,
      usdtZAR,
      usdZAR,
      change24h: btcResponse.data.market_data.price_change_percentage_24h,
      high24h: btcResponse.data.market_data.high_24h.usd,
      low24h: btcResponse.data.market_data.low_24h.usd,
      volume24h: btcResponse.data.market_data.total_volume.usd,
      marketCap: btcResponse.data.market_data.market_cap.usd,
    };

    // Save to database
    try {
      savePriceSnapshot({
        btc_usd: priceData.btcUSD,
        btc_zar: priceData.btcZAR,
        usd_zar: priceData.usdZAR,
        change_24h: priceData.change24h,
        high_24h: priceData.high24h,
        low_24h: priceData.low24h,
        volume_24h: priceData.volume24h,
        market_cap: priceData.marketCap,
      });

      // Save hourly price snapshot (once per hour)
      const now = new Date();
      const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0);
      const hourStartStr = hourStart.toISOString().split('.')[0];
      saveHourlyPrice(hourStartStr, priceData.btcUSD, priceData.btcZAR);
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Don't fail the API if database fails
    }

    return NextResponse.json(priceData);
  } catch (error) {
    console.error('Error fetching BTC data:', error);

    // Return cached data if available
    const cached = getLatestSnapshot();
    if (cached) {
      return NextResponse.json({
        btcUSD: cached.btc_usd,
        btcZAR: cached.btc_zar,
        usdZAR: cached.usd_zar,
        usdtZAR: cached.usd_zar,
        change24h: cached.change_24h,
        high24h: cached.high_24h,
        low24h: cached.low_24h,
        volume24h: cached.volume_24h,
        marketCap: cached.market_cap,
        cached: true,
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch BTC price data' },
      { status: 500 }
    );
  }
}
