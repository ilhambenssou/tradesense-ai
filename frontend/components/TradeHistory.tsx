
import React, { useState, useEffect } from 'react';
import { LucideHistory, LucideLoader2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../services/i18n';

interface TradeHistoryProps {
    challengeId: string;
    language: Language;
}

interface Trade {
    id: string;
    symbol: string;
    type: 'BUY' | 'SELL';
    entryPrice: number;
    exitPrice?: number;
    size: number;
    pnl: number;
    status: 'OPEN' | 'CLOSED';
    openedAt: string;
    closedAt?: string;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ challengeId, language }) => {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const t = translations[language];

    const fetchTrades = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/challenges/${challengeId}/trades`);
            if (response.ok) {
                const data = await response.json();
                setTrades(data);
            }
        } catch (err) {
            console.error("Trade history fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrades();
        const interval = setInterval(fetchTrades, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [challengeId]);

    return (
        <div className="bg-[#121214] border border-white/5 p-8 rounded-[32px]">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black text-white flex items-center gap-3">
                    <LucideHistory className="text-indigo-500" />
                    {t.tradeHistory || "Historique des Transactions"}
                </h3>
                {loading && <LucideLoader2 className="text-zinc-600 animate-spin" size={16} />}
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {trades.length === 0 && !loading && (
                    <p className="text-zinc-500 text-sm text-center py-4">Aucune transaction pour le moment.</p>
                )}
                {trades.map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] ${trade.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                }`}>
                                {trade.type}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white mb-0.5">{trade.symbol} <span className="text-zinc-500 text-[10px] font-mono ml-2">x{trade.size}</span></p>
                                <div className="flex gap-3">
                                    <span className="text-[10px] font-mono text-zinc-500">
                                        OPEN: <span className="text-zinc-300">{trade.entryPrice.toFixed(2)}</span>
                                    </span>
                                    {trade.exitPrice && (
                                        <span className="text-[10px] font-mono text-zinc-500">
                                            CLOSE: <span className="text-zinc-300">{trade.exitPrice.toFixed(2)}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-black ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                            </p>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${trade.status === 'OPEN' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-500'
                                }`}>
                                {trade.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TradeHistory;
