import os
import sys
import json
import time
import hashlib
import logging
import inspect
from typing import Dict, Any, List, Optional, Callable, Union
from datetime import datetime, timedelta
from functools import wraps, lru_cache
from pathlib import Path
from logging.handlers import RotatingFileHandler
import re
import random
import string

def setup_logging():
    """Setup application logging"""
    
    # Create logs directory if it doesn't exist
    logs_dir = 'logs'
    if not os.path.exists(logs_dir):
        os.makedirs(logs_dir)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(os.path.join(logs_dir, 'app.log')),
            logging.StreamHandler()
        ]
    )
    
    return logging.getLogger(__name__)

def rate_limiter(max_requests: int = 100, window_seconds: int = 3600):
    """Rate limiter decorator"""
    requests = {}
    
    def decorator(func):
        @wraps(func)
        def wrapper(api_key: str, *args, **kwargs):
            current_time = time.time()
            
            # Clean old entries
            keys_to_delete = []
            for key, (count, timestamp) in requests.items():
                if current_time - timestamp > window_seconds:
                    keys_to_delete.append(key)
            
            for key in keys_to_delete:
                del requests[key]
            
            # Check rate limit
            if api_key in requests:
                count, timestamp = requests[api_key]
                if current_time - timestamp < window_seconds and count >= max_requests:
                    return False
                requests[api_key] = (count + 1, current_time)
            else:
                requests[api_key] = (1, current_time)
            
            return True
        return wrapper
    return decorator

def validate_api_key(api_key: Optional[str], valid_key: str) -> bool:
    """Validate API key"""
    if not api_key or not valid_key:
        return False
    return api_key == valid_key

def sanitize_text(text: str) -> str:
    """Sanitize input text"""
    if not text:
        return ""
    
    # Remove excessive whitespace
    text = ' '.join(text.strip().split())
    
    # Optional: Remove potentially harmful characters
    # text = re.sub(r'[<>{}[\]]', '', text)
    
    return text

def generate_session_id(length: int = 16) -> str:
    """Generate a random session ID"""
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def format_timestamp(timestamp: Optional[float] = None) -> str:
    """Format timestamp to readable string"""
    if timestamp is None:
        timestamp = time.time()
    return datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

def safe_json_loads(json_str: str, default: Any = None) -> Any:
    """Safely parse JSON string"""
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return default

def calculate_confidence_score(keywords_found: List[str], total_keywords: int) -> float:
    """Calculate confidence score for scam detection"""
    score = len(keywords_found) / total_keywords
    return min(score, 1.0)

def is_valid_url(url: str) -> bool:
    """Check if string is a valid URL"""
    pattern = re.compile(
        r'^(https?://)?'  # http:// or https://
        r'([A-Z0-9-]+\.)+[A-Z]{2,}'  # domain
        r'(:\d+)?'  # port
        r'(/.*)?$',  # path
        re.IGNORECASE
    )
    return bool(pattern.match(url))

def mask_sensitive_info(text: str) -> str:
    """Mask sensitive information like phone numbers, emails"""
    # Mask phone numbers (Indian format)
    text = re.sub(r'\b\d{10}\b', 'XXXXXXXXXX', text)
    # Mask email addresses
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '***@***.***', text)
    return text