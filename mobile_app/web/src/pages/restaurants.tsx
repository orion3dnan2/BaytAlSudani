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
  MapPin,
  ChefHat,
  Coffee,
  Utensils
} from "lucide-react";

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  const { data: stores, isLoading, refetch } = useQuery({
    queryKey: ['/api/stores'],
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const cuisineTypes = [
    { value: "all", label: "جميع المأكولات" },
    { value: "سوداني", label: "مأكولات سودانية" },
    { value: "عربي", label: "مأكولات عربية" },
    { value: "شرقي", label: "مأكولات شرقية" },
    { value: "غربي", label: "مأكولات غربية" },
    { value: "مشاوي", label: "مشاوي" },
    { value: "مأكولات بحرية", label: "مأكولات بحرية" },
    { value: "حلويات", label: "حلويات ومعجنات" },
    { value: "مشروبات", label: "مشروبات وعصائر" },
    { value: "وجبات سريعة", label: "وجبات سريعة" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث" },
    { value: "rating", label: "الأعلى تقييماً" },
    { value: "popular", label: "الأكثر شعبية" },
    { value: "name-asc", label: "الاسم: أ-ي" },
    { value: "name-desc", label: "الاسم: ي-أ" },
  ];

  const filteredRestaurants = stores?.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Only show restaurants and cafes
    const isRestaurant = store.category === "restaurants-cafes" || store.category === "مطاعم وكافيهات" || store.category === "restaurants_cafes";
    
    return matchesSearch && isRestaurant;
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
      <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="absolute inset-0">
          <img 
            src={sudaneseMarketImage}
            alt="المطاعم السودانية"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-red-700/80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <ChefHat className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              مطاعم وكافيهات البيت السوداني
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              اكتشف أشهى المأكولات السودانية والعالمية
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="ابحث عن المطاعم والكافيهات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pr-14 text-lg rounded-full border-0 bg-white/95 backdrop-blur-sm"
                />
                <Button
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700 rounded-full"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            {/* Quick Categories */}
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              {["مأكولات سودانية", "مشاوي", "حلويات", "مشروبات", "وجبات سريعة"].map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-white/25 text-white hover:bg-white/35 border-white/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Utensils className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{filteredRestaurants?.length || 0}</div>
              <div className="text-sm text-gray-600">مطعم وكافيه</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Coffee className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">15+</div>
              <div className="text-sm text-gray-600">نوع مأكولات</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">متوسط التقييم</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">الخرطوم</div>
              <div className="text-sm text-gray-600">وجميع الولايات</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="w-4 h-4 ml-2" />
                  <SelectValue placeholder="نوع المأكولات" />
                </SelectTrigger>
                <SelectContent>
                  {cuisineTypes.map((cuisine) => (
                    <SelectItem key={cuisine.value} value={cuisine.value}>
                      {cuisine.label}
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
                {filteredRestaurants?.length} مطعم وكافيه
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

      {/* Restaurants Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredRestaurants && filteredRestaurants.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredRestaurants.map((restaurant) => (
                <StoreCard key={restaurant.id} store={restaurant} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ChefHat className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مطاعم</h3>
              <p className="text-gray-500">لم يتم العثور على مطاعم مطابقة لبحثك</p>
              <Button 
                className="mt-4 bg-orange-600 hover:bg-orange-700"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCuisine("all");
                }}
              >
                إعادة تعيين البحث
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}