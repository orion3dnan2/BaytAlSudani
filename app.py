import os
import sys
import psycopg2
import psycopg2.extras
import bcrypt
import jwt
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# Create Flask app
app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback-secret-key")

# Database connection
def get_db_connection():
    """Get PostgreSQL database connection"""
    try:
        connection = psycopg2.connect(
            os.environ.get('DATABASE_URL'),
            cursor_factory=psycopg2.extras.DictCursor
        )
        return connection
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def init_database():
    """Initialize database tables"""
    connection = get_db_connection()
    if not connection:
        return False
    
    try:
        cursor = connection.cursor()
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                full_name VARCHAR(100),
                phone VARCHAR(20),
                role VARCHAR(20) DEFAULT 'customer',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create stores table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS stores (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                owner_id INTEGER REFERENCES users(id),
                category VARCHAR(50),
                address TEXT,
                phone VARCHAR(20),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create products table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10,2),
                store_id INTEGER REFERENCES stores(id),
                category VARCHAR(50),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create services table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS services (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10,2),
                store_id INTEGER REFERENCES stores(id),
                category VARCHAR(50),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create jobs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT,
                salary DECIMAL(10,2),
                location VARCHAR(100),
                store_id INTEGER REFERENCES stores(id),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create announcements table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS announcements (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                content TEXT NOT NULL,
                store_id INTEGER REFERENCES stores(id),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        connection.commit()
        cursor.close()
        connection.close()
        return True
        
    except Exception as e:
        print(f"Database initialization error: {e}")
        connection.rollback()
        cursor.close()
        connection.close()
        return False

# JWT utilities
def encode_jwt(payload):
    """Encode a JWT token with the given payload"""
    secret = os.environ.get('JWT_SECRET', 'default-secret-key')
    payload['exp'] = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode(payload, secret, algorithm='HS256')

def decode_jwt(token):
    """Decode a JWT token and return the payload"""
    secret = os.environ.get('JWT_SECRET', 'default-secret-key')
    try:
        return jwt.decode(token, secret, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")

# Initialize database
with app.app_context():
    init_database()

# Routes
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "success",
        "message": "Welcome to Bayt AlSudani - Sudanese Marketplace API",
        "version": "1.0.0",
        "documentation": "/api/docs",
        "health": "/api/health"
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "success",
        "message": "Bayt AlSudani API is running",
        "version": "1.0.0"
    })

@app.route('/api/docs', methods=['GET'])
def api_docs():
    return jsonify({
        "status": "success",
        "message": "Bayt AlSudani API Documentation",
        "endpoints": {
            "authentication": {
                "POST /api/login": "User login",
                "POST /api/register": "User registration"
            },
            "stores": {
                "GET /api/stores": "Get all stores",
                "GET /api/stores/<id>": "Get store by ID",
                "POST /api/stores": "Create new store"
            },
            "products": {
                "GET /api/products": "Get all products",
                "GET /api/products/<id>": "Get product by ID",
                "POST /api/products": "Create new product"
            },
            "services": {
                "GET /api/services": "Get all services",
                "POST /api/services": "Create new service"
            },
            "jobs": {
                "GET /api/jobs": "Get all jobs",
                "POST /api/jobs": "Create new job"
            },
            "announcements": {
                "GET /api/announcements": "Get all announcements",
                "POST /api/announcements": "Create new announcement"
            }
        }
    })

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"status": "error", "message": "Username and password required"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s", (data['username'],))
        user = cursor.fetchone()
        
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password_hash'].encode('utf-8')):
            # Generate JWT token
            payload = {
                'user_id': user['id'],
                'username': user['username'],
                'role': user['role'],
                'full_name': user['full_name']
            }
            token = encode_jwt(payload)
            
            return jsonify({
                "status": "success",
                "message": "Login successful",
                "token": token,
                "user": {
                    "id": user['id'],
                    "username": user['username'],
                    "email": user['email'],
                    "fullName": user['full_name'],
                    "role": user['role']
                }
            })
        else:
            return jsonify({"status": "error", "message": "Invalid credentials"}), 401
            
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    required_fields = ['username', 'email', 'password', 'fullName']
    
    if not data or not all(data.get(field) for field in required_fields):
        return jsonify({"status": "error", "message": "All fields are required"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE username = %s OR email = %s", 
                      (data['username'], data['email']))
        if cursor.fetchone():
            return jsonify({"status": "error", "message": "User already exists"}), 400
        
        # Hash password
        password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Insert new user
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, full_name, phone, role)
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
        """, (data['username'], data['email'], password_hash, 
              data['fullName'], data.get('phone', ''), data.get('role', 'customer')))
        
        user_id = cursor.fetchone()['id']
        connection.commit()
        
        return jsonify({
            "status": "success",
            "message": "User registered successfully",
            "user_id": user_id
        })
        
    except Exception as e:
        connection.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/stores', methods=['GET'])
def get_stores():
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM stores WHERE is_active = TRUE ORDER BY created_at DESC")
        stores = cursor.fetchall()
        
        return jsonify({
            "status": "success",
            "stores": [dict(store) for store in stores]
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/products', methods=['GET'])
def get_products():
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC")
        products = cursor.fetchall()
        
        return jsonify({
            "status": "success",
            "products": [dict(product) for product in products]
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/services', methods=['GET'])
def get_services():
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM services WHERE is_active = TRUE ORDER BY created_at DESC")
        services = cursor.fetchall()
        
        return jsonify({
            "status": "success",
            "services": [dict(service) for service in services]
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM jobs WHERE is_active = TRUE ORDER BY created_at DESC")
        jobs = cursor.fetchall()
        
        return jsonify({
            "status": "success",
            "jobs": [dict(job) for job in jobs]
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM announcements WHERE is_active = TRUE ORDER BY created_at DESC")
        announcements = cursor.fetchall()
        
        return jsonify({
            "status": "success",
            "announcements": [dict(announcement) for announcement in announcements]
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)