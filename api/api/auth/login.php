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
    
    if (!$input || !isset($input['username']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password are required']);
        exit;
    }

    $username = trim($input['username']);
    $password = $input['password'];

    // Get database connection
    $pdo = getDatabaseConnection();

    // Find user by username or email
    $stmt = $pdo->prepare("SELECT id, username, password, email, full_name, role, phone, is_active, created_at 
                          FROM legacy_users 
                          WHERE (username = ? OR email = ?) AND is_active = true");
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid username or password']);
        exit;
    }

    // Verify password
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid username or password']);
        exit;
    }

    // Generate a simple token (in production, use JWT)
    $token = bin2hex(random_bytes(32));
    
    // Store token in database (you might want to create a tokens table)
    // For now, we'll just return user data

    // Return success response
    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'fullName' => $user['full_name'],
            'role' => $user['role'],
            'phone' => $user['phone'],
            'isActive' => $user['is_active'],
            'createdAt' => $user['created_at']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>