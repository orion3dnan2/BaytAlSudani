import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Bell,
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  TrendingUp,
  AlertCircle,
  Gift,
  Zap
} from "lucide-react";

export default function Announcements() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['/api/announcements'],
  });

  const types = [
    { value: "all", label: "جميع الإعلانات" },
    { value: "عرض خاص", label: "العروض الخاصة" },
    { value: "خصم", label: "خصومات" },
    { value: "منتج جديد", label: "منتجات جديدة" },
    { value: "خدمة جديدة", label: "خدمات جديدة" },
    { value: "حدث", label: "فعاليات وأحداث" },
    { value: "إعلان", label: "إعلانات عامة" },
    { value: "تحديث", label: "تحديثات المتجر" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث" },
    { value: "oldest", label: "الأقدم" },
    { value: "mostViewed", label: "الأكثر مشاهدة" },
    { value: "trending", label: "الأكثر تفاعلاً" },
  ];

  const filteredAnnouncements = announcements?.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || announcement.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case "عرض خاص": return Gift;
      case "خصم": return TrendingUp;
      case "منتج جديد": return Zap;
      case "خدمة جديدة": return Bell;
      case "حدث": return Calendar;
      default: return AlertCircle;
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case "عرض خاص": return "bg-purple-100 text-purple-800";
      case "خصم": return "bg-red-100 text-red-800";
      case "منتج جديد": return "bg-blue-100 text-blue-800";
      case "خدمة جديدة": return "bg-green-100 text-green-800";
      case "حدث": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
      <section className="bg-gradient-sudan-heritage text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">الإعلانات والعروض</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              تابع أحدث الإعلانات والعروض الخاصة من أفضل المتاجر السودانية
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                placeholder="ابحث في الإعلانات والعروض..."
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
                <Bell className="w-5 h-5 text-sudan-blue" />
                <span className="text-lg font-semibold text-gray-900">
                  {filteredAnnouncements?.length || 0} إعلان متاح
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="نوع الإعلان" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
          {(searchQuery || selectedType !== "all") && (
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
              {selectedType !== "all" && (
                <Badge variant="secondary" className="bg-sudan-blue/10 text-sudan-blue">
                  النوع: {types.find(t => t.value === selectedType)?.label}
                  <button 
                    onClick={() => setSelectedType("all")}
                    className="ml-2 text-xs hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Announcements Grid/List */}
          {filteredAnnouncements && filteredAnnouncements.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredAnnouncements.map((announcement) => {
                const IconComponent = getAnnouncementIcon(announcement.type || "إعلان");
                const colorClass = getAnnouncementColor(announcement.type || "إعلان");
                
                return (
                  <Card key={announcement.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
                    <CardContent className="p-0">
                      {/* Featured Image/Banner */}
                      <div className="h-32 bg-gradient-to-r from-sudan-blue to-sudan-red relative">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute top-4 right-4">
                          <Badge className={`${colorClass} border-0`}>
                            {announcement.type || "إعلان عام"}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">
                          {announcement.title}
                        </h3>

                        {/* Content */}
                        <p className="text-gray-600 leading-relaxed line-clamp-3">
                          {announcement.content}
                        </p>

                        {/* Meta Info */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>نشر في: {new Date(announcement.createdAt).toLocaleDateString('ar-SA')}</span>
                          </div>

                          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>منذ {Math.floor((Date.now() - new Date(announcement.createdAt).getTime()) / (1000 * 60 * 60 * 24))} يوم</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge 
                              variant={announcement.isActive ? "default" : "secondary"}
                              className={announcement.isActive ? "bg-green-100 text-green-800" : ""}
                            >
                              {announcement.isActive ? "نشط" : "منتهي"}
                            </Badge>
                            
                            <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-500">
                              <Eye className="w-4 h-4" />
                              <span>150 مشاهدة</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 space-x-reverse pt-4 border-t">
                          <Button 
                            className="flex-1 bg-sudan-blue hover:bg-sudan-blue/90"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            اقرأ المزيد
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          
                          <Button variant="outline" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد إعلانات
              </h3>
              <p className="text-gray-600">
                {searchQuery || selectedType !== "all"
                  ? "لا توجد إعلانات تطابق البحث المحدد"
                  : "لا توجد إعلانات متاحة حالياً"
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Announcement Types */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            أنواع الإعلانات
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {types.slice(1, 9).map((type) => (
              <Card 
                key={type.value}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                onClick={() => setSelectedType(type.value)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">
                    {type.value === "عرض خاص" && "🎁"}
                    {type.value === "خصم" && "🏷️"}
                    {type.value === "منتج جديد" && "⚡"}
                    {type.value === "خدمة جديدة" && "🔔"}
                    {type.value === "حدث" && "📅"}
                    {type.value === "إعلان" && "📢"}
                    {type.value === "تحديث" && "🔄"}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {type.label}
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