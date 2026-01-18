
from dataclasses import dataclass
from typing import Dict

@dataclass
class AdminConfigModel:
    paypal_client_id: str
    paypal_secret: str
    paypal_enabled: bool
    challenge_prices: Dict[str, float]

    def to_json(self):
        return {
            "paypalClientId": self.paypal_client_id,
            "paypalEnabled": self.paypal_enabled,
            "prices": self.challenge_prices
        }
