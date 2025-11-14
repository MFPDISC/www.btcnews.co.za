'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewWidgetProps {
  advanced?: boolean;
}

export default function TradingViewWidget({ advanced = false }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== 'undefined') {
        if (advanced) {
          new window.TradingView.widget({
            autosize: true,
            symbol: 'BINANCE:BTCUSDT',
            interval: '60',
            timezone: 'Africa/Johannesburg',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#0a0a0a',
            enable_publishing: false,
            withdateranges: true,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            studies: [
              'MASimple@tv-basicstudies',
              'RSI@tv-basicstudies',
            ],
            container_id: containerRef.current?.id || 'tradingview-widget-advanced',
            backgroundColor: '#0a0a0a',
            gridColor: 'rgba(255, 255, 255, 0.06)',
          });
        } else {
          new window.TradingView.widget({
            width: '100%',
            height: 400,
            symbol: 'BINANCE:BTCUSDT',
            interval: 'D',
            timezone: 'Africa/Johannesburg',
            theme: 'dark',
            style: '1',
            locale: 'en',
            toolbar_bg: '#0a0a0a',
            enable_publishing: false,
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
            container_id: containerRef.current?.id || 'tradingview-widget',
            backgroundColor: '#0a0a0a',
            gridColor: 'rgba(255, 255, 255, 0.06)',
          });
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [advanced]);

  return (
    <div
      ref={containerRef}
      id={advanced ? 'tradingview-widget-advanced' : 'tradingview-widget'}
      className={advanced ? 'w-full h-[600px]' : 'w-full h-[400px]'}
    />
  );
}
