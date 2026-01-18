
import React from 'react';
import { Challenge, Language } from '../types';
import { translations } from '../services/i18n';
import { LucideWallet, LucideArrowUpRight, LucideShieldAlert } from 'lucide-react';

interface StatsProps {
  challenge: Challenge | null;
  language: Language;
}

const ChallengeStats: React.FC<StatsProps> = ({ challenge, language }) => {
  const t = translations[language];

  // Default values for Exploration Mode
  const equity = challenge?.equity || 0;
  const initialBalance = challenge?.initialBalance || 0;
  const currentBalance = challenge?.currentBalance || 0;
  const maxDailyLossLimit = challenge?.maxDailyLossLimit || 0;
  const profitTarget = challenge?.profitTarget || 0;

  const stats = [
    {
      label: t.currentEquity,
      value: `$${equity.toLocaleString()}`,
      change: `${initialBalance > 0 ? (((equity - initialBalance) / initialBalance) * 100).toFixed(2) : '0.00'}%`,
      positive: equity >= initialBalance,
      icon: LucideWallet,
      color: 'text-indigo-500'
    },
    {
      label: t.balance,
      value: `$${currentBalance.toLocaleString()}`,
      change: 'Cash',
      positive: true,
      icon: LucideArrowUpRight,
      color: 'text-emerald-500'
    },
    {
      label: t.dailyLossLimit,
      value: `$${maxDailyLossLimit.toLocaleString()}`,
      change: 'Static',
      positive: false,
      icon: LucideShieldAlert,
      color: 'text-rose-500'
    },
    {
      label: t.profitTarget,
      value: `$${profitTarget.toLocaleString()}`,
      change: 'Remaining',
      positive: true,
      icon: LucideArrowUpRight,
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="dark:bg-[#121214] bg-white border dark:border-white/5 border-black/5 p-6 rounded-2xl shadow-lg">
          <div className={`flex items-start mb-4 ${language === 'AR' ? 'justify-between' : 'justify-between'}`}>
            <div className={`p-2 dark:bg-zinc-900 bg-zinc-100 rounded-xl ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.positive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {stat.change}
            </div>
          </div>
          <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">
            {stat.label}
          </div>
          <div className="text-2xl font-black dark:text-white text-zinc-900 tracking-tighter italic">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChallengeStats;
