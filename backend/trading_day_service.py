
from datetime import datetime, timezone

def check_and_reset_trading_day(challenge):
    """
    Reset le daily_starting_balance si nous avons changé de jour UTC.
    Indispensable pour le calcul correct du daily drawdown.
    """
    now_utc = datetime.now(timezone.utc)
    last_update = datetime.fromisoformat(challenge['updatedAt'].replace('Z', '+00:00'))
    
    if now_utc.date() > last_update.date():
        # Nouveau jour de trading
        challenge['dailyStartingBalance'] = challenge['equity']
        challenge['updatedAt'] = now_utc.isoformat()
        return True, challenge
        
    return False, challenge
