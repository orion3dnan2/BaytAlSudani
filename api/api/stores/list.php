<?php
header("Content-Type: application/json");
require_once '../config/cors.php';
require_once '../config/database.php';

try {
    // Allow GET requests
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }

    // Get query parameters
    $category = $_GET['category'] ?? '';
    $ownerId = $_GET['owner_id'] ?? '';
    $isActive = $_GET['is_active'] ?? 'true';

    // Get database connection
    $pdo = getDatabaseConnection();

    // Build query
    $query = "SELECT id, name, description, owner_id, category, address, phone, is_active, created_at FROM stores WHERE 1=1";
    $params = [];

    if (!empty($category)) {
        $query .= " AND category = ?";
        $params[] = $category;
    }

    if (!empty($ownerId)) {
        $query .= " AND owner_id = ?";
        $params[] = $ownerId;
    }

    if ($isActive === 'true') {
        $query .= " AND is_active = true";
    }

    $query .= " ORDER BY created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $stores = $stmt->fetchAll();

    // Return stores
    echo json_encode([
        'success' => true,
        'data' => $stores
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>