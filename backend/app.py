
from flask import Flask, request, make_response
from threading import Lock
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

def create_app():
    app = Flask(__name__)
    
    # 1. Configuration Globale
    app.config.from_object(ProductionConfig)
    
    # 2. Blueprints (Modulaires)
    app.register_blueprint(trade_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(leaderboard_bp)
    app.register_blueprint(challenge_routes_bp)
    app.register_blueprint(news_bp)
    app.register_blueprint(ai_bp)
    print(app.url_map)
    
    # 3. Gestion d'erreurs centralisée
    register_error_handlers(app)
    
    app.challenges_db = challenges_db
    app.challenge_locks = challenge_locks
    
    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,PATCH,DELETE,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Admin-Token'
        return response
    
    @app.route("/health", methods=["GET"])
    def health():
        return "OK", 200
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=False)
