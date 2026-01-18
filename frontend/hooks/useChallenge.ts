
import { useState, useEffect, useCallback } from 'react';
import { Challenge, Trade } from '../types';

export const useChallenge = (challengeId: string | null) => {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    if (!challengeId) return;
    setLoading(true);
    try {
      // Logic for polling/fetching from backend truth
      // Mocking fetch logic aligned with contractual JSON
      const saved = localStorage.getItem('tradesense_challenge');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id === challengeId) {
          setChallenge(parsed);
          // In real backend: fetch /api/challenges/:id/trades
          const savedTrades = localStorage.getItem(`trades_${challengeId}`);
          setTrades(savedTrades ? JSON.parse(savedTrades) : []);
        }
      }
    } catch (err) {
      setError("FAILED_TO_SYNC_CHALLENGE");
    } finally {
      setLoading(false);
    }
  }, [challengeId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return { challenge, trades, loading, error, refreshData };
};
