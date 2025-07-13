import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/auth/landing";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import Stores from "@/pages/stores";
import Restaurants from "@/pages/restaurants";
import Services from "@/pages/services";
import Jobs from "@/pages/jobs";
import Announcements from "@/pages/announcements";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import AdminDashboard from "@/pages/admin/dashboard";
import StoreDetails from "@/pages/admin/store-details";
import MerchantDashboard from "@/pages/merchant/dashboard";
import Profile from "@/pages/profile";
import CreateProduct from "@/pages/products/create";
import CreateStore from "@/pages/stores/create";
import HandleLink from "@/pages/handle-link";
import ImportData from "@/pages/import-data";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 pb-16 md:pb-0">
              <Router />
            </main>
            <Footer />
            <MobileBottomNav />
          </div>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Main routes - always available */}
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/stores" component={Stores} />
      <Route path="/restaurants" component={Restaurants} />
      <Route path="/services" component={Services} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/announcements" component={Announcements} />
      
      {/* Home route - conditional based on auth */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <Route path="/" component={Home} />
      )}
      
      {/* Protected routes - only for authenticated users */}
      {isAuthenticated && (
        <>
          <Route path="/profile" component={Profile} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/stores/:id" component={StoreDetails} />
          <Route path="/merchant/dashboard" component={MerchantDashboard} />
          <Route path="/products/create" component={CreateProduct} />
          <Route path="/stores/create" component={CreateStore} />
        </>
      )}
      
      {/* Legacy auth routes for existing system */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      
      {/* PWA specific routes */}
      <Route path="/handle-link" component={HandleLink} />
      <Route path="/import-data" component={ImportData} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
