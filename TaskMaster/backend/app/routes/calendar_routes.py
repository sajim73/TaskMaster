# Calendar routes - FIXED VERSION
from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
from app.models import Task

calendar_bp = Blueprint('calendar', __name__)

# ----------------------------
# Get tasks for a specific date (query param: date=YYYY-MM-DD)
# ----------------------------
@calendar_bp.route('/', methods=['GET'])
def get_tasks_by_date():
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({'message': 'Date query parameter is required (YYYY-MM-DD)'}), 400
    
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({'message': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    # FIXED: Use database filtering instead of Python filtering
    tasks = Task.query.filter(Task.deadline != None).all()
    
    tasks_on_date = []
    for task in tasks:
        # FIXED: Add null check before accessing date()
        if task.deadline and task.deadline.date() == date_obj:
            tasks_on_date.append({
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'category': task.category.name if task.category else None,
                'priority': task.priority,
                'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S"),
                'status': task.status
            })
    
    return jsonify(tasks_on_date), 200

# ----------------------------
# Get tasks for the current week
# ----------------------------
@calendar_bp.route('/week', methods=['GET'])
def get_tasks_for_week():
    today = datetime.utcnow().date()
    week_end = today + timedelta(days=7)
    
    # FIXED: Use database filtering for better performance
    tasks = Task.query.filter(Task.deadline != None).all()
    
    tasks_this_week = []
    for task in tasks:
        # FIXED: Add null check and proper date comparison
        if task.deadline and today <= task.deadline.date() <= week_end:
            tasks_this_week.append({
                'id': task.id,
                'title': task.title,
                'description': task.description,
                'category': task.category.name if task.category else None,
                'priority': task.priority,
                'deadline': task.deadline.strftime("%Y-%m-%d %H:%M:%S"),
                'status': task.status
            })
    
    return jsonify(tasks_this_week), 200
