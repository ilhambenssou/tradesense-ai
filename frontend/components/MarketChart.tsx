
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface MarketChartProps {
  symbol: string;
  theme?: 'light' | 'dark';
}

const MarketChart: React.FC<MarketChartProps> = ({ symbol, theme = 'dark' }) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const lwChartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null);

  const isBVC = ['IAM', 'ATW'].includes(symbol);

  // --- TRADINGVIEW WIDGET LOGIC (International) ---
  useEffect(() => {
    if (isBVC) return;
    if (!widgetRef.current || !window.TradingView) return;

    // Clear previous
    widgetRef.current.innerHTML = "";

    const getTVSymbol = (s: string) => {
      const mapping: Record<string, string> = {
        'BTC-USD': 'BINANCE:BTCUSDT',
        'ETH-USD': 'BINANCE:ETHUSDT',
        'TSLA': 'NASDAQ:TSLA',
        'AAPL': 'NASDAQ:AAPL',
      };
      return mapping[s] || s;
    };

    new window.TradingView.widget({
      "autosize": true,
      "symbol": getTVSymbol(symbol),
      "interval": "1",
      "timezone": "Etc/UTC",
      "theme": theme,
      "style": "1",
      "locale": "en",
      "toolbar_bg": theme === 'dark' ? "#121214" : "#f8f9fa",
      "enable_publishing": false,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "container_id": widgetRef.current.id,
      "details": true,
      "hotlist": true,
      "calendar": true,
      "show_popup_button": false,
      "popup_width": "1000",
      "popup_height": "650",
      "backgroundColor": theme === 'dark' ? "rgba(18, 18, 20, 1)" : "rgba(255, 255, 255, 1)",
      "gridColor": theme === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
      "studies": ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
    });

  }, [symbol, theme, isBVC]);

  // --- LIGHTWEIGHT CHART LOGIC (Maroc / IAM) ---
  useEffect(() => {
    if (!isBVC) return;
    if (!lwChartRef.current) return;

    // Initialize Chart
    lwChartRef.current.innerHTML = "";

    const chart = createChart(lwChartRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: theme === 'dark' ? '#121214' : '#ffffff' },
        textColor: theme === 'dark' ? '#d1d5db' : '#333',
      },
      grid: {
        vertLines: { color: theme === 'dark' ? '#333' : '#eee' },
        horzLines: { color: theme === 'dark' ? '#333' : '#eee' },
      },
      width: lwChartRef.current.clientWidth,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const series = chart.addLineSeries({
      color: '#4f46e5',
      lineWidth: 2,
      crosshairMarkerVisible: true,
    });

    chartInstance.current = chart;

    // Load initial history (simulated recent past to avoid empty chart)
    const now = Math.floor(Date.now() / 1000);
    const initialData = [];
    let basePrice = symbol === 'IAM' ? 95.50 : 480.00;
    for (let i = 100; i > 0; i--) {
      initialData.push({ time: now - (i * 60) as any, value: basePrice + (Math.random() - 0.5) });
    }
    series.setData(initialData);

    // Polling Real Data
    const fetchPoint = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/price/${symbol}`);
        const data = await res.json();
        if (data.price && data.timestamp) {
          series.update({
            time: data.timestamp as any,
            value: data.price
          });
          // Optional: Fit content if needed, but auto-scaling usually works
          // chart.timeScale().scrollToPosition(0, false);
        }
      } catch (e) {
        console.error("Chart Poll Error", e);
      }
    };

    fetchPoint();
    const interval = setInterval(fetchPoint, 2000); // Poll every 2s

    const handleResize = () => {
      if (lwChartRef.current) {
        chart.applyOptions({ width: lwChartRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol, theme, isBVC]);

  return (
    <div className="w-full h-[600px] rounded-[32px] overflow-hidden border dark:border-white/5 border-black/5 shadow-2xl relative bg-[#121214]">
      {/* Visual Overlay Header */}
      <div className="absolute top-0 left-0 right-0 h-1 z-10 bg-indigo-600" />

      {/* Widget Container */}
      <div
        ref={widgetRef}
        id="tv_widget_container"
        className="w-full h-full"
        style={{ display: isBVC ? 'none' : 'block' }}
      />

      {/* Lightweight Chart Container */}
      <div
        ref={lwChartRef}
        id="lw_chart_container"
        className="w-full h-full"
        style={{ display: isBVC ? 'block' : 'none' }}
      />
    </div>
  );
};
export default MarketChart;
