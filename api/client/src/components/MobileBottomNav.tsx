import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Store, 
  Briefcase, 
  User, 
  ShoppingBag
} from 'lucide-react';

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/marketplace', label: 'السوق', icon: ShoppingBag },
    { href: '/services', label: 'الخدمات', icon: Briefcase },
    { href: '/jobs', label: 'الوظائف', icon: Briefcase },
    { href: isAuthenticated ? '/profile' : '/auth/login', label: 'حسابي', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 transition-colors ${
                isActive
                  ? 'text-sudan-blue bg-sudan-blue/5'
                  : 'text-gray-600 hover:text-sudan-blue'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-sudan-blue' : ''}`} />
              <span className={`text-xs font-medium text-center ${isActive ? 'text-sudan-blue' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}