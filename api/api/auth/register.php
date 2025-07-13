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
    
    $required_fields = ['username', 'password', 'email', 'fullName'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field]) || empty(trim($input[$field]))) {
            http_response_code(400);
            echo json_encode(['error' => "Field '$field' is required"]);
            exit;
        }
    }

    $username = trim($input['username']);
    $password = $input['password'];
    $email = trim($input['email']);
    $fullName = trim($input['fullName']);
    $phone = trim($input['phone'] ?? '');
    $role = $input['role'] ?? 'customer';

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email format']);
        exit;
    }

    // Get database connection
    $pdo = getDatabaseConnection();

    // Check if username already exists
    $stmt = $pdo->prepare("SELECT id FROM legacy_users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'Username already exists']);
        exit;
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM legacy_users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'Email already exists']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $pdo->prepare("INSERT INTO legacy_users (username, password, email, full_name, phone, role, is_active) 
                          VALUES (?, ?, ?, ?, ?, ?, true) RETURNING id, created_at");
    $stmt->execute([$username, $hashedPassword, $email, $fullName, $phone, $role]);
    $newUser = $stmt->fetch();

    // Generate token
    $token = bin2hex(random_bytes(32));

    // Return success response
    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $newUser['id'],
            'username' => $username,
            'email' => $email,
            'fullName' => $fullName,
            'role' => $role,
            'phone' => $phone,
            'isActive' => true,
            'createdAt' => $newUser['created_at']
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>