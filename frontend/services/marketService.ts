
import { MarketPrice } from '../hooks/useMarketData';

export class MarketService {
  private static API_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/';

  /**
   * Récupère les données RÉELLES via un proxy public ou API directe
   * Note: En environnement WebContainer, nous utilisons un fetch direct sur des APIs publiques de confiance.
   */
  static async fetchRealPrice(symbol: string): Promise<MarketPrice> {
    try {
      // Préférence: Backend Flask unifié (garantit égalité prix affiché/exécuté)
      const backend = `http://127.0.0.1:5000/api/price/${symbol}`;
      const beRes = await fetch(backend);
      if (beRes.ok) {
        const beJson = await beRes.json();
        if (!beJson.error && typeof beJson.price === 'number') {
          return {
            symbol,
            price: beJson.price,
            currency: beJson.currency || (symbol.includes('-') ? 'USD' : 'MAD'),
            source: beJson.source || 'BackendTruth',
            timestamp: new Date().toISOString()
          };
        }
      }
      
      // Fallback: Yahoo V8 direct
      const response = await fetch(`${this.API_BASE}${symbol}?interval=1m&range=1d`);
      const json = await response.json();
      const result = json.chart.result[0];
      const price = result.meta.regularMarketPrice;
      const currency = result.meta.currency;

      return {
        symbol,
        price,
        currency,
        source: 'LIVE_YAHOO_V8',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error("REAL_DATA_FETCH_ERROR", error);
      throw error;
    }
  }

  /**
   * Calcul du signal IA basé sur les prix réels (SMA 5/20)
   */
  static calculateSignal(prices: number[]): { type: 'BUY' | 'SELL' | 'HOLD'; reason: string } {
    if (prices.length < 20) return { type: 'HOLD', reason: 'Analyzing market depth...' };
    
    const sma5 = prices.slice(-5).reduce((a, b) => a + b, 0) / 5;
    const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;

    if (sma5 > sma20 * 1.0005) return { type: 'BUY', reason: 'Bullish momentum (SMA5 > SMA20)' };
    if (sma5 < sma20 * 0.9995) return { type: 'SELL', reason: 'Bearish pressure (SMA5 < SMA20)' };
    
    return { type: 'HOLD', reason: 'Market consolidation' };
  }
}
