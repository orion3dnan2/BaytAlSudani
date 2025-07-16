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
import { Package, DollarSign, Tag, Edit, ArrowRight } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(2, 'اسم المنتج يجب أن يكون أطول من حرفين'),
  description: z.string().optional(),
  price: z.string().min(1, 'السعر مطلوب'),
  category: z.string().min(1, 'الفئة مطلوبة'),
});

type ProductForm = z.infer<typeof productSchema>;

const productCategories = [
  'إلكترونيات',
  'أزياء',
  'مجوهرات',
  'مطاعم وكافيهات',
  'مستحضرات تجميل',
  'كتب ومجلات',
  'رياضة وترفيه',
  'منزل وحديقة',
  'سيارات',
  'خدمات',
  'أخرى'
];

export default function EditProduct() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/products/edit/:id');
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const selectedCategory = watch('category');

  // Fetch product data
  useEffect(() => {
    if (match && params?.id) {
      fetchProduct(params.id);
    }
  }, [match, params?.id]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products`);
      const data = await response.json();
      
      if (data.status === 'success') {
        const foundProduct = data.products.find((p: any) => p.id.toString() === productId);
        if (foundProduct) {
          setProduct(foundProduct);
          // Populate form with existing data
          reset({
            name: foundProduct.name,
            description: foundProduct.description || '',
            price: foundProduct.price.toString(),
            category: foundProduct.category,
          });
        } else {
          toast({
            title: 'خطأ',
            description: 'المنتج غير موجود',
            variant: 'destructive',
          });
          setLocation('/');
        }
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل بيانات المنتج',
        variant: 'destructive',
      });
      setLocation('/');
    }
  };

  const onSubmit = async (data: ProductForm) => {
    if (!user || !product) return;

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        toast({
          title: 'تم تحديث المنتج',
          description: `تم تحديث منتج "${result.product.name}" بنجاح`,
        });
        
        // Redirect to merchant dashboard
        setLocation('/merchant/dashboard');
      } else {
        throw new Error(result.message || 'فشل في تحديث المنتج');
      }
    } catch (error) {
      toast({
        title: 'خطأ في تحديث المنتج',
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!match || !params?.id) {
    return <div>المنتج غير موجود</div>;
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل بيانات المنتج...</p>
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">تعديل المنتج</h1>
            <p className="text-gray-600">قم بتحديث معلومات منتجك</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              معلومات المنتج
            </CardTitle>
            <CardDescription>
              قم بتعديل التفاصيل الأساسية لمنتجك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">اسم المنتج *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="أدخل اسم المنتج"
                  className="text-right"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف المنتج</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="اكتب وصفاً مفصلاً عن المنتج وميزاته"
                  className="text-right min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  السعر (جنيه سوداني) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price')}
                  placeholder="0.00"
                  className="text-right"
                  dir="ltr"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  فئة المنتج *
                </Label>
                <Select value={selectedCategory} onValueChange={(value) => setValue('category', value)}>
                  <SelectTrigger className="text-right">
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
                  <p className="text-red-500 text-sm">{errors.category.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري تحديث المنتج...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    تحديث المنتج
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