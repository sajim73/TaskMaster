# Task service - FIXED VERSION
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
# Create a new task - FIXED FUNCTION
# ----------------------------
def create_task(title, description=None, category_id=None, priority='Medium', deadline=None):
    """FIXED: Accept category_id instead of category_name to match routes"""
    
    # Validate category_id if provided
    category = None
    if category_id:
        category = Category.query.get(category_id)
        if not category:
            raise ValueError(f"Category with ID {category_id} not found")
    
    # Parse deadline if string
    if isinstance(deadline, str):
        try:
            deadline = datetime.strptime(deadline, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            # Try alternative format
            try:
                deadline = datetime.strptime(deadline, "%Y-%m-%d")
            except ValueError:
                raise ValueError("Invalid date format. Use YYYY-MM-DD or YYYY-MM-DD HH:MM:SS")
    
    task = Task(
        title=title,
        description=description,
        category_id=category_id,
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
    
    # Handle deadline parsing if provided as string
    if 'deadline' in kwargs and isinstance(kwargs['deadline'], str):
        try:
            kwargs['deadline'] = datetime.strptime(kwargs['deadline'], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            try:
                kwargs['deadline'] = datetime.strptime(kwargs['deadline'], "%Y-%m-%d")
            except ValueError:
                raise ValueError("Invalid date format. Use YYYY-MM-DD or YYYY-MM-DD HH:MM:SS")
    
    # Validate category_id if provided
    if 'category_id' in kwargs and kwargs['category_id'] is not None:
        category = Category.query.get(kwargs['category_id'])
        if not category:
            raise ValueError(f"Category with ID {kwargs['category_id']} not found")
    
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
