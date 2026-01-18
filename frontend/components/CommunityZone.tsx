
import React from 'react';
import { LucideUsers, LucideMessageCircle, LucideHeart, LucideShare2, LucideSend } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../services/i18n';

interface CommunityZoneProps {
  language: Language;
}

const CommunityZone: React.FC<CommunityZoneProps> = ({ language }) => {
  const t = translations[language];
  const posts = [
    { user: 'Sami_FX', content: 'Just passed the Elite Challenge! AI signals were spot on for the EUR/USD breakout. 🚀', time: '1h ago', likes: 24, comments: 5 },
    { user: 'MarketPro', content: 'Analysis: Gold is forming a triple top on the 4H chart. Be careful with longs here.', time: '3h ago', likes: 12, comments: 8 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-center gap-4 mb-10">
          <LucideUsers className="text-indigo-400" size={32} />
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{t.socialHub}</h2>
        </div>

        <div className="bg-[#121214] border border-white/5 p-6 rounded-[24px]">
          <textarea 
            placeholder={t.shareUpdate}
            className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 min-h-[100px] mb-4 italic"
          />
          <div className="flex justify-end">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/20">
              <LucideSend size={16} /> {t.postUpdate}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post, i) => (
            <div key={i} className="bg-[#121214] border border-white/5 p-8 rounded-[32px] hover:border-white/10 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400">
                  {post.user[0]}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{post.user}</h4>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase">{post.time}</p>
                </div>
              </div>
              <p className="text-zinc-300 mb-8 leading-relaxed italic">"{post.content}"</p>
              <div className="flex items-center gap-8 border-t border-white/5 pt-6">
                <button className="flex items-center gap-2 text-zinc-500 hover:text-rose-500 transition-colors"><LucideHeart size={18} /> <span className="text-xs font-bold">{post.likes}</span></button>
                <button className="flex items-center gap-2 text-zinc-500 hover:text-indigo-500 transition-colors"><LucideMessageCircle size={18} /> <span className="text-xs font-bold">{post.comments}</span></button>
                <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors ml-auto"><LucideShare2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <div className="bg-[#121214] border border-white/5 p-8 rounded-[32px]">
          <h3 className="text-xl font-black text-white mb-6 uppercase italic tracking-tighter">{t.activeGroups}</h3>
          <div className="space-y-4">
            {['Gold Elite', 'Nasdaq Scalpers', 'Crypto AI Squad', 'Forex Fundamental'].map(group => (
              <div key={group} className="flex items-center justify-between p-4 bg-black/40 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                <span className="text-sm font-bold text-zinc-400 group-hover:text-white">{group}</span>
                <span className="text-[10px] bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded-lg font-black">{t.getStarted}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityZone;
