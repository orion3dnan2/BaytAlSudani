import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Store, User, Mail, Calendar, Eye, Package, Briefcase, Megaphone, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StoreDetails {
  id: number;
  name: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  owner: {
    id: number;
    fullName: string;
    email: string;
    username: string;
  };
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

interface Job {
  id: number;
  title: string;
  description: string;
  salary: string;
  location: string;
  isActive: boolean;
  createdAt: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
}

export default function StoreDetails() {
  const [, params] = useRoute("/admin/stores/:id");
  const [, setLocation] = useLocation();
  const storeId = params?.id;

  const { data: store, isLoading: storeLoading, error: storeError } = useQuery({
    queryKey: ['/api/stores', storeId],
    enabled: !!storeId,
  });

  const { data: owner, isLoading: ownerLoading } = useQuery({
    queryKey: ['/api/users', store?.ownerId],
    enabled: !!store?.ownerId,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products/store', storeId],
    enabled: !!storeId,
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/services/store', storeId],
    enabled: !!storeId,
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/jobs/store', storeId],
    enabled: !!storeId,
  });

  const { data: announcements = [], isLoading: announcementsLoading } = useQuery({
    queryKey: ['/api/announcements/store', storeId],
    enabled: !!storeId,
  });

  if (!storeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <Alert>
          <AlertDescription>معرف المتجر غير صحيح</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل تفاصيل المتجر...</p>
        </div>
      </div>
    );
  }

  if (storeError || !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <Alert variant="destructive">
          <AlertDescription>خطأ في تحميل بيانات المتجر</AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatCurrency = (amount: string) => {
    return `${amount} ج.س`;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/admin/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للوحة الإدارة
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-full p-3">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">تفاصيل المتجر</h1>
                <p className="text-gray-600">عرض وإدارة تفاصيل المتجر</p>
              </div>
            </div>
          </div>
        </div>

        {/* Store Info Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl mb-2">{store.name}</CardTitle>
                  <CardDescription className="text-gray-600 mb-4 max-w-2xl">
                    {store.description}
                  </CardDescription>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {ownerLoading ? "جاري التحميل..." : owner?.fullName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {ownerLoading ? "جاري التحميل..." : owner?.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(store.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={store.isActive ? "default" : "secondary"}>
                  {store.isActive ? "نشط" : "غير نشط"}
                </Badge>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  إدارة المتجر
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">الفئة</h3>
                <p className="text-gray-600">{store.category}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">العنوان</h3>
                <p className="text-gray-600">{store.address}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">الهاتف</h3>
                <p className="text-gray-600">{store.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full p-3">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">المنتجات</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">الخدمات</p>
                  <p className="text-2xl font-bold text-gray-900">{services.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 rounded-full p-3">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">الوظائف</p>
                  <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 rounded-full p-3">
                  <Megaphone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">الإعلانات</p>
                  <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="services">الخدمات</TabsTrigger>
            <TabsTrigger value="jobs">الوظائف</TabsTrigger>
            <TabsTrigger value="announcements">الإعلانات</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>منتجات المتجر</CardTitle>
                <CardDescription>جميع المنتجات المعروضة في هذا المتجر</CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل المنتجات...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد منتجات في هذا المتجر</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم المنتج</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ الإضافة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product: Product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>
                            <Badge variant={product.isActive ? "default" : "secondary"}>
                              {product.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(product.createdAt)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">تعديل</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>خدمات المتجر</CardTitle>
                <CardDescription>جميع الخدمات المقدمة من هذا المتجر</CardDescription>
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل الخدمات...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد خدمات في هذا المتجر</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم الخدمة</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ الإضافة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service: Service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>{service.category}</TableCell>
                          <TableCell>{formatCurrency(service.price)}</TableCell>
                          <TableCell>
                            <Badge variant={service.isActive ? "default" : "secondary"}>
                              {service.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(service.createdAt)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">تعديل</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>وظائف المتجر</CardTitle>
                <CardDescription>جميع الوظائف المعلن عنها من هذا المتجر</CardDescription>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل الوظائف...</p>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد وظائف معلن عنها من هذا المتجر</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المسمى الوظيفي</TableHead>
                        <TableHead>المكان</TableHead>
                        <TableHead>الراتب</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ الإعلان</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job: Job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.location || "غير محدد"}</TableCell>
                          <TableCell>{job.salary ? formatCurrency(job.salary) : "غير محدد"}</TableCell>
                          <TableCell>
                            <Badge variant={job.isActive ? "default" : "secondary"}>
                              {job.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(job.createdAt)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">مراجعة</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>إعلانات المتجر</CardTitle>
                <CardDescription>جميع الإعلانات المنشورة من هذا المتجر</CardDescription>
              </CardHeader>
              <CardContent>
                {announcementsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل الإعلانات...</p>
                  </div>
                ) : announcements.length === 0 ? (
                  <div className="text-center py-12">
                    <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد إعلانات من هذا المتجر</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>عنوان الإعلان</TableHead>
                        <TableHead>المحتوى</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ النشر</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {announcements.map((announcement: Announcement) => (
                        <TableRow key={announcement.id}>
                          <TableCell className="font-medium">{announcement.title}</TableCell>
                          <TableCell className="max-w-xs truncate">{announcement.content}</TableCell>
                          <TableCell>
                            <Badge variant={announcement.isActive ? "default" : "secondary"}>
                              {announcement.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(announcement.createdAt)}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">مراجعة</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}