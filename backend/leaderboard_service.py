"""
Service de génération de traders réalistes pour le leaderboard
Basé sur des statistiques réelles de Prop Firms (FTMO, MyForexFunds, etc.)
"""

import random
from datetime import datetime, timedelta

# Noms de traders réalistes (inspirés de vrais pseudos de trading)
TRADER_NAMES = [
    # Style professionnel
    "AlphaTrader_Pro", "QuantumFX", "PriceAction_King", "ScalpMaster_V2",
    "TrendFollower_Elite", "BreakoutHunter", "SwingTrader_Pro", "DayTrader_X",
    
    # Style international
    "Tokyo_Scalper", "LondonSession_Pro", "NYOpen_Trader", "Sydney_Sniper",
    
    # Style technique
    "FibonacciMaster", "EMA_Crossover", "RSI_Divergence", "MACD_Hunter",
    
    # Style marocain/arabe
    "Casablanca_Trader", "Rabat_FX", "Marrakech_Pro", "Atlas_Capital",
    "Dubai_Scalper", "Riyadh_Trader", "Cairo_FX", "Beirut_Pro",
    
    # Style crypto
    "BTC_Maximalist", "ETH_Whale", "CryptoKing_2024", "DeFi_Trader",
    
    # Noms courts percutants
    "TheBull", "TheSniper", "TheProphet", "TheHunter", "TheScalper",
    "Momentum_Master", "Volatility_King", "Risk_Manager_Pro"
]

# Statistiques réelles de Prop Firms :
# - Taux de réussite : 5-15% des traders passent le challenge
# - Profit moyen des gagnants : 10-25% sur le capital initial
# - Top performers : 30-50% (rare)
# - Drawdown moyen : 3-8%

def generate_realistic_leaderboard(count: int = 10) -> list:
    """
    Génère un classement réaliste de traders basé sur des statistiques de Prop Firms
    
    Distribution des performances :
    - Top 1-3 : 20-35% de profit (exceptionnels)
    - Rang 4-7 : 12-20% de profit (très bons)
    - Rang 8-10 : 8-12% de profit (bons)
    
    Args:
        count: Nombre de traders à générer (default: 10)
    
    Returns:
        Liste de traders triés par profit décroissant
    """
    
    # Sélectionner des noms uniques
    selected_names = random.sample(TRADER_NAMES, min(count, len(TRADER_NAMES)))
    
    traders = []
    
    for i in range(count):
        rank = i + 1
        
        # Distribution réaliste des profits selon le rang
        if rank == 1:
            # Top 1 : Performance exceptionnelle (25-35%)
            profit_pct = round(random.uniform(25.0, 35.0), 2)
            status = "FUNDED"
        elif rank == 2:
            # Top 2 : Très forte performance (20-28%)
            profit_pct = round(random.uniform(20.0, 28.0), 2)
            status = random.choice(["FUNDED", "PASSED"])
        elif rank == 3:
            # Top 3 : Forte performance (18-24%)
            profit_pct = round(random.uniform(18.0, 24.0), 2)
            status = random.choice(["FUNDED", "PASSED"])
        elif rank <= 5:
            # Top 4-5 : Bonne performance (14-20%)
            profit_pct = round(random.uniform(14.0, 20.0), 2)
            status = random.choice(["PASSED", "ACTIVE"])
        elif rank <= 7:
            # Top 6-7 : Performance solide (11-16%)
            profit_pct = round(random.uniform(11.0, 16.0), 2)
            status = random.choice(["PASSED", "ACTIVE"])
        else:
            # Top 8-10 : Performance correcte (8-13%)
            profit_pct = round(random.uniform(8.0, 13.0), 2)
            status = "ACTIVE"
        
        # Nombre de trades (réaliste pour un mois)
        # Scalpers : 100-300 trades/mois
        # Day traders : 40-100 trades/mois
        # Swing traders : 10-40 trades/mois
        if rank <= 3:
            # Top traders = plus actifs
            trades_count = random.randint(80, 250)
        else:
            trades_count = random.randint(30, 120)
        
        # Win rate réaliste (50-70% pour les meilleurs)
        if rank <= 3:
            win_rate = round(random.uniform(62.0, 72.0), 1)
        elif rank <= 7:
            win_rate = round(random.uniform(55.0, 65.0), 1)
        else:
            win_rate = round(random.uniform(52.0, 60.0), 1)
        
        # Capital initial (selon le type de challenge)
        initial_balance = random.choice([10000, 25000, 50000, 100000])
        
        # Profit absolu
        profit_absolute = round((profit_pct / 100) * initial_balance, 2)
        
        # Pays (pour ajouter du réalisme)
        countries = ["🇲🇦 Maroc", "🇫🇷 France", "🇦🇪 UAE", "🇸🇦 KSA", "🇪🇬 Egypt", 
                     "🇬🇧 UK", "🇺🇸 USA", "🇩🇪 Germany", "🇯🇵 Japan", "🇸🇬 Singapore"]
        
        trader = {
            "rank": rank,
            "user": selected_names[i] if i < len(selected_names) else f"Trader_{rank}",
            "profit": f"+{profit_pct}%",
            "profit_pct": profit_pct,
            "profit_absolute": f"${profit_absolute:,.2f}",
            "status": status,
            "trades_count": trades_count,
            "win_rate": f"{win_rate}%",
            "country": random.choice(countries),
            "initial_balance": f"${initial_balance:,}",
            "joined_days_ago": random.randint(15, 30)  # Traders du mois en cours
        }
        
        traders.append(trader)
    
    return traders

def get_trader_badge(status: str) -> dict:
    """Retourne le badge et la couleur selon le statut"""
    badges = {
        "FUNDED": {"label": "💰 FUNDED", "color": "emerald"},
        "PASSED": {"label": "✅ PASSED", "color": "indigo"},
        "ACTIVE": {"label": "🔥 ACTIVE", "color": "amber"}
    }
    return badges.get(status, {"label": status, "color": "zinc"})
