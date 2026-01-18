
import React, { useState } from 'react';
import { LucideShieldCheck, LucideMail, LucideLock, LucideArrowRight, LucideUser } from 'lucide-react';
import { Language, User } from '../types';
import { translations } from '../services/i18n';


interface LoginProps {
  onLogin: (user: User) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  initialMode?: 'login' | 'register';
}

const Login: React.FC<LoginProps> = ({ onLogin, language, onLanguageChange, initialMode = 'login' }) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userData: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 5),
      name: isLoginMode ? email.split('@')[0] : name,
      email: email,
      isAdmin: email.includes('admin')
    };

    onLogin(userData);
  };

  const isRTL = language === 'AR';

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-6 relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />

      {/* Language Switcher */}
      <div className="absolute top-8 right-8 flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
        {(['EN', 'FR', 'AR'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${language === lang ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'
              }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-[28px] shadow-2xl shadow-indigo-600/30 flex items-center justify-center font-black text-3xl text-white transform hover:rotate-6 transition-transform">T</div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
              {isLoginMode ? t.welcomeBack : t.createAccount}
            </h1>
            <p className="text-zinc-500 text-sm font-medium">
              {isLoginMode ? t.loginSubtitle : t.signupSubtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#121214] border border-white/5 p-10 rounded-[48px] shadow-2xl space-y-6">
          {!isLoginMode && (
            <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">{t.fullName}</label>
              <div className="relative">
                <LucideUser className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-zinc-500`} size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full bg-black/40 border border-white/5 p-4 ${isRTL ? 'pr-12' : 'pl-12'} rounded-2xl text-white focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700`}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">{t.email}</label>
            <div className="relative">
              <LucideMail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-zinc-500`} size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@tradesense.ai"
                className={`w-full bg-black/40 border border-white/5 p-4 ${isRTL ? 'pr-12' : 'pl-12'} rounded-2xl text-white focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">{t.password}</label>
            <div className="relative">
              <LucideLock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-zinc-500`} size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-black/40 border border-white/5 p-4 ${isRTL ? 'pr-12' : 'pl-12'} rounded-2xl text-white focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-white text-black font-black rounded-[24px] hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 group text-sm uppercase tracking-widest"
          >
            {isLoginMode ? t.login : t.createAccount}
            <LucideArrowRight size={18} className={`group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </form>

        <p className="text-center text-zinc-600 text-sm font-medium">
          {isLoginMode ? t.dontHaveAccount : t.alreadyHaveAccount}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-white font-black hover:text-indigo-400 transition-colors uppercase tracking-widest text-xs ml-2 underline underline-offset-4"
          >
            {isLoginMode ? t.signUp : t.login}
          </button>
        </p>
      </div>

      <div className="mt-20 flex items-center gap-3 text-zinc-800 font-black text-[10px] tracking-[0.3em] uppercase opacity-50">
        <LucideShieldCheck size={16} />
        TradeSense Protocol 2.5 Multi-Lingual
      </div>
    </div>
  );
};

export default Login;
