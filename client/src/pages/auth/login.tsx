import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, LogIn, User, Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "فشل في تسجيل الدخول");
      }

      login(result.token, result.user);
      
      // Redirect based on user role
      if (result.user.role === 'admin') {
        setLocation('/admin/dashboard');
      } else if (result.user.role === 'merchant') {
        setLocation('/merchant/dashboard');
      } else {
        setLocation('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-4 shadow-2xl">
              <LogIn className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600">أدخل بياناتك للوصول إلى حسابك</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">مرحباً بك</CardTitle>
            <CardDescription className="text-center">
              أدخل اسم المستخدم وكلمة المرور
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  اسم المستخدم
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  {...register("username", { required: "اسم المستخدم مطلوب" })}
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  {...register("password", { required: "كلمة المرور مطلوبة" })}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ليس لديك حساب؟{" "}
                  <Link href="/auth/register" className="text-blue-600 hover:underline">
                    سجل الآن
                  </Link>
                </p>
              </div>

              <div className="text-center">
                <Link href="/">
                  <Button variant="outline" className="flex items-center gap-2 mx-auto">
                    <ArrowRight className="w-4 h-4" />
                    العودة للصفحة الرئيسية
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-blue-800 mb-2">حسابات تجريبية:</p>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>مدير:</strong> admin / admin</p>
              <p><strong>تاجر:</strong> merchant1 / admin</p>
              <p><strong>عميل:</strong> customer1 / admin</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}