
import time

def validate_market_data(data):
    """
    Vérifie l'intégrité du feed avant calcul de PnL.
    """
    price = data.get('price')
    symbol = data.get('symbol')
    
    if price is None or price <= 0:
        return False, "INVALID_PRICE_VALUE"
    
    if not symbol or len(symbol) > 12:
        return False, "INVALID_SYMBOL_FORMAT"
        
    return True, None

# Exemple de données rejetées :
# {"symbol": "BTC", "price": -100} -> False
# {"symbol": "", "price": 65000} -> False
