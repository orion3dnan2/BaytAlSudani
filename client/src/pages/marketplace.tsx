import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShoppingCart, Store, Package, MapPin } from "lucide-react";

export default function Marketplace() {
  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ['/api/stores'],
    enabled: true,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    enabled: true,
  });

  if (storesLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل السوق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">السوق 🛒</h1>
            <p className="text-xl text-gray-600">تسوق من المتاجر المحلية واكتشف منتجات متنوعة</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              العودة للصفحة الرئيسية
            </Button>
          </Link>
        </div>

        {/* Stores Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Store className="w-6 h-6" />
            المتاجر المتاحة
          </h2>
          
          {stores.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا توجد متاجر</p>
                <p className="text-gray-400 text-sm">لم يتم تسجيل أي متاجر بعد</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store: any) => (
                <Card key={store.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="w-5 h-5" />
                      {store.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{store.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Package className="w-4 h-4" />
                        {store.category}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {store.address}
                      </div>
                      <Badge variant={store.isActive ? 'default' : 'destructive'}>
                        {store.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Products Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="w-6 h-6" />
            المنتجات المتاحة
          </h2>
          
          {products.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا توجد منتجات</p>
                <p className="text-gray-400 text-sm">لم يتم إضافة أي منتجات بعد</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-3">{product.description}</p>
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-green-600">
                        {product.price} جنيه
                      </div>
                      <div className="text-sm text-gray-500">
                        الفئة: {product.category}
                      </div>
                      <Badge variant={product.isActive ? 'default' : 'destructive'}>
                        {product.isActive ? 'متوفر' : 'غير متوفر'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
