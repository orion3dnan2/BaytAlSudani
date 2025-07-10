# البيت السوداني - Sudanese Marketplace Platform

## هيكل المشروع / Project Structure

يتكون هذا المشروع من ثلاثة أجزاء رئيسية:

### 1. مجلد `admin/` - لوحة التحكم الإدارية
**الغرض**: لوحة تحكم مبنية بـ PHP لإدارة المستخدمين والنظام
**المحتويات**:
- `dashboard.php` - الصفحة الرئيسية للإحصائيات والمعلومات
- `login_admin.php` - صفحة تسجيل الدخول للمديرين
- `manage_users.php` - إدارة المستخدمين (تفعيل، إلغاء تفعيل، تغيير الأدوار)
- `logout.php` - تسجيل الخروج

**الحماية**: محمية بجلسات PHP، فقط المديرون يمكنهم الوصول

### 2. مجلد `api/` - واجهة برمجة التطبيقات
**الغرض**: API endpoints تعود بـ JSON فقط للتطبيق المحمول
**المحتويات**:
- `config/` - إعدادات قاعدة البيانات والـ CORS
- `auth/` - تسجيل الدخول والخروج
- `stores/` - إدارة المتاجر
- `products/` - إدارة المنتجات
- `services/` - إدارة الخدمات
- `jobs/` - إدارة الوظائف
- `announcements/` - إدارة الإعلانات

**المميزات**:
- كل ملف يبدأ بـ `header("Content-Type: application/json");`
- دعم CORS للتطبيقات المحمولة
- معالجة أخطاء شاملة

### 3. مجلد `mobile_app/` - تطبيقات الهاتف المحمول
**الغرض**: تطبيقات الهاتف المحمول والويب
**المحتويات**:
- `web/` - تطبيق الويب المبني بـ React
- ملفات React Native للتطبيق المحمول
- `package.json` - تبعيات التطبيق المحمول

## قاعدة البيانات
- **النوع**: PostgreSQL
- **الجداول**: المستخدمين، المتاجر، المنتجات، الخدمات، الوظائف، الإعلانات
- **الاتصال**: عبر متغيرات البيئة في `api/config/database.php`

## بيانات الاختبار / Test Credentials
- **مدير**: `admin` / `admin`
- **تاجر**: `merchant1` / `admin`
- **عميل**: `customer1` / `admin`

## التشغيل / Setup

### لتشغيل التطبيق المحمول:
```bash
cd mobile_app
npm install
npm run dev
```

### لتشغيل لوحة التحكم:
1. تأكد من تشغيل خادم PHP
2. اذهب إلى `admin/login_admin.php`
3. ادخل بيانات المدير

### لاستخدام API:
- جميع endpoints تبدأ بـ `/api/`
- مثال: `GET /api/stores/list.php`
- إرسال البيانات بصيغة JSON

## الأمان / Security
- **جلسات PHP**: حماية لوحة التحكم
- **تشفير كلمات المرور**: باستخدام PHP password_hash()
- **CORS**: مُعد للتطبيقات المحمولة
- **فصل الأدوار**: مدير، تاجر، عميل

## الملفات المنقولة / Migrated Files
- `server/` - تم نقل منطق الخادم إلى `api/`
- `client/` - تم نقل ملفات React إلى `mobile_app/web/`
- `mobile/` - تم نقل ملفات React Native إلى `mobile_app/`
- `shared/` - تم الاحتفاظ بها للمخططات المشتركة

## التطوير / Development
- **API PHP**: يعمل مع أي خادم PHP
- **React Web**: يعمل مع Vite
- **React Native**: يعمل مع Expo
- **قاعدة البيانات**: PostgreSQL أو SQLite للتطوير

---

## English

### Project Structure
This project consists of three main parts:

1. **admin/** - PHP-based admin dashboard for system management
2. **api/** - PHP REST API endpoints that return JSON only
3. **mobile_app/** - Mobile and web applications (React Native + React)

### Features
- Multi-platform support (Web, iOS, Android)
- Role-based access control (Admin, Merchant, Customer)
- RESTful API architecture
- Arabic RTL interface
- Secure authentication and session management

### Technology Stack
- **Backend**: PHP + PostgreSQL
- **Frontend**: React (Web) + React Native (Mobile)
- **Database**: PostgreSQL with fallback to SQLite
- **Authentication**: PHP Sessions + JWT tokens