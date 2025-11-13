# BTCnews.co.za - Bitcoin Price Dashboard

A sleek, modern dark-mode dashboard for real-time Bitcoin price tracking with ZAR conversion and comprehensive market data.

## Features

- 🪙 **Real-time BTC Price** - Live Bitcoin prices in USD and ZAR
- 💱 **Currency Conversion** - Automatic BTC/ZAR calculation using Binance USDT/ZAR rates
- 📊 **Interactive Charts** - 48-hour price history with Recharts
- 📈 **TradingView Integration** - Professional trading charts with technical indicators
- 📉 **Market Statistics** - 24h high/low, volume, and market cap
- 🔄 **Auto-refresh** - Data updates every 30 seconds
- 🌙 **Dark Mode** - Beautiful dark theme optimized for extended viewing

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **TradingView Widgets** - Professional trading charts

## Data Sources

- **CoinGecko API** - Bitcoin price and market data (free, no API key required)
- **Binance API** - USDT/ZAR exchange rate (public endpoint)
- **TradingView** - Live charts and technical analysis

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
npm start
```

## Database

The dashboard uses **SQLite** to store price snapshots automatically:

### Price Snapshots (`price_snapshots` table)
- Saved every 30 seconds from the API
- Stores: BTC/USD, BTC/ZAR, USD/ZAR rates, 24h change, high/low, volume, market cap
- Allows fallback to cached data if external APIs fail
- Location: `./data/bitcoin.db`

### Hourly Prices (`hourly_prices` table)
- One entry per hour to maintain daily/monthly historical data
- Used for long-term price trend analysis
- Efficient storage compared to storing every single update

### Database Location
```
BTCnews.co.za/
├── data/
│   ├── bitcoin.db        # Main database file
│   ├── bitcoin.db-shm    # Shared memory file (WAL mode)
│   └── bitcoin.db-wal    # Write-ahead log file (WAL mode)
```

The database is automatically created on first run.

### Viewing Database Stats

You can check database contents via the stats endpoint:

```bash
# View stored snapshots and hourly prices
curl http://localhost:3000/api/db-stats
```

## API Routes

### `/api/btc-price`
Fetches current BTC price data and saves to database

**Response:**
```json
{
  "btcUSD": 99695,
  "btcZAR": 1714754,
  "usdZAR": 17.2,
  "usdtZAR": 17.2,
  "change24h": -2.177,
  "high24h": 103933,
  "low24h": 98102,
  "volume24h": 100783715957,
  "marketCap": 1990536829386,
  "cached": false
}
```

### `/api/btc-history?days=7`
Fetches price history for charts (uses database if available, falls back to CoinGecko)

### `/api/db-stats`
Returns database statistics including all stored snapshots and hourly prices

## Features Breakdown

### Price Cards
- BTC/USD price with 24h change percentage
- BTC/ZAR price (highlighted) with 24h change
- USD/ZAR exchange rate display

### Market Statistics
- 24-hour high and low prices
- 24-hour trading volume
- Total market capitalization

### Charts
- 48-hour price history chart (from our database or CoinGecko)
- Live TradingView mini chart
- Full-size advanced TradingView chart with indicators

## Deployment

The application is ready to deploy to:
- **Vercel** (easiest - just push to GitHub)
- **Railway**
- **Render**
- Any server with Node.js 18+

Note: SQLite database will persist in the `/data` directory. For serverless deployment, consider migrating to PostgreSQL.

## License

© 2025 BTCnews.co.za - All rights reserved
# www.btcnews.co.za
