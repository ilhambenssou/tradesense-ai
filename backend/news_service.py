"""
Service d'actualités financières pour TradeSense
Agrège des flux RSS de sources professionnelles
"""

import feedparser
from datetime import datetime, timezone
import time
from typing import List, Dict, Optional

# Cache global pour éviter les appels excessifs
_news_cache = {
    'data': [],
    'timestamp': 0,
    'ttl': 300  # 5 minutes
}

def get_time_ago(published_time: str) -> str:
    """Convertit un timestamp en format relatif (ex: '2h ago')"""
    try:
        # Parse différents formats de date RSS
        parsed = feedparser._parse_date(published_time)
        if not parsed:
            return "récemment"
        
        pub_dt = datetime(*parsed[:6], tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        diff = now - pub_dt
        
        seconds = diff.total_seconds()
        if seconds < 60:
            return "à l'instant"
        elif seconds < 3600:
            mins = int(seconds / 60)
            return f"il y a {mins}min"
        elif seconds < 86400:
            hours = int(seconds / 3600)
            return f"il y a {hours}h"
        else:
            days = int(seconds / 86400)
            return f"il y a {days}j"
    except:
        return "récemment"

def categorize_article(title: str, description: str) -> str:
    """Catégorise automatiquement un article selon son contenu"""
    content = (title + " " + description).lower()
    
    # Crypto
    if any(word in content for word in ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'blockchain']):
        return 'Crypto'
    
    # Actions US
    if any(word in content for word in ['nasdaq', 'dow', 's&p', 'wall street', 'nyse', 'apple', 'tesla', 'nvidia']):
        return 'Actions US'
    
    # Économie & Macro
    if any(word in content for word in ['fed', 'inflation', 'interest rate', 'gdp', 'unemployment', 'central bank']):
        return 'Économie'
    
    # Commodities
    if any(word in content for word in ['oil', 'gold', 'silver', 'commodity', 'crude']):
        return 'Matières Premières'
    
    # Default
    return 'Marchés Globaux'

def get_sentiment(title: str, description: str) -> str:
    """Analyse le sentiment d'un article (Bullish/Bearish/Neutral)"""
    content = (title + " " + description).lower()
    
    bullish_words = ['surge', 'rally', 'gain', 'rise', 'jump', 'soar', 'record high', 'bullish', 'optimistic']
    bearish_words = ['plunge', 'crash', 'fall', 'drop', 'decline', 'bearish', 'pessimistic', 'concern', 'fear']
    
    bullish_count = sum(1 for word in bullish_words if word in content)
    bearish_count = sum(1 for word in bearish_words if word in content)
    
    if bullish_count > bearish_count:
        return 'Bullish'
    elif bearish_count > bullish_count:
        return 'Bearish'
    else:
        return 'Neutre'

def fetch_financial_news() -> List[Dict]:
    """
    Récupère les actualités financières depuis plusieurs sources RSS
    Sources gratuites et fiables (pas d'API key requise)
    """
    
    # Vérifier le cache
    now = time.time()
    if _news_cache['data'] and (now - _news_cache['timestamp']) < _news_cache['ttl']:
        return _news_cache['data']
    
    news_sources = [
        {
            'url': 'https://feeds.finance.yahoo.com/rss/2.0/headline',
            'name': 'Yahoo Finance'
        },
        {
            'url': 'https://www.investing.com/rss/news.rss',
            'name': 'Investing.com'
        },
        {
            'url': 'https://www.marketwatch.com/rss/topstories',
            'name': 'MarketWatch'
        }
    ]
    
    all_articles = []
    
    for source in news_sources:
        try:
            feed = feedparser.parse(source['url'])
            
            for entry in feed.entries[:10]:  # Limiter à 10 articles par source
                article = {
                    'id': entry.get('id', entry.get('link', str(time.time()))),
                    'title': entry.get('title', 'Sans titre'),
                    'description': entry.get('summary', entry.get('description', ''))[:200] + '...',
                    'link': entry.get('link', '#'),
                    'source': source['name'],
                    'published': entry.get('published', ''),
                    'time_ago': get_time_ago(entry.get('published', '')),
                    'category': '',
                    'sentiment': '',
                    'is_breaking': False
                }
                
                # Catégorisation automatique
                article['category'] = categorize_article(article['title'], article['description'])
                
                # Analyse de sentiment
                article['sentiment'] = get_sentiment(article['title'], article['description'])
                
                # Breaking news si < 30 min
                if 'min' in article['time_ago'] and 'il y a' in article['time_ago']:
                    try:
                        mins = int(article['time_ago'].split('il y a ')[1].split('min')[0])
                        if mins < 30:
                            article['is_breaking'] = True
                    except:
                        pass
                
                all_articles.append(article)
        
        except Exception as e:
            print(f"Error fetching from {source['name']}: {e}")
            continue
    
    # Trier par date (les plus récents en premier)
    all_articles.sort(key=lambda x: x['time_ago'])
    
    # Limiter à 30 articles max
    all_articles = all_articles[:30]
    
    # Mettre à jour le cache
    _news_cache['data'] = all_articles
    _news_cache['timestamp'] = now
    
    return all_articles
