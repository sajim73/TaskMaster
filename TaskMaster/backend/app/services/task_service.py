# Task service
from datetime import datetime
from app import db
from app.models import Task, Category

# ----------------------------
# Get all tasks
# ----------------------------
def get_all_tasks():
    return Task.query.all()


# ----------------------------
# Get task by ID
# ----------------------------
def get_task_by_id(task_id):
    task = Task.query.get(task_id)
    if not task:
        return None
    return task


# ----------------------------
# Create a new task
# ----------------------------
def create_task(title, description=None, category_name=None, priority='Medium', deadline=None):
    # Find or create category
    category = None
    if category_name:
        category = Category.query.filter_by(name=category_name).first()
        if not category:
            category = Category(name=category_name)
            db.session.add(category)
            db.session.commit()

    # Parse deadline if string
    if isinstance(deadline, str):
        deadline = datetime.strptime(deadline, "%Y-%m-%d %H:%M:%S")

    task = Task(
        title=title,
        description=description,
        category_id=category.id if category else None,
        priority=priority,
        deadline=deadline
    )
    db.session.add(task)
    db.session.commit()
    return task


# ----------------------------
# Update existing task
# ----------------------------
def update_task(task_id, **kwargs):
    task = Task.query.get(task_id)
    if not task:
        return None

    for key, value in kwargs.items():
        if hasattr(task, key):
            setattr(task, key, value)
    task.updated_at = datetime.utcnow()
    db.session.commit()
    return task


# ----------------------------
# Delete a task
# ----------------------------
def delete_task(task_id):
    task = Task.query.get(task_id)
    if not task:
        return False
    db.session.delete(task)
    db.session.commit()
    return True
