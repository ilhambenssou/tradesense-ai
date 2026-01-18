
import React, { useEffect, useState } from 'react';
import { LucideShieldCheck, LucideSettings, LucideCreditCard, LucideSave, LucideHistory } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [config, setConfig] = useState({
    paypalClientId: '',
    paypalEmail: '',
    paypalSecret: '**************************',
    enabled: false,
    prices: {
      STARTER: 200,
      PRO: 500,
      ELITE: 1000
    }
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/config');
        if (res.ok) {
          const data = await res.json();
          setConfig({
            paypalClientId: data.paypal_client_id || '',
            paypalEmail: data.paypal_email || '',
            paypalSecret: '**************************',
            enabled: !!data.paypal_enabled,
            prices: data.prices || config.prices
          });
        }
      } catch (e) {
        console.error('[ADMIN] Failed to load backend config');
      }
    };
    load();
  }, []);

  const handleSave = () => {
    fetch('http://localhost:5000/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paypal_client_id: config.paypalClientId,
        paypal_email: config.paypalEmail,
        paypal_enabled: config.enabled,
        prices: config.prices
      })
    }).then(() => {
      alert("Configuration synchronisée avec le Backend Flask");
    }).catch(() => {
      alert("Échec de la synchronisation Backend");
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-white/5 pb-8">
        <div className="p-4 bg-amber-600 rounded-2xl shadow-xl shadow-amber-500/20">
          <LucideShieldCheck className="text-white" size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">SuperAdmin Console</h2>
          <p className="text-zinc-500 text-sm">Prop Firm Infrastructure & Payment Gateway Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PayPal Config */}
        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <LucideCreditCard className="text-indigo-400" />
            PayPal Gateway
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-zinc-600 uppercase mb-2 tracking-widest">PayPal Business Email</label>
              <input
                type="text"
                value={config.paypalEmail}
                onChange={(e) => setConfig({ ...config, paypalEmail: e.target.value })}
                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-xs font-bold text-white focus:border-indigo-500 outline-none"
                placeholder="admin@tradesense.local"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Client ID</label>
              <input
                type="text"
                value={config.paypalClientId}
                onChange={(e) => setConfig({ ...config, paypalClientId: e.target.value })}
                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-xs font-mono text-indigo-300 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-600 uppercase mb-2 tracking-widest">Client Secret</label>
              <input
                type="password"
                value={config.paypalSecret}
                className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-xs font-mono text-zinc-600 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="accent-indigo-500"
              />
              <span className="text-xs text-zinc-400 font-bold">Enable PayPal Live Checkout</span>
            </div>
          </div>
        </div>

        {/* Pricing Management */}
        <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <LucideSettings className="text-amber-400" />
            Challenge Pricing (USD)
          </h3>
          <div className="space-y-4">
            {Object.entries(config.prices).map(([tier, price]) => (
              <div key={tier} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                <span className="text-xs font-black text-zinc-400">{tier}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600">$</span>
                  <input
                    type="number"
                    value={price}
                    className="bg-transparent text-right font-black text-white outline-none w-20"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 flex items-center justify-between">
        <div className="flex items-center gap-4 text-zinc-500">
          <LucideHistory size={20} />
          <p className="text-xs italic">Last synchronized: {new Date().toLocaleTimeString()}</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-white/5"
        >
          <LucideSave size={18} />
          SAVE CHANGES
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
