import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'bitcoin.db');

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeDb();
  }
  return db;
}

function initializeDb() {
  const database = getDb();

  // Create tables if they don't exist
  database.exec(`
    CREATE TABLE IF NOT EXISTS price_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      btc_usd REAL NOT NULL,
      btc_zar REAL NOT NULL,
      usd_zar REAL NOT NULL,
      change_24h REAL NOT NULL,
      high_24h REAL NOT NULL,
      low_24h REAL NOT NULL,
      volume_24h REAL NOT NULL,
      market_cap REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hourly_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      hour_start DATETIME NOT NULL,
      btc_usd REAL NOT NULL,
      btc_zar REAL NOT NULL,
      UNIQUE(hour_start)
    );

    CREATE INDEX IF NOT EXISTS idx_price_snapshots_timestamp ON price_snapshots(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_hourly_prices_hour_start ON hourly_prices(hour_start DESC);
  `);
}

export interface PriceSnapshot {
  id?: number;
  timestamp?: string;
  btc_usd: number;
  btc_zar: number;
  usd_zar: number;
  change_24h: number;
  high_24h: number;
  low_24h: number;
  volume_24h: number;
  market_cap: number;
}

export function savePriceSnapshot(data: PriceSnapshot) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT INTO price_snapshots (
      btc_usd, btc_zar, usd_zar, change_24h, 
      high_24h, low_24h, volume_24h, market_cap
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    data.btc_usd,
    data.btc_zar,
    data.usd_zar,
    data.change_24h,
    data.high_24h,
    data.low_24h,
    data.volume_24h,
    data.market_cap
  );
}

export function getLatestSnapshot(): PriceSnapshot | null {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT * FROM price_snapshots 
    ORDER BY timestamp DESC 
    LIMIT 1
  `);

  return (stmt.get() as PriceSnapshot) || null;
}

export function getSnapshotHistory(limit: number = 288) {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT * FROM price_snapshots 
    ORDER BY timestamp DESC 
    LIMIT ?
  `);

  return (stmt.all(limit) as PriceSnapshot[]).reverse();
}

export function saveHourlyPrice(timestamp: string, btc_usd: number, btc_zar: number) {
  const database = getDb();
  const stmt = database.prepare(`
    INSERT OR REPLACE INTO hourly_prices (hour_start, btc_usd, btc_zar)
    VALUES (?, ?, ?)
  `);

  return stmt.run(timestamp, btc_usd, btc_zar);
}

export function getHourlyPriceHistory(days: number = 7) {
  const database = getDb();
  const stmt = database.prepare(`
    SELECT * FROM hourly_prices 
    WHERE hour_start >= datetime('now', '-' || ? || ' days')
    ORDER BY hour_start ASC
  `);

  return stmt.all(days) as Array<{ hour_start: string; btc_usd: number; btc_zar: number }>;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

// Analytics functions
export function saveAnalyticsEvent(event: {
  type: string;
  data: any;
}) {
  const database = getDb();
  
  // Create analytics table if it doesn't exist
  database.exec(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      data TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  const stmt = database.prepare(`
    INSERT INTO analytics_events (type, data)
    VALUES (?, ?)
  `);
  
  stmt.run(event.type, JSON.stringify(event.data));
}

export function getAnalyticsStats(days: number = 7) {
  const database = getDb();
  
  // Get visitor stats
  const visitorStats = database.prepare(`
    SELECT 
      COUNT(*) as total_visits,
      COUNT(DISTINCT json_extract(data, '$.ip')) as unique_visitors
    FROM analytics_events 
    WHERE type = 'visit' 
    AND timestamp >= datetime('now', '-${days} days')
  `).get();
  
  // Get referral clicks
  const referralStats = database.prepare(`
    SELECT 
      json_extract(data, '$.exchange') as exchange,
      COUNT(*) as clicks
    FROM analytics_events 
    WHERE type = 'referral_click' 
    AND timestamp >= datetime('now', '-${days} days')
    GROUP BY json_extract(data, '$.exchange')
  `).all();
  
  // Get page views
  const pageStats = database.prepare(`
    SELECT 
      json_extract(data, '$.page') as page,
      COUNT(*) as views
    FROM analytics_events 
    WHERE type = 'visit' 
    AND timestamp >= datetime('now', '-${days} days')
    GROUP BY json_extract(data, '$.page')
    ORDER BY views DESC
  `).all();
  
  return {
    visitors: visitorStats,
    referrals: referralStats,
    pages: pageStats,
  };
}
