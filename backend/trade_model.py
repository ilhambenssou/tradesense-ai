
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class TradeModel:
    id: str
    challenge_id: str
    symbol: str
    type: str  # BUY or SELL
    entry_price: float
    exit_price: Optional[float]
    size: float
    pnl: float
    status: str  # OPEN or CLOSED
    opened_at: datetime
    closed_at: Optional[datetime]

    def to_json(self):
        return {
            "id": self.id,
            "challengeId": self.challenge_id,
            "symbol": self.symbol,
            "type": self.type,
            "entryPrice": self.entry_price,
            "exitPrice": self.exit_price,
            "size": self.size,
            "pnl": self.pnl,
            "status": self.status,
            "openedAt": self.opened_at.isoformat(),
            "closedAt": self.closed_at.isoformat() if self.closed_at else None
        }
