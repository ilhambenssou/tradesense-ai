
import React from 'react';
import { LucideBrainCircuit, LucideTrendingUp, LucideTrendingDown, LucideMinus, LucideZap } from 'lucide-react';
import { MarketService } from '../services/marketService';
import { Language } from '../types';
import { translations } from '../services/i18n';

interface SignalPanelProps {
  symbol: string;
  priceHistory: number[];
  language: Language;
}

const SignalPanel: React.FC<SignalPanelProps> = ({ symbol, priceHistory, language }) => {
  const signal = MarketService.calculateSignal(priceHistory);
  const t = translations[language];

  return (
    <div className="bg-indigo-600/5 border border-indigo-500/20 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px] -z-10" />
      
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
          <LucideBrainCircuit size={28} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">TradeSense AI</h3>
          <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Deep Learning Core</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5 backdrop-blur-md mb-6">
        <div>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">Live Bias</p>
          <div className="flex items-center gap-3">
            {signal.type === 'BUY' ? <LucideTrendingUp className="text-emerald-400" size={24} /> : 
             signal.type === 'SELL' ? <LucideTrendingDown className="text-rose-400" size={24} /> : 
             <LucideMinus className="text-zinc-500" size={24} />}
            <span className={`font-black text-2xl italic tracking-tighter ${
              signal.type === 'BUY' ? 'text-emerald-400' : 
              signal.type === 'SELL' ? 'text-rose-400' : 
              'text-zinc-500'
            }`}>{signal.type}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">{t.confidence}</p>
          <p className="text-2xl font-mono font-black text-white italic">{signal.type === 'HOLD' ? '45%' : '89%'}</p>
        </div>
      </div>

      <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/10 flex items-start gap-3">
        <LucideZap size={14} className="text-indigo-400 mt-0.5" />
        <p className="text-[11px] text-indigo-300 font-bold leading-relaxed italic">
          "{signal.reason}"
        </p>
      </div>
    </div>
  );
};

export default SignalPanel;
