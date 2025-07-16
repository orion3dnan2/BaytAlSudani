import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Store, Package, Plus, Check, X, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";

interface AdminCreateStoreForm {
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  ownerId: string;
}

interface AdminCreateProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  storeId: string;
}

const storeCategories = [
  { value: 'electronics', label: 'الإلكترونيات' },
  { value: 'fashion', label: 'الأزياء والملابس' },
  { value: 'restaurants-cafes', label: 'مطاعم وكافيهات' },
  { value: 'home-garden', label: 'المنزل والحديقة' },
  { value: 'health-beauty', label: 'الصحة والجمال' },
  { value: 'sports', label: 'الرياضة واللياقة' },
  { value: 'books', label: 'الكتب والقرطاسية' },
  { value: 'toys', label: 'الألعاب والأطفال' },
  { value: 'automotive', label: 'السيارات وقطع الغيار' },
  { value: 'jewelry', label: 'المجوهرات والإكسسوارات' },
  { value: 'handicrafts', label: 'الحرف اليدوية والتراث' },
  { value: 'services', label: 'الخدمات المهنية' },
  { value: 'education', label: 'التعليم والتدريب' },
  { value: 'technology', label: 'التكنولوجيا والبرمجيات' },
  { value: 'agriculture', label: 'الزراعة والثروة الحيوانية' },
  { value: 'other', label: 'أخرى' }
];

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

export default function AdminRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [createStoreOpen, setCreateStoreOpen] = useState(false);
  const [createProductOpen, setCreateProductOpen] = useState(false);
  const [storeForm, setStoreForm] = useState<AdminCreateStoreForm>({
    name: '',
    description: '',
    category: '',
    address: '',
    phone: '',
    ownerId: ''
  });
  const [productForm, setProductForm] = useState<AdminCreateProductForm>({
    name: '',
    description: '',
    price: '',
    category: '',
    storeId: ''
  });

  // Fetch data
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
    enabled: true,
  });

  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ['/api/stores'],
    enabled: true,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    enabled: true,
  });

  // Create store mutation
  const createStoreMutation = useMutation({
    mutationFn: async (data: AdminCreateStoreForm) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'فشل في إنشاء المتجر');
      }
      return result;
    },
    onSuccess: (result) => {
      toast({
        title: 'تم إنشاء المتجر',
        description: `تم إضافة متجر "${result.store.name}" بنجاح`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/stores'] });
      setCreateStoreOpen(false);
      setStoreForm({
        name: '',
        description: '',
        category: '',
        address: '',
        phone: '',
        ownerId: ''
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ في إنشاء المتجر',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: AdminCreateProductForm) => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          storeId: parseInt(data.storeId),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'فشل في إنشاء المنتج');
      }
      return result;
    },
    onSuccess: (result) => {
      toast({
        title: 'تم إنشاء المنتج',
        description: `تم إضافة منتج "${result.product.name}" بنجاح`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setCreateProductOpen(false);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        storeId: ''
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'خطأ في إنشاء المنتج',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">غير مخول للوصول</h1>
          <p className="text-gray-600 mb-4">هذه الصفحة مخصصة للمسؤولين فقط</p>
          <Link href="/">
            <Button>العودة إلى الرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (usersLoading || storesLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الطلبات والموافقات</h1>
            <p className="text-gray-600">قم بإدارة طلبات المتاجر والمنتجات والموافقة عليها</p>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="outline">
              <ArrowRight className="w-4 h-4 ml-2" />
              العودة إلى لوحة التحكم
            </Button>
          </Link>
        </div>

        {/* Admin Creation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Create Store Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5 text-green-600" />
                إضافة متجر جديد
              </CardTitle>
              <CardDescription>
                قم بإنشاء متجر جديد كمسؤول للنظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={createStoreOpen} onOpenChange={setCreateStoreOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة متجر
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>إنشاء متجر جديد</DialogTitle>
                    <DialogDescription>
                      قم بملء البيانات لإنشاء متجر جديد
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="store-name">اسم المتجر</Label>
                      <Input
                        id="store-name"
                        value={storeForm.name}
                        onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                        placeholder="أدخل اسم المتجر"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-description">الوصف</Label>
                      <Textarea
                        id="store-description"
                        value={storeForm.description}
                        onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                        placeholder="وصف المتجر"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-category">الفئة</Label>
                      <Select
                        value={storeForm.category}
                        onValueChange={(value) => setStoreForm({ ...storeForm, category: value })}
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          {storeCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="store-owner">صاحب المتجر</Label>
                      <Select
                        value={storeForm.ownerId}
                        onValueChange={(value) => setStoreForm({ ...storeForm, ownerId: value })}
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر المستخدم" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user: any) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.fullName || user.username} - {user.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="store-address">العنوان</Label>
                      <Input
                        id="store-address"
                        value={storeForm.address}
                        onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                        placeholder="عنوان المتجر"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-phone">رقم الهاتف</Label>
                      <Input
                        id="store-phone"
                        value={storeForm.phone}
                        onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                        placeholder="رقم الهاتف"
                        className="text-right"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => createStoreMutation.mutate(storeForm)}
                      disabled={createStoreMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {createStoreMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء المتجر'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Create Product Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                إضافة منتج جديد
              </CardTitle>
              <CardDescription>
                قم بإنشاء منتج جديد كمسؤول للنظام
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={createProductOpen} onOpenChange={setCreateProductOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة منتج
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>إنشاء منتج جديد</DialogTitle>
                    <DialogDescription>
                      قم بملء البيانات لإنشاء منتج جديد
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="product-name">اسم المنتج</Label>
                      <Input
                        id="product-name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="أدخل اسم المنتج"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-description">الوصف</Label>
                      <Textarea
                        id="product-description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        placeholder="وصف المنتج"
                        className="text-right"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-price">السعر</Label>
                      <Input
                        id="product-price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="0.00"
                        className="text-right"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product-category">الفئة</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="product-store">المتجر</Label>
                      <Select
                        value={productForm.storeId}
                        onValueChange={(value) => setProductForm({ ...productForm, storeId: value })}
                      >
                        <SelectTrigger className="text-right">
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
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => createProductMutation.mutate(productForm)}
                      disabled={createProductMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {createProductMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء المنتج'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">إجمالي المستخدمين</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">إجمالي المتاجر</p>
                  <p className="text-3xl font-bold">{stores.length}</p>
                </div>
                <Store className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">إجمالي المنتجات</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}