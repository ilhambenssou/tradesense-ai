
from dataclasses import dataclass
from datetime import datetime

@dataclass
class AuditLogModel:
    id: str
    user_id: str
    challenge_id: str
    action: str  # PAYMENT, CHALLENGE_CREATE, TRADE_EXECUTE, STATUS_CHANGE
    details: str
    timestamp: datetime

    def to_json(self):
        return {
            "id": self.id,
            "action": self.action,
            "details": self.details,
            "timestamp": self.timestamp.isoformat()
        }
