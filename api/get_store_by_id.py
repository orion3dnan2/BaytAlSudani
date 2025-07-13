from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection, verify_token

app = Flask(__name__)
CORS(app)

@app.route('/api/stores/<int:store_id>', methods=['GET'])
def get_store_by_id(store_id):
    if not verify_token(request):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Get store details with owner information
        cursor.execute("""
            SELECT s.*, u.username as ownerName, u.fullName as ownerFullName, u.email as ownerEmail
            FROM stores s
            LEFT JOIN users u ON s.ownerId = u.id
            WHERE s.id = %s
        """, (store_id,))
        
        store = cursor.fetchone()
        
        if not store:
            return jsonify({"status": "error", "message": "Store not found"}), 404
        
        # Get store statistics
        cursor.execute("SELECT COUNT(*) as count FROM products WHERE storeId = %s AND isActive = 1", (store_id,))
        products_count = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM services WHERE storeId = %s AND isActive = 1", (store_id,))
        services_count = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM jobs WHERE storeId = %s AND isActive = 1", (store_id,))
        jobs_count = cursor.fetchone()['count']
        
        cursor.execute("SELECT COUNT(*) as count FROM announcements WHERE storeId = %s AND isActive = 1", (store_id,))
        announcements_count = cursor.fetchone()['count']
        
        # Add statistics to store data
        store['statistics'] = {
            'products': products_count,
            'services': services_count,
            'jobs': jobs_count,
            'announcements': announcements_count
        }
        
        return jsonify({
            "status": "success",
            "message": "Store retrieved successfully",
            "data": store
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5005)