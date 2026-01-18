
import uuid
from datetime import datetime

def log_event(user_id, challenge_id, action, details):
    """
    Persist audit event to database.
    """
    event = {
        "id": str(uuid.uuid4()),
        "userId": user_id,
        "challengeId": challenge_id,
        "action": action,
        "details": details,
        "timestamp": datetime.now().isoformat()
    }
    # Persistence logic: INSERT INTO audit_logs ...
    print(f"[AUDIT] {action}: {details}")
    return event
