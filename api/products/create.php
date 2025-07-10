<?php
header("Content-Type: application/json");
require_once '../config/cors.php';
require_once '../config/database.php';

try {
    // Only allow POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    $required_fields = ['name', 'price', 'storeId', 'category'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || (is_string($input[$field]) && empty(trim($input[$field])))) {
            http_response_code(400);
            echo json_encode(['error' => "Field '$field' is required"]);
            exit;
        }
    }

    $name = trim($input['name']);
    $description = trim($input['description'] ?? '');
    $price = $input['price'];
    $storeId = $input['storeId'];
    $category = trim($input['category']);

    // Validate price
    if (!is_numeric($price) || $price < 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Price must be a valid positive number']);
        exit;
    }

    // Get database connection
    $pdo = getDatabaseConnection();

    // Insert new product
    $stmt = $pdo->prepare("INSERT INTO products (name, description, price, store_id, category, is_active) 
                          VALUES (?, ?, ?, ?, ?, true) RETURNING id, created_at");
    $stmt->execute([$name, $description, $price, $storeId, $category]);
    $newProduct = $stmt->fetch();

    // Return success response
    echo json_encode([
        'success' => true,
        'data' => [
            'id' => $newProduct['id'],
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'store_id' => $storeId,
            'category' => $category,
            'is_active' => true,
            'created_at' => $newProduct['created_at']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>