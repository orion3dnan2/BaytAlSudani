import { Link } from 'wouter';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Scroll to top button */}
      <Button
        onClick={scrollToTop}
        className="absolute -top-6 right-6 bg-sudan-blue hover:bg-sudan-blue/90 rounded-full w-12 h-12 shadow-lg"
        size="icon"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-sudan-flag rounded-lg flex items-center justify-center text-white font-bold">
                🏠
              </div>
              <div>
                <h3 className="text-xl font-bold">البيت السوداني</h3>
                <p className="text-sm text-gray-400">منصة التجارة الإلكترونية</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              منصة البيت السوداني هي الوجهة الأولى للتجارة الإلكترونية في السودان، نربط بين التجار والعملاء لتوفير تجربة تسوق متميزة ومنتجات عالية الجودة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <Button variant="ghost" size="icon" className="hover:bg-sudan-blue/20">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-sudan-blue/20">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-sudan-blue/20">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-sudan-gold">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-white transition-colors">
                  السوق
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  الخدمات
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors">
                  الوظائف
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="text-gray-400 hover:text-white transition-colors">
                  الإعلانات
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-sudan-gold">خدمة العملاء</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  شروط الاستخدام
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-sudan-gold">معلومات الاتصال</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <MapPin className="w-5 h-5 text-sudan-blue" />
                <span className="text-gray-400 text-sm">الكويت  , حولي</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-sudan-blue" />
                <span className="text-gray-400 text-sm">+249-123-456-789</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-5 h-5 text-sudan-blue" />
                <span className="text-gray-400 text-sm">info@sudanhome.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h4 className="text-lg font-semibold text-sudan-gold mb-4">تصنيفات المنتجات</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'الإلكترونيات', 'الأزياء', 'المنزل والحديقة', 'الصحة والجمال', 
              'الرياضة', 'الكتب', 'الألعاب', 'السيارات', 'الطعام والمشروبات', 
              'الهدايا', 'الأطفال', 'الحرف اليدوية'
            ].map((category) => (
              <Link
                key={category}
                href={`/marketplace?category=${encodeURIComponent(category)}`}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 البيت السوداني. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center space-x-6 space-x-reverse">
              <span className="text-gray-400 text-sm">صُنع بـ ❤️ في السودان</span>
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-gray-400 text-sm">نقبل:</span>
                <div className="flex space-x-2 space-x-reverse">
                  <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                  <div className="w-8 h-5 bg-gradient-to-r from-red-600 to-red-400 rounded text-white text-xs flex items-center justify-center font-bold">
                    MC
                  </div>
                  <div className="w-8 h-5 bg-gradient-to-r from-green-600 to-green-400 rounded text-white text-xs flex items-center justify-center font-bold">
                    💳
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}