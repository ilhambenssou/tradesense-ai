from backend.market_data_yahoo import get_yahoo_price
from backend.market_data_maroc import get_maroc_price

def get_live_price(symbol: str) -> float:
    s = symbol.upper()
    if s in ["IAM", "ATW"]:
        data = get_maroc_price(s)
        return float(data.get("price", 0) or 0)
    data = get_yahoo_price(s)
    return float(data.get("price", 0) or 0)
