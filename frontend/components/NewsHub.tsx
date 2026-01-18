
import React, { useState, useEffect } from 'react';
import {
  LucideNewspaper,
  LucideClock,
  LucideZap,
  LucideExternalLink,
  LucideLoader2,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideMinusCircle,
  LucideAlertCircle
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../services/i18n';

interface NewsHubProps {
  language: Language;
}

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  time_ago: string;
  category: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutre';
  is_breaking: boolean;
}

const NewsHub: React.FC<NewsHubProps> = ({ language }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const t = translations[language];

  const categories = ['Tous', 'Crypto', 'Actions US', 'Économie', 'Matières Premières', 'Marchés Globaux'];

  // Fetch des actualités depuis le backend
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = selectedCategory === 'Tous'
        ? 'http://127.0.0.1:5000/api/news'
        : `http://127.0.0.1:5000/api/news?category=${encodeURIComponent(selectedCategory)}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setArticles(data.articles);
      } else {
        setError(data.message || 'Erreur lors du chargement des actualités');
      }
    } catch (err) {
      console.error('News fetch error:', err);
      setError('Impossible de charger les actualités. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial et rafraîchissement automatique toutes les 5 minutes
  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, [selectedCategory]);

  // Icône de sentiment
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish':
        return <LucideTrendingUp className="text-emerald-500" size={20} />;
      case 'Bearish':
        return <LucideTrendingDown className="text-rose-500" size={20} />;
      default:
        return <LucideMinusCircle className="text-zinc-500" size={20} />;
    }
  };

  // Badge de sentiment
  const getSentimentBadge = (sentiment: string) => {
    const styles = {
      Bullish: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      Bearish: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      Neutre: 'bg-zinc-800 text-zinc-500 border-zinc-700'
    };
    return styles[sentiment as keyof typeof styles] || styles.Neutre;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b dark:border-white/5 border-black/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
            <LucideNewspaper className="text-indigo-500" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black dark:text-white text-zinc-900 italic uppercase tracking-tighter">
              {t.newsHub}
            </h2>
            <p className="text-xs text-zinc-500 font-bold mt-1">Actualités Financières en Temps Réel</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl border border-emerald-500/20">
            <LucideZap size={16} className="animate-pulse" />
            <span className="text-xs font-black uppercase">LIVE</span>
          </div>
          <button
            onClick={fetchNews}
            disabled={loading}
            className="p-2.5 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/5 border-black/5 text-zinc-500 hover:text-indigo-500 transition-all disabled:opacity-50"
          >
            <LucideLoader2 size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'dark:bg-white/5 bg-black/5 dark:text-zinc-400 text-zinc-600 hover:bg-indigo-600/10 hover:text-indigo-500'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loader */}
      {loading && articles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <LucideLoader2 className="text-indigo-500 animate-spin mb-4" size={48} />
          <p className="text-zinc-500 font-bold">Chargement des actualités...</p>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="dark:bg-rose-500/10 bg-rose-100 border dark:border-rose-500/20 border-rose-300 p-6 rounded-2xl flex items-center gap-4">
          <LucideAlertCircle className="text-rose-500" size={32} />
          <div>
            <h4 className="font-black dark:text-white text-zinc-900 mb-1">Erreur de chargement</h4>
            <p className="text-sm text-zinc-600">{error}</p>
          </div>
        </div>
      )}

      {/* Liste des articles */}
      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-20">
          <LucideNewspaper className="mx-auto text-zinc-600 mb-4" size={64} />
          <p className="text-zinc-500 font-bold">Aucune actualité disponible pour cette catégorie</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="dark:bg-[#121214] bg-white border dark:border-white/5 border-black/5 p-6 rounded-[24px] hover:dark:bg-white/5 hover:bg-black/5 transition-all cursor-pointer group relative overflow-hidden"
          >
            {/* Breaking News Badge */}
            {article.is_breaking && (
              <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
                🔴 BREAKING
              </div>
            )}

            <div className="flex items-start gap-6">
              {/* Sentiment Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${getSentimentBadge(article.sentiment)}`}>
                {getSentimentIcon(article.sentiment)}
              </div>

              {/* Content */}
              <div className="flex-grow">
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2.5 py-1 rounded-lg border border-indigo-400/20">
                    {article.category}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border ${getSentimentBadge(article.sentiment)}`}>
                    {article.sentiment === 'Bullish' ? '📈 BULLISH' : article.sentiment === 'Bearish' ? '📉 BEARISH' : '⚖️ NEUTRE'}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-bold uppercase">
                    <LucideClock size={12} /> {article.time_ago}
                  </span>
                  <span className="text-[10px] text-zinc-600 font-bold">• {article.source}</span>
                </div>

                {/* Title */}
                <h4 className="text-lg font-bold dark:text-white text-zinc-900 group-hover:text-indigo-500 transition-colors mb-2 leading-tight">
                  {article.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-zinc-500 leading-relaxed mb-3">
                  {article.description}
                </p>

                {/* Link */}
                <div className="flex items-center gap-2 text-indigo-500 text-xs font-black uppercase tracking-wider group-hover:gap-3 transition-all">
                  <span>Lire l'article</span>
                  <LucideExternalLink size={14} />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Footer info */}
      {articles.length > 0 && (
        <div className="text-center pt-8 border-t dark:border-white/5 border-black/5">
          <p className="text-xs text-zinc-600 font-bold">
            {articles.length} article{articles.length > 1 ? 's' : ''} • Mis à jour automatiquement toutes les 5 minutes
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsHub;
