from flask import Blueprint, jsonify

access_bp = Blueprint('access', __name__)

@access_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "backend"})

@access_bp.route('/info', methods=['GET'])
def get_info():
    return jsonify({
        "app": "Pneumonia Detection API",
        "version": "1.0.0",
        "description": "Flask backend for processing medical images."
    })
