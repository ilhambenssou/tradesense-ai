
import time
from datetime import datetime

# In-memory rate limiting
user_last_trade = {}
MAX_TRADES_PER_MINUTE = 10

def can_execute_trade(user_id):
    now = time.time()
    if user_id in user_last_trade:
        # Simplistic sliding window mock
        recent_trades = [t for t in user_last_trade[user_id] if now - t < 60]
        if len(recent_trades) >= MAX_TRADES_PER_MINUTE:
            return False, "RATE_LIMIT_EXCEEDED"
        user_last_trade[user_id] = recent_trades
    else:
        user_last_trade[user_id] = []
    
    user_last_trade[user_id].append(now)
    return True, None

def is_market_open(symbol):
    """
    Check if market is open based on symbol and time.
    Crypto (BTC) is 24/7.
    """
    if "BTC" in symbol:
        return True
    
    now = datetime.now()
    # Mocking standard market hours (9:30 AM - 4:00 PM EST, Mon-Fri)
    if now.weekday() >= 5: # Weekend
        return False
    if now.hour < 9 or (now.hour == 9 and now.minute < 30) or now.hour >= 16:
        return False
        
    return True
