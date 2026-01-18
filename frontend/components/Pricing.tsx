
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LucideArrowLeft,
    LucideCreditCard,
    LucideBitcoin,
    LucideWallet,
    LucideX
} from 'lucide-react';
import CMIModal from './CMIModal';
import PayPalModal from './PayPalModal';
import { ChallengeType } from '../types';

interface Plan {
    id: string;
    name: string;
    price: string;
    balance: string;
    profitTarget: string;
    maxDrawdown: string;
    color: string;
    popular?: boolean;
}

const plans: Plan[] = [
    {
        id: 'starter',
        name: 'Starter',
        price: '200 DH',
        balance: '5 000 DH',
        profitTarget: '+10%',
        maxDrawdown: '-10%',
        color: 'indigo'
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '500 DH',
        balance: '10 000 DH',
        profitTarget: '+10%',
        maxDrawdown: '-10%',
        color: 'emerald',
        popular: true
    },
    {
        id: 'elite',
        name: 'Elite',
        price: '1 000 DH',
        balance: '25 000 DH',
        profitTarget: '+10%',
        maxDrawdown: '-10%',
        color: 'amber'
    }
];

const Pricing: React.FC = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCMI, setShowCMI] = useState(false);
    const [showPayPal, setShowPayPal] = useState(false);

    const handlePurchase = (plan: Plan) => {
        setSelectedPlan(plan);
        setShowModal(true);
    };

    const handlePaymentSuccess = async (method: string) => {
        if (!selectedPlan) return;

        const userStr = localStorage.getItem('tradesense_user');
        if (!userStr) {
            alert("Veuillez vous connecter pour acheter un challenge");
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);

        try {
            const response = await fetch('http://localhost:5000/api/challenges/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    plan: selectedPlan.id.toUpperCase(),
                    amount: selectedPlan.price.replace(/[^0-9]/g, ''),
                    payment_method: method
                }),
            });

            const result = await response.json();

            if (result.success) {
                localStorage.setItem('tradesense_challenge', JSON.stringify(result.challenge));
                setShowCMI(false);
                setShowPayPal(false);
                navigate('/dashboard');
                window.location.reload();
            } else {
                alert("Erreur: " + result.message);
            }
        } catch (error) {
            console.error("Erreur Backend:", error);
            alert("Impossible de contacter le serveur backend");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-indigo-500/30 pb-20">
            {/* Header */}
            <nav className="p-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group px-4 py-2 rounded-xl hover:bg-white/5"
                >
                    <LucideArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-xs">Retour</span>
                </button>
            </nav>

            {/* Hero */}
            <div className="max-w-4xl mx-auto text-center px-6 pt-10 pb-20 space-y-6">
                <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">
                    Choisissez votre <span className="text-indigo-600">Challenge</span>
                </h1>
                <p className="text-zinc-400 text-lg font-medium max-w-xl mx-auto">
                    Démontrez vos compétences en trading et débloquez des fonds réels grâce à nos programmes de financement.
                </p>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative group p-10 rounded-[48px] border transition-all duration-500 hover:-translate-y-4 ${plan.popular
                            ? 'bg-gradient-to-b from-indigo-600/20 to-transparent border-indigo-500/50 shadow-2xl shadow-indigo-500/10'
                            : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                Le plus populaire
                            </div>
                        )}

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-400">{plan.name}</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black italic uppercase tracking-tighter">{plan.price}</span>
                                    <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Frais Unique</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-2">
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Capital à gérer</p>
                                <p className="text-3xl font-black italic text-white tracking-widest">{plan.balance}</p>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    { label: "Objectif de profit", value: plan.profitTarget },
                                    { label: "Perte maximale (Drawdown)", value: plan.maxDrawdown },
                                    { label: "Trading avec IA autorisée", value: "Oui" },
                                    { label: "Paiement mensuel", value: "Aucun" },
                                    { label: "Partage de profits", value: "Jusqu'à 90%" }
                                ].map((rule, idx) => (
                                    <li key={idx} className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-500 font-medium">{rule.label}</span>
                                        <span className="text-white font-black italic">{rule.value}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePurchase(plan)}
                                className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all ${plan.popular
                                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20'
                                    : 'bg-white text-black hover:bg-zinc-200'
                                    }`}
                            >
                                Acheter le Challenge
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Paiement */}
            {showModal && selectedPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowModal(false)}
                    />

                    <div className="relative w-full max-w-xl bg-[#121214] border border-white/10 rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-8 right-8 text-zinc-500 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all"
                        >
                            <LucideX size={24} />
                        </button>

                        <div className="p-12 space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Moyen de paiement</h2>
                                <p className="text-zinc-500 font-medium">Vous achetez le challenge <span className="text-white font-black">{selectedPlan.name}</span> pour <span className="text-indigo-500 font-black">{selectedPlan.price}</span>.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { name: "Payer avec CMI", icon: LucideCreditCard, desc: "Cartes bancaires marocaines & internationales" },
                                    { name: "Payer avec Crypto", icon: LucideBitcoin, desc: "BTC, USDT, ETH via Binance Pay ou direct" },
                                    { name: "Payer avec PayPal", icon: LucideWallet, desc: "Compte PayPal ou Cartes de crédit" }
                                ].map((method, idx) => (
                                    <button
                                        key={idx}
                                        className="flex items-center gap-6 p-6 rounded-[32px] bg-black/40 border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group text-left"
                                        onClick={() => {
                                            if (method.name === "Payer avec CMI") {
                                                setShowModal(false);
                                                setShowCMI(true);
                                            } else if (method.name === "Payer avec PayPal") {
                                                setShowModal(false);
                                                setShowPayPal(true);
                                            } else {
                                                alert(`Redirection vers le paiement ${method.name}...`);
                                                setShowModal(false);
                                            }
                                        }}
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-indigo-500 transition-colors">
                                            <method.icon size={28} />
                                        </div>
                                        <div>
                                            <h4 className="font-black italic uppercase tracking-tighter text-white">{method.name}</h4>
                                            <p className="text-zinc-500 text-xs font-medium">{method.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <p className="text-center text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                                Transactions sécurisées & cryptées par TradeSense Protocol
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Simulation CMI */}
            {showCMI && selectedPlan && (
                <CMIModal
                    amount={selectedPlan.price}
                    planName={selectedPlan.name}
                    onSuccess={() => handlePaymentSuccess('CMI')}
                    onClose={() => setShowCMI(false)}
                />
            )}

            {/* Modal de Simulation PayPal */}
            {showPayPal && selectedPlan && (
                <PayPalModal
                    amount={selectedPlan.price}
                    planName={selectedPlan.name}
                    onSuccess={() => handlePaymentSuccess('PAYPAL')}
                    onClose={() => setShowPayPal(false)}
                />
            )}
        </div>
    );
};

export default Pricing;
