import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Store, Package, Briefcase, Bell, Plus, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStoreSchema, insertProductSchema, insertServiceSchema, insertJobSchema, insertAnnouncementSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function MerchantDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  // Fetch merchant's data
  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ['/api/stores'],
    enabled: !!user,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    enabled: !!user,
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/services'],
    enabled: !!user,
  });

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/jobs'],
    enabled: !!user,
  });

  const { data: announcements = [], isLoading: announcementsLoading } = useQuery({
    queryKey: ['/api/announcements'],
    enabled: !!user,
  });

  // Filter data for current merchant
  const merchantStores = stores.filter((store: any) => store.ownerId === user?.id);
  const merchantStoreIds = merchantStores.map((store: any) => store.id);
  const merchantProducts = products.filter((product: any) => merchantStoreIds.includes(product.storeId));
  const merchantServices = services.filter((service: any) => merchantStoreIds.includes(service.storeId));
  const merchantJobs = jobs.filter((job: any) => merchantStoreIds.includes(job.storeId));
  const merchantAnnouncements = announcements.filter((announcement: any) => merchantStoreIds.includes(announcement.storeId));

  // Forms
  const storeForm = useForm({
    resolver: zodResolver(insertStoreSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      address: "",
      phone: "",
    },
  });

  const productForm = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      storeId: "",
    },
  });

  const serviceForm = useForm({
    resolver: zodResolver(insertServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      storeId: "",
    },
  });

  const jobForm = useForm({
    resolver: zodResolver(insertJobSchema),
    defaultValues: {
      title: "",
      description: "",
      salary: "",
      location: "",
      storeId: "",
    },
  });

  const announcementForm = useForm({
    resolver: zodResolver(insertAnnouncementSchema),
    defaultValues: {
      title: "",
      content: "",
      storeId: "",
    },
  });

  // Mutations
  const createStoreMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/stores', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stores'] });
      toast({ title: "تم إنشاء المتجر بنجاح" });
      setOpenDialog(null);
      storeForm.reset();
    },
    onError: () => {
      toast({ title: "حدث خطأ أثناء إنشاء المتجر", variant: "destructive" });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/products', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "تم إضافة المنتج بنجاح" });
      setOpenDialog(null);
      productForm.reset();
    },
    onError: () => {
      toast({ title: "حدث خطأ أثناء إضافة المنتج", variant: "destructive" });
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/services', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({ title: "تم إضافة الخدمة بنجاح" });
      setOpenDialog(null);
      serviceForm.reset();
    },
    onError: () => {
      toast({ title: "حدث خطأ أثناء إضافة الخدمة", variant: "destructive" });
    },
  });

  const createJobMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/jobs', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ title: "تم إضافة الوظيفة بنجاح" });
      setOpenDialog(null);
      jobForm.reset();
    },
    onError: () => {
      toast({ title: "حدث خطأ أثناء إضافة الوظيفة", variant: "destructive" });
    },
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/announcements', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      toast({ title: "تم إضافة الإعلان بنجاح" });
      setOpenDialog(null);
      announcementForm.reset();
    },
    onError: () => {
      toast({ title: "حدث خطأ أثناء إضافة الإعلان", variant: "destructive" });
    },
  });

  if (storesLoading || productsLoading || servicesLoading || jobsLoading || announcementsLoading) {
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
    { title: "المتاجر", value: merchantStores.length, icon: Store, color: "bg-blue-500" },
    { title: "المنتجات", value: merchantProducts.length, icon: Package, color: "bg-green-500" },
    { title: "الخدمات", value: merchantServices.length, icon: Briefcase, color: "bg-purple-500" },
    { title: "الوظائف", value: merchantJobs.length, icon: Briefcase, color: "bg-orange-500" },
    { title: "الإعلانات", value: merchantAnnouncements.length, icon: Bell, color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة تحكم التاجر</h1>
          <p className="text-gray-600">مرحباً {user?.fullName}، إدارة متجرك ومنتجاتك</p>
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">إدارة المتاجر</h2>
              <Dialog open={openDialog === 'store'} onOpenChange={(open) => setOpenDialog(open ? 'store' : null)}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة متجر جديد
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة متجر جديد</DialogTitle>
                    <DialogDescription>أدخل تفاصيل المتجر الجديد</DialogDescription>
                  </DialogHeader>
                  <Form {...storeForm}>
                    <form onSubmit={storeForm.handleSubmit((data) => createStoreMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={storeForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المتجر</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل اسم المتجر" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={storeForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>وصف المتجر</FormLabel>
                            <FormControl>
                              <Textarea placeholder="أدخل وصف المتجر" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={storeForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>فئة المتجر</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل فئة المتجر" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={storeForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>العنوان</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل عنوان المتجر" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={storeForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الهاتف</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل رقم الهاتف" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={createStoreMutation.isPending}>
                        {createStoreMutation.isPending ? 'جاري الإضافة...' : 'إضافة المتجر'}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {merchantStores.map((store: any) => (
                <Card key={store.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {store.name}
                      <Badge variant={store.isActive ? 'default' : 'secondary'}>
                        {store.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{store.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">الفئة: {store.category}</p>
                    <p className="text-sm text-gray-600 mb-2">العنوان: {store.address}</p>
                    <p className="text-sm text-gray-600">الهاتف: {store.phone}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">إدارة المنتجات</h2>
              <Dialog open={openDialog === 'product'} onOpenChange={(open) => setOpenDialog(open ? 'product' : null)}>
                <DialogTrigger asChild>
                  <Button disabled={merchantStores.length === 0}>
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة منتج جديد
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة منتج جديد</DialogTitle>
                    <DialogDescription>أدخل تفاصيل المنتج الجديد</DialogDescription>
                  </DialogHeader>
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit((data) => createProductMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={productForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم المنتج</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل اسم المنتج" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>وصف المنتج</FormLabel>
                            <FormControl>
                              <Textarea placeholder="أدخل وصف المنتج" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>السعر</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="أدخل السعر" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>فئة المنتج</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل فئة المنتج" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={productForm.control}
                        name="storeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>المتجر</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="اختر المتجر" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {merchantStores.map((store: any) => (
                                  <SelectItem key={store.id} value={store.id.toString()}>
                                    {store.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={createProductMutation.isPending}>
                        {createProductMutation.isPending ? 'جاري الإضافة...' : 'إضافة المنتج'}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            {merchantStores.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">يجب إنشاء متجر أولاً لإضافة المنتجات</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {merchantProducts.map((product: any) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {product.name}
                        <Badge variant={product.isActive ? 'default' : 'secondary'}>
                          {product.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">السعر: {product.price} جنيه</p>
                      <p className="text-sm text-gray-600">الفئة: {product.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Similar structure for services, jobs, and announcements tabs */}
          <TabsContent value="services" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">إدارة الخدمات</h2>
              <Button disabled={merchantStores.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة خدمة جديدة
              </Button>
            </div>
            {merchantStores.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">يجب إنشاء متجر أولاً لإضافة الخدمات</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {merchantServices.map((service: any) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {service.name}
                        <Badge variant={service.isActive ? 'default' : 'secondary'}>
                          {service.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">السعر: {service.price} جنيه</p>
                      <p className="text-sm text-gray-600">الفئة: {service.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">إدارة الوظائف</h2>
              <Button disabled={merchantStores.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة وظيفة جديدة
              </Button>
            </div>
            {merchantStores.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">يجب إنشاء متجر أولاً لإضافة الوظائف</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {merchantJobs.map((job: any) => (
                  <Card key={job.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {job.title}
                        <Badge variant={job.isActive ? 'default' : 'secondary'}>
                          {job.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{job.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-2">الراتب: {job.salary} جنيه</p>
                      <p className="text-sm text-gray-600">الموقع: {job.location}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">إدارة الإعلانات</h2>
              <Button disabled={merchantStores.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                إضافة إعلان جديد
              </Button>
            </div>
            {merchantStores.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">يجب إنشاء متجر أولاً لإضافة الإعلانات</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {merchantAnnouncements.map((announcement: any) => (
                  <Card key={announcement.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {announcement.title}
                        <Badge variant={announcement.isActive ? 'default' : 'secondary'}>
                          {announcement.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{announcement.content.substring(0, 100)}...</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}