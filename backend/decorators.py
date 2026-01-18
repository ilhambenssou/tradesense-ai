
from functools import wraps
from flask import request, jsonify
from backend.enums import ChallengeStatus

def require_active_challenge(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Simulation d'extraction du challenge depuis la DB
        # challenge = db.get_challenge(request.json.get('challengeId'))
        # Pour l'exemple, on simule une vérification de l'état "ACTIVE"
        challenge_status = request.headers.get('X-Challenge-Status', 'PENDING_PAYMENT')
        
        if challenge_status != ChallengeStatus.ACTIVE.value:
            return jsonify({
                "error": "FORBIDDEN_OPERATION",
                "message": f"Operation only allowed on ACTIVE challenges. Current: {challenge_status}",
                "code": 403
            }), 403
        return f(*args, **kwargs)
    return decorated_function
