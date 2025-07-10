import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Settings, 
  Briefcase, 
  Megaphone, 
  User,
  LogOut,
  Home as HomeIcon,
  ArrowLeft,
  Store
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();

  const sections = [
    {
      title: "السوق",
      description: "تسوق من مئات المتاجر المحلية واكتشف منتجات متنوعة بأفضل الأسعار",
      icon: ShoppingCart,
      href: "/marketplace",
      gradient: "from-blue-500 to-blue-600",
      hoverColor: "hover:border-blue-500",
      iconBg: "bg-blue-500",
      textColor: "text-blue-600"
    },
    {
      title: "الخدمات", 
      description: "احصل على خدمات متخصصة من حرفيين ومهنيين في مجالات متعددة",
      icon: Settings,
      href: "/services", 
      gradient: "from-green-500 to-green-600",
      hoverColor: "hover:border-green-500",
      iconBg: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      title: "الإعلانات",
      description: "تابع أحدث الإعلانات والعروض الخاصة من المتاجر والخدمات المحلية",
      icon: Megaphone,
      href: "/announcements",
      gradient: "from-orange-500 to-orange-600", 
      hoverColor: "hover:border-orange-500",
      iconBg: "bg-orange-500",
      textColor: "text-orange-600"
    },
    {
      title: "الوظائف",
      description: "ابحث عن فرص عمل جديدة أو قم بنشر إعلانات التوظيف الخاصة بك",
      icon: Briefcase,
      href: "/jobs",
      gradient: "from-purple-500 to-purple-600",
      hoverColor: "hover:border-purple-500", 
      iconBg: "bg-purple-500",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      {/* Modern Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2.5 shadow-lg">
                <HomeIcon className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                البيت السوداني
              </h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg px-4 py-2 shadow-md">
                      <User className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                      {user?.fullName || "المستخدم"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard">
                          <Settings className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                          لوحة تحكم المسؤول
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user?.role === 'store_owner' && (
                      <DropdownMenuItem asChild>
                        <Link href="/merchant/dashboard">
                          <Store className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                          لوحة تحكم التاجر
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                      تسجيل الخروج
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg px-6 py-2 shadow-md">
                    تسجيل الدخول
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-32 w-12 h-12 bg-white rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          {/* Main Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/30">
              <HomeIcon className="w-20 h-20 text-white mx-auto" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            البيت السوداني
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            منصتك الشاملة للتسوق والخدمات والوظائف في السودان
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
              ابدأ التسوق الآن
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200">
              انضم كتاجر
            </Button>
          </div>
        </div>
      </section>

      {/* Main Sections Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              استكشف خدماتنا
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اختر من بين أقسامنا المتنوعة وابدأ رحلتك معنا
            </p>
          </div>

          {/* Responsive Grid - 2x2 on desktop, 1 column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Link key={index} href={section.href}>
                  <Card className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 ${section.hoverColor} cursor-pointer overflow-hidden transform hover:-translate-y-2 hover:scale-105`}>
                    <CardContent className="p-8 text-center">
                      {/* Large Icon */}
                      <div className={`flex items-center justify-center w-20 h-20 ${section.iconBg} rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      
                      {/* Title */}
                      <h3 className={`text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:${section.textColor} transition-colors`}>
                        {section.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {section.description}
                      </p>
                      
                      {/* CTA Button */}
                      <Button className={`w-full ${section.iconBg} hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-md group-hover:shadow-lg transition-all duration-200`}>
                        <span className="ml-2 rtl:ml-0 rtl:mr-2">اكتشف المزيد</span>
                        <ArrowLeft className="w-5 h-5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">لماذا البيت السوداني؟</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">تسوق محلي</h3>
              <p className="text-gray-600">ادعم التجار المحليين واكتشف منتجات سودانية أصيلة</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">خدمات موثوقة</h3>
              <p className="text-gray-600">احصل على خدمات عالية الجودة من مقدمين معتمدين</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">فرص عمل</h3>
              <p className="text-gray-600">اعثر على الوظيفة المناسبة أو اعلن عن احتياجاتك</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">البيت السوداني</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                منصتك الشاملة للتسوق والخدمات في السودان
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">الأقسام</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">السوق</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">الخدمات</Link></li>
                <li><Link href="/jobs" className="hover:text-white transition-colors">الوظائف</Link></li>
                <li><Link href="/announcements" className="hover:text-white transition-colors">الإعلانات</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <p className="text-gray-400">
                info@baytsudani.com<br/>
                الخرطوم، السودان
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 البيت السوداني. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}