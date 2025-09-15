# Report routes
from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from app.models import Task

report_bp = Blueprint('reports', __name__)

# ----------------------------
# Weekly report (tasks due this week)
# ----------------------------
@report_bp.route('/weekly', methods=['GET'])
def weekly_report():
    today = datetime.utcnow().date()
    week_end = today + timedelta(days=7)

    tasks = Task.query.filter(Task.deadline != None).all()
    weekly_tasks = [
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

    return jsonify({
        'week_start': today.strftime("%Y-%m-%d"),
        'week_end': week_end.strftime("%Y-%m-%d"),
        'tasks': weekly_tasks,
        'total_tasks': len(weekly_tasks)
    }), 200


# ----------------------------
# Monthly report (tasks due this month)
# ----------------------------
@report_bp.route('/monthly', methods=['GET'])
def monthly_report():
    today = datetime.utcnow().date()
    month_end = (today.replace(day=1) + timedelta(days=32)).replace(day=1) - timedelta(days=1)

    tasks = Task.query.filter(Task.deadline != None).all()
    monthly_tasks = [
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
        if today <= t.deadline.date() <= month_end
    ]

    return jsonify({
        'month_start': today.replace(day=1).strftime("%Y-%m-%d"),
        'month_end': month_end.strftime("%Y-%m-%d"),
        'tasks': monthly_tasks,
        'total_tasks': len(monthly_tasks)
    }), 200
