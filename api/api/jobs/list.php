<?php
header("Content-Type: application/json");
require_once '../config/cors.php';
require_once '../config/database.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }

    $storeId = $_GET['store_id'] ?? '';
    $isActive = $_GET['is_active'] ?? 'true';

    $pdo = getDatabaseConnection();

    $query = "SELECT j.id, j.title, j.description, j.salary, j.location, j.store_id, j.is_active, j.created_at,
                     s.name as store_name 
              FROM jobs j 
              LEFT JOIN stores s ON j.store_id = s.id 
              WHERE 1=1";
    $params = [];

    if (!empty($storeId)) {
        $query .= " AND j.store_id = ?";
        $params[] = $storeId;
    }

    if ($isActive === 'true') {
        $query .= " AND j.is_active = true";
    }

    $query .= " ORDER BY j.created_at DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $jobs = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $jobs
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>