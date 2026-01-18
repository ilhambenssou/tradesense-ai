
import numpy as np

def calculate_signal(price_history):
    """
    IA Engine: Simple Moving Average Crossover (SMA 5/20)
    """
    if len(price_history) < 20:
        return "HOLD", "INSUFFICIENT_DATA"
    
    prices = np.array(price_history)
    sma_5 = np.mean(prices[-5:])
    sma_20 = np.mean(prices[-20:])
    
    if sma_5 > sma_20:
        return "BUY", "BULLISH_CROSSOVER"
    elif sma_5 < sma_20:
        return "SELL", "BEARISH_CROSSOVER"
    
    return "HOLD", "NEUTRAL_MARKET"
