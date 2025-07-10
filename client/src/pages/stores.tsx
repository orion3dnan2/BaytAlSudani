import { useState } from "react";
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
import StoreCard from "@/components/StoreCard";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal,
  Store,
  TrendingUp,
  Star,
  MapPin
} from "lucide-react";

export default function Stores() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  const { data: stores, isLoading } = useQuery({
    queryKey: ['/api/stores'],
  });

  const categories = [
    { value: "all", label: "جميع الفئات" },
    { value: "الإلكترونيات", label: "الإلكترونيات" },
    { value: "الأزياء والملابس", label: "الأزياء والملابس" },
    { value: "المنزل والحديقة", label: "المنزل والحديقة" },
    { value: "الصحة والجمال", label: "الصحة والجمال" },
    { value: "الرياضة واللياقة", label: "الرياضة واللياقة" },
    { value: "الكتب والقرطاسية", label: "الكتب والقرطاسية" },
    { value: "الألعاب والأطفال", label: "الألعاب والأطفال" },
    { value: "السيارات وقطع الغيار", label: "السيارات وقطع الغيار" },
    { value: "المجوهرات والإكسسوارات", label: "المجوهرات والإكسسوارات" },
    { value: "الحرف اليدوية والتراث", label: "الحرف اليدوية والتراث" },
    { value: "الخدمات المهنية", label: "الخدمات المهنية" },
    { value: "التعليم والتدريب", label: "التعليم والتدريب" },
    { value: "التكنولوجيا والبرمجيات", label: "التكنولوجيا والبرمجيات" },
    { value: "الزراعة والثروة الحيوانية", label: "الزراعة والثروة الحيوانية" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث" },
    { value: "oldest", label: "الأقدم" },
    { value: "name-asc", label: "الاسم: أ-ي" },
    { value: "name-desc", label: "الاسم: ي-أ" },
    { value: "popular", label: "الأكثر شعبية" },
  ];

  const filteredStores = stores?.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || store.category === selectedCategory;
    
    // Exclude restaurant stores from general stores page
    const isNotRestaurant = store.category !== "restaurants-cafes" && store.category !== "مطاعم وكافيهات";
    
    return matchesSearch && matchesCategory && isNotRestaurant;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-sudan-heritage text-white py-16">
        <div className="absolute inset-0">
          <img 
            src={sudaneseMarketImage}
            alt="السوق السوداني"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sudan-blue/80 to-sudan-red/80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              متاجر البيت السوداني
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              اكتشف أفضل المتاجر السودانية في مكان واحد
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="ابحث عن المتاجر..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pr-14 text-lg rounded-full border-0 bg-white/95 backdrop-blur-sm"
                />
                <Button
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sudan-blue hover:bg-sudan-blue/90 rounded-full"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="w-4 h-4 ml-2" />
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
                <SelectTrigger className="w-[150px]">
                  <SlidersHorizontal className="w-4 h-4 ml-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filteredStores?.length} متجر
              </span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-md"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-md"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredStores && filteredStores.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Store className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد متاجر</h3>
              <p className="text-gray-500">لم يتم العثور على متاجر مطابقة لبحثك</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}