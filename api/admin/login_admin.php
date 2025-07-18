<?php
session_start();

// If already logged in, redirect to dashboard
if (isset($_SESSION['admin_id'])) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

// Handle login form submission
if ($_POST) {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = 'جميع الحقول مطلوبة';
    } else {
        // Include database connection
        require_once '../api/config/database.php';
        
        try {
            $pdo = new PDO($dsn, $db_user, $db_password, $options);
            
            // Check user credentials
            $stmt = $pdo->prepare("SELECT id, username, password, role FROM legacy_users WHERE username = ? AND role = 'admin' AND is_active = true");
            $stmt->execute([$username]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password'])) {
                // Login successful
                $_SESSION['admin_id'] = $user['id'];
                $_SESSION['admin_username'] = $user['username'];
                $_SESSION['admin_role'] = $user['role'];
                
                header('Location: dashboard.php');
                exit;
            } else {
                $error = 'اسم المستخدم أو كلمة المرور غير صحيحة';
            }
        } catch (PDOException $e) {
            $error = 'خطأ في الاتصال بقاعدة البيانات';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول - لوحة التحكم الإدارية</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            padding: 2rem;
            width: 100%;
            max-width: 400px;
        }
        .logo {
            text-align: center;
            margin-bottom: 2rem;
        }
        .logo i {
            font-size: 3rem;
            color: #1e3c72;
            margin-bottom: 1rem;
        }
        .form-control {
            border-radius: 10px;
            padding: 12px 15px;
            border: 2px solid #e9ecef;
            transition: all 0.3s ease;
        }
        .form-control:focus {
            border-color: #1e3c72;
            box-shadow: 0 0 0 0.2rem rgba(30, 60, 114, 0.25);
        }
        .btn-login {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            border: none;
            border-radius: 10px;
            padding: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .alert {
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="logo">
            <i class="fas fa-shield-alt"></i>
            <h3 class="fw-bold text-primary">لوحة التحكم الإدارية</h3>
            <p class="text-muted">البيت السوداني</p>
        </div>

        <?php if ($error): ?>
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="">
            <div class="mb-3">
                <label for="username" class="form-label">
                    <i class="fas fa-user me-2"></i>
                    اسم المستخدم
                </label>
                <input type="text" class="form-control" id="username" name="username" required 
                       value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>">
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">
                    <i class="fas fa-lock me-2"></i>
                    كلمة المرور
                </label>
                <input type="password" class="form-control" id="password" name="password" required>
            </div>

            <button type="submit" class="btn btn-primary btn-login w-100">
                <i class="fas fa-sign-in-alt me-2"></i>
                تسجيل الدخول
            </button>
        </form>

        <div class="text-center mt-3">
            <small class="text-muted">
                <i class="fas fa-info-circle me-1"></i>
                للمديرين المخولين فقط
            </small>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>