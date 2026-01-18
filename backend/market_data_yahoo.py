
import yfinance as yf
import random
import time

# Cache simple pour simulation cohérente
_mock_prices = {
    "BTC-USD": 96500.00,
    "ETH-USD": 3450.00,
    "TSLA": 240.00,
    "AAPL": 180.00
}

def get_yahoo_price(ticker):
    """
    Récupère le dernier prix de clôture ou prix actuel.
    Fallback sur simulation si l'API échoue.
    """
    try:
        # Tente de récupérer le prix réel
        data = yf.Ticker(ticker)
        # Access property safely
        # Try fast_info first
        if hasattr(data, 'fast_info'):
            # Check for various keys that might hold the price
            if 'last_price' in data.fast_info:
                price = data.fast_info['last_price']
            elif 'regularMarketPrice' in data.fast_info:
                price = data.fast_info['regularMarketPrice']
            else:
                price = None

            if price and price > 0:
                 return {
                    "symbol": ticker,
                    "price": round(price, 4),
                    "currency": "USD",
                    "source": "YahooFinance",
                    "timestamp": int(time.time())
                }
        
        # Fallback to history (slower but more reliable)
        hist = data.history(period="1d")
        if not hist.empty:
            price = hist['Close'].iloc[-1]
            return {
                "symbol": ticker,
                "price": round(price, 4),
                "currency": "USD",
                "source": "YahooFinance (History)",
                "timestamp": int(time.time())
            }
    except Exception:
        # On ignore silencieusement les erreurs et on passe au fallback
        pass
        
    # Fallback Simulation
    base = _mock_prices.get(ticker, 100.00)
    # Variation +/- 0.2%
    variation = random.uniform(-0.002, 0.002)
    new_price = base * (1 + variation)
    _mock_prices[ticker] = new_price # Update cache for continuity
    
    return {
        "symbol": ticker,
        "price": round(new_price, 2),
        "currency": "USD",
        "source": "SIMULATION_FALLBACK",
        "timestamp": int(time.time())
    }
