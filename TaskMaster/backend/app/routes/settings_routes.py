# Settings routes with data management functionality
from flask import Blueprint, jsonify, request
from app.models import Settings, Task, Category
from app import db
from datetime import datetime

settings_bp = Blueprint('settings', __name__)

# ----------------------------
# Get current settings
# ----------------------------
@settings_bp.route('/', methods=['GET'])
def get_settings():
    """Get current application settings"""
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
    """Update application settings"""
    data = request.get_json()
    settings = Settings.query.first()
    if not settings:
        settings = Settings()
        db.session.add(settings)

    # Validate theme
    theme = data.get('theme')
    if theme and theme not in ['light', 'dark']:
        return jsonify({'message': 'Theme must be either "light" or "dark"'}), 400

    # Validate font size
    font_size = data.get('font_size')
    if font_size and font_size not in ['small', 'medium', 'large']:
        return jsonify({'message': 'Font size must be "small", "medium", or "large"'}), 400

    # Update settings
    if theme:
        settings.theme = theme
    if font_size:
        settings.font_size = font_size
    if 'notifications' in data:  # Check if key exists, not just truthy value
        settings.notifications = data['notifications']

    try:
        db.session.commit()
        return jsonify({'message': 'Settings updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating settings', 'error': str(e)}), 500

# ----------------------------
# Reset settings to defaults
# ----------------------------
@settings_bp.route('/reset', methods=['POST'])
def reset_settings():
    """Reset all settings to default values"""
    try:
        settings = Settings.query.first()
        if not settings:
            settings = Settings()
            db.session.add(settings)

        # Reset to default values
        settings.theme = 'light'
        settings.font_size = 'medium'
        settings.notifications = True

        db.session.commit()

        return jsonify({
            'message': 'Settings reset to defaults successfully',
            'settings': {
                'theme': settings.theme,
                'font_size': settings.font_size,
                'notifications': settings.notifications
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error resetting settings', 'error': str(e)}), 500

# ----------------------------
# Data Management Endpoints
# ----------------------------

# Clear all tasks
@settings_bp.route('/data/clear-tasks', methods=['DELETE'])
def clear_all_tasks():
    """Clear all tasks from the database"""
    try:
        # Get count before deletion for confirmation
        task_count = Task.query.count()

        if task_count == 0:
            return jsonify({'message': 'No tasks to clear'}), 200

        # Delete all tasks
        Task.query.delete()
        db.session.commit()

        return jsonify({
            'message': f'Successfully cleared {task_count} tasks',
            'tasks_deleted': task_count,
            'timestamp': datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error clearing tasks', 'error': str(e)}), 500

# Clear all categories
@settings_bp.route('/data/clear-categories', methods=['DELETE'])
def clear_all_categories():
    """Clear all categories from the database"""
    try:
        # Get count before deletion for confirmation
        category_count = Category.query.count()

        if category_count == 0:
            return jsonify({'message': 'No categories to clear'}), 200

        # First, update all tasks to remove category associations
        tasks_updated = Task.query.filter(Task.category_id != None).count()
        Task.query.filter(Task.category_id != None).update({Task.category_id: None})

        # Then delete all categories
        Category.query.delete()
        db.session.commit()

        return jsonify({
            'message': f'Successfully cleared {category_count} categories',
            'categories_deleted': category_count,
            'tasks_updated': tasks_updated,
            'note': 'Tasks were preserved but category associations were removed',
            'timestamp': datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error clearing categories', 'error': str(e)}), 500

# Clear all data (tasks, categories, and reset settings)
@settings_bp.route('/data/clear-all', methods=['DELETE'])
def clear_all_data():
    """Clear all data and reset settings to defaults"""
    try:
        # Get counts before deletion
        task_count = Task.query.count()
        category_count = Category.query.count()

        # Delete all tasks
        Task.query.delete()

        # Delete all categories
        Category.query.delete()

        # Reset settings to defaults
        settings = Settings.query.first()
        if not settings:
            settings = Settings()
            db.session.add(settings)

        settings.theme = 'light'
        settings.font_size = 'medium'
        settings.notifications = True

        db.session.commit()

        return jsonify({
            'message': 'Successfully cleared all data and reset settings',
            'tasks_deleted': task_count,
            'categories_deleted': category_count,
            'settings_reset': True,
            'timestamp': datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error clearing all data', 'error': str(e)}), 500

# ----------------------------
# Data Statistics
# ----------------------------
@settings_bp.route('/data/stats', methods=['GET'])
def data_statistics():
    """Get statistics about current data in the system"""
    try:
        # Count all data
        total_tasks = Task.query.count()
        completed_tasks = Task.query.filter_by(status='Completed').count()
        pending_tasks = Task.query.filter_by(status='Pending').count()
        total_categories = Category.query.count()

        # Tasks without categories
        uncategorized_tasks = Task.query.filter_by(category_id=None).count()

        # Tasks with deadlines
        tasks_with_deadlines = Task.query.filter(Task.deadline != None).count()

        # Overdue tasks
        from datetime import datetime
        today = datetime.utcnow().date()
        overdue_tasks = Task.query.filter(
            Task.deadline != None,
            Task.deadline < today,
            Task.status == 'Pending'
        ).count()

        # Priority distribution
        high_priority = Task.query.filter_by(priority='High').count()
        medium_priority = Task.query.filter_by(priority='Medium').count()
        low_priority = Task.query.filter_by(priority='Low').count()

        # Database size estimation (approximate)
        database_stats = {
            'total_records': total_tasks + total_categories + 1,  # +1 for settings
            'storage_usage': 'lightweight'  # This would need actual DB size calculation
        }

        return jsonify({
            'task_statistics': {
                'total_tasks': total_tasks,
                'completed_tasks': completed_tasks,
                'pending_tasks': pending_tasks,
                'uncategorized_tasks': uncategorized_tasks,
                'tasks_with_deadlines': tasks_with_deadlines,
                'overdue_tasks': overdue_tasks,
                'completion_rate': round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 1)
            },
            'category_statistics': {
                'total_categories': total_categories,
                'categorized_tasks': total_tasks - uncategorized_tasks
            },
            'priority_distribution': {
                'high_priority': high_priority,
                'medium_priority': medium_priority,
                'low_priority': low_priority
            },
            'database_statistics': database_stats,
            'last_updated': datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        }), 200
    except Exception as e:
        return jsonify({'message': 'Error retrieving statistics', 'error': str(e)}), 500

# ----------------------------
# Backup Data (Export all data as JSON)
# ----------------------------
@settings_bp.route('/data/backup', methods=['GET'])
def backup_data():
    """Create a complete backup of all application data"""
    try:
        # Get all tasks
        tasks = Task.query.all()
        task_data = []
        for task in tasks:
            task_data.append({
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'category_id': task.category_id,
                'priority': task.priority,
                'deadline': task.deadline.isoformat() if task.deadline else None,
                'status': task.status,
                'created_at': task.created_at.isoformat() if task.created_at else None,
                'updated_at': task.updated_at.isoformat() if task.updated_at else None
            })

        # Get all categories
        categories = Category.query.all()
        category_data = []
        for category in categories:
            category_data.append({
                'id': category.id,
                'name': category.name
            })

        # Get settings
        settings = Settings.query.first()
        settings_data = {
            'theme': settings.theme if settings else 'light',
            'font_size': settings.font_size if settings else 'medium',
            'notifications': settings.notifications if settings else True
        }

        backup_data = {
            'backup_info': {
                'timestamp': datetime.utcnow().isoformat(),
                'version': '1.0',
                'total_tasks': len(task_data),
                'total_categories': len(category_data)
            },
            'tasks': task_data,
            'categories': category_data,
            'settings': settings_data
        }

        return jsonify(backup_data), 200
    except Exception as e:
        return jsonify({'message': 'Error creating backup', 'error': str(e)}), 500

# ----------------------------
# Data Management Confirmation
# ----------------------------
@settings_bp.route('/data/confirm-clear', methods=['POST'])
def confirm_clear_operation():
    """Confirm data clearing operation with additional validation"""
    data = request.get_json()
    operation = data.get('operation')  # 'tasks', 'categories', 'all'
    confirmation_code = data.get('confirmation_code')

    # Simple confirmation mechanism
    expected_code = f"CLEAR_{operation.upper()}_CONFIRM"

    if confirmation_code != expected_code:
        return jsonify({
            'message': 'Invalid confirmation code',
            'expected_format': f'{expected_code}',
            'operation_cancelled': True
        }), 400

    # Provide statistics before clearing
    task_count = Task.query.count()
    category_count = Category.query.count()

    return jsonify({
        'message': 'Confirmation successful',
        'operation': operation,
        'data_to_be_cleared': {
            'tasks': task_count if operation in ['tasks', 'all'] else 0,
            'categories': category_count if operation in ['categories', 'all'] else 0
        },
        'next_step': f'Call the appropriate clear endpoint to proceed',
        'warning': 'This operation cannot be undone. Consider creating a backup first.'
    }), 200
