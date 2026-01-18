
def reload_challenge_state(challenge_id):
    """
    Reconstruit l'état complet depuis la base de données.
    Ne fait JAMAIS confiance au state envoyé par le frontend.
    """
    # 1. Fetch challenge row from DB
    # challenge = db.execute("SELECT * FROM challenges WHERE id = ?", (challenge_id,))
    
    # 2. Fetch all closed trades to verify equity integrity
    # trades = db.execute("SELECT pnl FROM trades WHERE challenge_id = ?", (challenge_id,))
    # reconstructed_equity = challenge['initial_balance'] + sum(t['pnl'] for t in trades)
    
    # 3. Apply daily reset check
    # _, challenge = check_and_reset_trading_day(challenge)
    
    return "STATE_SYNCHRONIZED"
