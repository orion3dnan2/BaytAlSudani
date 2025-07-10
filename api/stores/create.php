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
    
    $required_fields = ['name', 'ownerId', 'category'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            http_response_code(400);
            echo json_encode(['error' => "Field '$field' is required"]);
            exit;
        }
    }

    $name = trim($input['name']);
    $description = trim($input['description'] ?? '');
    $ownerId = $input['ownerId'];
    $category = trim($input['category']);
    $address = trim($input['address'] ?? '');
    $phone = trim($input['phone'] ?? '');

    // Get database connection
    $pdo = getDatabaseConnection();

    // Insert new store
    $stmt = $pdo->prepare("INSERT INTO stores (name, description, owner_id, category, address, phone, is_active) 
                          VALUES (?, ?, ?, ?, ?, ?, true) RETURNING id, created_at");
    $stmt->execute([$name, $description, $ownerId, $category, $address, $phone]);
    $newStore = $stmt->fetch();

    // Return success response
    echo json_encode([
        'success' => true,
        'data' => [
            'id' => $newStore['id'],
            'name' => $name,
            'description' => $description,
            'owner_id' => $ownerId,
            'category' => $category,
            'address' => $address,
            'phone' => $phone,
            'is_active' => true,
            'created_at' => $newStore['created_at']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>