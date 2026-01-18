"""
Routes API pour les actualités financières
"""

from flask import Blueprint, jsonify, request
from backend.news_service import fetch_financial_news

news_bp = Blueprint('news', __name__)

@news_bp.route('/api/news', methods=['GET'])
def get_news():
    """
    Récupère les actualités financières en temps réel
    
    Query params (optionnels):
    - category: Filtrer par catégorie (Crypto, Actions US, Économie, etc.)
    - limit: Nombre max d'articles (default: 20)
    
    Returns:
        JSON: Liste d'articles avec titre, source, date, catégorie, sentiment
    """
    try:
        # Récupérer les actualités (avec cache)
        articles = fetch_financial_news()
        
        # Filtrage par catégorie si demandé
        category_filter = request.args.get('category')
        if category_filter:
            articles = [a for a in articles if a['category'] == category_filter]
        
        # Limitation du nombre d'articles
        limit = request.args.get('limit', 20, type=int)
        articles = articles[:limit]
        
        return jsonify({
            'success': True,
            'count': len(articles),
            'articles': articles,
            'last_updated': 'now'
        })
    
    except Exception as e:
        # En cas d'erreur, retourner un message clair
        return jsonify({
            'success': False,
            'error': 'NEWS_FETCH_ERROR',
            'message': 'Impossible de récupérer les actualités pour le moment',
            'details': str(e)
        }), 500

@news_bp.route('/api/news/categories', methods=['GET'])
def get_categories():
    """
    Retourne la liste des catégories disponibles
    """
    categories = [
        'Crypto',
        'Actions US',
        'Économie',
        'Matières Premières',
        'Marchés Globaux'
    ]
    return jsonify({'categories': categories})
