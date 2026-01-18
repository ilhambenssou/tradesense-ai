
import React, { useState } from 'react';
import {
    LucideShieldCheck,
    LucideCreditCard,
    LucideCalendar,
    LucideLock,
    LucideLoader2,
    LucideCheckCircle2,
    LucideChevronRight
} from 'lucide-react';

interface CMIModalProps {
    amount: string;
    planName: string;
    onSuccess: () => void;
    onClose: () => void;
}

const CMIModal: React.FC<CMIModalProps> = ({ amount, planName, onSuccess, onClose }) => {
    const [step, setStep] = useState<'FORM' | 'PROCESSING' | 'SUCCESS'>('FORM');
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.cardName) newErrors.cardName = 'Nom obligatoire';
        if (formData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = '16 chiffres requis';
        const expiryRegex = /^\d{2}\/\d{2}$/;
        if (!expiryRegex.test(formData.expiry)) newErrors.expiry = 'Format MM/YY requis';
        if (formData.cvv.length !== 3) newErrors.cvv = '3 chiffres requis';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setStep('PROCESSING');

        // Simulation réaliste de gateway CMI (2.5 secondes)
        await new Promise(resolve => setTimeout(resolve, 2500));

        setStep('SUCCESS');

        // Attendre 1.5s sur l'écran succès avant de rediriger
        await new Promise(resolve => setTimeout(resolve, 1500));
        onSuccess();
    };

    const formatCardNumber = (val: string) => {
        const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/.{1,4}/g);
        return matches ? matches.join(' ') : v;
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0a0a0b]/95 backdrop-blur-xl animate-in fade-in duration-300" />

            <div className="relative w-full max-w-lg bg-white text-zinc-900 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* CMI Branded Header */}
                <div className="bg-[#f8f9fa] border-b border-zinc-100 p-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0056b3] rounded-lg flex items-center justify-center text-white font-bold text-xl">CMI</div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-tight text-[#0056b3]">Paiement Sécurisé</h3>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Gateway v2.4.1</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Montant à régler</p>
                        <p className="text-2xl font-black text-[#0056b3]">{amount}</p>
                    </div>
                </div>

                <div className="p-8">
                    {step === 'FORM' && (
                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Nom sur la carte</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="M. AHMED ALAMI"
                                            className={`w-full bg-zinc-50 border ${errors.cardName ? 'border-rose-500' : 'border-zinc-200'} p-4 rounded-2xl focus:border-[#0056b3] outline-none transition-all font-bold placeholder:text-zinc-300 uppercase`}
                                            value={formData.cardName}
                                            onChange={e => setFormData({ ...formData, cardName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Numéro de carte</label>
                                    <div className="relative">
                                        <LucideCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                                        <input
                                            type="text"
                                            maxLength={19}
                                            placeholder="0000 0000 0000 0000"
                                            className={`w-full bg-zinc-50 border ${errors.cardNumber ? 'border-rose-500' : 'border-zinc-200'} p-4 pl-12 rounded-2xl focus:border-[#0056b3] outline-none transition-all font-mono font-bold placeholder:text-zinc-300`}
                                            value={formData.cardNumber}
                                            onChange={e => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Expiration</label>
                                        <div className="relative">
                                            <LucideCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                                            <input
                                                type="text"
                                                maxLength={5}
                                                placeholder="MM/YY"
                                                className={`w-full bg-zinc-50 border ${errors.expiry ? 'border-rose-500' : 'border-zinc-200'} p-4 pl-12 rounded-2xl focus:border-[#0056b3] outline-none transition-all font-bold placeholder:text-zinc-300`}
                                                value={formData.expiry}
                                                onChange={e => {
                                                    let val = e.target.value.replace(/\D/g, '');
                                                    if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                                    setFormData({ ...formData, expiry: val });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">CVV</label>
                                        <div className="relative">
                                            <LucideLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                                            <input
                                                type="password"
                                                maxLength={3}
                                                placeholder="•••"
                                                className={`w-full bg-zinc-50 border ${errors.cvv ? 'border-rose-500' : 'border-zinc-200'} p-4 pl-12 rounded-2xl focus:border-[#0056b3] outline-none transition-all font-bold placeholder:text-zinc-300`}
                                                value={formData.cvv}
                                                onChange={e => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-4">
                                <button
                                    type="submit"
                                    className="w-full py-5 bg-[#0056b3] text-white font-black rounded-2xl hover:bg-[#004494] transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-xl shadow-blue-900/10"
                                >
                                    Valider le paiement
                                    <LucideChevronRight size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full py-2 text-zinc-400 font-bold text-xs uppercase tracking-widest hover:text-zinc-600 transition-colors"
                                >
                                    Annuler la transaction
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'PROCESSING' && (
                        <div className="py-20 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in-95">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-zinc-100 rounded-full" />
                                <div className="absolute inset-0 border-4 border-t-[#0056b3] rounded-full animate-spin" />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-xl font-black uppercase italic tracking-tight text-[#0056b3]">Traitement en cours...</h4>
                                <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Communication avec le serveur CMI</p>
                            </div>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="py-20 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in-95">
                            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
                                <LucideCheckCircle2 size={40} />
                            </div>
                            <div className="text-center space-y-2">
                                <h4 className="text-2xl font-black uppercase italic tracking-tight text-emerald-600">Paiement Réussi</h4>
                                <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Votre challenge {planName} est activé !</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* CMI Footer Decoration */}
                <div className="bg-zinc-50 p-6 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-6 opacity-30 grayscale">
                        <img src="https://img.icons8.com/?size=100&id=15848&format=png" className="h-6" alt="Visa" />
                        <img src="https://img.icons8.com/?size=100&id=13610&format=png" className="h-6" alt="Mastercard" />
                        <div className="h-4 w-px bg-zinc-400" />
                        <span className="font-black text-xs italic tracking-tighter">CMI</span>
                    </div>
                    <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                        <LucideShieldCheck size={12} />
                        Mode Simulation - Aucun débit réel
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CMIModal;
