import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Handle custom protocol links for البيت السوداني PWA
 * Supports: web+sudanese-market:// and web+bayt-sudani://
 */
export default function HandleLink() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const url = urlParams.get('url');
    const action = urlParams.get('action');

    if (url) {
      // Handle web+sudanese-market protocol
      try {
        const decodedUrl = decodeURIComponent(url);
        const protocolUrl = new URL(decodedUrl);
        
        // Parse the protocol URL and navigate accordingly
        if (protocolUrl.protocol === 'web+sudanese-market:') {
          const path = protocolUrl.pathname || '/';
          navigate(path);
        }
      } catch (error) {
        console.error('Error parsing protocol URL:', error);
        navigate('/');
      }
    } else if (action) {
      // Handle web+bayt-sudani protocol actions
      switch (action) {
        case 'marketplace':
          navigate('/marketplace');
          break;
        case 'stores':
          navigate('/stores');
          break;
        case 'services':
          navigate('/services');
          break;
        case 'jobs':
          navigate('/jobs');
          break;
        case 'profile':
          navigate('/profile');
          break;
        default:
          navigate('/');
      }
    } else {
      // Default to home
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">جاري التحويل...</h2>
        <p className="text-gray-600">يتم توجيهك إلى الصفحة المطلوبة</p>
      </div>
    </div>
  );
}