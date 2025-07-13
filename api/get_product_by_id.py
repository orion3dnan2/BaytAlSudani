from flask import Flask, request, jsonify
from flask_cors import CORS
from db_config import get_db_connection, verify_token

app = Flask(__name__)
CORS(app)

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    if not verify_token(request):
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"status": "error", "message": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        
        # Get product details with store information
        cursor.execute("""
            SELECT p.*, s.name as storeName, s.category as storeCategory, 
                   s.address as storeAddress, s.phone as storePhone,
                   u.username as storeOwnerName, u.fullName as storeOwnerFullName
            FROM products p
            LEFT JOIN stores s ON p.storeId = s.id
            LEFT JOIN users u ON s.ownerId = u.id
            WHERE p.id = %s
        """, (product_id,))
        
        product = cursor.fetchone()
        
        if not product:
            return jsonify({"status": "error", "message": "Product not found"}), 404
        
        return jsonify({
            "status": "success",
            "message": "Product retrieved successfully",
            "data": product
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5008)