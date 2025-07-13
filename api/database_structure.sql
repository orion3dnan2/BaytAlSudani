-- بنية قاعدة البيانات للبيت السوداني
-- Sudanese Marketplace Database Structure

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS sudanese_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sudanese_marketplace;

-- جدول المستخدمين
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'اسم المستخدم',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'البريد الإلكتروني',
    password VARCHAR(255) NOT NULL COMMENT 'كلمة المرور المشفرة',
    role ENUM('admin', 'merchant', 'customer') DEFAULT 'customer' COMMENT 'دور المستخدم',
    phone VARCHAR(20) COMMENT 'رقم الهاتف',
    is_active BOOLEAN DEFAULT 1 COMMENT 'حالة النشاط',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
    last_login TIMESTAMP NULL COMMENT 'آخر تسجيل دخول'
) ENGINE=InnoDB COMMENT='جدول المستخدمين';

-- جدول المتاجر
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL COMMENT 'اسم المتجر',
    description TEXT COMMENT 'وصف المتجر',
    owner_id INT NOT NULL COMMENT 'معرف المالك',
    category VARCHAR(50) NOT NULL COMMENT 'فئة المتجر',
    address TEXT COMMENT 'عنوان المتجر',
    phone VARCHAR(20) COMMENT 'هاتف المتجر',
    is_active BOOLEAN DEFAULT 1 COMMENT 'حالة النشاط',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='جدول المتاجر';

-- جدول المنتجات
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL COMMENT 'اسم المنتج',
    description TEXT COMMENT 'وصف المنتج',
    price DECIMAL(10,2) NOT NULL COMMENT 'سعر المنتج',
    store_id INT NOT NULL COMMENT 'معرف المتجر',
    category VARCHAR(50) NOT NULL COMMENT 'فئة المنتج',
    image_url VARCHAR(500) COMMENT 'رابط صورة المنتج',
    is_active BOOLEAN DEFAULT 1 COMMENT 'حالة النشاط',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='جدول المنتجات';

-- جدول الخدمات
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL COMMENT 'اسم الخدمة',
    description TEXT COMMENT 'وصف الخدمة',
    price DECIMAL(10,2) NOT NULL COMMENT 'سعر الخدمة',
    store_id INT NOT NULL COMMENT 'معرف المتجر',
    category VARCHAR(50) NOT NULL COMMENT 'فئة الخدمة',
    duration VARCHAR(50) COMMENT 'مدة الخدمة',
    is_active BOOLEAN DEFAULT 1 COMMENT 'حالة النشاط',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='جدول الخدمات';

-- جدول الوظائف
CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL COMMENT 'عنوان الوظيفة',
    description TEXT COMMENT 'وصف الوظيفة',
    salary DECIMAL(10,2) COMMENT 'الراتب',
    location VARCHAR(100) COMMENT 'موقع العمل',
    store_id INT NOT NULL COMMENT 'معرف المتجر',
    requirements TEXT COMMENT 'متطلبات الوظيفة',
    is_active BOOLEAN DEFAULT 1 COMMENT 'حالة النشاط',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='جدول الوظائف';

-- جدول الإعلانات
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT 'عنوان الإعلان',
    content TEXT NOT NULL COMMENT 'محتوى الإعلان',
    store_id INT NOT NULL COMMENT 'معرف المتجر',
    type ENUM('promotion', 'news', 'event') DEFAULT 'news' COMMENT 'نوع الإعلان',
    is_active BOOLEAN DEFAULT 1 COMMENT 'حالة النشاط',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'تاريخ الإنشاء',
    expires_at TIMESTAMP NULL COMMENT 'تاريخ انتهاء الصلاحية',
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='جدول الإعلانات';

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_owner ON stores(owner_id);
CREATE INDEX idx_stores_category ON stores(category);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_services_store ON services(store_id);
CREATE INDEX idx_jobs_store ON jobs(store_id);
CREATE INDEX idx_announcements_store ON announcements(store_id);

-- إدراج بيانات تجريبية
INSERT INTO users (name, email, password, role, phone) VALUES
('المدير العام', 'admin@sudanese-market.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '249912345678'),
('أحمد محمد', 'ahmed@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'merchant', '249923456789'),
('فاطمة علي', 'fatima@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '249934567890'),
('محمد عثمان', 'mohammed@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'merchant', '249945678901');

INSERT INTO stores (name, description, owner_id, category, address, phone) VALUES
('متجر الالكترونيات الحديثة', 'متجر متخصص في بيع الأجهزة الإلكترونية والهواتف الذكية', 2, 'electronics', 'الخرطوم - السوق المركزي', '249912111111'),
('مطعم النيل الأزرق', 'مطعم شعبي يقدم الأكلات السودانية التقليدية', 2, 'restaurant', 'أم درمان - شارع الجمهورية', '249912222222'),
('متجر الأزياء العصرية', 'متجر للملابس النسائية والرجالية العصرية', 4, 'fashion', 'الخرطوم بحري - المنطقة التجارية', '249912333333');

INSERT INTO products (name, description, price, store_id, category, image_url) VALUES
('هاتف سامسونج جالاكسي', 'هاتف ذكي بمواصفات عالية وكاميرا ممتازة', 850.00, 1, 'electronics', '/images/samsung-phone.jpg'),
('وجبة عاشة السمك', 'وجبة سودانية تقليدية مع الأرز والسلطة', 25.00, 2, 'food', '/images/fish-meal.jpg'),
('ثوب سوداني نسائي', 'ثوب تقليدي بألوان زاهية وتصميم أنيق', 120.00, 3, 'fashion', '/images/traditional-dress.jpg');

INSERT INTO services (name, description, price, store_id, category, duration) VALUES
('صيانة الهواتف', 'خدمة صيانة وإصلاح الهواتف الذكية', 50.00, 1, 'repair', '1-2 ساعة'),
('توصيل الطعام', 'خدمة توصيل الوجبات إلى المنزل', 10.00, 2, 'delivery', '30-45 دقيقة');

INSERT INTO jobs (title, description, salary, location, store_id, requirements) VALUES
('فني صيانة هواتف', 'مطلوب فني متخصص في صيانة الهواتف الذكية', 800.00, 'الخرطوم', 1, 'خبرة سنتين على الأقل في صيانة الإلكترونيات'),
('طاهي مأكولات شعبية', 'مطلوب طاهي متخصص في الأكلات السودانية', 650.00, 'أم درمان', 2, 'خبرة في طبخ الأكلات السودانية التقليدية');

INSERT INTO announcements (title, content, store_id, type) VALUES
('خصم 20% على جميع الهواتف', 'عرض خاص لمدة أسبوع على جميع الهواتف الذكية في المتجر', 1, 'promotion'),
('افتتاح فرع جديد', 'يسعدنا الإعلان عن افتتاح فرع جديد في منطقة الدعم السكني', 2, 'news'),
('مجموعة أزياء الصيف الجديدة', 'وصلت مجموعة الأزياء الصيفية الجديدة بأحدث الموديلات', 3, 'promotion');