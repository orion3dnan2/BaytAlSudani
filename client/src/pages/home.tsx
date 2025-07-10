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
  Globe,
  Palmtree,
  Mountain,
  Waves,
  LogOut,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-200 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and App Name */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0 gradient-sudan-flag rounded-xl p-2 shadow-lg">
                <Palmtree className="w-8 h-8 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-sudan-blue">البيت السوداني</h1>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:inline-flex border-sudan-blue text-sudan-blue hover:bg-sudan-blue hover:text-white"
              >
                <Globe className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                EN
              </Button>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-sudan-blue hover:bg-sudan-blue/90 text-white shadow-sm hover:shadow-md">
                      <User className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                      <span className="hidden sm:inline">{user?.fullName}</span>
                      <span className="sm:hidden">الملف</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login">
                  <Button className="bg-sudan-blue hover:bg-sudan-blue/90 text-white shadow-sm hover:shadow-md">
                    <span className="hidden sm:inline">تسجيل الدخول</span>
                    <span className="sm:hidden">دخول</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative gradient-sudan-sunset py-12 lg:py-20 animate-slide-up overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pattern-sudanese-geometric opacity-10"></div>
        <div className="absolute inset-0 pattern-sudanese-textile"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-sudan-gold opacity-20 animate-float">
          <Mountain className="w-12 h-12" />
        </div>
        <div className="absolute top-20 right-20 text-sudan-blue opacity-20 animate-float" style={{animationDelay: '1s'}}>
          <Waves className="w-10 h-10" />
        </div>
        <div className="absolute bottom-20 left-20 text-sudan-red opacity-20 animate-float" style={{animationDelay: '2s'}}>
          <Palmtree className="w-14 h-14" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Logo */}
          <div className="flex justify-center mb-8">
            <div className="gradient-sudan-heritage rounded-3xl p-6 shadow-2xl animate-bounce-gentle border-4 border-white/30">
              <HomeIcon className="w-16 h-16 text-white" />
            </div>
          </div>
          
          {/* App Title and Subtitle */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              البيت السوداني
            </h1>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto shadow-xl">
              <p className="text-xl sm:text-2xl text-sudan-blue font-semibold leading-relaxed">
                كل المتاجر والخدمات في مكان واحد
              </p>
              <div className="mt-4 flex justify-center">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sudan-sand">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">خدماتك المحلية في متناول يدك</span>
                </div>
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
              <Card className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-200 hover:border-sudan-blue cursor-pointer overflow-hidden transform hover:-translate-y-1">
                <CardContent className="p-8 relative">
                  <div className="absolute top-4 right-4 pattern-nile-waves w-8 h-8 opacity-20"></div>
                  <div className="flex items-center justify-center w-16 h-16 bg-sudan-blue rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-sudan-blue transition-colors">
                    السوق 🛍️
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    تسوق من مئات المتاجر المحلية واكتشف منتجات متنوعة بأفضل الأسعار
                  </p>
                  <div className="flex items-center text-sudan-blue font-medium group-hover:text-sudan-blue transition-colors">
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
              <Card className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-200 hover:border-sudan-red cursor-pointer overflow-hidden transform hover:-translate-y-1">
                <CardContent className="p-8 relative">
                  <div className="absolute top-4 right-4 pattern-nile-waves w-8 h-8 opacity-20"></div>
                  <div className="flex items-center justify-center w-16 h-16 bg-sudan-red rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-sudan-red transition-colors">
                    الخدمات 🔧
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    احصل على خدمات متخصصة من حرفيين ومهنيين في مجالات متعددة
                  </p>
                  <div className="flex items-center text-sudan-red font-medium group-hover:text-sudan-red transition-colors">
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
              <Card className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-200 hover:border-sudan-gold cursor-pointer overflow-hidden transform hover:-translate-y-1">
                <CardContent className="p-8 relative">
                  <div className="absolute top-4 right-4 pattern-nile-waves w-8 h-8 opacity-20"></div>
                  <div className="flex items-center justify-center w-16 h-16 bg-sudan-gold rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-sudan-gold transition-colors">
                    الوظائف 💼
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    ابحث عن فرص عمل جديدة أو قم بنشر إعلانات التوظيف الخاصة بك
                  </p>
                  <div className="flex items-center text-sudan-gold font-medium group-hover:text-sudan-gold transition-colors">
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
              <Card className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-200 hover:border-sudan-sand cursor-pointer overflow-hidden transform hover:-translate-y-1">
                <CardContent className="p-8 relative">
                  <div className="absolute top-4 right-4 pattern-nile-waves w-8 h-8 opacity-20"></div>
                  <div className="flex items-center justify-center w-16 h-16 bg-sudan-sand rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Megaphone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-sudan-sand transition-colors">
                    الإعلانات 📢
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    تابع أحدث الإعلانات والعروض الخاصة من المتاجر والخدمات المحلية
                  </p>
                  <div className="flex items-center text-sudan-sand font-medium group-hover:text-sudan-sand transition-colors">
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
      <section className="gradient-sudan-heritage py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pattern-sudanese-geometric opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 drop-shadow-lg">
              انضم إلى مجتمعنا اليوم
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              ابدأ رحلتك مع البيت السوداني واكتشف عالماً من الفرص والخدمات المتميزة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-sudan-blue px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200 shadow-lg hover:shadow-xl border-2 border-white">
                سجل كمستخدم
              </Button>
              <Button className="bg-sudan-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-sudan-gold/90 transition-colors duration-200 shadow-lg hover:shadow-xl border-2 border-sudan-gold">
                سجل كتاجر
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 lg:py-16 relative">
        <div className="absolute inset-0 pattern-sudanese-textile opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <div className="gradient-sudan-flag rounded-xl p-2">
                  <Palmtree className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">البيت السوداني</h3>
              </div>
              <p className="text-slate-300 text-lg mb-6 max-w-md">
                منصتك الموثوقة للتسوق والخدمات المحلية في السودان
              </p>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <a href="#" className="text-slate-400 hover:text-sudan-gold transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-sudan-gold transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-slate-400 hover:text-sudan-gold transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-sudan-gold">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-sudan-gold transition-colors">عن البيت السوداني</a></li>
                <li><a href="#" className="text-slate-300 hover:text-sudan-gold transition-colors">كيفية الاستخدام</a></li>
                <li><a href="#" className="text-slate-300 hover:text-sudan-gold transition-colors">الشروط والأحكام</a></li>
                <li><a href="#" className="text-slate-300 hover:text-sudan-gold transition-colors">سياسة الخصوصية</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-sudan-gold">تواصل معنا</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-3 rtl:space-x-reverse text-slate-300">
                  <Mail className="w-5 h-5 text-sudan-gold" />
                  <span>info@baytsudani.com</span>
                </li>
                <li className="flex items-center space-x-3 rtl:space-x-reverse text-slate-300">
                  <Phone className="w-5 h-5 text-sudan-gold" />
                  <span>+249 123 456 789</span>
                </li>
                <li className="flex items-start space-x-3 rtl:space-x-reverse text-slate-300">
                  <MapPin className="w-5 h-5 mt-1 text-sudan-gold" />
                  <span>الخرطوم، السودان</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-slate-400 text-sm">
                © 2025 البيت السوداني. جميع الحقوق محفوظة.
              </p>
              <div className="flex space-x-6 rtl:space-x-reverse">
                <a href="#" className="text-slate-400 hover:text-sudan-gold text-sm transition-colors">سياسة الخصوصية</a>
                <a href="#" className="text-slate-400 hover:text-sudan-gold text-sm transition-colors">شروط الاستخدام</a>
                <a href="#" className="text-slate-400 hover:text-sudan-gold text-sm transition-colors">المساعدة</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
