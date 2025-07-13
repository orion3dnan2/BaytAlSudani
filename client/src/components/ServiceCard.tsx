import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Heart, 
  Eye, 
  Briefcase,
  DollarSign
} from 'lucide-react';

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    description: string;
    price: number;
    storeId: number;
    category: string;
    isActive: boolean;
    createdAt: string;
  };
  storeName?: string;
  className?: string;
}

export default function ServiceCard({ service, storeName, className = '' }: ServiceCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SD', {
      style: 'currency',
      currency: 'SDG',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getRandomImage = () => {
    const serviceImages = [
      'https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?w=400&h=250&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop&q=80',
    ];
    return serviceImages[Math.floor(Math.random() * serviceImages.length)];
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'تقنية': 'bg-blue-100 text-blue-800',
      'تسويق': 'bg-green-100 text-green-800',
      'تصميم': 'bg-purple-100 text-purple-800',
      'استشارات': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.default;
  };

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden ${className}`}>
      <div className="relative">
        {/* Service Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-sudan-blue/10 to-sudan-blue/5">
          {!imageError ? (
            <img
              src={getRandomImage()}
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sudan-blue/10 to-sudan-blue/5">
              <Briefcase className="w-16 h-16 text-sudan-blue/60" />
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
              onClick={handleToggleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <Badge className={`${service.isActive ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs`}>
              {service.isActive ? 'متاح' : 'غير متاح'}
            </Badge>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-2 left-2">
            <Badge className={`${getCategoryColor(service.category)} text-xs`}>
              {service.category}
            </Badge>
          </div>
        </div>

        {/* Service Info */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Service Name */}
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-sudan-blue transition-colors line-clamp-1">
              {service.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2">
              {service.description}
            </p>

            {/* Store Info */}
            {storeName && (
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-sudan-blue" />
                <span>{storeName}</span>
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center space-x-1 space-x-reverse">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.2)</span>
              <span className="text-sm text-gray-400">• {Math.floor(Math.random() * 50) + 10} تقييم</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <DollarSign className="w-4 h-4 text-sudan-blue" />
                <span className="text-xl font-bold text-sudan-blue">
                  {formatPrice(service.price)}
                </span>
              </div>
              <Badge variant="secondary" className="bg-sudan-gold/10 text-sudan-gold text-xs">
                خدمة مميزة
              </Badge>
            </div>

            {/* Time */}
            <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>منذ {Math.floor(Math.random() * 30) + 1} يوم</span>
            </div>
          </div>
        </CardContent>

        {/* Actions */}
        <CardFooter className="p-4 pt-0">
          <div className="flex space-x-2 space-x-reverse w-full">
            <Button
              className="flex-1 bg-sudan-blue hover:bg-sudan-blue/90 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              طلب الخدمة
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-sudan-blue text-sudan-blue hover:bg-sudan-blue hover:text-white"
              asChild
            >
              <Link href={`/service/${service.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                التفاصيل
              </Link>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}