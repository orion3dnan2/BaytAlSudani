import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Users, 
  Briefcase, 
  Bell,
  Star,
  Shield,
  Truck,
  Award,
  Heart,
  ArrowRight
} from "lucide-react";
import sudaneseRiverImage from "@assets/IMG_20140225_115710_1752142479490.jpg";

export default function Landing() {
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

  const stats = [
    { icon: ShoppingBag, label: "منتج متاح", value: "1000+" },
    { icon: Users, label: "تاجر موثوق", value: "50+" },
    { icon: Briefcase, label: "خدمة مهنية", value: "200+" },
    { icon: Bell, label: "إعلان يومي", value: "25+" },
  ];

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
                  onClick={() => window.location.href = '/api/login'}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  سجل دخول للتسوق
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-6"
                  onClick={() => window.location.href = '/api/login'}
                >
                  <Users className="w-5 h-5 mr-2" />
                  انضم كتاجر
                </Button>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-sudan-gold" />
                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm opacity-90">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              لماذا البيت السوداني؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نقدم لك أفضل تجربة تسوق إلكتروني مع ضمان الجودة والأمان
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-sudan-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-sudan-blue" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-sudan-blue to-sudan-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            ابدأ رحلتك معنا اليوم
          </h2>
          <p className="text-xl mb-8 opacity-90">
            انضم إلى آلاف العملاء والتجار الذين يثقون في البيت السوداني
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-sudan-blue hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => window.location.href = '/api/login'}
            >
              سجل دخول الآن
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}