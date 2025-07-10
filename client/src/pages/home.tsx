import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import sudaneseRiverImage from "@assets/IMG_20140225_115710_1752142479490.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import StoreCard from "@/components/StoreCard";
import { 
  Store, 
  ShoppingBag, 
  Users, 
  Briefcase, 
  Bell, 
  Search,
  ArrowRight,
  Star,
  Shield,
  Truck,
  Heart,
  Gift,
  Zap,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";

export default function Home() {
  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ['/api/stores'],
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/services'],
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/jobs'],
  });

  const { data: announcements, isLoading: announcementsLoading } = useQuery({
    queryKey: ['/api/announcements'],
  });

  const features = [
    {
      icon: Shield,
      title: "تسوق آمن",
      description: "حماية شاملة لبياناتك ومعاملاتك"
    },
    {
      icon: Truck,
      title: "توصيل سريع",
      description: "توصيل مجاني للطلبات فوق 100 جنيه"
    },
    {
      icon: Award,
      title: "جودة مضمونة",
      description: "منتجات عالية الجودة من أفضل التجار"
    },
    {
      icon: Heart,
      title: "خدمة عملاء ممتازة",
      description: "دعم فني متاح 24/7 لمساعدتك"
    }
  ];

  const categories = [
    { name: "الإلكترونيات", icon: "📱", color: "bg-blue-100 text-blue-800" },
    { name: "الأزياء", icon: "👕", color: "bg-pink-100 text-pink-800" },
    { name: "المنزل والحديقة", icon: "🏠", color: "bg-green-100 text-green-800" },
    { name: "الصحة والجمال", icon: "💄", color: "bg-purple-100 text-purple-800" },
    { name: "الرياضة", icon: "⚽", color: "bg-orange-100 text-orange-800" },
    { name: "الكتب", icon: "📚", color: "bg-indigo-100 text-indigo-800" },
    { name: "الألعاب", icon: "🎮", color: "bg-red-100 text-red-800" },
    { name: "السيارات", icon: "🚗", color: "bg-gray-100 text-gray-800" },
  ];

  if (storesLoading || productsLoading || servicesLoading || jobsLoading || announcementsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-sudan-heritage text-white">
        {/* Background Image - Right Side */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#871414] from-0% via-[#871414]/90 via-45% to-transparent to-70%"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
            style={{
              backgroundImage: `url("${sudaneseRiverImage}")`,
              backgroundPosition: "center right",
              maskImage: "linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,1) 100%)"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#871414]/60 via-transparent to-black/40"></div>
        </div>
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 pattern-sudanese-geometric opacity-5"></div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <Badge className="bg-sudan-gold text-gray-900 text-sm px-3 py-1">
                  🇸🇩 منصة سودانية 100%
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-white drop-shadow-lg">
                  البيت السوداني
                </h1>
                <p className="text-xl lg:text-2xl text-white drop-shadow-md">سوداني وخليك .............. قدرها</p>
                <p className="text-lg text-white/90 max-w-lg drop-shadow-sm">تسوق واكتشف أفضل المنتجات والخدمات من التجار السودانيين. تجربة تسوق آمنة وسهلة مع توصيل سريع .</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-sudan-gold hover:bg-sudan-gold/90 text-gray-900 text-lg px-8 py-6 shadow-lg"
                  asChild
                >
                  <Link href="/marketplace">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    تسوق الآن
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-6 bg-[#871414]/70 backdrop-blur-sm shadow-lg"
                  asChild
                >
                  <Link href="/register">
                    <Store className="w-5 h-5 mr-2" />
                    سجل متجرك
                  </Link>
                </Button>
              </div>

              <div className="flex items-center space-x-8 space-x-reverse">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white drop-shadow-md">{stores?.length || 0}</div>
                  <div className="text-sm text-white/90">متجر</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white drop-shadow-md">{products?.length || 0}</div>
                  <div className="text-sm text-white/90">منتج</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white drop-shadow-md">{(services?.length || 0) + (jobs?.length || 0)}</div>
                  <div className="text-sm text-white/90">خدمة</div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center text-white drop-shadow-md">ابحث عن أي شيء</h3>
                  <div className="relative">
                    <Input
                      placeholder="ابحث عن المنتجات، المتاجر، الخدمات..."
                      className="w-full pr-12 py-6 text-lg bg-white text-gray-900 border-0 rounded-xl shadow-lg"
                    />
                    <Button 
                      className="absolute right-2 top-2 bg-sudan-blue hover:bg-sudan-blue/90 rounded-lg shadow-md"
                      size="icon"
                    >
                      <Search className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["هاتف", "لابتوب", "ملابس", "طعام", "كتب"].map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/25 text-white hover:bg-white/35 border-white/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">تصنيفات المنتجات</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              اكتشف مجموعة واسعة من المنتجات في جميع التصنيفات
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/marketplace?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-sudan-blue transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">منتجات مميزة</h2>
              <p className="text-gray-600">اكتشف أفضل المنتجات من التجار السودانيين</p>
            </div>
            <Button variant="outline" className="border-sudan-blue text-sudan-blue hover:bg-sudan-blue hover:text-white" asChild>
              <Link href="/marketplace">
                عرض الكل
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      {/* Featured Stores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">متاجر مميزة</h2>
              <p className="text-gray-600">تعرف على أفضل المتاجر في السودان</p>
            </div>
            <Button variant="outline" className="border-sudan-blue text-sudan-blue hover:bg-sudan-blue hover:text-white" asChild>
              <Link href="/marketplace">
                عرض الكل
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores?.slice(0, 3).map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">لماذا البيت السوداني؟</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نقدم أفضل تجربة تسوق إلكتروني في السودان
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-sudan-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-sudan-blue" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-gradient-sudan-heritage text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">أرقام تتحدث عن نفسها</h2>
            <p className="text-white/90 max-w-2xl mx-auto">البيت السوداني يخدم آلاف العملاء والتجار في جميع أنحاء الوطن العربي</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users className="w-8 h-8 text-sudan-gold mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">{stores?.length || 0}</div>
              <div className="text-white/80">تاجر موثوق</div>
            </div>
            <div className="text-center">
              <ShoppingBag className="w-8 h-8 text-sudan-gold mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">{products?.length || 0}</div>
              <div className="text-white/80">منتج متاح</div>
            </div>
            <div className="text-center">
              <Bell className="w-8 h-8 text-sudan-gold mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">{announcements?.length || 0}</div>
              <div className="text-white/80">إعلان يومي</div>
            </div>
            <div className="text-center">
              <Briefcase className="w-8 h-8 text-sudan-gold mx-auto mb-3" />
              <div className="text-4xl font-bold mb-2">{(services?.length || 0) + (jobs?.length || 0)}</div>
              <div className="text-white/80">خدمة مهنية</div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ابدأ رحلتك التجارية اليوم
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              انضم إلى آلاف التجار والعملاء الذين يثقون بمنصة البيت السوداني
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-sudan-blue hover:bg-sudan-blue/90 text-lg px-8 py-6"
                asChild
              >
                <Link href="/register">
                  <Store className="w-5 h-5 mr-2" />
                  سجل متجرك الآن
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-sudan-blue text-sudan-blue hover:bg-sudan-blue hover:text-white text-lg px-8 py-6"
                asChild
              >
                <Link href="/marketplace">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  تسوق الآن
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}