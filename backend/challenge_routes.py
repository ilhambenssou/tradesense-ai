
from flask import Blueprint, request, jsonify, current_app
import sqlite3
import os
import uuid
from datetime import datetime

challenge_routes_bp = Blueprint('challenge_routes', __name__)

PLAN_CONFIGS = {
    'STARTER': {
        'initial_balance': 5000,
        'profit_target': 500,
        'max_daily_loss': 250,  # 5% de 5000
        'max_total_loss': 500   # 10% de 5000
    },
    'PRO': {
        'initial_balance': 10000,
        'profit_target': 1000,
        'max_daily_loss': 500,  # 5% de 10000
        'max_total_loss': 1000  # 10% de 10000
    },
    'ELITE': {
        'initial_balance': 25000,
        'profit_target': 2500,
        'max_daily_loss': 1250, # 5% de 25000
        'max_total_loss': 2500  # 10% de 25000
    }
}

@challenge_routes_bp.route('/api/challenges/create', methods=['POST'])
def create_challenge():
    """
    Simulation de création de challenge après paiement réussi.
    """
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"success": False, "message": "Données JSON manquantes"}), 400
            
        user_id = data.get('user_id') or data.get('userId')
        plan = data.get('plan')
        amount = data.get('amount')
        payment_method = data.get('payment_method', 'CMI')

        if not user_id or not plan:
            return jsonify({"success": False, "message": "user_id et plan sont obligatoires"}), 400

        plan = plan.upper()
        if plan not in PLAN_CONFIGS:
            return jsonify({"success": False, "message": f"Plan invalide: {plan}"}), 400

        config = PLAN_CONFIGS[plan]
        cid = str(uuid.uuid4())
        now = datetime.now().isoformat()

        challenge_data = {
            "id": cid,
            "userId": user_id,
            "type": plan,
            "status": "ACTIVE",
            "initialBalance": float(config['initial_balance']),
            "currentBalance": float(config['initial_balance']),
            "equity": float(config['initial_balance']),
            "maxEquity": float(config['initial_balance']),
            "dailyStartingBalance": float(config['initial_balance']),
            "profitTarget": float(config['profit_target']),
            "maxDailyLossLimit": float(config['max_daily_loss']),
            "maxTotalLossLimit": float(config['max_total_loss']),
            "createdAt": now,
            "updatedAt": now
        }

        # 1. Mise à jour de la DB en mémoire (challenges_db)
        store = getattr(current_app, "challenges_db", {})
        store[cid] = challenge_data
        current_app.challenges_db = store

        # 2. Persistance dans SQLite
        db_path = os.path.join(os.getcwd(), "tradesense.db")
        conn = None
        try:
            conn = sqlite3.connect(db_path)
            cur = conn.cursor()
            
            # Vérifier si l'utilisateur existe, sinon le créer (simplifié pour la démo)
            cur.execute("SELECT id FROM users WHERE id = ?", (user_id,))
            if not cur.fetchone():
                cur.execute("INSERT INTO users (id, name, email) VALUES (?, ?, ?)", 
                           (user_id, user_id.split('_')[0], f"{user_id}@tradesense.local"))

            cur.execute(
                """INSERT INTO user_challenges 
                (id, user_id, type, status, initial_balance, current_balance, equity, max_equity, 
                daily_starting_balance, profit_target, max_daily_loss_limit, max_total_loss_limit, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    cid, user_id, plan, "ACTIVE", 
                    config['initial_balance'], config['initial_balance'], 
                    config['initial_balance'], config['initial_balance'],
                    config['initial_balance'], config['profit_target'],
                    config['max_daily_loss'], config['max_total_loss'],
                    now, now
                )
            )

            # Insérer le paiement
            payment_id = str(uuid.uuid4())
            cur.execute(
                "INSERT INTO payments (id, user_id, challenge_id, method, amount, currency, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (payment_id, user_id, cid, payment_method, amount or 0, "MAD", "SUCCESS")
            )
            
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            return jsonify({"success": False, "message": f"Erreur DB: {str(e)}"}), 500
        finally:
            if conn:
                conn.close()

        return jsonify({
            "success": True, 
            "message": "Challenge activé avec succès",
            "challenge_id": cid,
            "challenge": challenge_data
        }), 201

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
