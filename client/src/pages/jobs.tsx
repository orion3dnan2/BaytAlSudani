import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Briefcase } from "lucide-react";

export default function Jobs() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-3xl p-6 shadow-2xl">
              <Briefcase className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            الوظائف 🧑‍💼
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            ابحث عن فرص عمل جديدة أو قم بنشر إعلانات التوظيف الخاصة بك
          </p>
          
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-slate-600 mb-4">
                هذا القسم قيد التطوير. سيتم إضافة الوظائف المتاحة قريباً.
              </p>
              
              <Link href="/">
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  <ArrowRight className="w-4 h-4 ml-2 rtl:ml-0 rtl:mr-2" />
                  العودة للصفحة الرئيسية
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
