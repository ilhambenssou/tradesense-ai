
import uuid
from datetime import datetime, timezone
from backend.challenge_evaluator import evaluate_after_trade

def execute_trade(challenge, symbol, trade_type, price, size):
    """
    Exécute un trade réel dans le contexte d'une Prop Firm.
    
    Logique:
    - BUY: Ouvre une position LONG (parie sur la hausse)
    - SELL: Ouvre une position SHORT (parie sur la baisse)
    - Les positions sont fermées immédiatement avec un slippage simulé
    
    Args:
        challenge: État du challenge actuel
        symbol: Symbole tradé (ex: BTC-USD)
        trade_type: "BUY" ou "SELL"
        price: Prix du marché en temps réel (récupéré côté serveur)
        size: Taille de la position (lots)
    
    Returns:
        (trade, updated_challenge) ou (None, error_message)
    """
    if challenge['status'] != "ACTIVE":
        return None, "Challenge is not active"
    
    # Validation du prix (doit être récupéré en temps réel)
    if not price or price <= 0:
        return None, "Invalid market price"
    
    # Check Solde (Règle de risque)
    trade_cost = price * size
    current_equity = challenge.get('equity', 0)
    if trade_cost > current_equity:
        return None, f"Insufficient equity ({current_equity:.2f}) for trade cost ({trade_cost:.2f})"
    
    # Reset journalier basé sur la date UTC
    now_utc = datetime.now(timezone.utc)
    today_str = now_utc.date().isoformat()
    if challenge.get('dailyDate') != today_str:
        challenge['dailyDate'] = today_str
        # Le point de départ journalier devient l'équité courante au début de la journée
        challenge['dailyStartingBalance'] = challenge.get('equity', challenge['initialBalance'])
    
    # Simulation de l'exécution du trade
    import random
    
    entry_price = price
    
    # Simulation de Slippage / Market Impact (+/- 0.1%)
    # Dans une vraie Prop Firm, le slippage dépend de la liquidité du marché
    slippage_pct = random.uniform(-0.001, 0.001)
    exit_price = entry_price * (1 + slippage_pct)
    
    # Calcul du PnL selon le type de trade
    if trade_type == "BUY":
        # Position LONG: Profit si le prix monte
        simulated_pnl = (exit_price - entry_price) * size
    else:  # SELL
        # Position SHORT: Profit si le prix baisse
        simulated_pnl = (entry_price - exit_price) * size
    
    # Mise à jour du challenge
    challenge['equity'] += simulated_pnl
    challenge['currentBalance'] += simulated_pnl
    challenge['maxEquity'] = max(challenge['maxEquity'], challenge['equity'])
    challenge['updatedAt'] = now_utc.isoformat()
    
    # Évaluation des règles de risque (Daily Loss, Total Loss, Profit Target)
    challenge = evaluate_after_trade(challenge)
    
    # Création de l'objet trade
    trade = {
        "id": str(uuid.uuid4()),
        "challengeId": challenge['id'],
        "symbol": symbol,
        "type": trade_type,
        "entryPrice": entry_price,
        "exitPrice": exit_price,
        "size": size,
        "pnl": simulated_pnl,
        "status": "CLOSED",  # Fermé immédiatement (mode simulation)
        "openedAt": now_utc.isoformat(),
        "closedAt": now_utc.isoformat()
    }
    
    return trade, challenge
