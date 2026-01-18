
import React, { useState } from 'react';
import { LucideZap, LucideTerminal, LucideMousePointer2, LucideInfo } from 'lucide-react';

interface TradeSimulatorProps {
  active: boolean;
  onTrade: (pnl: number) => void;
}

const TradeSimulator: React.FC<TradeSimulatorProps> = ({ active, onTrade }) => {
  const [lotSize, setLotSize] = useState(1.0);
  const [risk, setRisk] = useState<'LOW' | 'MED' | 'HIGH'>('MED');

  const executeTrade = (direction: 'BUY' | 'SELL') => {
    if (!active) return;

    // Simulate PnL based on risk profile
    const volatility = {
      'LOW': 200,
      'MED': 500,
      'HIGH': 1500
    };

    const multiplier = direction === 'BUY' ? 1 : -1;
    const outcome = (Math.random() - 0.45) * volatility[risk] * lotSize; // Slight bias to simulate skill
    
    onTrade(outcome);
  };

  return (
    <div className="glass p-6 rounded-2xl relative">
      {!active && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 rounded-2xl flex items-center justify-center p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <LucideInfo className="text-indigo-400" />
            <p className="text-white font-bold">Terminal Disabled</p>
            <p className="text-zinc-400 text-sm">Activate challenge to execute trades.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6">
        <LucideTerminal size={18} className="text-indigo-400" />
        <h3 className="text-lg font-bold text-white">Execution Terminal</h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Lot Size</label>
          <div className="flex items-center gap-3">
            <input 
              type="range" 
              min="0.1" 
              max="5.0" 
              step="0.1"
              value={lotSize}
              onChange={(e) => setLotSize(parseFloat(e.target.value))}
              className="flex-grow accent-indigo-500"
            />
            <span className="w-12 text-center font-bold text-white">{lotSize.toFixed(1)}</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Strategy Risk</label>
          <div className="grid grid-cols-3 gap-2">
            {(['LOW', 'MED', 'HIGH'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRisk(r)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                  risk === r 
                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                    : 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => executeTrade('BUY')}
            className="group relative overflow-hidden py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            <div className="flex items-center justify-center gap-2">
              <LucideZap size={18} fill="currentColor" />
              BUY
            </div>
          </button>
          <button 
            onClick={() => executeTrade('SELL')}
            className="group relative overflow-hidden py-4 px-6 bg-rose-500 hover:bg-rose-400 text-black font-black rounded-xl transition-all shadow-lg shadow-rose-500/20"
          >
            <div className="flex items-center justify-center gap-2">
              <LucideMousePointer2 size={18} fill="currentColor" />
              SELL
            </div>
          </button>
        </div>

        <p className="text-[10px] text-zinc-600 leading-relaxed text-center">
          Market simulator uses real-time variance models. <br/>
          Profits and losses affect equity instantly.
        </p>
      </div>
    </div>
  );
};

export default TradeSimulator;
