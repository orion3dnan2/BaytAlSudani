import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye, 
  Share2,
  MapPin,
  Clock
} from 'lucide-react';
import { Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
  showStore?: boolean;
  className?: string;
  compact?: boolean;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ 
  product, 
  showStore = true, 
  className = '', 
  compact = false,
  viewMode = 'grid'
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add to cart logic
    console.log('Adding to cart:', product.id);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    // Share functionality
    console.log('Sharing product:', product.id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SD', {
      style: 'currency',
      currency: 'SDG',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getRandomImage = () => {
    const categories = ['electronics', 'fashion', 'home', 'restaurants-cafes', 'books', 'sports'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&q=80`;
  };

  // Compact version for mobile
  if (compact) {
    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-sm overflow-hidden ${className}`}>
        <div className="flex gap-3 p-3">
          {/* Compact Product Image */}
          <div className="relative flex-shrink-0">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              {!imageError ? (
                <img
                  src={getRandomImage()}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <Eye className="w-6 h-6 text-sudan-blue" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-1 left-1">
                <Badge className="bg-green-500 text-white text-xs px-1 py-0">
                  متوفر
                </Badge>
              </div>
            </div>
          </div>

          {/* Compact Product Info */}
          <div className="flex-1 min-w-0">
            <div className="space-y-1">
              {/* Product Name */}
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-sudan-blue transition-colors">
                {product.name}
              </h3>

              {/* Store Info */}
              {showStore && (
                <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>متجر رقم {product.storeId}</span>
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center space-x-1 space-x-reverse">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">(4.0)</span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-lg font-bold text-sudan-blue">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    {formatPrice(product.price * 1.2)}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-sudan-red/10 text-sudan-red text-xs">
                  خصم 20%
                </Badge>
              </div>
            </div>
          </div>

          {/* Compact Actions */}
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
              onClick={handleToggleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full text-gray-600"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // List view version
  if (viewMode === 'list') {
    return (
      <Card className={`group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden ${className}`}>
        <div className="flex gap-4 p-4">
          {/* Product Image */}
          <div className="relative flex-shrink-0">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
              {!imageError ? (
                <img
                  src={getRandomImage()}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <Eye className="w-8 h-8 text-sudan-blue" />
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-1 left-1">
                <Badge className="bg-green-500 text-white text-xs">
                  متوفر
                </Badge>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              {/* Product Name */}
              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-sudan-blue transition-colors">
                {product.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>

              {/* Store Info */}
              {showStore && (
                <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>متجر رقم {product.storeId}</span>
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
                <span className="text-sm text-gray-600">(4.0)</span>
                <span className="text-sm text-gray-400">• 25 تقييم</span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-xl font-bold text-sudan-blue">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.price * 1.2)}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-sudan-red/10 text-sudan-red">
                  خصم 20%
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
              onClick={handleToggleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full text-gray-600"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full text-gray-600"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Default grid view
  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden ${className}`}>
      <div className="relative">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!imageError ? (
            <img
              src={getRandomImage()}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-sudan-blue/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-8 h-8 text-sudan-blue" />
                </div>
                <p className="text-gray-500 text-sm font-medium">{product.name}</p>
              </div>
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
              onClick={handleToggleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md text-gray-600"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-green-500 text-white text-xs">
              متوفر
            </Badge>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-sudan-blue transition-colors">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>

            {/* Store Info */}
            {showStore && (
              <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>متجر رقم {product.storeId}</span>
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
              <span className="text-sm text-gray-600">(4.0)</span>
              <span className="text-sm text-gray-400">• 25 تقييم</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-2xl font-bold text-sudan-blue">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price * 1.2)}
                </span>
              </div>
              <Badge variant="secondary" className="bg-sudan-red/10 text-sudan-red">
                خصم 20%
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
              onClick={handleAddToCart}
              className="flex-1 bg-sudan-blue hover:bg-sudan-blue/90 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              أضف للسلة
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-sudan-blue text-sudan-blue hover:bg-sudan-blue hover:text-white"
              asChild
            >
              <Link href={`/product/${product.id}`}>
                عرض التفاصيل
              </Link>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}