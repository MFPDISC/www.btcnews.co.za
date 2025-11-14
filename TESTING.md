# Testing & Troubleshooting Guide

## Quick Start

### 1. Verify API is working:
```bash
curl http://localhost:3000/api/btc-price
```

### 2. Check database stats:
```bash
curl http://localhost:3000/api/db-stats
```

### 3. Open in browser:
Open http://localhost:3000 in your web browser

## API Endpoints

### `/api/btc-price`
Returns current BTC price data and saves snapshot to database

### `/api/btc-history?days=7`
Returns hourly price history for charts

### `/api/db-stats`
Shows all stored data and statistics

## Dashboard Features

✅ Real-time BTC price in USD and ZAR
✅ Automatic currency conversion using Binance rates
✅ Market statistics (24h high/low, volume, market cap)
✅ 48-hour price history chart
✅ TradingView live and advanced charts
✅ Automatic data refresh every 30 seconds
✅ SQLite database storing all price snapshots

## Database

- Location: `./data/bitcoin.db`
- Stores: 5-minute snapshots + hourly averages
- Auto-created on first run
- Falls back to cached data if APIs fail

## Troubleshooting

### No data showing?
1. Check browser console (F12)
2. Verify `/api/btc-price` returns JSON
3. Wait 30 seconds for first data fetch

### API rate limited (429 error)?
- Normal - API will use cached database
- Happens after ~10 rapid requests
- Cached data serves within 30 seconds

### Need to check database content?
```bash
sqlite3 ./data/bitcoin.db "SELECT * FROM price_snapshots LIMIT 5;"
```
