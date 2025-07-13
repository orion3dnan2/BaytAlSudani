import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { User, Phone, Mail, Shield, Save, Edit, Store, Package, Calendar, MapPin } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import StoreCard from '@/components/StoreCard';
import ProductCard from '@/components/ProductCard';

const profileSchema = z.object({
  fullName: z.string().min(2, 'الاسم يجب أن يكون أطول من حرفين'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    }
  });

  // Fetch user's stores and products
  const { data: stores } = useQuery({
    queryKey: ['/api/stores'],
    enabled: !!user && (user.role === 'merchant' || user.role === 'store_owner'),
  });

  const { data: products } = useQuery({
    queryKey: ['/api/products'],
    enabled: !!user && (user.role === 'merchant' || user.role === 'store_owner'),
  });

  const userStores = stores?.filter(store => store.ownerId === user?.id?.toString()) || [];
  const userProducts = products?.filter(product => 
    userStores.some(store => store.id === product.storeId)
  ) || [];

  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest(`/api/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث البيانات');
      }

      const updatedUser = await response.json();
      
      // Update the user context with new data
      login(localStorage.getItem('auth_token') || '', updatedUser);
      
      toast({
        title: 'تم حفظ التغييرات',
        description: 'تم تحديث بيانات الملف الشخصي بنجاح',
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'خطأ في الحفظ',
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">يرجى تسجيل الدخول للوصول إلى الملف الشخصي</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
          <p className="text-gray-600 mt-2">إدارة بيانات حسابك الشخصي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl bg-sudan-blue text-white">
                    {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'م'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.fullName}</CardTitle>
                <CardDescription className="text-sm">{user?.email}</CardDescription>
                <div className="mt-4">
                  <Badge variant={user?.role === 'admin' ? 'default' : user?.role === 'merchant' ? 'secondary' : 'outline'}>
                    {user?.role === 'admin' ? 'مدير' : user?.role === 'merchant' ? 'تاجر' : 'عميل'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse text-sm">
                    <Calendar className="w-4 h-4 text-sudan-blue" />
                    <span>انضم في {new Date(user?.createdAt || '').toLocaleDateString('ar-SA')}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center space-x-2 space-x-reverse text-sm">
                      <Phone className="w-4 h-4 text-sudan-blue" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 space-x-reverse text-sm">
                    <MapPin className="w-4 h-4 text-sudan-blue" />
                    <span>الخرطوم، السودان</span>
                  </div>
                </div>
                
                {/* Statistics for merchants */}
                {(user?.role === 'merchant' || user?.role === 'store_owner') && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-4">إحصائيات التاجر</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-sudan-blue">{userStores.length}</div>
                        <div className="text-xs text-gray-500">متجر</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-sudan-blue">{userProducts.length}</div>
                        <div className="text-xs text-gray-500">منتج</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      معلومات الحساب
                    </CardTitle>
                    <CardDescription>
                      عرض وتعديل البيانات الشخصية
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      تعديل
                    </Button>
                  )}
                </div>
              </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  الاسم الكامل
                </Label>
                <Input
                  id="fullName"
                  {...register('fullName')}
                  disabled={!isEditing}
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={!isEditing}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
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
                  disabled={!isEditing}
                  placeholder="اختياري"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  نوع الحساب
                </Label>
                <div>
                  <Badge variant={user.role === 'admin' ? 'default' : user.role === 'merchant' ? 'secondary' : 'outline'}>
                    {user.role === 'admin' ? 'مدير' : user.role === 'merchant' ? 'تاجر' : 'عميل'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>تاريخ إنشاء الحساب</Label>
                <p className="text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                </p>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    إلغاء
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* User's Stores and Products - Only for merchants */}
    {(user?.role === 'merchant' || user?.role === 'store_owner') && (
      <div className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User's Stores */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  متاجري ({userStores.length})
                </CardTitle>
                <CardDescription>
                  المتاجر التي تملكها
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userStores.length > 0 ? (
                  <div className="space-y-4">
                    {userStores.slice(0, 3).map((store) => (
                      <div key={store.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{store.name}</h3>
                          <Badge className={`${store.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} text-xs`}>
                            {store.isActive ? 'نشط' : 'غير نشط'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
                        <div className="mt-2 flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{store.address || 'الخرطوم، السودان'}</span>
                        </div>
                      </div>
                    ))}
                    {userStores.length > 3 && (
                      <Button variant="outline" className="w-full">
                        عرض جميع المتاجر ({userStores.length})
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد متاجر</p>
                    <Button variant="outline" className="mt-4">
                      أنشئ متجرك الأول
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* User's Products */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  منتجاتي ({userProducts.length})
                </CardTitle>
                <CardDescription>
                  المنتجات في متاجرك
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userProducts.length > 0 ? (
                  <div className="space-y-4">
                    {userProducts.slice(0, 3).map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          <div className="text-lg font-bold text-sudan-blue">
                            {new Intl.NumberFormat('ar-SD', {
                              style: 'currency',
                              currency: 'SDG',
                              maximumFractionDigits: 0,
                            }).format(product.price)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        <div className="mt-2 flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {userProducts.length > 3 && (
                      <Button variant="outline" className="w-full">
                        عرض جميع المنتجات ({userProducts.length})
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد منتجات</p>
                    <Button variant="outline" className="mt-4">
                      أضف منتجك الأول
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )}
    </div>
    </div>
  );
}