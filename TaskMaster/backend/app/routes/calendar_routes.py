# Calendar routes
from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from app.models import Task

calendar_bp = Blueprint('calendar', __name__)

# ----------------------------
# Get tasks for a specific date (query param: date=YYYY-MM-DD)
# ----------------------------
@calendar_bp.route('/', methods=['GET'])
def get_tasks_by_date():
    from flask import request
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({'message': 'Date query parameter is required (YYYY-MM-DD)'}), 400

    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400

    tasks = Task.query.filter(Task.deadline != None).all()
    tasks_on_date = [
        {
            'id': t.id,
            'title': t.title,
            'description': t.description,
            'category': t.category.name if t.category else None,
            'priority': t.priority,
            'deadline': t.deadline.strftime("%Y-%m-%d %H:%M:%S"),
            'status': t.status
        }
        for t in tasks
        if t.deadline.date() == date_obj
    ]

    return jsonify(tasks_on_date), 200


# ----------------------------
# Get tasks for the current week
# ----------------------------
@calendar_bp.route('/week', methods=['GET'])
def get_tasks_for_week():
    today = datetime.utcnow().date()
    week_end = today + timedelta(days=7)

    tasks = Task.query.filter(Task.deadline != None).all()
    tasks_this_week = [
        {
            'id': t.id,
            'title': t.title,
            'description': t.description,
            'category': t.category.name if t.category else None,
            'priority': t.priority,
            'deadline': t.deadline.strftime("%Y-%m-%d %H:%M:%S"),
            'status': t.status
        }
        for t in tasks
        if today <= t.deadline.date() <= week_end
    ]

    return jsonify(tasks_this_week), 200
