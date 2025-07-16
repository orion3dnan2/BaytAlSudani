import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Store, Package, Briefcase, Bell, Settings, ArrowRight, Plus, Shield } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
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

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/services'],
    enabled: true,
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/jobs'],
    enabled: true,
  });

  const { data: announcements = [], isLoading: announcementsLoading } = useQuery({
    queryKey: ['/api/announcements'],
    enabled: true,
  });

  if (usersLoading || storesLoading || productsLoading || servicesLoading || jobsLoading || announcementsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: "المستخدمين", value: users.length, icon: Users, color: "bg-blue-500" },
    { title: "المتاجر", value: stores.length, icon: Store, color: "bg-green-500" },
    { title: "المنتجات", value: products.length, icon: Package, color: "bg-purple-500" },
    { title: "الخدمات", value: services.length, icon: Briefcase, color: "bg-orange-500" },
    { title: "الوظائف", value: jobs.length, icon: Briefcase, color: "bg-teal-500" },
    { title: "الإعلانات", value: announcements.length, icon: Bell, color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم المسؤول</h1>
            <p className="text-gray-600">مرحباً بك في لوحة التحكم الرئيسية</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/requests">
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                إدارة الطلبات
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                العودة للصفحة الرئيسية
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Tables */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">المستخدمين</TabsTrigger>
            <TabsTrigger value="stores">المتاجر</TabsTrigger>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="services">الخدمات</TabsTrigger>
            <TabsTrigger value="jobs">الوظائف</TabsTrigger>
            <TabsTrigger value="announcements">الإعلانات</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المستخدمين</CardTitle>
                <CardDescription>قائمة جميع المستخدمين المسجلين في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا يوجد مستخدمون</p>
                    <p className="text-gray-400 text-sm">لم يتم تسجيل أي مستخدمين في النظام بعد</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-right">الاسم</th>
                          <th className="border border-gray-300 p-2 text-right">البريد الإلكتروني</th>
                          <th className="border border-gray-300 p-2 text-right">الدور</th>
                          <th className="border border-gray-300 p-2 text-right">الحالة</th>
                          <th className="border border-gray-300 p-2 text-right">تاريخ التسجيل</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user: any) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{user.fullName}</td>
                            <td className="border border-gray-300 p-2">{user.email}</td>
                            <td className="border border-gray-300 p-2">
                              <Badge variant={user.role === 'admin' ? 'default' : user.role === 'store_owner' ? 'secondary' : 'outline'}>
                                {user.role === 'admin' ? 'مسؤول' : user.role === 'store_owner' ? 'صاحب متجر' : 'عميل'}
                              </Badge>
                            </td>
                            <td className="border border-gray-300 p-2">
                              <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                {user.isActive ? 'نشط' : 'غير نشط'}
                              </Badge>
                            </td>
                            <td className="border border-gray-300 p-2">
                              {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المتاجر</CardTitle>
                <CardDescription>قائمة جميع المتاجر المسجلة في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                {stores.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد متاجر</p>
                    <p className="text-gray-400 text-sm">لم يتم تسجيل أي متاجر في النظام بعد</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-right">اسم المتجر</th>
                          <th className="border border-gray-300 p-2 text-right">الفئة</th>
                          <th className="border border-gray-300 p-2 text-right">العنوان</th>
                          <th className="border border-gray-300 p-2 text-right">الحالة</th>
                          <th className="border border-gray-300 p-2 text-right">تاريخ الإنشاء</th>
                          <th className="border border-gray-300 p-2 text-right">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stores.map((store: any) => (
                          <tr key={store.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2 font-medium">{store.name}</td>
                            <td className="border border-gray-300 p-2">{store.category}</td>
                            <td className="border border-gray-300 p-2">{store.address}</td>
                            <td className="border border-gray-300 p-2">
                              <Badge variant={store.isActive ? 'default' : 'destructive'}>
                                {store.isActive ? 'نشط' : 'غير نشط'}
                              </Badge>
                            </td>
                            <td className="border border-gray-300 p-2">
                              {new Date(store.createdAt).toLocaleDateString('ar-SA')}
                            </td>
                            <td className="border border-gray-300 p-2">
                              <a 
                                href={`/admin/stores/${store.id}`}
                                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                              >
                                عرض التفاصيل
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المنتجات</CardTitle>
                <CardDescription>قائمة جميع المنتجات في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد منتجات</p>
                    <p className="text-gray-400 text-sm">لم يتم إضافة أي منتجات في النظام بعد</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-right">اسم المنتج</th>
                          <th className="border border-gray-300 p-2 text-right">السعر</th>
                          <th className="border border-gray-300 p-2 text-right">الفئة</th>
                          <th className="border border-gray-300 p-2 text-right">الحالة</th>
                          <th className="border border-gray-300 p-2 text-right">تاريخ الإضافة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product: any) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{product.name}</td>
                            <td className="border border-gray-300 p-2">{product.price} جنيه</td>
                            <td className="border border-gray-300 p-2">{product.category}</td>
                            <td className="border border-gray-300 p-2">
                              <Badge variant={product.isActive ? 'default' : 'destructive'}>
                                {product.isActive ? 'نشط' : 'غير نشط'}
                              </Badge>
                            </td>
                            <td className="border border-gray-300 p-2">
                              {new Date(product.createdAt).toLocaleDateString('ar-SA')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الخدمات</CardTitle>
                <CardDescription>قائمة جميع الخدمات في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد خدمات</p>
                    <p className="text-gray-400 text-sm">لم يتم إضافة أي خدمات في النظام بعد</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-right">اسم الخدمة</th>
                          <th className="border border-gray-300 p-2 text-right">السعر</th>
                          <th className="border border-gray-300 p-2 text-right">الفئة</th>
                          <th className="border border-gray-300 p-2 text-right">الحالة</th>
                          <th className="border border-gray-300 p-2 text-right">تاريخ الإضافة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((service: any) => (
                          <tr key={service.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{service.name}</td>
                            <td className="border border-gray-300 p-2">{service.price} جنيه</td>
                            <td className="border border-gray-300 p-2">{service.category}</td>
                            <td className="border border-gray-300 p-2">
                              <Badge variant={service.isActive ? 'default' : 'destructive'}>
                                {service.isActive ? 'نشط' : 'غير نشط'}
                              </Badge>
                            </td>
                            <td className="border border-gray-300 p-2">
                              {new Date(service.createdAt).toLocaleDateString('ar-SA')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الوظائف</CardTitle>
                <CardDescription>قائمة جميع الوظائف في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد وظائف</p>
                    <p className="text-gray-400 text-sm">لم يتم إضافة أي وظائف في النظام بعد</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-right">عنوان الوظيفة</th>
                          <th className="border border-gray-300 p-2 text-right">الراتب</th>
                          <th className="border border-gray-300 p-2 text-right">الموقع</th>
                          <th className="border border-gray-300 p-2 text-right">الحالة</th>
                          <th className="border border-gray-300 p-2 text-right">تاريخ الإضافة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.map((job: any) => (
                          <tr key={job.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{job.title}</td>
                            <td className="border border-gray-300 p-2">{job.salary} جنيه</td>
                            <td className="border border-gray-300 p-2">{job.location}</td>
                            <td className="border border-gray-300 p-2">
                              <Badge variant={job.isActive ? 'default' : 'destructive'}>
                                {job.isActive ? 'نشط' : 'غير نشط'}
                              </Badge>
                            </td>
                            <td className="border border-gray-300 p-2">
                              {new Date(job.createdAt).toLocaleDateString('ar-SA')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الإعلانات</CardTitle>
                <CardDescription>قائمة جميع الإعلانات في النظام</CardDescription>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد إعلانات</p>
                    <p className="text-gray-400 text-sm">لم يتم إضافة أي إعلانات في النظام بعد</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-right">عنوان الإعلان</th>
                          <th className="border border-gray-300 p-2 text-right">المحتوى</th>
                          <th className="border border-gray-300 p-2 text-right">الحالة</th>
                          <th className="border border-gray-300 p-2 text-right">تاريخ الإضافة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {announcements.map((announcement: any) => (
                          <tr key={announcement.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{announcement.title}</td>
                            <td className="border border-gray-300 p-2">{announcement.content.substring(0, 100)}...</td>
                            <td className="border border-gray-300 p-2">
                              <Badge variant={announcement.isActive ? 'default' : 'destructive'}>
                                {announcement.isActive ? 'نشط' : 'غير نشط'}
                              </Badge>
                            </td>
                            <td className="border border-gray-300 p-2">
                              {new Date(announcement.createdAt).toLocaleDateString('ar-SA')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}