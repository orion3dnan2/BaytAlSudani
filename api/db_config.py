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

def verify_token(request):
    """Verify API token from request headers"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return False
    
    try:
        token = auth_header.split(' ')[1]  # Bearer <token>
        expected_token = os.getenv('API_TOKEN', 'your-secret-api-token')
        return token == expected_token
    except IndexError:
        return False