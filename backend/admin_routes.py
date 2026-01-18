
from flask import Blueprint, request, jsonify, current_app
import uuid
from datetime import datetime, timezone
# Assume role check middleware exists
# from backend.middleware import admin_required

admin_bp = Blueprint('admin', __name__)

import sqlite3
import os

def get_db_connection():
    db_path = os.path.join(os.getcwd(), "tradesense.db")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@admin_bp.route('/api/admin/config', methods=['GET'])
def get_config():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT key, value FROM payment_settings")
    rows = cur.fetchall()
    conn.close()
    
    settings = {row['key']: row['value'] for row in rows}
    return jsonify({
        "paypal_client_id": settings.get("paypal_client_id", ""),
        "paypal_email": settings.get("paypal_email", ""),
        "paypal_enabled": settings.get("paypal_enabled") == "1",
        "prices": {
            "STARTER": 200,
            "PRO": 500,
            "ELITE": 1000
        }
    })

@admin_bp.route('/api/admin/config', methods=['POST'])
def update_config():
    data = request.json
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        keys_to_update = ["paypal_client_id", "paypal_email", "paypal_enabled"]
        for key in keys_to_update:
            if key in data:
                val = "1" if key == "paypal_enabled" and data[key] else str(data[key])
                if key == "paypal_enabled" and not data[key]: val = "0"
                
                cur.execute("INSERT OR REPLACE INTO payment_settings (key, value) VALUES (?, ?)", (key, val))
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        conn.close()
        
    return jsonify({"status": "SUCCESS", "message": "SETTINGS_UPDATED"})

@admin_bp.route('/api/admin/seed-challenge', methods=['POST'])
# @admin_required
def seed_challenge():
    """
    Crée un challenge actif en mémoire pour les tests fonctionnels.
    Payload optionnel:
    { "balance": 5000, "dailyLossPct": 5, "totalLossPct": 10, "profitTargetPct": 10 }
    """
    data = request.json or {}
    balance = float(data.get('balance', 5000))
    daily_pct = float(data.get('dailyLossPct', 5))
    total_pct = float(data.get('totalLossPct', 10))
    profit_pct = float(data.get('profitTargetPct', 10))
    
    now_utc = datetime.now(timezone.utc)
    challenge_id = str(uuid.uuid4())
    challenge = {
        "id": challenge_id,
        "userId": "TEST_USER",
        "type": "STARTER",
        "status": "ACTIVE",
        "initialBalance": balance,
        "currentBalance": balance,
        "equity": balance,
        "maxEquity": balance,
        "dailyStartingBalance": balance,
        "profitTarget": round(balance * (profit_pct / 100.0), 2),
        "maxDailyLossLimit": round(balance * (daily_pct / 100.0), 2),
        "maxTotalLossLimit": round(balance * (total_pct / 100.0), 2),
        "createdAt": now_utc.isoformat(),
        "updatedAt": now_utc.isoformat(),
        "dailyDate": now_utc.date().isoformat()
    }
    store = getattr(current_app, "challenges_db", {})
    store[challenge_id] = challenge
    current_app.challenges_db = store
    return jsonify({"status": "SUCCESS", "challenge": challenge})

@admin_bp.route('/api/payments/paypal/create-order', methods=['POST'])
def paypal_create_order():
    """
    Crée une commande PayPal simulée si activé par l'admin.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT key, value FROM payment_settings")
    rows = cur.fetchall()
    conn.close()
    settings = {row['key']: row['value'] for row in rows}

    if settings.get("paypal_enabled") != "1":
        return jsonify({"error": "PAYPAL_DISABLED"}), 400
    order_id = str(uuid.uuid4())
    amount = 99.00
    return jsonify({"status": "CREATED", "orderId": order_id, "amount": amount})

@admin_bp.route('/api/payments/paypal/capture', methods=['POST'])
def paypal_capture():
    """
    Capture de commande PayPal simulée. Fallback si non configuré.
    """
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT key, value FROM payment_settings")
    rows = cur.fetchall()
    conn.close()
    settings = {row['key']: row['value'] for row in rows}

    if settings.get("paypal_enabled") != "1":
        return jsonify({"status": "FALLBACK_REQUIRED", "reason": "PAYPAL_DISABLED"}), 200
    if not settings.get("paypal_client_id") or not settings.get("paypal_email"): # Check email instead of secret as secret is not stored? or checks client_id
        return jsonify({"status": "FALLBACK_REQUIRED", "reason": "PAYPAL_CREDENTIALS_MISSING"}), 200
    return jsonify({"status": "CAPTURED"})
