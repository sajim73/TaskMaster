# Settings routes
from flask import Blueprint, jsonify, request
from app.models import Settings
from app import db

settings_bp = Blueprint('settings', __name__)

# ----------------------------
# Get current settings
# ----------------------------
@settings_bp.route('/', methods=['GET'])
def get_settings():
    settings = Settings.query.first()
    if not settings:
        # If no settings exist, create default
        settings = Settings()
        db.session.add(settings)
        db.session.commit()
    
    result = {
        'theme': settings.theme,
        'font_size': settings.font_size,
        'notifications': settings.notifications
    }
    return jsonify(result), 200


# ----------------------------
# Update settings
# ----------------------------
@settings_bp.route('/', methods=['PUT'])
def update_settings():
    data = request.get_json()
    settings = Settings.query.first()
    if not settings:
        settings = Settings()
        db.session.add(settings)

    theme = data.get('theme')
    font_size = data.get('font_size')
    notifications = data.get('notifications')

    if theme:
        settings.theme = theme
    if font_size:
        settings.font_size = font_size
    if notifications is not None:
        settings.notifications = notifications

    db.session.commit()
    return jsonify({'message': 'Settings updated successfully'}), 200
