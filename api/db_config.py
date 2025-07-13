import os
import pymysql
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    """Get MySQL database connection"""
    try:
        connection = pymysql.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASS', ''),
            database=os.getenv('DB_NAME', 'sudanese_marketplace'),
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        return connection
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

# JWT authentication is now handled by auth_utils.py
# This function has been removed in favor of JWT-based authentication