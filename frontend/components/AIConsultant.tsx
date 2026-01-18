
import React, { useState, useEffect, useRef } from 'react';
import {
  LucideBrainCircuit,
  LucideSend,
  LucideLoader2,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideShieldAlert,
  LucideTarget,
  LucideZap,
  LucideInfo,
  LucideBarChart3,
  LucideSettings
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../services/i18n';

interface AIConsultantProps {
  symbol: string;
  language: Language;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface MarketContext {
  symbol: string;
  current_price: number;
  sma5: number;
  sma20: number;
  signal_type: 'BUY' | 'SELL' | 'HOLD';
  signal_reason: string;
  volatility: string;
  trend: string;
  support: number;
  resistance: number;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ symbol, language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [marketContext, setMarketContext] = useState<MarketContext | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [expertiseLevel, setExpertiseLevel] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Questions suggérées
  const suggestedQuestions = [
    "Pourquoi le signal est ACHAT ?",
    "Quel est le risque si je trade maintenant ?",
    "Quels événements pourraient impacter ce trade ?",
    "Où placer mon stop loss ?",
    "Quelle taille de position recommandes-tu ?"
  ];

  // Fetch prix du marché
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/price/${symbol}`);
        if (response.ok) {
          const data = await response.json();
          setPriceHistory(prev => [...prev, data.price].slice(-100));
        }
      } catch (err) {
        console.error('Market data fetch error:', err);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 3000);
    return () => clearInterval(interval);
  }, [symbol]);

  // Fetch analyse du marché
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (priceHistory.length < 20) return;

      try {
        const response = await fetch('http://127.0.0.1:5000/api/ai/analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prices: priceHistory, symbol })
        });

        if (response.ok) {
          const data = await response.json();
          setMarketContext(data.analysis);
          setSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error('Analysis fetch error:', err);
      }
    };

    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 10000); // Toutes les 10s
    return () => clearInterval(interval);
  }, [priceHistory, symbol]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Envoyer une question
  const handleSendMessage = async (question?: string) => {
    const messageText = question || inputValue.trim();
    if (!messageText || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: messageText,
          prices: priceHistory,
          symbol,
          expertise_level: expertiseLevel
        })
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response || "Désolé, je n'ai pas pu analyser votre question.",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI chat error:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "❌ Erreur de connexion. Veuillez réessayer.",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b dark:border-white/5 border-black/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30">
            <LucideBrainCircuit className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black dark:text-white text-zinc-900 italic uppercase tracking-tighter">
              {t.aiAdvisor}
            </h2>
            <p className="text-xs text-zinc-500 font-bold mt-1">Assistant IA Interactif • Analyses en Temps Réel</p>
          </div>
        </div>

        {/* Niveau d'expertise */}
        <div className="flex items-center gap-2 dark:bg-[#121214] bg-white border dark:border-white/5 border-black/5 p-1 rounded-xl">
          {(['beginner', 'intermediate', 'expert'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setExpertiseLevel(level)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${expertiseLevel === level
                  ? 'bg-indigo-600 text-white'
                  : 'dark:text-zinc-500 text-zinc-600 hover:text-indigo-500'
                }`}
            >
              {level === 'beginner' ? '🌱 Débutant' : level === 'intermediate' ? '📊 Inter' : '🎓 Expert'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Signal + Analyse */}
        <div className="lg:col-span-1 space-y-6">
          {/* Signal Actif */}
          {marketContext && (
            <div className="dark:bg-[#121214] bg-white border dark:border-white/5 border-black/5 rounded-[24px] p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-black dark:text-white text-zinc-900">{t.activeSignal}</h3>
                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20">
                  LIVE
                </span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {marketContext.signal_type === 'BUY' ? (
                  <LucideTrendingUp className="text-emerald-500" size={32} />
                ) : marketContext.signal_type === 'SELL' ? (
                  <LucideTrendingDown className="text-rose-500" size={32} />
                ) : (
                  <LucideBarChart3 className="text-zinc-500" size={32} />
                )}
                <div>
                  <p className={`text-3xl font-black ${marketContext.signal_type === 'BUY' ? 'text-emerald-500' :
                      marketContext.signal_type === 'SELL' ? 'text-rose-500' : 'text-zinc-500'
                    }`}>
                    {marketContext.signal_type}
                  </p>
                  <p className="text-xs text-zinc-600 font-bold mt-1">{marketContext.signal_reason}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-600 font-bold">Prix actuel</span>
                  <span className="text-sm font-black dark:text-white text-zinc-900">${marketContext.current_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-600 font-bold">Support</span>
                  <span className="text-sm font-black text-emerald-500">${marketContext.support.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-zinc-600 font-bold">Résistance</span>
                  <span className="text-sm font-black text-rose-500">${marketContext.resistance.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions Proactives */}
          {suggestions.length > 0 && (
            <div className="dark:bg-rose-500/5 bg-rose-100 border dark:border-rose-500/10 border-rose-300 rounded-[24px] p-6">
              <h3 className="text-sm font-black dark:text-white text-zinc-900 mb-4 flex items-center gap-2">
                <LucideShieldAlert className="text-rose-500" size={18} />
                Alertes IA
              </h3>
              <div className="space-y-3">
                {suggestions.map((sug, idx) => (
                  <div key={idx} className="dark:bg-black/40 bg-white p-3 rounded-xl border dark:border-white/5 border-black/5">
                    <p className="text-xs dark:text-white text-zinc-900 font-bold leading-relaxed">{sug.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite - Chat */}
        <div className="lg:col-span-2">
          <div className="dark:bg-[#121214] bg-white border dark:border-white/5 border-black/5 rounded-[24px] overflow-hidden shadow-2xl flex flex-col h-[700px]">
            {/* Header Chat */}
            <div className="p-6 border-b dark:border-white/5 border-black/5">
              <h3 className="text-lg font-black dark:text-white text-zinc-900 flex items-center gap-2">
                <LucideZap className="text-indigo-500" size={20} />
                Chat Interactif
              </h3>
              <p className="text-xs text-zinc-600 mt-1">Posez n'importe quelle question sur le marché</p>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <LucideBrainCircuit className="mx-auto text-zinc-600 mb-4" size={48} />
                  <p className="text-zinc-600 font-bold mb-6">Commencez par poser une question</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-xs dark:bg-indigo-500/10 bg-indigo-100 dark:text-indigo-400 text-indigo-700 px-3 py-2 rounded-lg hover:bg-indigo-500/20 transition-all font-bold"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'dark:bg-zinc-800 bg-zinc-200 dark:text-white text-zinc-900'
                    } p-4 rounded-2xl`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-[10px] opacity-60 mt-2">{msg.timestamp}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="dark:bg-zinc-800 bg-zinc-200 p-4 rounded-2xl flex items-center gap-2">
                    <LucideLoader2 className="animate-spin text-indigo-500" size={16} />
                    <span className="text-sm dark:text-white text-zinc-900 font-bold">L'IA analyse...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t dark:border-white/5 border-black/5">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Posez votre question..."
                  className="flex-grow dark:bg-zinc-800 bg-zinc-100 dark:text-white text-zinc-900 px-4 py-3 rounded-xl border dark:border-white/5 border-black/5 outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={loading || !inputValue.trim()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <LucideSend size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIConsultant;
