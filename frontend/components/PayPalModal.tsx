
import React, { useState, useEffect } from 'react';
import {
    LucideLoader2,
    LucideCheckCircle2,
    LucideShieldCheck,
    LucideExternalLink,
    LucideLock
} from 'lucide-react';

interface PayPalModalProps {
    amount: string;
    planName: string;
    onSuccess: () => void;
    onClose: () => void;
}

const PayPalModal: React.FC<PayPalModalProps> = ({ amount, planName, onSuccess, onClose }) => {
    const [step, setStep] = useState<'LOADING' | 'CHECKOUT' | 'PROCESSING' | 'SUCCESS'>('LOADING');
    const [config, setConfig] = useState({ clientId: '', email: '' });

    useEffect(() => {
        // Simuler la récupération des réglages PayPal via l'API Admin
        const fetchConfig = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/config');
                const data = await response.json();
                setConfig({
                    clientId: data.paypal_client_id || 'sb-xxxxxx',
                    email: data.paypal_email || 'admin@tradesense.local'
                });
                // Petit délai pour simuler le chargement du SDK PayPal
                setTimeout(() => setStep('CHECKOUT'), 1500);
            } catch (error) {
                console.error("Erreur config PayPal:", error);
                setStep('CHECKOUT');
            }
        };
        fetchConfig();
    }, []);

    const handlePay = async () => {
        setStep('PROCESSING');
        // Simulation de la transaction PayPal (3 secondes)
        await new Promise(resolve => setTimeout(resolve, 3000));
        setStep('SUCCESS');
        // Redirection automatique après l'écran de succès
        await new Promise(resolve => setTimeout(resolve, 2000));
        onSuccess();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500" />

            <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header PayPal */}
                <div className="bg-[#003087] p-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-black text-[#003087] text-xl">P</div>
                        <span className="text-white font-black text-2xl tracking-tighter italic">PayPal</span>
                    </div>
                    <div className="text-right text-white/60">
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Checkout</p>
                        <p className="text-xs font-bold mt-1">v5.0.1</p>
                    </div>
                </div>

                <div className="p-10">
                    {step === 'LOADING' && (
                        <div className="py-20 flex flex-col items-center justify-center gap-6 animate-pulse">
                            <LucideLoader2 className="animate-spin text-[#0070ba]" size={48} />
                            <p className="text-zinc-400 font-black uppercase text-xs tracking-[0.2em]">Chargement du SDK...</p>
                        </div>
                    )}

                    {step === 'CHECKOUT' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black text-zinc-900 leading-tight">Finaliser votre achat</h3>
                                <p className="text-zinc-500 font-medium">Challenge {planName} &bull; <span className="text-[#0070ba] font-black">{amount}</span></p>
                            </div>

                            <div className="bg-zinc-50 border border-zinc-100 rounded-3xl p-6 space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-400 font-black uppercase">Vendeur</span>
                                    <span className="text-zinc-900 font-bold">{config.email}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-400 font-black uppercase">Client ID</span>
                                    <span className="text-zinc-900 font-mono text-[10px] truncate max-w-[150px]">{config.clientId}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handlePay}
                                    className="w-full py-5 bg-[#ffc439] hover:bg-[#f4bb36] text-black font-black rounded-2xl transition-all shadow-xl shadow-yellow-500/10 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                                >
                                    Payer avec PayPal
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 text-zinc-400 font-bold text-xs uppercase tracking-widest hover:text-zinc-900 transition-colors"
                                >
                                    Retour au site
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'PROCESSING' && (
                        <div className="py-20 flex flex-col items-center justify-center gap-6 animate-in zoom-in-95">
                            <div className="relative">
                                <div className="w-24 h-24 border-4 border-zinc-100 rounded-full" />
                                <div className="absolute inset-0 border-4 border-t-[#0070ba] rounded-full animate-spin" />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-xl font-black text-[#003087] uppercase italic italic tracking-tight">Traitement PayPal...</h4>
                                <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest leading-relaxed">Vérification des fonds en cours</p>
                            </div>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="py-20 flex flex-col items-center justify-center gap-6 animate-in zoom-in-95">
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
                                <LucideCheckCircle2 size={48} />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-3xl font-black text-emerald-600 uppercase italic tracking-tight">Succès PayPal!</h4>
                                <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Transaction terminée</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Security */}
                <div className="bg-zinc-50 border-t border-zinc-100 p-6 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4 opacity-30 grayscale">
                        <LucideLock size={16} />
                        <span className="font-black text-[10px] uppercase tracking-widest">Secured by SSL 256-bit</span>
                    </div>
                    <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                        <LucideShieldCheck size={12} />
                        Mode Simulation - PayPal Sandbox
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PayPalModal;
