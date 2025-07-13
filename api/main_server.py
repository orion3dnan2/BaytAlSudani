from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db_config import init_database

# Import all API endpoint functions
from login import login
from register import register
from create_store import create_store
from get_stores import get_stores
from get_store_by_id import get_store_by_id
from create_product import create_product
from get_products import get_products
from get_product_by_id import get_product_by_id
from create_service import create_service
from get_services import get_services
from create_job import create_job
from get_jobs import get_jobs
from create_announcement import create_announcement
from get_announcements import get_announcements

load_dotenv()

# Create main Flask app
app = Flask(__name__)
CORS(app)
app.secret_key = os.environ.get("SESSION_SECRET", "fallback-secret-key")

# Initialize database
with app.app_context():
    init_database()

# Root endpoint
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "status": "success",
        "message": "Welcome to Bayt AlSudani - Sudanese Marketplace API",
        "version": "1.0.0",
        "documentation": "/api/docs",
        "health": "/api/health"
    })

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "success",
        "message": "Bayt AlSudani API is running",
        "version": "1.0.0"
    })

# API Documentation endpoint
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

# Register all API endpoints
app.add_url_rule('/api/login', 'login', login, methods=['POST'])
app.add_url_rule('/api/register', 'register', register, methods=['POST'])
app.add_url_rule('/api/stores', 'create_store', create_store, methods=['POST'])
app.add_url_rule('/api/stores', 'get_stores', get_stores, methods=['GET'])
app.add_url_rule('/api/stores/<int:store_id>', 'get_store_by_id', get_store_by_id, methods=['GET'])
app.add_url_rule('/api/products', 'create_product', create_product, methods=['POST'])
app.add_url_rule('/api/products', 'get_products', get_products, methods=['GET'])
app.add_url_rule('/api/products/<int:product_id>', 'get_product_by_id', get_product_by_id, methods=['GET'])
app.add_url_rule('/api/services', 'create_service', create_service, methods=['POST'])
app.add_url_rule('/api/services', 'get_services', get_services, methods=['GET'])
app.add_url_rule('/api/jobs', 'create_job', create_job, methods=['POST'])
app.add_url_rule('/api/jobs', 'get_jobs', get_jobs, methods=['GET'])
app.add_url_rule('/api/announcements', 'create_announcement', create_announcement, methods=['POST'])
app.add_url_rule('/api/announcements', 'get_announcements', get_announcements, methods=['GET'])

if __name__ == '__main__':
    port = int(os.getenv('API_PORT', 5000))
    debug = os.getenv('DEBUG', 'true').lower() == 'true'
    app.run(debug=debug, port=port, host='0.0.0.0')