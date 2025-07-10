import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase, User, MapPin } from "lucide-react";

export default function Services() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['/api/services'],
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الخدمات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">الخدمات 🧰</h1>
            <p className="text-xl text-gray-600">احصل على خدمات متخصصة من حرفيين ومهنيين مؤهلين</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>

        {/* Services Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            الخدمات المتاحة
          </h2>
          
          {services.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا توجد خدمات</p>
                <p className="text-gray-400 text-sm">لم يتم إضافة أي خدمات بعد</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service: any) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-teal-600">
                        {service.price} جنيه
                      </div>
                      <div className="text-sm text-gray-500">
                        الفئة: {service.category}
                      </div>
                      <div className="text-sm text-gray-500">
                        تاريخ الإضافة: {new Date(service.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                      <Badge variant={service.isActive ? 'default' : 'destructive'}>
                        {service.isActive ? 'متاح' : 'غير متاح'}
                      </Badge>
                    </div>
                    <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700">
                      طلب الخدمة
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
