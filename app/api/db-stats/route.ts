import { NextResponse } from 'next/server';
import { getSnapshotHistory, getHourlyPriceHistory } from '@/lib/db';

export async function GET() {
  try {
    const snapshots = getSnapshotHistory(288); // Last 12 hours of 5-minute snapshots
    const hourlyPrices = getHourlyPriceHistory(30); // Last 30 days of hourly prices

    return NextResponse.json({
      snapshots_count: snapshots.length,
      hourly_count: hourlyPrices.length,
      latest_snapshot: snapshots.length > 0 ? snapshots[snapshots.length - 1] : null,
      hourly_prices: hourlyPrices,
      snapshots: snapshots.slice(-20), // Last 20 snapshots
    });
  } catch (error) {
    console.error('Error getting DB stats:', error);
    return NextResponse.json(
      { error: 'Failed to get database stats' },
      { status: 500 }
    );
  }
}
