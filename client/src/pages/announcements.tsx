import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bell, Calendar, User } from "lucide-react";

export default function Announcements() {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['/api/announcements'],
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الإعلانات...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">الإعلانات 📣</h1>
            <p className="text-xl text-gray-600">تابع أحدث الإعلانات والعروض الخاصة</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>

        {/* Announcements Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            الإعلانات الحديثة
          </h2>
          
          {announcements.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا توجد إعلانات</p>
                <p className="text-gray-400 text-sm">لم يتم إضافة أي إعلانات بعد</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement: any) => (
                <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      {announcement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {announcement.content}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(announcement.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                      <Badge variant={announcement.isActive ? 'default' : 'destructive'}>
                        {announcement.isActive ? 'نشط' : 'منتهي'}
                      </Badge>
                    </div>
                    <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                      عرض التفاصيل
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
