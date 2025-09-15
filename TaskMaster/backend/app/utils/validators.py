# Validators
from datetime import datetime

def validate_date(date_str):
    """
    Validate date string format YYYY-MM-DD or YYYY-MM-DD HH:MM:SS
    """
    try:
        if len(date_str) == 10:
            datetime.strptime(date_str, "%Y-%m-%d")
        else:
            datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
        return True
    except ValueError:
        return False
