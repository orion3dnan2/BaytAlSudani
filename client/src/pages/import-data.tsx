import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, FileSpreadsheet, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * File import handler for البيت السوداني PWA
 * Handles CSV, PDF, Excel, and JSON files
 */
export default function ImportData() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadedFile(file);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Handle different file types
      switch (file.type) {
        case 'text/csv':
          toast({
            title: 'تم رفع ملف CSV',
            description: `تم استيراد البيانات من الملف: ${file.name}`,
          });
          break;
        case 'application/pdf':
          toast({
            title: 'تم رفع ملف PDF',
            description: `تم تحليل المستند: ${file.name}`,
          });
          break;
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          toast({
            title: 'تم رفع ملف Excel',
            description: `تم استيراد جدول البيانات: ${file.name}`,
          });
          break;
        case 'application/json':
          toast({
            title: 'تم رفع ملف JSON',
            description: `تم تحليل البيانات من: ${file.name}`,
          });
          break;
        default:
          toast({
            title: 'تم رفع الملف',
            description: `تم معالجة الملف: ${file.name}`,
          });
      }
    } catch (error) {
      toast({
        title: 'خطأ في رفع الملف',
        description: 'حدث خطأ أثناء معالجة الملف. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('csv') || fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return <FileSpreadsheet className="h-12 w-12 text-green-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-12 w-12 text-red-500" />;
    } else {
      return <File className="h-12 w-12 text-blue-500" />;
    }
  };

  // Check if opened via file handler
  useEffect(() => {
    // Listen for file handler events from service worker
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'FILE_RECEIVED') {
        handleFileUpload(event.data.file);
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleServiceWorkerMessage);
    
    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [handleFileUpload]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">استيراد البيانات</CardTitle>
          <CardDescription className="text-center">
            رفع ومعالجة ملفات CSV، PDF، Excel، أو JSON
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {uploadedFile ? (
              <div className="flex flex-col items-center space-y-4">
                {getFileIcon(uploadedFile.type)}
                <div>
                  <h3 className="font-semibold">{uploadedFile.name}</h3>
                  <p className="text-sm text-gray-500">
                    الحجم: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-sm text-gray-500">
                    النوع: {uploadedFile.type || 'غير محدد'}
                  </p>
                </div>
                {isProcessing && (
                  <div className="text-blue-600">
                    جاري معالجة الملف...
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Upload className="h-12 w-12 text-gray-400" />
                <div>
                  <h3 className="text-lg font-semibold">اسحب الملف هنا</h3>
                  <p className="text-gray-500">أو انقر لاختيار ملف</p>
                  <p className="text-sm text-gray-400 mt-2">
                    يدعم: CSV، PDF، Excel، JSON (حتى 10 MB)
                  </p>
                </div>
              </div>
            )}
            
            <input
              type="file"
              className="hidden"
              id="file-upload"
              accept=".csv,.pdf,.xls,.xlsx,.json"
              onChange={handleFileSelect}
              disabled={isProcessing}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outline"
                className="mt-4 cursor-pointer"
                disabled={isProcessing}
                asChild
              >
                <span>
                  {isProcessing ? 'جاري المعالجة...' : 'اختيار ملف'}
                </span>
              </Button>
            </label>
          </div>

          {uploadedFile && !isProcessing && (
            <div className="mt-6 text-center">
              <Button
                onClick={() => {
                  setUploadedFile(null);
                }}
                variant="ghost"
              >
                رفع ملف آخر
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}