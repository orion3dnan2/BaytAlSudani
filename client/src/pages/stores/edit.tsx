import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useRoute } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Store, MapPin, Phone, ArrowRight, Edit } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const storeSchema = z.object({
  name: z.string().min(2, 'اسم المتجر يجب أن يكون أطول من حرفين'),
  description: z.string().optional(),
  category: z.string().min(1, 'الفئة مطلوبة'),
  address: z.string().optional(),
  phone: z.string().optional(),
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

export default function EditStore() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/stores/edit/:id');
  const [isLoading, setIsLoading] = useState(false);
  const [store, setStore] = useState<any>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<StoreForm>({
    resolver: zodResolver(storeSchema),
  });

  const selectedCategory = watch('category');

  // Fetch store data
  useEffect(() => {
    if (match && params?.id) {
      fetchStore(params.id);
    }
  }, [match, params?.id]);

  const fetchStore = async (storeId: string) => {
    try {
      const response = await fetch(`/api/stores`);
      const data = await response.json();
      
      if (data.status === 'success') {
        const foundStore = data.stores.find((s: any) => s.id.toString() === storeId);
        if (foundStore) {
          setStore(foundStore);
          // Populate form with existing data
          reset({
            name: foundStore.name,
            description: foundStore.description || '',
            category: foundStore.category,
            address: foundStore.address || '',
            phone: foundStore.phone || '',
          });
        } else {
          toast({
            title: 'خطأ',
            description: 'المتجر غير موجود',
            variant: 'destructive',
          });
          setLocation('/');
        }
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل بيانات المتجر',
        variant: 'destructive',
      });
      setLocation('/');
    }
  };

  const onSubmit = async (data: StoreForm) => {
    if (!user || !store) return;

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/stores/${store.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        toast({
          title: 'تم تحديث المتجر',
          description: `تم تحديث متجر "${result.store.name}" بنجاح`,
        });
        
        // Redirect to merchant dashboard
        setLocation('/merchant/dashboard');
      } else {
        throw new Error(result.message || 'فشل في تحديث المتجر');
      }
    } catch (error) {
      toast({
        title: 'خطأ في تحديث المتجر',
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!match || !params?.id) {
    return <div>المتجر غير موجود</div>;
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات المتجر...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setLocation('/merchant/dashboard')}
            className="mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة إلى لوحة التحكم
          </Button>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تعديل المتجر</h1>
            <p className="text-gray-600">قم بتحديث معلومات متجرك</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-green-600" />
              معلومات المتجر
            </CardTitle>
            <CardDescription>
              قم بتعديل التفاصيل الأساسية لمتجرك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المتجر *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="أدخل اسم المتجر"
                  className="text-right"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف المتجر</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="اكتب وصفاً موجزاً عن متجرك ومنتجاتك"
                  className="text-right min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">فئة المتجر *</Label>
                <Select value={selectedCategory} onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر فئة المتجر" />
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
                  <p className="text-red-500 text-sm">{errors.category.message}</p>
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
                  placeholder="أدخل عنوان المتجر"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="أدخل رقم الهاتف"
                  className="text-right"
                  dir="ltr"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري تحديث المتجر...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    تحديث المتجر
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}