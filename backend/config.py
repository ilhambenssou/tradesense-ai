
import os

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'tradesense-dev-secret-key')
    DATABASE_URL = os.environ.get('DATABASE_URL', 'sqlite:///tradesense.db')
    PAYPAL_CLIENT_ID = os.environ.get('PAYPAL_CLIENT_ID')
    PAYPAL_SECRET = os.environ.get('PAYPAL_SECRET')
    DEBUG = False

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    # Ensure all secrets are set
    @classmethod
    def check_env(cls):
        required = ['SECRET_KEY', 'DATABASE_URL', 'PAYPAL_CLIENT_ID', 'PAYPAL_SECRET']
        for var in required:
            if not os.environ.get(var):
                raise RuntimeError(f"Missing required environment variable: {var}")
