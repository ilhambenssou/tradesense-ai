
from enum import Enum

class ChallengeStatus(Enum):
    PENDING_PAYMENT = "PENDING_PAYMENT"
    ACTIVE = "ACTIVE"
    PASSED = "PASSED"
    FAILED = "FAILED"
    FUNDED = "FUNDED"

    @classmethod
    def normalize(cls, status_str: str):
        return status_str.upper().strip()

class TradeSide(Enum):
    BUY = "BUY"
    SELL = "SELL"
