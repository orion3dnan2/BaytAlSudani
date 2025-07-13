import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';
import { Link } from 'wouter';

interface EmptyStateProps {
  type: 'products' | 'stores' | 'services' | 'jobs' | 'announcements';
  title: string;
  description: string;
  icon: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
  showCTA?: boolean;
}

export default function EmptyState({
  type,
  title,
  description,
  icon,
  actionHref,
  actionLabel,
  showCTA = true
}: EmptyStateProps) {
  const { user, isAuthenticated } = useAuth();

  const canAdd = isAuthenticated && (user?.role === 'merchant' || user?.role === 'admin' || user?.role === 'store_owner');

  const getDefaultAction = () => {
    switch (type) {
      case 'products':
        return { href: '/products/create', label: 'أضف منتجك الأول' };
      case 'stores':
        return { href: '/stores/create', label: 'أنشئ متجرك الأول' };
      case 'services':
        return { href: '/services/create', label: 'أضف خدمتك الأولى' };
      case 'jobs':
        return { href: '/jobs/create', label: 'أضف وظيفتك الأولى' };
      case 'announcements':
        return { href: '/announcements/create', label: 'أضف إعلانك الأول' };
      default:
        return { href: '/', label: 'ابدأ الآن' };
    }
  };

  const action = actionHref && actionLabel 
    ? { href: actionHref, label: actionLabel }
    : getDefaultAction();

  return (
    <div className="text-center py-16 px-4">
      <div className="w-20 h-20 mx-auto mb-4 text-gray-400">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {showCTA && canAdd && (
        <Button 
          asChild
          className="bg-sudan-blue hover:bg-sudan-blue/90 text-white"
        >
          <Link href={action.href}>
            <Plus className="w-4 h-4 mr-2" />
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
}