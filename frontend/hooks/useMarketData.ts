
import { useState, useEffect } from 'react';

export interface MarketPrice {
  symbol: string;
  price: number;
  currency: string;
  source: string;
  timestamp?: string;
}

export const useMarketData = (symbol: string, source: 'yahoo' | 'maroc' = 'yahoo') => {
  const [data, setData] = useState<MarketPrice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = async () => {
    try {
      // Construction de l'URL basée sur le contrat backend défini précédemment
      const endpoint = source === 'yahoo' 
        ? `/api/market/yahoo/${symbol}` 
        : `/api/market/maroc/${symbol}`;

      // Mock pour l'environnement sans backend réel (simulation locale)
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('webcontainer')) {
         const mockPrice = source === 'yahoo' 
            ? (symbol === 'TSLA' ? 180 : 65000) + (Math.random() * 10 - 5) 
            : 95.50 + (Math.random() * 0.4 - 0.2);
         
         setData({
            symbol,
            price: mockPrice,
            currency: source === 'yahoo' ? 'USD' : 'MAD',
            source: source === 'yahoo' ? 'YahooFinance' : 'BVC_Scraper'
         });
         setLoading(false);
         return;
      }

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Failed to fetch market data');
      const result = await response.json();
      
      if (result.error) throw new Error(result.error);
      
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    // Augmentation de la fréquence pour une courbe "vivante"
    const interval = setInterval(fetchPrice, 3000); 
    return () => clearInterval(interval);
  }, [symbol, source]);

  return { data, loading, error, refetch: fetchPrice };
};
