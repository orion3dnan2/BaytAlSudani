from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Import all API endpoints
from login import app as login_app
from register import app as register_app
from create_store import app as create_store_app
from get_stores import app as get_stores_app
from get_store_by_id import app as get_store_by_id_app
from create_product import app as create_product_app
from get_products import app as get_products_app
from get_product_by_id import app as get_product_by_id_app
from create_service import app as create_service_app
from get_services import app as get_services_app
from create_job import app as create_job_app
from get_jobs import app as get_jobs_app
from create_announcement import app as create_announcement_app
from get_announcements import app as get_announcements_app

load_dotenv()

# Create main Flask app
app = Flask(__name__)
CORS(app)

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

# Register all blueprints/routes from individual files
# Note: This is a simplified approach. In production, you'd use Flask blueprints
def register_routes():
    # Copy routes from individual apps to main app
    for rule in login_app.url_map.iter_rules():
        if rule.endpoint != 'static':
            app.add_url_rule(rule.rule, rule.endpoint + '_login', 
                           login_app.view_functions[rule.endpoint], 
                           methods=rule.methods)
    
    for rule in register_app.url_map.iter_rules():
        if rule.endpoint != 'static':
            app.add_url_rule(rule.rule, rule.endpoint + '_register', 
                           register_app.view_functions[rule.endpoint], 
                           methods=rule.methods)
    
    for rule in create_store_app.url_map.iter_rules():
        if rule.endpoint != 'static':
            app.add_url_rule(rule.rule, rule.endpoint + '_create_store', 
                           create_store_app.view_functions[rule.endpoint], 
                           methods=rule.methods)
    
    for rule in get_stores_app.url_map.iter_rules():
        if rule.endpoint != 'static':
            app.add_url_rule(rule.rule, rule.endpoint + '_get_stores', 
                           get_stores_app.view_functions[rule.endpoint], 
                           methods=rule.methods)

if __name__ == '__main__':
    # register_routes()  # Uncomment if you want to merge all routes
    port = int(os.getenv('API_PORT', 5000))
    debug = os.getenv('DEBUG', 'true').lower() == 'true'
    app.run(debug=debug, port=port, host='0.0.0.0')