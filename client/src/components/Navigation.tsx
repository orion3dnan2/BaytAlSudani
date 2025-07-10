import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Home,
  Store,
  ChefHat,
  Briefcase,
  Bell,
  Settings,
  LogOut,
  UserCircle,
  Heart,
  Plus,
  Package
} from 'lucide-react';

export default function Navigation() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/marketplace', label: 'السوق', icon: Store },
    { href: '/stores', label: 'المتاجر', icon: Store },
    { href: '/restaurants', label: 'المطاعم', icon: ChefHat },
    { href: '/services', label: 'الخدمات', icon: Briefcase },
    { href: '/jobs', label: 'الوظائف', icon: Briefcase },
    { href: '/announcements', label: 'الإعلانات', icon: Bell },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search query:', searchQuery);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      {/* Top Bar - Hidden on mobile */}
      <div className="bg-gradient-sudan-heritage text-white py-1 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 space-x-reverse">
              <span>🇸🇩 البيت السوداني - منصة التجارة الإلكترونية</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <span> </span>
              <span> </span>
            </div>
          </div>
        </div>
      </div>
      {/* Main Navigation */}
      <div className="container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-sudan-flag rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-base">
              🏠
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-sudan-blue">البيت السوداني</h1>
              <p className="text-xs text-gray-600 hidden md:block">سوداني وخليك ...... قدرها</p>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="ابحث عن المنتجات، المتاجر، الخدمات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 rounded-full border-2 border-gray-200 focus:border-sudan-blue text-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sudan-blue hover:bg-sudan-blue/90 rounded-full"
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Search Icon for Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-4 h-4" />
            </Button>

            {/* Favorites - Hidden on mobile */}
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
              <Badge className="absolute -top-1 -right-1 bg-sudan-red text-white text-xs">2</Badge>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              <Badge className="absolute -top-1 -right-1 bg-sudan-red text-white text-xs">0</Badge>
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-7 w-7 md:h-8 md:w-8 rounded-full">
                    <Avatar className="h-7 w-7 md:h-8 md:w-8">
                      <AvatarFallback className="bg-sudan-blue text-white text-xs md:text-sm">
                        {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'م'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.fullName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>الملف الشخصي</span>
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>لوحة الإدارة</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {(user?.role === 'merchant' || user?.role === 'store_owner') && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/merchant/dashboard" className="w-full">
                          <Store className="mr-2 h-4 w-4" />
                          <span>لوحة التاجر</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/stores/create" className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          <span>إنشاء متجر</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/products/create" className="w-full">
                          <Package className="mr-2 h-4 w-4" />
                          <span>إضافة منتج</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/';
                  }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button 
                  className="bg-sudan-blue hover:bg-sudan-blue/90 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
                  onClick={() => window.location.href = '/auth/login'}
                >
                  <span className="hidden sm:inline">تسجيل الدخول</span>
                  <span className="sm:hidden">دخول</span>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center justify-center space-x-8 space-x-reverse py-2 border-t border-gray-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-sudan-blue text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-sudan-blue'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 space-x-reverse px-3 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-sudan-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}