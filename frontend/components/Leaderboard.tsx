
import React, { useState, useEffect } from 'react';
import {
  LucideTrophy,
  LucideLoader2,
  LucideCrown,
  LucideMedal,
  LucideAward,
  LucideTrendingUp,
  LucideUsers,
  LucideCalendar
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../services/i18n';

interface LeaderboardProps {
  language: Language;
}

interface Trader {
  rank: number;
  user: string;
  profit: string;
  profit_pct?: number;
  profit_absolute?: string;
  status: string;
  trades_count?: number;
  win_rate?: string;
  country?: string;
  initial_balance?: string;
  is_real?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ language }) => {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const t = translations[language];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        // Fetch leaderboard
        const response = await fetch('http://127.0.0.1:5000/api/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setTraders(data);
        }

        // Fetch stats
        const statsResponse = await fetch('http://127.0.0.1:5000/api/leaderboard/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (err) {
        console.error("Leaderboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  // Badge de statut
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      FUNDED: { label: "💰 FUNDED", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
      PASSED: { label: "✅ PASSED", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
      ACTIVE: { label: "🔥 ACTIVE", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" }
    };
    return badges[status] || { label: status, color: "bg-zinc-800 text-zinc-500 border-zinc-700" };
  };

  // Icône de podium
  const getPodiumIcon = (rank: number) => {
    if (rank === 1) return <LucideCrown className="text-amber-500" size={24} />;
    if (rank === 2) return <LucideMedal className="text-zinc-400" size={22} />;
    if (rank === 3) return <LucideAward className="text-amber-700" size={20} />;
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b dark:border-white/5 border-black/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30">
            <LucideTrophy className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black dark:text-white text-zinc-900 italic uppercase tracking-tighter">
              {t.leaderboardTitle}
            </h2>
            <p className="text-xs text-zinc-500 font-bold mt-1">Top 10 Traders du Mois • Classement en Temps Réel</p>
          </div>
        </div>

        {loading && (
          <LucideLoader2 className="text-indigo-500 animate-spin" size={24} />
        )}
      </div>

      {/* Stats globales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="dark:bg-[#121214] bg-white border dark:border-white/5 border-black/5 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <LucideUsers className="text-indigo-500" size={20} />
              <span className="text-xs font-black text-zinc-500 uppercase tracking-wider">Traders Actifs</span>
            </div>
            <p className="text-3xl font-black dark:text-white text-zinc-900">{stats.total_traders}</p>
          </div>

          <div className="dark:bg-[#121214] bg-white border dark:border-white/5 border-black/5 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <LucideTrendingUp className="text-emerald-500" size={20} />
              <span className="text-xs font-black text-zinc-500 uppercase tracking-wider">Profit Moyen</span>
            </div>
            <p className="text-3xl font-black text-emerald-500">{stats.avg_profit}</p>
          </div>

          <div className="dark:bg-[#121214] bg-white border dark:border-white/5 border-black/5 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <LucideCalendar className="text-amber-500" size={20} />
              <span className="text-xs font-black text-zinc-500 uppercase tracking-wider">Période</span>
            </div>
            <p className="text-xl font-black dark:text-white text-zinc-900">{stats.month}</p>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="space-y-4">
        {traders.map((trader) => {
          const statusBadge = getStatusBadge(trader.status);
          const isPodium = trader.rank <= 3;

          return (
            <div
              key={trader.rank}
              className={`dark:bg-[#121214] bg-white border dark:border-white/5 border-black/5 p-6 rounded-[24px] transition-all hover:dark:bg-white/5 hover:bg-black/5 ${isPodium ? 'ring-2 ring-amber-500/20 shadow-xl shadow-amber-500/10' : ''
                }`}
            >
              <div className="flex items-center gap-6">
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl ${trader.rank === 1
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                    : trader.rank === 2
                      ? 'bg-gradient-to-br from-zinc-400 to-zinc-500 text-white shadow-lg shadow-zinc-400/30'
                      : trader.rank === 3
                        ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-white shadow-lg shadow-amber-700/30'
                        : 'dark:bg-zinc-800 bg-zinc-200 dark:text-zinc-400 text-zinc-600'
                  }`}>
                  {isPodium ? getPodiumIcon(trader.rank) : trader.rank}
                </div>

                {/* Trader Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-black dark:text-white text-zinc-900">
                      {trader.user}
                    </h4>
                    {trader.country && (
                      <span className="text-xs font-bold text-zinc-500">{trader.country}</span>
                    )}
                    {trader.is_real && (
                      <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full border border-indigo-500/20">
                        REAL TRADER
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>

                    {trader.trades_count && (
                      <span className="text-xs text-zinc-600 font-bold">
                        📊 {trader.trades_count} trades
                      </span>
                    )}

                    {trader.win_rate && (
                      <span className="text-xs text-zinc-600 font-bold">
                        🎯 {trader.win_rate} win rate
                      </span>
                    )}
                  </div>
                </div>

                {/* Profit */}
                <div className="text-right flex-shrink-0">
                  <p className={`text-2xl font-black ${trader.rank === 1 ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                    {trader.profit}
                  </p>
                  {trader.profit_absolute && (
                    <p className="text-xs text-zinc-600 font-bold mt-1">{trader.profit_absolute}</p>
                  )}
                  {trader.initial_balance && (
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">sur {trader.initial_balance}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center pt-8 border-t dark:border-white/5 border-black/5">
        <p className="text-xs text-zinc-600 font-bold">
          Classement mis à jour en temps réel • Basé sur les performances du mois en cours
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
