
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Challenge, ChallengeType, ChallengeStatus, Language, User, Theme } from './types';
import { ChallengeEngine } from './services/challengeService';
import { translations } from './services/i18n';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';

import AuthGuard from './components/AuthGuard';
import AIConsultant from './components/AIConsultant';
import NewsHub from './components/NewsHub';
import CommunityZone from './components/CommunityZone';
import MasterClass from './components/MasterClass';
import AdminSettings from './components/AdminSettings';
import Login from './components/Login';
import Home from './components/Home';
import Pricing from './components/Pricing';
import {
  LucideLogOut,
  LucideLayoutDashboard,
  LucideBrainCircuit,
  LucideNewspaper,
  LucideUsers,
  LucideGraduationCap,
  LucideShieldCheck,
  LucideSun,
  LucideMoon,
  LucideTrophy
} from 'lucide-react';

type View = 'DASHBOARD' | 'AI_INSIGHTS' | 'NEWS' | 'COMMUNITY' | 'ACADEMY' | 'ADMIN' | 'LEADERBOARD';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<View>('DASHBOARD');
  const [user, setUser] = useState<User | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [language, setLanguage] = useState<Language>('FR');
  const [theme, setTheme] = useState<Theme>('dark');

  const t = translations[language];

  useEffect(() => {
    const savedChallenge = localStorage.getItem('tradesense_challenge');
    const savedUser = localStorage.getItem('tradesense_user');
    const savedLang = localStorage.getItem('tradesense_lang');
    const savedTheme = localStorage.getItem('tradesense_theme') as Theme;

    if (savedLang && ['EN', 'FR', 'AR'].includes(savedLang)) setLanguage(savedLang as Language);
    if (savedTheme) setTheme(savedTheme);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('tradesense_user');
      }
    }
    if (savedChallenge) {
      try {
        setActiveChallenge(JSON.parse(savedChallenge));
      } catch (e) {
        console.error("Failed to parse saved challenge", e);
        localStorage.removeItem('tradesense_challenge');
      }
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
    localStorage.setItem('tradesense_theme', theme);
  }, [theme]);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('tradesense_lang', lang);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('tradesense_user', JSON.stringify(newUser));
    navigate('/dashboard');
  };



  const handleUpdateChallenge = (updated: Challenge) => {
    setActiveChallenge(updated);
    localStorage.setItem('tradesense_challenge', JSON.stringify(updated));
  };

  const handleLogout = () => {
    setUser(null);
    setActiveChallenge(null);
    localStorage.removeItem('tradesense_challenge');
    localStorage.removeItem('tradesense_user');
    navigate('/');
  };

  const renderView = () => {
    switch (activeView) {
      case 'DASHBOARD': return (
        <Dashboard
          challenge={activeChallenge}
          onPaymentSuccess={() => {
            if (activeChallenge) handleUpdateChallenge(ChallengeEngine.activateChallenge(activeChallenge));
          }}
          onUpdate={handleUpdateChallenge}
          language={language}
        />
      );
      case 'AI_INSIGHTS': return <AIConsultant symbol="BTC-USD" language={language} />;
      case 'NEWS': return <NewsHub language={language} />;
      case 'COMMUNITY': return <CommunityZone language={language} />;
      case 'ACADEMY': return <MasterClass />;
      case 'LEADERBOARD': return <Leaderboard language={language} />;
      case 'ADMIN': return <AdminSettings />;
    }
  };

  const isRTL = language === 'AR';

  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />

      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} language={language} onLanguageChange={handleLanguageChange} initialMode="login" />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} language={language} onLanguageChange={handleLanguageChange} initialMode="register" />}
      />

      <Route
        path="/dashboard"
        element={
          !user ? <Navigate to="/login" /> : (
            <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-[#0a0a0b] text-[#f4f4f5]' : 'bg-zinc-50 text-zinc-900'} transition-colors duration-300`} dir={isRTL ? 'rtl' : 'ltr'}>
              <aside className={`w-20 lg:w-72 border-${isRTL ? 'l' : 'r'} ${theme === 'dark' ? 'border-white/5 bg-black/50' : 'border-black/5 bg-white/80'} backdrop-blur-xl flex flex-col items-center lg:items-stretch py-8 sticky top-0 h-screen z-50 transition-all shadow-2xl`}>
                <div className="px-6 mb-12 flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl shadow-indigo-600/20">T</div>
                  <div className="hidden lg:block">
                    <span className="block text-xl font-black tracking-tighter italic leading-none">TRADESENSE</span>
                    <span className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Prop-AI Grid</span>
                  </div>
                </div>

                <nav className="flex-grow space-y-2 px-4">
                  {[
                    { id: 'DASHBOARD', icon: LucideLayoutDashboard, label: t.terminal },
                    { id: 'AI_INSIGHTS', icon: LucideBrainCircuit, label: t.aiAdvisor },
                    { id: 'NEWS', icon: LucideNewspaper, label: t.newsHub },
                    { id: 'COMMUNITY', icon: LucideUsers, label: t.socialHub },
                    { id: 'ACADEMY', icon: LucideGraduationCap, label: t.academy },
                    { id: 'LEADERBOARD', icon: LucideTrophy, label: t.leaderboardTitle }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveView(item.id as View)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${activeView === item.id ? (theme === 'dark' ? 'bg-white text-black' : 'bg-indigo-600 text-white') : 'text-zinc-500 hover:bg-indigo-600/10'
                        }`}
                    >
                      <item.icon size={20} className={activeView === item.id ? '' : 'group-hover:text-indigo-600 transition-colors'} />
                      <span className="hidden lg:block font-black text-xs uppercase tracking-widest">{item.label}</span>
                    </button>
                  ))}

                  {user?.isAdmin && (
                    <button
                      onClick={() => setActiveView('ADMIN')}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all mt-8 group ${activeView === 'ADMIN' ? 'bg-amber-600 text-white shadow-xl shadow-amber-500/20' : 'text-amber-500/40 hover:bg-amber-500/10'
                        }`}
                    >
                      <LucideShieldCheck size={20} />
                      <span className="hidden lg:block font-black text-xs uppercase tracking-widest italic">{t.superAdmin}</span>
                    </button>
                  )}
                </nav>

                <div className="px-4 mt-auto space-y-4">
                  <button
                    onClick={toggleTheme}
                    className={`w-full flex items-center justify-center gap-4 p-4 rounded-2xl transition-all ${theme === 'dark' ? 'bg-white/5 text-amber-400 hover:bg-white/10' : 'bg-black/5 text-indigo-600 hover:bg-black/10'}`}
                  >
                    {theme === 'dark' ? <LucideSun size={20} /> : <LucideMoon size={20} />}
                    <span className="hidden lg:block font-black text-[10px] uppercase tracking-widest">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>

                  <div className={`hidden lg:flex items-center gap-3 p-4 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-black/5 border-black/5'} rounded-2xl border`}>
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white text-sm">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <p className={`text-xs font-black truncate ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{user.name}</p>
                      <p className="text-[10px] text-zinc-600 font-bold truncate">Funded Level 0</p>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between gap-1 p-1 ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-zinc-200 border-black/5'} border rounded-2xl`}>
                    {(['EN', 'FR', 'AR'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`flex-grow py-2 rounded-xl text-[10px] font-black transition-all ${language === lang ? (theme === 'dark' ? 'bg-white text-black' : 'bg-indigo-600 text-white') : 'text-zinc-600 hover:text-indigo-600'
                          }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                  >
                    <LucideLogOut size={20} />
                    <span className="hidden lg:block font-black text-xs uppercase tracking-widest">{t.logout}</span>
                  </button>
                </div>
              </aside>

              <main className="flex-grow h-screen overflow-y-auto">
                {activeView === 'DASHBOARD' ? (
                  renderView()
                ) : (
                  renderView()
                )}
              </main>
            </div>
          )
        }
      />
    </Routes>
  );
};


const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
