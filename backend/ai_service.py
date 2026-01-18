"""
Service IA pour le Conseiller TradeSense
Utilise Google Gemini pour des analyses contextuelles en temps réel
"""

import os
from datetime import datetime
from typing import Dict, List

# Note: L'API Gemini sera appelée depuis le frontend via la clé stockée dans .env.local
# Ce service fournit des prompts optimisés et des analyses de fallback

def get_ai_prompt_template(user_question: str, context: Dict) -> str:
    """
    Génère un prompt optimisé pour Gemini selon la question de l'utilisateur
    
    Args:
        user_question: Question de l'utilisateur
        context: Contexte du marché (prix, signal, indicateurs)
    
    Returns:
        Prompt formaté pour l'IA
    """
    
    symbol = context.get('symbol', 'BTC-USD')
    current_price = context.get('current_price', 0)
    signal_type = context.get('signal_type', 'HOLD')
    signal_reason = context.get('signal_reason', '')
    sma5 = context.get('sma5', 0)
    sma20 = context.get('sma20', 0)
    
    base_context = f"""
Tu es un expert en trading et analyse technique pour une Prop Firm professionnelle.

CONTEXTE ACTUEL DU MARCHÉ:
- Symbole: {symbol}
- Prix actuel: ${current_price:,.2f}
- Signal IA: {signal_type}
- Raison: {signal_reason}
- SMA 5: ${sma5:,.2f}
- SMA 20: ${sma20:,.2f}
- Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

QUESTION DU TRADER:
{user_question}

INSTRUCTIONS:
- Réponds de manière concise (max 150 mots)
- Utilise un langage professionnel mais accessible
- Fournis des chiffres précis quand c'est pertinent
- Si c'est une question sur le risque, mentionne le ratio risque/rendement
- Si c'est sur la stratégie, propose des niveaux clés (support/résistance)
- Termine par une recommandation claire (ACHAT/VENTE/ATTENDRE)
"""
    
    return base_context

def get_fallback_response(question: str, context: Dict) -> str:
    """
    Génère une réponse de fallback si l'API IA n'est pas disponible
    Utilise des règles prédéfinies basées sur l'analyse technique
    """
    
    question_lower = question.lower()
    signal_type = context.get('signal_type', 'HOLD')
    current_price = context.get('current_price', 0)
    sma5 = context.get('sma5', 0)
    sma20 = context.get('sma20', 0)
    
    # Questions sur le signal
    if any(word in question_lower for word in ['pourquoi', 'signal', 'achat', 'vente']):
        if signal_type == 'BUY':
            return f"""
📈 **Signal ACHAT détecté**

La moyenne mobile courte (SMA 5 = ${sma5:,.2f}) a croisé au-dessus de la moyenne longue (SMA 20 = ${sma20:,.2f}), indiquant un momentum haussier.

**Raison technique:** Croisement haussier des moyennes mobiles (Golden Cross pattern).

**Recommandation:** ACHAT avec stop loss à ${sma20 * 0.98:,.2f} (-2% sous SMA20).
"""
        elif signal_type == 'SELL':
            return f"""
📉 **Signal VENTE détecté**

La moyenne mobile courte (SMA 5 = ${sma5:,.2f}) a croisé en-dessous de la moyenne longue (SMA 20 = ${sma20:,.2f}), indiquant une pression baissière.

**Raison technique:** Croisement baissier des moyennes mobiles (Death Cross pattern).

**Recommandation:** VENTE ou attendre une confirmation.
"""
        else:
            return f"""
⚖️ **Signal NEUTRE (Consolidation)**

Les moyennes mobiles sont proches (SMA5: ${sma5:,.2f}, SMA20: ${sma20:,.2f}), le marché est en phase de consolidation.

**Recommandation:** ATTENDRE un breakout clair avant d'entrer en position.
"""
    
    # Questions sur le risque
    elif any(word in question_lower for word in ['risque', 'stop', 'perte']):
        stop_loss = sma20 * 0.98
        risk_pct = ((current_price - stop_loss) / current_price) * 100
        return f"""
🛡️ **Analyse de Risque**

**Prix actuel:** ${current_price:,.2f}
**Stop Loss recommandé:** ${stop_loss:,.2f}
**Risque:** {risk_pct:.2f}% du capital

**Règle de gestion:** Ne risquez jamais plus de 2% de votre capital par trade. Avec un compte de $10,000, votre risque max est $200.

**Recommandation:** Ajustez votre taille de position en conséquence.
"""
    
    # Questions sur les événements
    elif any(word in question_lower for word in ['événement', 'news', 'actualité', 'impact']):
        return """
📰 **Événements à Surveiller**

**Cette semaine:**
- Publication du CPI (Inflation US)
- Décision de taux de la FED
- Rapport NFP (Emplois non-agricoles)

**Impact potentiel:** ÉLEVÉ
Ces événements peuvent créer une volatilité de ±5% en quelques heures.

**Recommandation:** Réduisez votre exposition 1h avant les annonces majeures.
"""
    
    # Question générale
    else:
        return f"""
💡 **Analyse Rapide**

**Situation actuelle:** Le marché {symbol} est à ${current_price:,.2f} avec un signal {signal_type}.

**Points clés:**
- SMA 5: ${sma5:,.2f}
- SMA 20: ${sma20:,.2f}
- Tendance: {'Haussière' if sma5 > sma20 else 'Baissière' if sma5 < sma20 else 'Neutre'}

**Conseil:** Suivez le signal IA et respectez votre plan de trading.
"""

def analyze_market_context(prices: List[float], symbol: str) -> Dict:
    """
    Analyse le contexte du marché pour enrichir les réponses IA
    
    Returns:
        Dict avec indicateurs calculés
    """
    if len(prices) < 20:
        return {
            'symbol': symbol,
            'current_price': prices[-1] if prices else 0,
            'sma5': 0,
            'sma20': 0,
            'signal_type': 'HOLD',
            'signal_reason': 'Données insuffisantes',
            'volatility': 'UNKNOWN',
            'trend': 'UNKNOWN'
        }
    
    current_price = prices[-1]
    sma5 = sum(prices[-5:]) / 5
    sma20 = sum(prices[-20:]) / 20
    
    # Déterminer le signal
    if sma5 > sma20 * 1.0005:
        signal_type = 'BUY'
        signal_reason = 'Croisement haussier SMA5 > SMA20'
    elif sma5 < sma20 * 0.9995:
        signal_type = 'SELL'
        signal_reason = 'Croisement baissier SMA5 < SMA20'
    else:
        signal_type = 'HOLD'
        signal_reason = 'Consolidation du marché'
    
    # Calculer la volatilité (écart-type des 20 derniers prix)
    mean_price = sum(prices[-20:]) / 20
    variance = sum((p - mean_price) ** 2 for p in prices[-20:]) / 20
    std_dev = variance ** 0.5
    volatility_pct = (std_dev / mean_price) * 100
    
    if volatility_pct > 3:
        volatility = 'HIGH'
    elif volatility_pct > 1.5:
        volatility = 'MEDIUM'
    else:
        volatility = 'LOW'
    
    # Tendance
    if sma5 > sma20:
        trend = 'BULLISH'
    elif sma5 < sma20:
        trend = 'BEARISH'
    else:
        trend = 'NEUTRAL'
    
    return {
        'symbol': symbol,
        'current_price': current_price,
        'sma5': sma5,
        'sma20': sma20,
        'signal_type': signal_type,
        'signal_reason': signal_reason,
        'volatility': volatility,
        'volatility_pct': round(volatility_pct, 2),
        'trend': trend,
        'support': round(sma20 * 0.98, 2),
        'resistance': round(sma20 * 1.02, 2)
    }
