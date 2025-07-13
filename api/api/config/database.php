<?php
// Database configuration
$db_host = $_ENV['DB_HOST'] ?? 'localhost';
$db_port = $_ENV['DB_PORT'] ?? '5432';
$db_name = $_ENV['DB_NAME'] ?? 'sudanese_marketplace';
$db_user = $_ENV['DB_USER'] ?? 'postgres';
$db_password = $_ENV['DB_PASSWORD'] ?? '';

// DSN for PostgreSQL
$dsn = "pgsql:host=$db_host;port=$db_port;dbname=$db_name;charset=utf8";

// PDO options
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

// Test connection function
function testDatabaseConnection() {
    global $dsn, $db_user, $db_password, $options;
    
    try {
        $pdo = new PDO($dsn, $db_user, $db_password, $options);
        return ['status' => 'connected', 'message' => 'Database connected successfully'];
    } catch (PDOException $e) {
        return ['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()];
    }
}

// Get database connection
function getDatabaseConnection() {
    global $dsn, $db_user, $db_password, $options;
    
    try {
        return new PDO($dsn, $db_user, $db_password, $options);
    } catch (PDOException $e) {
        throw new Exception('Database connection failed: ' . $e->getMessage());
    }
}
?>