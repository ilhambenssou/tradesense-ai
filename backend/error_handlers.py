
from flask import jsonify

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({
            "error": "BAD_REQUEST",
            "message": str(e.description),
            "code": 400
        }), 400

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({
            "error": "FORBIDDEN",
            "message": "Access denied to the requested resource.",
            "code": 403
        }), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            "error": "NOT_FOUND",
            "message": "Resource could not be found.",
            "code": 404
        }), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({
            "error": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred.",
            "code": 500
        }), 500
