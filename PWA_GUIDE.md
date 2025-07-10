# دليل تطبيق الويب التقدمي (PWA) - البيت السوداني

## نظرة عامة

تم تحويل منصة البيت السوداني إلى تطبيق ويب تقدمي (PWA) كامل الميزات، مما يوفر تجربة تطبيق محلي مع إمكانات متقدمة للمستخدمين.

## الميزات المطبقة

### ✅ 1. ملف البيان (Manifest) المحسن

```json
{
  "name": "البيت السوداني - السوق الإلكتروني الشامل",
  "short_name": "البيت السوداني",
  "display": "standalone",
  "start_url": "/",
  "theme_color": "#2563eb",
  "background_color": "#ffffff"
}
```

**الميزات المضافة:**
- ✅ مصفوفة screenshots مع 4 لقطات شاشة (سطح المكتب والهاتف)
- ✅ دعم edge_side_panel لمستخدمي Microsoft Edge
- ✅ معالجات الملفات (file_handlers) لـ CSV, PDF, Excel, JSON
- ✅ معالجة الروابط (handle_links) للروابط المخصصة
- ✅ معالجات البروتوكول (protocol_handlers) للروابط المخصصة

### ✅ 2. Service Worker متكامل

**الوظائف:**
- 🔄 تخزين مؤقت ذكي للموارد الثابتة
- 📱 دعم العمل في وضع عدم الاتصال
- 🔗 معالجة البروتوكولات المخصصة
- 📁 معالجة استيراد الملفات
- 🚀 تحديث تلقائي للتطبيق

### ✅ 3. معالجة الملفات

**الملفات المدعومة:**
- 📊 CSV - لاستيراد البيانات
- 📄 PDF - للمستندات
- 📈 Excel (XLS/XLSX) - لجداول البيانات
- 🔧 JSON - لبيانات التكوين

**كيفية الاستخدام:**
1. انقر بالزر الأيمن على ملف مدعوم
2. اختر "فتح باستخدام البيت السوداني"
3. سيتم فتح التطبيق مع صفحة استيراد البيانات

### ✅ 4. البروتوكولات المخصصة

**البروتوكولات المدعومة:**

#### `web+sudanese-market://`
```
web+sudanese-market://marketplace
web+sudanese-market://stores
web+sudanese-market://services
```

#### `web+bayt-sudani://`
```
web+bayt-sudani://marketplace
web+bayt-sudani://profile
web+bayt-sudani://jobs
```

### ✅ 5. اختصارات التطبيق

**الاختصارات المتاحة:**
- 🛒 السوق - الوصول السريع للمنتجات
- 🏪 المتاجر - استعراض المتاجر
- 🛠️ الخدمات - تصفح الخدمات
- 💼 الوظائف - البحث عن عمل

### ✅ 6. دعم Microsoft Edge

- 📱 لوحة جانبية بعرض 400 بكسل
- 🎯 تحسين للاستخدام داخل Edge
- 🔄 تكامل مع نظام Windows

## الملفات الرئيسية

### 📄 ملفات PWA الأساسية

```
client/public/
├── manifest.json          # ملف البيان الرئيسي
├── sw.js                 # Service Worker
├── icons/                # أيقونات التطبيق (72x72 إلى 512x512)
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── shortcut-*.png    # أيقونات الاختصارات
└── screenshots/          # لقطات شاشة للمتجر
    ├── desktop-home.png
    ├── mobile-marketplace.png
    └── ...
```

### 🔧 ملفات المعالجة

```
client/src/pages/
├── handle-link.tsx       # معالج الروابط المخصصة
├── import-data.tsx       # معالج استيراد الملفات
└── ...
```

## متطلبات الإعداد

### 1. الأيقونات المطلوبة

إنشاء الأيقونات التالية في `client/public/icons/`:

```
icon-72x72.png      - أيقونة صغيرة
icon-96x96.png      - أيقونة متوسطة
icon-128x128.png    - أيقونة عادية
icon-144x144.png    - أيقونة كبيرة
icon-152x152.png    - أيقونة iOS
icon-192x192.png    - أيقونة قياسية
icon-384x384.png    - أيقونة عالية الدقة
icon-512x512.png    - أيقونة فائقة الدقة
```

**مواصفات التصميم:**
- استخدام الألوان: #2563eb (أزرق)، #dc2626 (أحمر)، #f59e0b (ذهبي)
- تضمين عناصر ثقافية سودانية
- جعل الأيقونات قابلة للقناع (safe area في وسط 80% من الأيقونة)

### 2. لقطات الشاشة المطلوبة

إنشاء لقطات في `client/public/screenshots/`:

```
desktop-home.png       - 1920x1080 (سطح المكتب)
desktop-stores.png     - 1920x1080 (سطح المكتب)
mobile-marketplace.png - 540x720 (هاتف)
mobile-products.png    - 540x720 (هاتف)
```

**مواصفات لقطات الشاشة:**
- إظهار المحتوى الحقيقي وليس النصوص التجريبية
- تضمين النصوص العربية لإظهار دعم RTL
- إبراز الميزات الرئيسية للتطبيق
- استخدام بيانات متنوعة وممثلة

## التحقق من PWA

### أدوات الفحص

1. **Lighthouse PWA Audit**
   ```bash
   npm install -g lighthouse
   lighthouse https://your-domain.com --view
   ```

2. **PWA Builder (Microsoft)**
   - زيارة: https://www.pwabuilder.com/
   - إدخال URL الخاص بالتطبيق
   - اتباع التوصيات

3. **Chrome DevTools**
   - F12 → Application → Manifest
   - فحص Service Worker
   - اختبار وضع عدم الاتصال

### قائمة التحقق

- [ ] ✅ ملف manifest.json صحيح
- [ ] ✅ Service Worker مُسجل ويعمل
- [ ] ✅ أيقونات بجميع الأحجام متوفرة
- [ ] ✅ لقطات شاشة بالأبعاد الصحيحة
- [ ] ✅ يعمل في وضع عدم الاتصال
- [ ] ✅ قابل للتثبيت على الأجهزة
- [ ] ✅ معالجات الملفات تعمل
- [ ] ✅ البروتوكولات المخصصة تعمل

## النشر والتوزيع

### متاجر التطبيقات

1. **Microsoft Store (PWA)**
   - استخدام PWA Builder لإنشاء حزمة
   - رفع إلى Microsoft Partner Center

2. **Google Play Store**
   - استخدام Trusted Web Activity (TWA)
   - إنشاء APK باستخدام Android Studio

3. **App Store (iOS)**
   - استخدام Capacitor أو Cordova
   - إنشاء تطبيق iOS منفصل

### النشر المباشر

```bash
# بناء للإنتاج
npm run build

# نشر على خادم HTTPS
# PWA يتطلب HTTPS للعمل الكامل
```

## الاستخدام للمطورين

### تسجيل Service Worker

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/public/sw.js')
    .then(registration => console.log('SW registered'))
    .catch(error => console.log('SW registration failed'));
}
```

### معالجة الملفات

```javascript
// في ImportData component
const handleFile = async (file) => {
  // معالجة أنواع مختلفة من الملفات
  switch (file.type) {
    case 'text/csv':
      await processCSV(file);
      break;
    case 'application/pdf':
      await processPDF(file);
      break;
  }
};
```

### معالجة البروتوكولات

```javascript
// في HandleLink component
const protocol = new URL(urlString).protocol;
if (protocol === 'web+sudanese-market:') {
  navigate(path);
}
```

## الصيانة والتحديث

### تحديث الإصدار

1. تعديل `CACHE_NAME` في `sw.js`
2. تحديث `version` في `manifest.json`
3. بناء ونشر النسخة الجديدة

### مراقبة الأداء

- استخدام Google Analytics للـ PWA
- مراقبة معدلات التثبيت
- تتبع استخدام الميزات المتقدمة

## الدعم والمساعدة

### المشاكل الشائعة

1. **Service Worker لا يعمل**
   - التأكد من HTTPS
   - فحص Console للأخطاء
   - مسح Cache ومحاولة مرة أخرى

2. **الأيقونات لا تظهر**
   - التحقق من مسارات الملفات
   - التأكد من أحجام الأيقونات الصحيحة

3. **لا يمكن التثبيت**
   - التحقق من ملف manifest.json
   - التأكد من وجود Service Worker
   - فحص متطلبات PWA في Lighthouse

هذا الدليل يغطي جميع جوانب PWA الخاصة بالبيت السوداني ويوفر المرجع الكامل للتطوير والصيانة والنشر.