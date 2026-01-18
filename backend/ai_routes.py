"""
Routes API pour le Conseiller IA
"""

from flask import Blueprint, request, jsonify
from backend.ai_service import get_ai_prompt_template, get_fallback_response, analyze_market_context

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    """
    Endpoint pour le chat IA
    
    Payload:
    {
        "question": "Pourquoi le signal est ACHAT ?",
        "prices": [65000, 65100, ...],
        "symbol": "BTC-USD"
    }
    
    Returns:
        JSON: { "response": "...", "context": {...} }
    """
    try:
        data = request.json
        question = data.get('question', '')
        prices = data.get('prices', [])
        symbol = data.get('symbol', 'BTC-USD')
        
        if not question:
            return jsonify({'error': 'Question requise'}), 400
        
        # Analyser le contexte du marché
        context = analyze_market_context(prices, symbol)
        
        # Générer le prompt pour Gemini (sera utilisé côté frontend)
        prompt = get_ai_prompt_template(question, context)
        
        # Générer une réponse de fallback (si l'API Gemini n'est pas disponible)
        fallback_response = get_fallback_response(question, context)
        
        return jsonify({
            'success': True,
            'response': fallback_response,  # Réponse de fallback
            'prompt': prompt,  # Prompt pour Gemini (frontend)
            'context': context,
            'timestamp': context.get('timestamp', '')
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'AI_ERROR',
            'message': str(e)
        }), 500

@ai_bp.route('/api/ai/analysis', methods=['POST'])
def ai_analysis():
    """
    Analyse technique avancée du marché
    
    Payload:
    {
        "prices": [65000, 65100, ...],
        "symbol": "BTC-USD"
    }
    
    Returns:
        JSON: Analyse complète avec indicateurs
    """
    try:
        data = request.json
        prices = data.get('prices', [])
        symbol = data.get('symbol', 'BTC-USD')
        
        context = analyze_market_context(prices, symbol)
        
        # Suggestions proactives
        suggestions = []
        
        if context['volatility'] == 'HIGH':
            suggestions.append({
                'type': 'WARNING',
                'message': '⚠️ Forte volatilité détectée. Pensez à ajuster votre stop loss.',
                'priority': 'HIGH'
            })
        
        if context['signal_type'] == 'BUY' and context['trend'] == 'BULLISH':
            suggestions.append({
                'type': 'OPPORTUNITY',
                'message': f"📈 Signal d'achat confirmé. Entry: ${context['current_price']:,.2f}, Stop: ${context['support']:,.2f}",
                'priority': 'MEDIUM'
            })
        
        if context['signal_type'] == 'SELL' and context['trend'] == 'BEARISH':
            suggestions.append({
                'type': 'RISK',
                'message': '📉 Tendance baissière confirmée. Considérez de réduire votre exposition.',
                'priority': 'HIGH'
            })
        
        return jsonify({
            'success': True,
            'analysis': context,
            'suggestions': suggestions,
            'indicators': {
                'sma5': context['sma5'],
                'sma20': context['sma20'],
                'support': context['support'],
                'resistance': context['resistance'],
                'volatility': context['volatility_pct']
            }
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'ANALYSIS_ERROR',
            'message': str(e)
        }), 500
