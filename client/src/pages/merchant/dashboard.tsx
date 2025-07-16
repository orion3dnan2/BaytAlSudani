import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Package, Briefcase, Bell, ArrowRight, Plus, Edit, Eye } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function MerchantDashboard() {
  const { user } = useAuth();

  const { data: allStores = [], isLoading: storesLoading } = useQuery({
    queryKey: ['/api/stores'],
    enabled: true,
  });

  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    enabled: true,
  });

  const { data: allServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/services'],
    enabled: true,
  });

  const { data: allJobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/jobs'],
    enabled: true,
  });

  const { data: allAnnouncements = [], isLoading: announcementsLoading } = useQuery({
    queryKey: ['/api/announcements'],
    enabled: true,
  });

  // Filter data to show only items owned by the current user
  const stores = allStores.filter(store => store.ownerId === user?.id?.toString());
  const storeIds = stores.map(store => store.id);
  const products = allProducts.filter(product => storeIds.includes(product.storeId));
  const services = allServices.filter(service => storeIds.includes(service.storeId));
  const jobs = allJobs.filter(job => storeIds.includes(job.storeId));
  const announcements = allAnnouncements.filter(announcement => storeIds.includes(announcement.storeId));

  if (storesLoading || productsLoading || servicesLoading || jobsLoading || announcementsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: "متاجري", value: stores.length, icon: Store, color: "bg-green-500" },
    { title: "منتجاتي", value: products.length, icon: Package, color: "bg-purple-500" },
    { title: "خدماتي", value: services.length, icon: Briefcase, color: "bg-orange-500" },
    { title: "وظائفي", value: jobs.length, icon: Briefcase, color: "bg-teal-500" },
    { title: "إعلاناتي", value: announcements.length, icon: Bell, color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم التاجر</h1>
            <p className="text-gray-600">مرحباً {user?.fullName}، إدارة متاجرك ومنتجاتك</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

        {/* Management Tabs */}
        <Tabs defaultValue="stores" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="stores">المتاجر</TabsTrigger>
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="services">الخدمات</TabsTrigger>
            <TabsTrigger value="jobs">الوظائف</TabsTrigger>
            <TabsTrigger value="announcements">الإعلانات</TabsTrigger>
          </TabsList>

          <TabsContent value="stores" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>إدارة المتاجر</CardTitle>
                  <CardDescription>إدارة وتطوير متاجرك</CardDescription>
                </div>
                <Button className="bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/stores/create">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة متجر جديد
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {stores.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد متاجر</p>
                    <p className="text-gray-400 text-sm">ابدأ بإنشاء متجرك الأول</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stores.map((store: any) => (
                      <Card key={store.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{store.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-2">{store.description}</p>
                          <div className="space-y-1 text-sm text-gray-500">
                            <p>الفئة: {store.category}</p>
                            <p>العنوان: {store.address}</p>
                          </div>
                          <Badge variant={store.isActive ? 'default' : 'destructive'} className="mt-2 mb-3">
                            {store.isActive ? 'نشط' : 'غير نشط'}
                          </Badge>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" asChild className="flex-1 border-green-500 text-green-600 hover:bg-green-500 hover:text-white">
                              <Link href={`/stores/edit/${store.id}`}>
                                <Edit className="w-4 h-4 mr-1" />
                                تعديل
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="flex-1">
                              <Link href={`/store/${store.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                عرض
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>إدارة المنتجات</CardTitle>
                  <CardDescription>إضافة وإدارة منتجاتك</CardDescription>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة منتج جديد
                </Button>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد منتجات</p>
                    <p className="text-gray-400 text-sm">ابدأ بإضافة منتجاتك</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product: any) => (
                      <Card key={product.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-2">{product.description}</p>
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-purple-600">{product.price} جنيه</p>
                            <p className="text-sm text-gray-500">الفئة: {product.category}</p>
                          </div>
                          <Badge variant={product.isActive ? 'default' : 'destructive'} className="mt-2 mb-3">
                            {product.isActive ? 'متوفر' : 'غير متوفر'}
                          </Badge>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" asChild className="flex-1 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white">
                              <Link href={`/products/edit/${product.id}`}>
                                <Edit className="w-4 h-4 mr-1" />
                                تعديل
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild className="flex-1">
                              <Link href={`/product/${product.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                عرض
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>إدارة الخدمات</CardTitle>
                  <CardDescription>إضافة وإدارة خدماتك</CardDescription>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة خدمة جديدة
                </Button>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد خدمات</p>
                    <p className="text-gray-400 text-sm">ابدأ بإضافة خدماتك</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service: any) => (
                      <Card key={service.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-2">{service.description}</p>
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-orange-600">{service.price} جنيه</p>
                            <p className="text-sm text-gray-500">الفئة: {service.category}</p>
                          </div>
                          <Badge variant={service.isActive ? 'default' : 'destructive'} className="mt-2">
                            {service.isActive ? 'متاح' : 'غير متاح'}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>إدارة الوظائف</CardTitle>
                  <CardDescription>نشر وإدارة الوظائف المتاحة</CardDescription>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة وظيفة جديدة
                </Button>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد وظائف</p>
                    <p className="text-gray-400 text-sm">ابدأ بنشر الوظائف المتاحة</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.map((job: any) => (
                      <Card key={job.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-2">{job.description}</p>
                          <div className="space-y-1">
                            <p className="text-lg font-bold text-teal-600">{job.salary} جنيه/شهر</p>
                            <p className="text-sm text-gray-500">الموقع: {job.location}</p>
                          </div>
                          <Badge variant={job.isActive ? 'default' : 'destructive'} className="mt-2">
                            {job.isActive ? 'متاح' : 'منتهي'}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>إدارة الإعلانات</CardTitle>
                  <CardDescription>نشر الإعلانات والعروض</CardDescription>
                </div>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة إعلان جديد
                </Button>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد إعلانات</p>
                    <p className="text-gray-400 text-sm">ابدأ بنشر إعلاناتك</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {announcements.map((announcement: any) => (
                      <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-2">{announcement.content}</p>
                          <Badge variant={announcement.isActive ? 'default' : 'destructive'} className="mt-2">
                            {announcement.isActive ? 'نشط' : 'منتهي'}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
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