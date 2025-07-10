import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Star, 
  Users, 
  Package,
  Clock,
  Heart,
  Eye,
  Store as StoreIcon
} from 'lucide-react';
import { Store } from '@shared/schema';

interface StoreCardProps {
  store: Store;
  className?: string;
}

export default function StoreCard({ store, className = '' }: StoreCardProps) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleToggleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFollowed(!isFollowed);
  };

  const getRandomImage = () => {
    const storeImages = [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=200&fit=crop&q=80',
    ];
    return storeImages[Math.floor(Math.random() * storeImages.length)];
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'إلكترونيات': 'bg-blue-100 text-blue-800',
      'أزياء': 'bg-pink-100 text-pink-800',
      'منزل': 'bg-green-100 text-green-800',
      'طعام': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden ${className}`}>
      <div className="relative">
        {/* Store Cover Image */}
        <div className="relative h-32 overflow-hidden bg-gradient-sudan-heritage">
          {!imageError ? (
            <img
              src={getRandomImage()}
              alt={store.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-sudan-heritage">
              <StoreIcon className="w-12 h-12 text-white/80" />
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md ${isFollowed ? 'text-red-500' : 'text-gray-600'}`}
              onClick={handleToggleFollow}
            >
              <Heart className={`w-4 h-4 ${isFollowed ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={`${store.isActive ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs`}>
              {store.isActive ? 'نشط' : 'غير نشط'}
            </Badge>
          </div>
        </div>

        {/* Store Info */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Store Name & Category */}
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-sudan-blue transition-colors">
                {store.name}
              </h3>
              <Badge className={`${getCategoryColor(store.category)} text-xs`}>
                {store.category}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2">
              {store.description}
            </p>

            {/* Store Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-sudan-blue">
                  {Math.floor(Math.random() * 50) + 10}
                </div>
                <div className="text-xs text-gray-500">منتج</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-sudan-blue">
                  {Math.floor(Math.random() * 500) + 100}
                </div>
                <div className="text-xs text-gray-500">متابع</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center space-x-1 space-x-reverse">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-sudan-blue">4.5</span>
                </div>
                <div className="text-xs text-gray-500">تقييم</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-sudan-blue" />
              <span>{store.address || 'الخرطوم، السودان'}</span>
            </div>

            {/* Contact */}
            {store.phone && (
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                <Phone className="w-4 h-4 text-sudan-blue" />
                <span>{store.phone}</span>
              </div>
            )}

            {/* Join Date */}
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>انضم في {new Date(store.createdAt).toLocaleDateString('ar-SD')}</span>
            </div>
          </div>
        </CardContent>

        {/* Actions */}
        <CardFooter className="p-4 pt-0">
          <div className="flex space-x-2 space-x-reverse w-full">
            <Button
              onClick={handleToggleFollow}
              variant={isFollowed ? 'default' : 'outline'}
              className={`flex-1 ${isFollowed 
                ? 'bg-sudan-blue hover:bg-sudan-blue/90 text-white' 
                : 'border-sudan-blue text-sudan-blue hover:bg-sudan-blue hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFollowed ? 'fill-current' : ''}`} />
              {isFollowed ? 'متابع' : 'متابعة'}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-sudan-gold text-sudan-gold hover:bg-sudan-gold hover:text-white"
              asChild
            >
              <Link href={`/store/${store.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                زيارة المتجر
              </Link>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}