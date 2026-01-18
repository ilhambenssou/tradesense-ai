
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LucideBrainCircuit,
    LucideNewspaper,
    LucideUsers,
    LucideGraduationCap,
    LucideArrowRight,
    LucideShieldCheck,
    LucideGlobe
} from 'lucide-react';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-indigo-500/30">
            {/* Navbar Minimaliste */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/20 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-600/20">T</div>
                    <span className="text-xl font-black tracking-tighter italic">TRADESENSE <span className="text-indigo-500 italic not-italic font-medium">AI</span></span>
                </div>
                <div className="flex items-center gap-4">

                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2.5 text-sm font-bold hover:text-indigo-400 transition-colors uppercase tracking-widest"
                    >
                        Se connecter
                    </button>
                    <button
                        onClick={() => navigate('/pricing')}
                        className="px-6 py-2.5 bg-white text-black text-sm font-black rounded-xl hover:bg-zinc-200 transition-all uppercase tracking-widest"
                    >
                        Commencer le Challenge
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-44 pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 blur-[160px] rounded-full -z-10 animate-pulse" />

                <div className="max-w-6xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <LucideGlobe size={14} />
                        L'excellence du trading en Afrique
                    </div>

                    <h1 className="text-7xl lg:text-9xl font-black italic tracking-tighther leading-[0.85] uppercase">
                        TradeSense <span className="text-indigo-600">AI</span>
                    </h1>

                    <p className="text-xl lg:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        La première Prop Firm assistée par IA pour l’Afrique.
                        Débloquez votre potentiel avec une technologie de pointe.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                        <button
                            onClick={() => navigate('/pricing')}
                            className="group relative w-full sm:w-auto px-10 py-5 bg-indigo-600 rounded-[24px] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-600/20"
                        >
                            <span>Commencer le Challenge</span>
                            <LucideArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => {
                                // Guest access logic: ensure no old user data conflicts
                                localStorage.removeItem('tradesense_user');
                                // Create a temporary guest user session
                                const guestUser = { id: 'guest', name: 'Visiteur', email: 'guest@tradesense.local', isAdmin: false, balance: 0 };
                                localStorage.setItem('tradesense_user', JSON.stringify(guestUser));
                                // Force reload of the state in parent component is handled by logic or simply navigate
                                navigate('/dashboard');
                                window.location.reload(); // Quick fix to ensure App.tsx picks up the guest user from local storage immediately on mount if needed
                            }}
                            className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 rounded-[24px] font-black text-lg uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Explorer l'écosystème
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            title: "Assistance Trading par IA",
                            desc: "Analyses de marché en temps réel assistées par nos modèles d'IA avancés.",
                            icon: LucideBrainCircuit,
                            color: "indigo"
                        },
                        {
                            title: "Hub d’Actualités",
                            desc: "Actualités financières et sentiment de marché en direct.",
                            icon: LucideNewspaper,
                            color: "emerald"
                        },
                        {
                            title: "Zone Communautaire",
                            desc: "Échangez avec les meilleurs traders du continent.",
                            icon: LucideUsers,
                            color: "amber"
                        },
                        {
                            title: "L'Académie",
                            desc: "Apprentissage MasterClass pour maîtriser les marchés.",
                            icon: LucideGraduationCap,
                            color: "rose"
                        }
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-8 bg-white/5 border border-white/5 rounded-[40px] hover:bg-white/10 transition-all hover:-translate-y-2 duration-500"
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center text-${feature.color}-500 mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-xl font-black mb-3 italic uppercase tracking-tighter">{feature.title}</h3>
                            <p className="text-zinc-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats / Proof */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                        {[
                            { val: "10K+", label: "Traders Actifs" },
                            { val: "$25M", label: "Financement" },
                            { val: "99.9%", label: "Uptime IA" },
                            { val: "24/7", label: "Support Support" }
                        ].map((stat, idx) => (
                            <div key={idx}>
                                <div className="text-4xl lg:text-6xl font-black italic mb-2 tracking-tighter">{stat.val}</div>
                                <div className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center font-black text-white text-xs">T</div>
                        <span className="text-sm font-black tracking-tighter opacity-50 uppercase">TradeSense Protocol 2.5</span>
                    </div>
                    <p className="text-zinc-600 text-xs font-medium">© 2026 TradeSense AI. Tous droits réservés.</p>
                    <div className="flex items-center gap-6 text-zinc-500">
                        <LucideShieldCheck size={20} className="hover:text-white transition-colors cursor-pointer" />
                        <LucideGlobe size={20} className="hover:text-white transition-colors cursor-pointer" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
