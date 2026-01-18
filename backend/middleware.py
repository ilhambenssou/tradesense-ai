
from flask import request, jsonify, abort
from functools import wraps

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Simulation d'un header admin pour la sécurité
        auth_token = request.headers.get('X-Admin-Token')
        if auth_token != "SUPER_SECRET_ADMIN_KEY":
            return jsonify({
                "error": "UNAUTHORIZED_ADMIN_ACCESS",
                "message": "Valid admin token required"
            }), 401
        return f(*args, **kwargs)
    return decorated_function

def challenge_active_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Vérification du statut ACTIVE avant toute opération
        # Logique simplifiée : on suppose que challenge_id est dans le JSON
        data = request.json
        # ... logic to fetch challenge from DB ...
        # if challenge.status != "ACTIVE":
        #    return jsonify({"error": "CHALLENGE_NOT_ACTIVE"}), 403
        return f(*args, **kwargs)
    return decorated_function
