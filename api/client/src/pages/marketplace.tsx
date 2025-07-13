import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import sudaneseMarketImage from "@assets/sudanese-market.jpg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import ProductCard from "@/components/ProductCard";
import StoreCard from "@/components/StoreCard";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal,
  Package,
  Store,
  TrendingUp,
  Star
} from "lucide-react";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTab, setActiveTab] = useState<"products" | "stores">("products");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ['/api/stores'],
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const categories = [
    { value: "all", label: "جميع الفئات" },
    { value: "إلكترونيات", label: "الإلكترونيات" },
    { value: "أزياء", label: "الأزياء" },
    { value: "مطاعم وكافيهات", label: "مطاعم وكافيهات" },
    { value: "منزل", label: "المنزل والحديقة" },
    { value: "صحة", label: "الصحة والجمال" },
    { value: "رياضة", label: "الرياضة" },
    { value: "كتب", label: "الكتب" },
    { value: "ألعاب", label: "الألعاب" },
    { value: "سيارات", label: "السيارات" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث" },
    { value: "price-low", label: "السعر: من الأقل للأعلى" },
    { value: "price-high", label: "السعر: من الأعلى للأقل" },
    { value: "rating", label: "الأعلى تقييماً" },
    { value: "popular", label: "الأكثر شعبية" },
  ];

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredStores = stores?.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || store.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (storesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-sudan-heritage text-white py-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#871414]/80 via-[#871414]/70 to-[#871414]/85"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
            style={{
              backgroundImage: `url("${sudaneseMarketImage}")`,
              backgroundPosition: "center center"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#871414]/60 via-transparent to-[#871414]/60"></div>
        </div>
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 pattern-sudanese-geometric opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">السوق السوداني</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">اكتشف أفضل المتاجر والمنتجات السودانية</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                placeholder="ابحث عن المنتجات أو المتاجر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 py-6 text-lg bg-white/95 backdrop-blur-sm text-gray-900 border-0 rounded-xl shadow-lg"
              />
              <Button 
                className="absolute right-2 top-2 bg-sudan-blue hover:bg-sudan-blue/90 rounded-lg shadow-md"
                size="icon"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Filters and Controls */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Tabs */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button
                variant={activeTab === "products" ? "default" : "ghost"}
                onClick={() => setActiveTab("products")}
                className={activeTab === "products" ? "bg-sudan-blue text-white" : ""}
              >
                <Package className="w-4 h-4 mr-2" />
                المنتجات ({filteredProducts?.length || 0})
              </Button>
              <Button
                variant={activeTab === "stores" ? "default" : "ghost"}
                onClick={() => setActiveTab("stores")}
                className={activeTab === "stores" ? "bg-sudan-blue text-white" : ""}
              >
                <Store className="w-4 h-4 mr-2" />
                المتاجر ({filteredStores?.length || 0})
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size={isMobile ? "sm" : "icon"}
                  onClick={() => setViewMode("grid")}
                  className={isMobile ? "px-3" : ""}
                >
                  <Grid className="w-4 h-4" />
                  {isMobile && <span className="mr-2">شبكة</span>}
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size={isMobile ? "sm" : "icon"}
                  onClick={() => setViewMode("list")}
                  className={isMobile ? "px-3" : ""}
                >
                  <List className="w-4 h-4" />
                  {isMobile && <span className="mr-2">قائمة</span>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Active Filters */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">الفلاتر النشطة:</span>
              {searchQuery && (
                <Badge variant="secondary" className="bg-sudan-blue/10 text-sudan-blue">
                  البحث: {searchQuery}
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="ml-2 text-xs hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="bg-sudan-blue/10 text-sudan-blue">
                  الفئة: {categories.find(c => c.value === selectedCategory)?.label}
                  <button 
                    onClick={() => setSelectedCategory("all")}
                    className="ml-2 text-xs hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              {filteredProducts && filteredProducts.length > 0 ? (
                <div className={`grid gap-3 md:gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1"
                }`}>
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                      compact={isMobile}
                      className={viewMode === "list" ? "md:flex md:items-center" : ""}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لا توجد منتجات
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery || selectedCategory !== "all" 
                      ? "لا توجد منتجات تطابق البحث المحدد"
                      : "لا توجد منتجات متاحة حالياً"
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Stores Tab */}
          {activeTab === "stores" && (
            <div>
              {filteredStores && filteredStores.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                    : "grid-cols-1"
                }`}>
                  {filteredStores.map((store) => (
                    <StoreCard 
                      key={store.id} 
                      store={store} 
                      className={viewMode === "list" ? "md:flex md:items-center" : ""}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لا توجد متاجر
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery || selectedCategory !== "all" 
                      ? "لا توجد متاجر تطابق البحث المحدد"
                      : "لا توجد متاجر متاحة حالياً"
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      {/* Popular Categories */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            الفئات الشائعة
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(1, 7).map((category) => (
              <Card 
                key={category.value}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                onClick={() => setSelectedCategory(category.value)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">
                    {category.value === "إلكترونيات" && "📱"}
                    {category.value === "أزياء" && "👕"}
                    {category.value === "منزل" && "🏠"}
                    {category.value === "صحة" && "💄"}
                    {category.value === "رياضة" && "⚽"}
                    {category.value === "كتب" && "📚"}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {category.label}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}