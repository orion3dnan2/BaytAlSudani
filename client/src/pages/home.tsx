import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Settings, 
  Briefcase, 
  Megaphone, 
  Star, 
  Home as HomeIcon,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Instagram,
  Globe
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and App Name */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-2 shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900">البيت السوداني</h1>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:inline-flex"
              >
                <Globe className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                EN
              </Button>
              
              <Button className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md">
                <span className="hidden sm:inline">تسجيل الدخول</span>
                <span className="sm:hidden">دخول</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-teal-50 py-12 lg:py-20 animate-slide-up">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='none' fill-rule='evenodd'><g fill='%23059669' fill-opacity='0.1'><circle cx='30' cy='30' r='2'/></g></g></svg>")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-6 shadow-2xl animate-bounce-gentle">
              <HomeIcon className="w-16 h-16 text-white" />
            </div>
          </div>
          
          {/* App Title and Subtitle */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight">
              البيت السوداني
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              كل المتاجر والخدمات في مكان واحد
            </p>
            <div className="mt-6 flex justify-center">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-slate-500">
                <MapPin className="w-5 h-5" />
                <span>خدماتك المحلية في متناول يدك</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              اكتشف خدماتنا
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              اختر من بين خدماتنا المتنوعة وابدأ رحلتك معنا
            </p>
          </div>

          {/* Main Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Marketplace Card */}
            <Link href="/marketplace">
              <Card className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-green-200 cursor-pointer overflow-hidden transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors">
                    السوق 🛒
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    تسوق من مئات المتاجر المحلية واكتشف منتجات متنوعة بأفضل الأسعار
                  </p>
                  <div className="flex items-center text-green-600 font-medium group-hover:text-green-700">
                    <span className="ml-2 rtl:ml-0 rtl:mr-2">اكتشف المزيد</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Services Card */}
            <Link href="/services">
              <Card className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-teal-200 cursor-pointer overflow-hidden transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                    الخدمات 🧰
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    احصل على خدمات متخصصة من حرفيين ومهنيين في مجالات متعددة
                  </p>
                  <div className="flex items-center text-teal-600 font-medium group-hover:text-teal-700">
                    <span className="ml-2 rtl:ml-0 rtl:mr-2">اكتشف المزيد</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Jobs Card */}
            <Link href="/jobs">
              <Card className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-amber-200 cursor-pointer overflow-hidden transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
                    الوظائف 🧑‍💼
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    ابحث عن فرص عمل جديدة أو قم بنشر إعلانات التوظيف الخاصة بك
                  </p>
                  <div className="flex items-center text-amber-600 font-medium group-hover:text-amber-700">
                    <span className="ml-2 rtl:ml-0 rtl:mr-2">اكتشف المزيد</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Announcements Card */}
            <Link href="/announcements">
              <Card className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-red-200 cursor-pointer overflow-hidden transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Megaphone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                    الإعلانات 📣
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    تابع أحدث الإعلانات والعروض الخاصة من المتاجر والخدمات المحلية
                  </p>
                  <div className="flex items-center text-red-600 font-medium group-hover:text-red-700">
                    <span className="ml-2 rtl:ml-0 rtl:mr-2">اكتشف المزيد</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              انضم إلى مجتمعنا اليوم
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              ابدأ رحلتك مع البيت السوداني واكتشف عالماً من الفرص والخدمات المتميزة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors duration-200 shadow-lg hover:shadow-xl">
                سجل كمستخدم
              </Button>
              <Button className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                سجل كتاجر
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-2">
                  <HomeIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">البيت السوداني</h3>
              </div>
              <p className="text-slate-300 text-lg mb-6 max-w-md">
                منصتك الموثوقة للتسوق والخدمات المحلية في السودان
              </p>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">عن البيت السوداني</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">كيفية الاستخدام</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">الشروط والأحكام</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">سياسة الخصوصية</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-3 rtl:space-x-reverse text-slate-300">
                  <Mail className="w-5 h-5" />
                  <span>info@baytsudani.com</span>
                </li>
                <li className="flex items-center space-x-3 rtl:space-x-reverse text-slate-300">
                  <Phone className="w-5 h-5" />
                  <span>+249 123 456 789</span>
                </li>
                <li className="flex items-start space-x-3 rtl:space-x-reverse text-slate-300">
                  <MapPin className="w-5 h-5 mt-1" />
                  <span>الخرطوم، السودان</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-slate-400 text-sm">
                © 2024 البيت السوداني. جميع الحقوق محفوظة.
              </p>
              <div className="flex space-x-6 rtl:space-x-reverse">
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">سياسة الخصوصية</a>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">شروط الاستخدام</a>
                <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">المساعدة</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
