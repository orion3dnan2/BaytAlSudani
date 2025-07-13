import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { User, Phone, Mail, Shield, Save, Edit } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
          <p className="text-gray-600 mt-2">إدارة بيانات حسابك الشخصي</p>
        </div>

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
  );
}