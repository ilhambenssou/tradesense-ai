
def evaluate_after_trade(challenge):
    """
    Règles STRICTES Prop Firm:
    - Daily Loss: -5% du daily_starting_balance
    - Total Loss: -10% de l'initial_balance
    - Profit Target: +10% de l'initial_balance
    """
    initial = challenge['initialBalance']
    current_equity = challenge['equity']
    daily_start = challenge['dailyStartingBalance']
    
    # 1. Calcul des écarts
    total_loss = initial - current_equity
    daily_loss = daily_start - current_equity
    total_profit = current_equity - initial
    
    # 2. Seuils (Hardcoded truth)
    MAX_DAILY_LOSS = challenge['maxDailyLossLimit']
    MAX_TOTAL_LOSS = challenge['maxTotalLossLimit']
    PROFIT_TARGET = challenge['profitTarget']
    
    new_status = challenge['status']
    
    if total_loss >= MAX_TOTAL_LOSS:
        new_status = "FAILED"
    elif daily_loss >= MAX_DAILY_LOSS:
        new_status = "FAILED"
    elif total_profit >= PROFIT_TARGET:
        new_status = "PASSED"
        
    challenge['status'] = new_status
    return challenge
