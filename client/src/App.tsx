import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/auth/landing";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import Services from "@/pages/services";
import Jobs from "@/pages/jobs";
import Announcements from "@/pages/announcements";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import AdminDashboard from "@/pages/admin/dashboard";
import StoreDetails from "@/pages/admin/store-details";
import MerchantDashboard from "@/pages/merchant/dashboard";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/services" component={Services} />
          <Route path="/jobs" component={Jobs} />
          <Route path="/announcements" component={Announcements} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/stores/:id" component={StoreDetails} />
          <Route path="/merchant/dashboard" component={MerchantDashboard} />
        </>
      )}
      {/* Legacy auth routes for existing system */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
