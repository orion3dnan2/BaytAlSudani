import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import JobCard from "@/components/JobCard";
import CTAButton from "@/components/CTAButton";
import EmptyState from "@/components/EmptyState";
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
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building,
  GraduationCap,
  Calendar,
  Users,
  Send
} from "lucide-react";

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['/api/jobs'],
  });

  const categories = [
    { value: "all", label: "جميع الوظائف" },
    { value: "تقنية", label: "تقنية المعلومات" },
    { value: "طب", label: "الطب والصحة" },
    { value: "تعليم", label: "التعليم" },
    { value: "مالية", label: "الخدمات المالية" },
    { value: "هندسة", label: "الهندسة" },
    { value: "مبيعات", label: "المبيعات والتسويق" },
    { value: "إدارة", label: "الإدارة والقيادة" },
    { value: "خدمات", label: "خدمة العملاء" },
  ];

  const locations = [
    { value: "all", label: "جميع المواقع" },
    { value: "الخرطوم", label: "الخرطوم" },
    { value: "بحري", label: "بحري" },
    { value: "أم درمان", label: "أم درمان" },
    { value: "كسلا", label: "كسلا" },
    { value: "بورت سودان", label: "بورت سودان" },
    { value: "الأبيض", label: "الأبيض" },
    { value: "نيالا", label: "نيالا" },
  ];

  const sortOptions = [
    { value: "newest", label: "الأحدث" },
    { value: "salary-high", label: "الراتب: من الأعلى للأقل" },
    { value: "salary-low", label: "الراتب: من الأقل للأعلى" },
    { value: "location", label: "حسب الموقع" },
    { value: "company", label: "حسب الشركة" },
  ];

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || job.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
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
      <section className="bg-gradient-sudan-heritage text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">فرص العمل</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">اعثر على الوظيفة المناسبة لك في أفضل الشركات</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                placeholder="ابحث عن الوظائف حسب المسمى أو الشركة..."
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
                <Briefcase className="w-5 h-5 text-sudan-blue" />
                <span className="text-lg font-semibold text-gray-900">
                  {filteredJobs?.length || 0} وظيفة متاحة
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اختر المجال" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اختر الموقع" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
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
          {(searchQuery || selectedCategory !== "all" || selectedLocation !== "all") && (
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
                  المجال: {categories.find(c => c.value === selectedCategory)?.label}
                  <button 
                    onClick={() => setSelectedCategory("all")}
                    className="ml-2 text-xs hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedLocation !== "all" && (
                <Badge variant="secondary" className="bg-sudan-blue/10 text-sudan-blue">
                  الموقع: {selectedLocation}
                  <button 
                    onClick={() => setSelectedLocation("all")}
                    className="ml-2 text-xs hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Add Job CTA */}
          <div className="mb-6 flex justify-end">
            <CTAButton type="job" />
          </div>

          {/* Jobs Grid/List */}
          {filteredJobs && filteredJobs.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  storeName={`متجر رقم ${job.storeId}`}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type="jobs"
              title="لا توجد وظائف متاحة"
              description={searchQuery || selectedCategory !== "all" || selectedLocation !== "all"
                ? "لا توجد وظائف تطابق البحث المحدد"
                : "لا توجد وظائف متاحة حالياً"
              }
              icon={<Briefcase className="w-16 h-16" />}
            />
          )}
        </div>
      </section>
      {/* Job Categories */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            مجالات العمل الشائعة
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
                    {category.value === "طب" && "🏥"}
                    {category.value === "تعليم" && "🎓"}
                    {category.value === "مالية" && "💰"}
                    {category.value === "هندسة" && "⚙️"}
                    {category.value === "مبيعات" && "📈"}
                    {category.value === "إدارة" && "👔"}
                    {category.value === "خدمات" && "🤝"}
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