import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';
import { Link } from 'wouter';

interface CTAButtonProps {
  type: 'product' | 'store' | 'service' | 'job' | 'announcement';
  className?: string;
}

export default function CTAButton({ type, className = '' }: CTAButtonProps) {
  const { user, isAuthenticated } = useAuth();

  // Only show for merchants/admins
  if (!isAuthenticated || (user?.role !== 'merchant' && user?.role !== 'admin' && user?.role !== 'store_owner')) {
    return null;
  }

  const getButtonConfig = () => {
    switch (type) {
      case 'product':
        return {
          href: '/products/create',
          label: 'إضافة منتج',
          color: 'bg-sudan-blue hover:bg-sudan-blue/90'
        };
      case 'store':
        return {
          href: '/stores/create',
          label: 'إنشاء متجر',
          color: 'bg-sudan-gold hover:bg-sudan-gold/90 text-gray-900'
        };
      case 'service':
        return {
          href: '/services/create',
          label: 'إضافة خدمة',
          color: 'bg-green-600 hover:bg-green-700'
        };
      case 'job':
        return {
          href: '/jobs/create',
          label: 'إضافة وظيفة',
          color: 'bg-purple-600 hover:bg-purple-700'
        };
      case 'announcement':
        return {
          href: '/announcements/create',
          label: 'إضافة إعلان',
          color: 'bg-orange-600 hover:bg-orange-700'
        };
      default:
        return {
          href: '/',
          label: 'إضافة',
          color: 'bg-sudan-blue hover:bg-sudan-blue/90'
        };
    }
  };

  const config = getButtonConfig();

  return (
    <Button 
      asChild
      className={`${config.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <Link href={config.href}>
        <Plus className="w-4 h-4 mr-2" />
        {config.label}
      </Link>
    </Button>
  );
}