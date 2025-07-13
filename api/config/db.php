<?php
/**
 * Database Configuration and Connection
 * يتم استخدام متغيرات البيئة أولاً، ثم القيم الافتراضية
 */

// إعدادات قاعدة البيانات من متغيرات البيئة أو القيم الافتراضية
$db_host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'localhost';
$db_name = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'sudanese_marketplace';
$db_user = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'root';
$db_pass = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: '';
$db_port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: 3306;

// محاولة الاتصال بقاعدة البيانات
try {
    $connection = new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);
    
    // تعيين الترميز إلى UTF-8 لدعم اللغة العربية
    $connection->set_charset("utf8mb4");
    
    // فحص الاتصال
    if ($connection->connect_error) {
        throw new Exception("فشل الاتصال بقاعدة البيانات: " . $connection->connect_error);
    }
    
} catch (Exception $e) {
    // في حالة فشل الاتصال، إرجاع رسالة خطأ بصيغة JSON
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'خطأ في الاتصال بقاعدة البيانات',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * دالة لتنظيف المدخلات وحمايتها من SQL Injection
 */
function sanitize_input($data) {
    global $connection;
    return $connection->real_escape_string(trim($data));
}

/**
 * دالة لإرجاع استجابة JSON موحدة
 */
function json_response($success, $message, $data = null, $http_code = 200) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($http_code);
    
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * دالة للتحقق من صحة التوكن (يمكن تطويرها لاحقاً)
 */
function verify_token($token) {
    // يمكن تطوير هذه الدالة لاستخدام JWT أو نظام توكن آخر
    return !empty($token) && $token === ($_ENV['API_TOKEN'] ?? 'default_token_123');
}

/**
 * دالة للتحقق من صحة البريد الإلكتروني
 */
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}
?>