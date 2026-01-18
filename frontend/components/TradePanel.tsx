
import React, { useState } from 'react';
import { Challenge, ChallengeStatus, Language } from '../types';
import { translations } from '../services/i18n';
import { LucideZap, LucideArrowDownCircle, LucideLoader2, LucideAlertTriangle, LucideActivity } from 'lucide-react';

interface TradePanelProps {
  challenge: Challenge;
  currentPrice: number;
  symbol: string;
  onUpdate: (challenge: Challenge) => void;
  language: Language;
}

const TradePanel: React.FC<TradePanelProps> = ({ challenge, currentPrice, symbol, onUpdate, language }) => {
  const [lotSize, setLotSize] = useState<string | number>(1.0);
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const canTrade = challenge.status === ChallengeStatus.ACTIVE;

  const handleOrder = async (side: 'BUY' | 'SELL') => {
    if (!canTrade) return;

    setLoading(true);

    try {
      // Validation du lot size
      const size = Number(lotSize);
      if (size <= 0 || isNaN(size)) {
        alert("❌ Taille de lot invalide");
        setLoading(false);
        return;
      }

      // Vérification du prix en temps réel
      if (!currentPrice || currentPrice <= 0) {
        alert("❌ Prix du marché indisponible. Veuillez réessayer.");
        setLoading(false);
        return;
      }

      // Payload pour l'API (route correcte avec logique métier)
      const payload = {
        challengeId: challenge.id,
        symbol: symbol,
        type: side,
        size: size
        // Le prix sera récupéré côté serveur pour garantir la vérité système
      };

      // Appel à la vraie route avec logique métier complète
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api/trades/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        // Gestion des erreurs métier
        const errorMsg = data.message || data.error || "Erreur d'exécution";
        alert(`❌ ${errorMsg}`);
        setLoading(false);
        return;
      }

      // Succès : mise à jour du challenge
      if (data.challenge) {
        onUpdate(data.challenge);
      }

      // Feedback visuel de succès
      const trade = data.trade;
      const pnlColor = trade.pnl >= 0 ? '🟢' : '🔴';
      alert(`✅ Trade exécuté!\n${pnlColor} PnL: ${trade.pnl.toFixed(2)}\n📊 ${side} ${size} lots @ ${trade.entryPrice.toFixed(2)}`);

    } catch (err) {
      console.error("TRADE_EXECUTION_ERROR", err);
      alert("❌ Erreur réseau. Vérifiez que le serveur backend est actif.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-[#121214] bg-white border dark:border-white/5 border-black/5 p-10 rounded-[40px] relative overflow-hidden shadow-2xl">
      {!canTrade && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[6px] z-30 flex flex-col items-center justify-center p-8 text-center rounded-[40px] border border-white/5 animate-in fade-in duration-300">
          <LucideAlertTriangle className={`${challenge.status === 'FAILED' ? 'text-rose-500' : 'text-amber-500'} mb-6 animate-pulse`} size={54} />
          <h4 className="text-white font-black text-xl uppercase italic tracking-tighter mb-4">
            {challenge.status === 'EXPLORATION' ? 'Mode Exploration' :
              challenge.status === 'FAILED' ? 'Compte Échoué (Failed)' : 'Exécution Stoppée'}
          </h4>
          <p className="text-zinc-400 text-xs font-bold leading-relaxed max-w-[200px] mx-auto mb-8">
            {challenge.status === 'EXPLORATION'
              ? "Vous devez acheter un challenge pour exécuter des trades sur le marché réel."
              : challenge.status === 'FAILED'
                ? "Vous avez enfreint les règles de gestion des risques (Daily ou Max Loss). Ce compte est définitivement clos."
                : t.activationRequired}
          </p>
          {challenge.status === 'EXPLORATION' ? (
            <button
              onClick={() => window.location.href = '/pricing'}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all"
            >
              Voir les offres
            </button>
          ) : challenge.status === 'FAILED' ? (
            <button
              onClick={() => window.location.reload()} // Simple reset or link to new challenge
              className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-600/30 transition-all"
            >
              Réessayer
            </button>
          ) : null}
        </div>
      )}

      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
            <LucideActivity size={20} />
          </div>
          <h3 className="text-xl font-black dark:text-white text-zinc-900 italic uppercase tracking-tighter">{t.execution}</h3>
        </div>
        <div className="text-[10px] font-mono text-zinc-500 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-xl border dark:border-white/5 border-black/5 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
          {symbol}
        </div>
      </div>

      <div className="space-y-10">
        <div>
          <div className="flex justify-between items-end mb-4 px-2">
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{t.lotSize}</label>
              <p className="text-xs font-bold dark:text-white text-zinc-900 italic">Volume Control</p>
            </div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">{t.instantFill}</span>
          </div>
          <div className="flex items-center gap-4 dark:bg-black/40 bg-zinc-100 p-2 rounded-3xl border dark:border-white/5 border-black/5 shadow-inner">
            <button
              onClick={() => setLotSize(prev => Math.max(0.1, Number((Number(prev) - 0.1).toFixed(2))))}
              className="w-14 h-14 flex items-center justify-center text-zinc-500 hover:text-indigo-600 hover:bg-white/5 rounded-2xl transition-all font-black text-2xl"
            >-</button>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
              className="w-32 bg-transparent text-center font-mono font-black text-xl dark:text-white text-zinc-900 outline-none"
            />
            <button
              onClick={() => setLotSize(prev => Number((Number(prev) + 0.1).toFixed(2)))}
              className="w-14 h-14 flex items-center justify-center text-zinc-500 hover:text-indigo-600 hover:bg-white/5 rounded-2xl transition-all font-black text-2xl"
            >+</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button
            disabled={loading || !canTrade}
            onClick={() => handleOrder('BUY')}
            className="group relative flex items-center justify-center gap-3 py-6 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 disabled:cursor-not-allowed text-black font-black rounded-[24px] transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 text-xs uppercase tracking-widest overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? <LucideLoader2 className="animate-spin" size={20} /> : <LucideZap size={20} fill="currentColor" />}
            <span className="relative z-10">{t.buy}</span>
          </button>
          <button
            disabled={loading || !canTrade}
            onClick={() => handleOrder('SELL')}
            className="group relative flex items-center justify-center gap-3 py-6 bg-rose-500 hover:bg-rose-400 disabled:opacity-20 disabled:cursor-not-allowed text-black font-black rounded-[24px] transition-all shadow-2xl shadow-rose-500/20 active:scale-95 text-xs uppercase tracking-widest overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {loading ? <LucideLoader2 className="animate-spin" size={20} /> : <LucideArrowDownCircle size={20} fill="currentColor" />}
            <span className="relative z-10">{t.sell}</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Execution Mode</p>
          <p className="text-[10px] text-indigo-400 font-black mt-1 italic">DIRECT_MARKET_ACCESS (DMA)</p>
        </div>
      </div>
    </div>
  );
};

export default TradePanel;
