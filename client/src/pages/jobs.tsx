import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase, MapPin, DollarSign, Calendar } from "lucide-react";

export default function Jobs() {
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['/api/jobs'],
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الوظائف...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">الوظائف 🧑‍💼</h1>
            <p className="text-xl text-gray-600">ابحث عن فرص عمل جديدة في مختلف المجالات</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>

        {/* Jobs Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            الوظائف المتاحة
          </h2>
          
          {jobs.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا توجد وظائف</p>
                <p className="text-gray-400 text-sm">لم يتم إضافة أي وظائف بعد</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job: any) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      {job.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-lg font-bold text-amber-600">
                        <DollarSign className="w-5 h-5" />
                        {job.salary} جنيه/شهر
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(job.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                      <Badge variant={job.isActive ? 'default' : 'destructive'}>
                        {job.isActive ? 'متاح' : 'منتهي'}
                      </Badge>
                    </div>
                    <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
                      التقدم للوظيفة
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
