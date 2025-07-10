# دليل استخدام API - البيت السوداني

## نظرة عامة
هذا المشروع يحتوي على مجموعة من APIs المكتوبة بلغة PHP للتواصل مع قاعدة بيانات MySQL لنظام السوق السوداني.

## إعداد قاعدة البيانات

### متغيرات البيئة
يمكنك تعيين متغيرات البيئة التالية في Replit:

```
DB_HOST=localhost
DB_NAME=sudanese_marketplace
DB_USER=root
DB_PASS=your_password
DB_PORT=3306
API_TOKEN=your_secure_token_here
```

### جدول المستخدمين المطلوب
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'merchant', 'customer') DEFAULT 'customer',
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);
```

## الـ APIs المتاحة

### 1. تسجيل الدخول
**Endpoint:** `POST /api/login.php`

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "user_password"
}
```

**Response (نجح):**
```json
{
    "success": true,
    "message": "تم تسجيل الدخول بنجاح",
    "data": {
        "id": 1,
        "name": "اسم المستخدم",
        "email": "user@example.com",
        "role": "customer",
        "is_active": "1",
        "created_at": "2024-01-01 10:00:00",
        "token": "encoded_token_here",
        "login_time": "2024-01-01 15:30:00"
    }
}
```

**Response (فشل):**
```json
{
    "success": false,
    "message": "البريد الإلكتروني أو كلمة المرور غير صحيحة"
}
```

**مثال cURL:**
```bash
curl -X POST http://your-replit-url/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

---

### 2. تسجيل مستخدم جديد
**Endpoint:** `POST /api/register.php`

**Request Body:**
```json
{
    "name": "اسم المستخدم",
    "email": "user@example.com",
    "password": "password123",
    "role": "customer",
    "phone": "1234567890"
}
```

**Response (نجح):**
```json
{
    "success": true,
    "message": "تم تسجيل المستخدم بنجاح",
    "data": {
        "id": 2,
        "name": "اسم المستخدم",
        "email": "user@example.com",
        "role": "customer",
        "phone": "1234567890",
        "is_active": true,
        "created_at": "2024-01-01 15:30:00"
    }
}
```

**مثال cURL:**
```bash
curl -X POST http://your-replit-url/api/register.php \
  -H "Content-Type: application/json" \
  -d '{"name":"أحمد محمد","email":"ahmed@example.com","password":"123456","role":"customer"}'
```

---

### 3. الحصول على قائمة المستخدمين
**Endpoint:** `GET /api/get_users.php`

**Headers:**
```
Authorization: Bearer your_token_here
```

**Query Parameters (اختيارية):**
- `page`: رقم الصفحة (افتراضي: 1)
- `limit`: عدد النتائج في الصفحة (افتراضي: 10, أقصى: 100)
- `search`: البحث في الاسم أو البريد الإلكتروني
- `role`: تصفية حسب الدور (admin, merchant, customer)

**Response:**
```json
{
    "success": true,
    "message": "تم جلب قائمة المستخدمين بنجاح",
    "data": {
        "users": [
            {
                "id": 1,
                "name": "المدير",
                "email": "admin@example.com",
                "role": "admin",
                "is_active": "1",
                "created_at": "2024-01-01 10:00:00",
                "last_login": "2024-01-01 15:30:00"
            }
        ],
        "pagination": {
            "current_page": 1,
            "per_page": 10,
            "total": 25,
            "total_pages": 3,
            "has_next": true,
            "has_prev": false
        }
    }
}
```

**أمثلة cURL:**

```bash
# الحصول على جميع المستخدمين
curl -X GET "http://your-replit-url/api/get_users.php" \
  -H "Authorization: Bearer your_token_here"

# البحث عن مستخدمين
curl -X GET "http://your-replit-url/api/get_users.php?search=أحمد&page=1&limit=5" \
  -H "Authorization: Bearer your_token_here"

# تصفية حسب الدور
curl -X GET "http://your-replit-url/api/get_users.php?role=merchant" \
  -H "Authorization: Bearer your_token_here"

# استخدام التوكن في URL
curl -X GET "http://your-replit-url/api/get_users.php?token=your_token_here"
```

## رموز الحالة HTTP

- `200`: نجحت العملية
- `201`: تم إنشاء مورد جديد
- `400`: خطأ في البيانات المرسلة
- `401`: غير مصرح بالوصول (توكن مفقود أو خاطئ)
- `405`: طريقة HTTP غير مسموحة
- `409`: تضارب (مثل بريد إلكتروني موجود مسبقاً)
- `500`: خطأ في الخادم

## الأمان

### التوكن
- يتم إرجاع توكن عند تسجيل الدخول بنجاح
- يجب إرسال التوكن في header `Authorization: Bearer token`
- أو يمكن إرسال التوكن كمعامل `?token=your_token`

### حماية SQL Injection
- جميع المدخلات يتم تنظيفها باستخدام `mysqli::real_escape_string`
- استخدام Prepared Statements في جميع الاستعلامات

### تشفير كلمات المرور
- يتم تشفير كلمات المرور باستخدام `password_hash()` مع `PASSWORD_DEFAULT`
- التحقق من كلمات المرور باستخدام `password_verify()`

## أمثلة JavaScript

### تسجيل الدخول
```javascript
async function login(email, password) {
    const response = await fetch('/api/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    if (result.success) {
        localStorage.setItem('token', result.data.token);
        return result.data;
    } else {
        throw new Error(result.message);
    }
}
```

### الحصول على المستخدمين
```javascript
async function getUsers(page = 1, search = '') {
    const token = localStorage.getItem('token');
    const url = new URL('/api/get_users.php', window.location.origin);
    
    url.searchParams.append('page', page);
    if (search) url.searchParams.append('search', search);
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    const result = await response.json();
    if (result.success) {
        return result.data;
    } else {
        throw new Error(result.message);
    }
}
```

## ملاحظات

1. **الترميز**: جميع الـ APIs تدعم UTF-8 لضمان عرض النصوص العربية بشكل صحيح
2. **CORS**: تم تكوين رؤوس CORS للسماح بالطلبات من مصادر مختلفة
3. **التحقق**: يتم التحقق من صحة جميع المدخلات قبل معالجتها
4. **الأخطاء**: جميع الأخطاء يتم إرجاعها بصيغة JSON مع رسائل واضحة بالعربية

## تطوير إضافي

يمكن إضافة المزيد من الـ APIs مثل:
- إدارة المتاجر (`/api/stores.php`)
- إدارة المنتجات (`/api/products.php`)
- إدارة الخدمات (`/api/services.php`)
- إدارة الوظائف (`/api/jobs.php`)
- إدارة الإعلانات (`/api/announcements.php`)