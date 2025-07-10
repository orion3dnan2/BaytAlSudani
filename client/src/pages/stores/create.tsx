import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Store, MapPin, Phone, Instagram, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const storeSchema = z.object({
  name: z.string().min(2, 'اسم المتجر يجب أن يكون أطول من حرفين'),
  description: z.string().optional(),
  category: z.string().min(1, 'الفئة مطلوبة'),
  address: z.string().optional(),
  phone: z.string().optional(),
  instagramUrl: z.string().optional(),
});

type StoreForm = z.infer<typeof storeSchema>;

const storeCategories = [
  'electronics',
  'fashion',
  'restaurants-cafes',
  'home-garden',
  'health-beauty',
  'sports',
  'books',
  'toys',
  'automotive',
  'jewelry',
  'handicrafts',
  'services',
  'education',
  'technology',
  'agriculture',
  'other'
];

const categoryLabels = {
  electronics: 'الإلكترونيات',
  fashion: 'الأزياء والملابس',
  'restaurants-cafes': 'مطاعم وكافيهات',
  'home-garden': 'المنزل والحديقة',
  'health-beauty': 'الصحة والجمال',
  sports: 'الرياضة واللياقة',
  books: 'الكتب والقرطاسية',
  toys: 'الألعاب والأطفال',
  automotive: 'السيارات وقطع الغيار',
  jewelry: 'المجوهرات والإكسسوارات',
  handicrafts: 'الحرف اليدوية والتراث',
  services: 'الخدمات المهنية',
  education: 'التعليم والتدريب',
  technology: 'التكنولوجيا والبرمجيات',
  agriculture: 'الزراعة والثروة الحيوانية',
  other: 'أخرى'
};

export default function CreateStore() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<StoreForm>({
    resolver: zodResolver(storeSchema),
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: StoreForm) => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          ownerId: user.id.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في إنشاء المتجر');
      }

      const newStore = await response.json();
      
      toast({
        title: 'تم إنشاء المتجر',
        description: 'تم إضافة المتجر بنجاح',
      });
      
      // Redirect to merchant dashboard
      setLocation('/merchant/dashboard');
    } catch (error) {
      toast({
        title: 'خطأ في إنشاء المتجر',
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || (user.role !== 'store_owner' && user.role !== 'admin' && user.role !== 'merchant')) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">
                يجب أن تكون تاجراً لإنشاء متجر جديد
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/merchant/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              العودة
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">إنشاء متجر جديد</h1>
          <p className="text-gray-600 mt-2">أنشئ متجرك الإلكتروني الخاص</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              تفاصيل المتجر
            </CardTitle>
            <CardDescription>
              املأ بيانات المتجر الذي تريد إنشاءه
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  اسم المتجر *
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="أدخل اسم المتجر"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  وصف المتجر
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="اكتب وصفاً للمتجر (اختياري)"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  نوع المتجر *
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر نوع المتجر" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  العنوان
                </Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="أدخل عنوان المتجر (اختياري)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="أدخل رقم الهاتف (اختياري)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  رابط إنستغرام
                </Label>
                <Input
                  id="instagramUrl"
                  {...register('instagramUrl')}
                  placeholder="https://instagram.com/your_store (اختياري)"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء المتجر'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setLocation('/merchant/dashboard')}
                  disabled={isLoading}
                >
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}