
from flask import Flask, request, make_response
from flask_cors import CORS
import sqlite3
import os
from backend.config import Config, ProductionConfig
from backend.error_handlers import register_error_handlers
from backend.trade_routes import trade_bp
from backend.admin_routes import admin_bp
from backend.leaderboard_routes import leaderboard_bp
from backend.challenge_routes import challenge_routes_bp
from backend.news_routes import news_bp
from backend.ai_routes import ai_bp

challenges_db = {}
challenge_locks = {}

def init_db():
    """Initialise la base de données en exécutant schema.sql"""
    db_path = os.path.join(os.getcwd(), "tradesense.db")
    schema_path = os.path.join(os.getcwd(), "schema.sql")
    
    print(f"🚀 Initialisation de la base de données : {db_path}")
    
    if not os.path.exists(schema_path):
        print("⚠️ schema.sql non trouvé, passage de l'initialisation.")
        return

    try:
        conn = sqlite3.connect(db_path)
        with open(schema_path, 'r', encoding='utf-8') as f:
            conn.executescript(f.read())
        conn.commit()
        conn.close()
        print("✅ Base de données initialisée avec succès.")
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation de la DB : {e}")

def create_app():
    # Initialiser la DB avant de créer l'app
    init_db()
    
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    
    # 1. Configuration Globale
    app.config.from_object(ProductionConfig)
    
    # 2. Blueprints (Modulaires)
    app.register_blueprint(trade_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(leaderboard_bp)
    app.register_blueprint(challenge_routes_bp)
    app.register_blueprint(news_bp)
    app.register_blueprint(ai_bp)
    
    # 3. Gestion d'erreurs centralisée
    register_error_handlers(app)
    
    app.challenges_db = challenges_db
    app.challenge_locks = challenge_locks
    
    @app.route("/health", methods=["GET"])
    def health():
        return "OK", 200
    
    return app

if __name__ == "__main__":
    app = create_app()
    # Sur Railway, on utilise le port défini par l'environnement
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
