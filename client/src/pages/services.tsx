import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import serviceBgImage from "@assets/image_1752142698818.png";
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
import { 
  Search, 
  Grid, 
  List, 
  Settings,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Phone,
  Mail,
  User,
  Wrench
} from "lucide-react";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  const { data: services, isLoading } = useQuery({
    queryKey: ['/api/services'],
  });

  const categories = [
    { value: "all", label: "جميع الخدمات" },
    { value: "تقنية", label: "خدمات تقنية" },
    { value: "منزلية", label: "خدمات منزلية" },
    { value: "تعليمية", label: "خدمات تعليمية" },
    { value: "صحية", label: "خدمات صحية" },
    { value: "قانونية", label: "خدمات قانونية" },
    { value: "نقل", label: "خدمات النقل" },
    { value: "إصلاح", label: "خدمات الإصلاح" },
    { value: "تصميم", label: "خدمات التصميم" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث" },
    { value: "price-low", label: "السعر: من الأقل للأعلى" },
    { value: "price-high", label: "السعر: من الأعلى للأقل" },
    { value: "rating", label: "الأعلى تقييماً" },
    { value: "popular", label: "الأكثر طلباً" },
  ];

  const filteredServices = services?.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-sudan-heritage text-white py-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#871414]/70 via-[#871414]/60 to-[#871414]/80"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: `url("${serviceBgImage}")`,
              backgroundPosition: "center center"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#871414]/50 via-transparent to-[#871414]/50"></div>
        </div>
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 pattern-sudanese-geometric opacity-5"></div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">الخدمات المهنية</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              احصل على خدمات متخصصة من أفضل مقدمي الخدمات في السودان
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                placeholder="ابحث عن الخدمات التي تحتاجها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 py-6 text-lg bg-white text-gray-900 border-0 rounded-xl"
              />
              <Button 
                className="absolute right-2 top-2 bg-sudan-blue hover:bg-sudan-blue/90 rounded-lg"
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
            {/* Stats */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Settings className="w-5 h-5 text-sudan-blue" />
                <span className="text-lg font-semibold text-gray-900">
                  {filteredServices?.length || 0} خدمة متاحة
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اختر فئة الخدمة" />
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
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
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

          {/* Services Grid/List */}
          {filteredServices && filteredServices.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Service Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {service.name}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-sudan-blue/10 rounded-full flex items-center justify-center mr-4">
                          <Wrench className="w-6 h-6 text-sudan-blue" />
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-2xl font-bold text-green-600">
                            {service.price} جنيه
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                          <Settings className="w-4 h-4" />
                          <span>فئة: {service.category}</span>
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>مضاف منذ: {new Date(service.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={service.isActive ? "default" : "secondary"}
                            className={service.isActive ? "bg-green-100 text-green-800" : ""}
                          >
                            {service.isActive ? "متاح الآن" : "غير متاح"}
                          </Badge>
                          
                          <div className="flex items-center space-x-1 space-x-reverse">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="text-sm text-gray-500 mr-1">(4.0)</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 space-x-reverse pt-4">
                        <Button 
                          className="flex-1 bg-sudan-blue hover:bg-sudan-blue/90"
                          disabled={!service.isActive}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          طلب الخدمة
                        </Button>
                        <Button variant="outline" size="icon">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد خدمات
              </h3>
              <p className="text-gray-600">
                {searchQuery || selectedCategory !== "all" 
                  ? "لا توجد خدمات تطابق البحث المحدد"
                  : "لا توجد خدمات متاحة حالياً"
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Service Categories */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            فئات الخدمات الشائعة
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(1, 9).map((category) => (
              <Card 
                key={category.value}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                onClick={() => setSelectedCategory(category.value)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">
                    {category.value === "تقنية" && "💻"}
                    {category.value === "منزلية" && "🏠"}
                    {category.value === "تعليمية" && "🎓"}
                    {category.value === "صحية" && "🏥"}
                    {category.value === "قانونية" && "⚖️"}
                    {category.value === "نقل" && "🚛"}
                    {category.value === "إصلاح" && "🔧"}
                    {category.value === "تصميم" && "🎨"}
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