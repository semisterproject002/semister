import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OrderInputs from "./pages/OrderInputs";
import Checkout from "./pages/Checkout";
import TractorBooking from "./pages/TractorBooking";
import LaborHiring from "./pages/LaborHiring";
import OrderTracking from "./pages/OrderTracking";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected farmer routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/dashboard/orders" element={
                <ProtectedRoute><OrderInputs /></ProtectedRoute>
              } />
              <Route path="/dashboard/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />
              <Route path="/dashboard/tractors" element={
                <ProtectedRoute><TractorBooking /></ProtectedRoute>
              } />
              <Route path="/dashboard/labor" element={
                <ProtectedRoute><LaborHiring /></ProtectedRoute>
              } />
              <Route path="/dashboard/tracking" element={
                <ProtectedRoute><OrderTracking /></ProtectedRoute>
              } />
              
              {/* Protected admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
