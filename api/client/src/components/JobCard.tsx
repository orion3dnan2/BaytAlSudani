import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Heart, 
  Eye, 
  Briefcase,
  Building
} from 'lucide-react';

interface JobCardProps {
  job: {
    id: number;
    title: string;
    description: string;
    salary: number;
    location: string;
    storeId: number;
    isActive: boolean;
    createdAt: string;
  };
  storeName?: string;
  className?: string;
}

export default function JobCard({ job, storeName, className = '' }: JobCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('ar-SD', {
      style: 'currency',
      currency: 'SDG',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const getJobTypeColor = () => {
    const types = ['دوام كامل', 'دوام جزئي', 'عمل حر', 'تدريب'];
    const colors = [
      'bg-green-100 text-green-800',
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800'
    ];
    const randomIndex = Math.floor(Math.random() * types.length);
    return { type: types[randomIndex], color: colors[randomIndex] };
  };

  const jobType = getJobTypeColor();

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden ${className}`}>
      <div className="relative">
        {/* Job Header */}
        <div className="relative bg-gradient-to-r from-sudan-blue/10 to-sudan-blue/5 p-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-sudan-blue/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-sudan-blue" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-sudan-blue transition-colors line-clamp-1">
                  {job.title}
                </h3>
                {storeName && (
                  <div className="flex items-center space-x-1 space-x-reverse text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{storeName}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
              onClick={handleToggleLike}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Status & Type Badges */}
          <div className="flex items-center space-x-2 space-x-reverse mt-3">
            <Badge className={`${job.isActive ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs`}>
              {job.isActive ? 'متاح' : 'مغلق'}
            </Badge>
            <Badge className={`${jobType.color} text-xs`}>
              {jobType.type}
            </Badge>
          </div>
        </div>

        {/* Job Info */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-3">
              {job.description}
            </p>

            {/* Location */}
            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-sudan-blue" />
              <span>{job.location}</span>
            </div>

            {/* Salary */}
            <div className="flex items-center space-x-2 space-x-reverse">
              <DollarSign className="w-4 h-4 text-sudan-blue" />
              <span className="text-lg font-bold text-sudan-blue">
                {formatSalary(job.salary)}
              </span>
              <span className="text-sm text-gray-500">/ شهرياً</span>
            </div>

            {/* Time */}
            <div className="flex items-center space-x-1 space-x-reverse text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>منذ {Math.floor(Math.random() * 30) + 1} يوم</span>
            </div>

            {/* Job Features */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['تأمين صحي', 'مرونة في العمل', 'فرص ترقي'].map((feature, index) => (
                <Badge key={index} variant="secondary" className="bg-sudan-gold/10 text-sudan-gold text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Actions */}
        <CardFooter className="p-4 pt-0">
          <div className="flex space-x-2 space-x-reverse w-full">
            <Button
              className="flex-1 bg-sudan-blue hover:bg-sudan-blue/90 text-white"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              تقدم للوظيفة
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-sudan-blue text-sudan-blue hover:bg-sudan-blue hover:text-white"
              asChild
            >
              <Link href={`/job/${job.id}`}>
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