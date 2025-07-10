import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Package, DollarSign, Tag, Store, Image, ArrowRight } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

const productSchema = z.object({
  name: z.string().min(2, 'اسم المنتج يجب أن يكون أطول من حرفين'),
  description: z.string().optional(),
  price: z.string().min(1, 'السعر مطلوب'),
  category: z.string().min(1, 'الفئة مطلوبة'),
  storeId: z.string().min(1, 'المتجر مطلوب'),
  isActive: z.boolean().default(true),
});

type ProductForm = z.infer<typeof productSchema>;

const productCategories = [
  'إلكترونيات',
  'أزياء',
  'مجوهرات',
  'طعام ومشروبات',
  'مستحضرات تجميل',
  'كتب ومجلات',
  'رياضة وترفيه',
  'منزل وحديقة',
  'سيارات',
  'خدمات',
  'أخرى'
];

export default function CreateProduct() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
    }
  });

  // Fetch user's stores
  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ['/api/stores/owner', user?.id],
    enabled: !!user?.id,
  });

  const selectedCategory = watch('category');
  const selectedStoreId = watch('storeId');
  const isActive = watch('isActive');

  useEffect(() => {
    // Auto-select the first store if user has only one store
    if (stores.length === 1 && !selectedStoreId) {
      setValue('storeId', stores[0].id.toString());
    }
  }, [stores, selectedStoreId, setValue]);

  const onSubmit = async (data: ProductForm) => {
    if (!user) return;

    setIsLoading(true);
    
    try {
      const response = await apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          storeId: parseInt(data.storeId),
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في إنشاء المنتج');
      }

      const newProduct = await response.json();
      
      toast({
        title: 'تم إنشاء المنتج',
        description: 'تم إضافة المنتج بنجاح',
      });
      
      // Redirect to products list or merchant dashboard
      setLocation('/merchant/dashboard');
    } catch (error) {
      toast({
        title: 'خطأ في إنشاء المنتج',
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || (user.role !== 'merchant' && user.role !== 'admin')) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">
                يجب أن تكون تاجراً لإنشاء منتج جديد
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
          <h1 className="text-3xl font-bold text-gray-900">إنشاء منتج جديد</h1>
          <p className="text-gray-600 mt-2">أضف منتجاً جديداً إلى متجرك</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              تفاصيل المنتج
            </CardTitle>
            <CardDescription>
              املأ بيانات المنتج الذي تريد إضافته
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  اسم المنتج *
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="أدخل اسم المنتج"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  وصف المنتج
                </Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="اكتب وصفاً للمنتج (اختياري)"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  السعر (بالجنيه السوداني) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price')}
                  placeholder="0.00"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  الفئة *
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر فئة المنتج" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  المتجر *
                </Label>
                {storesLoading ? (
                  <div className="text-sm text-gray-500">جاري تحميل المتاجر...</div>
                ) : stores.length === 0 ? (
                  <div className="text-sm text-red-500">
                    لا توجد متاجر. يجب إنشاء متجر أولاً
                  </div>
                ) : (
                  <Select
                    value={selectedStoreId}
                    onValueChange={(value) => setValue('storeId', value)}
                  >
                    <SelectTrigger className={errors.storeId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="اختر المتجر" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store: any) => (
                        <SelectItem key={store.id} value={store.id.toString()}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.storeId && (
                  <p className="text-sm text-red-500">{errors.storeId.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('isActive', checked)}
                />
                <Label htmlFor="isActive" className="text-sm">
                  متاح للبيع
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading || stores.length === 0}
                  className="flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  {isLoading ? 'جاري الإنشاء...' : 'إنشاء المنتج'}
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