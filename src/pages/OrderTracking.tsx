import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, Home, Package, Tractor, Users, Truck, 
  Settings, LogOut, Menu, X, Bell, MapPin, Calendar,
  Clock, CheckCircle, AlertCircle, Loader2, ChevronRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserOrders } from "@/hooks/useOrders";
import { useUserTractorBookings } from "@/hooks/useTractors";
import { useUserLaborBookings } from "@/hooks/useWorkers";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { format } from "date-fns";

const OrderTracking = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  // Enable real-time notifications
  useRealtimeNotifications();
  
  const { data: orders, isLoading: ordersLoading } = useUserOrders();
  const { data: tractorBookings, isLoading: tractorsLoading } = useUserTractorBookings();
  const { data: laborBookings, isLoading: laborLoading } = useUserLaborBookings();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const userName = user?.user_metadata?.full_name || user?.phone || "Farmer";
  const userInitial = userName.charAt(0).toUpperCase();

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Overview" },
    { path: "/dashboard/orders", icon: Package, label: "Order Inputs" },
    { path: "/dashboard/tractors", icon: Tractor, label: "Book Tractors" },
    { path: "/dashboard/labor", icon: Users, label: "Hire Labor" },
    { path: "/dashboard/tracking", icon: Truck, label: "Track Orders" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: React.ReactNode }> = {
      requested: { color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: <AlertCircle className="w-3 h-3" /> },
      accepted: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: <CheckCircle className="w-3 h-3" /> },
      in_progress: { color: "bg-accent/20 text-accent-foreground border-accent/30", icon: <Truck className="w-3 h-3" /> },
      completed: { color: "bg-success/10 text-success border-success/20", icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { color: "bg-destructive/10 text-destructive border-destructive/20", icon: <X className="w-3 h-3" /> },
    };
    
    const variant = variants[status] || variants.requested;
    
    return (
      <Badge variant="outline" className={`${variant.color} flex items-center gap-1`}>
        {variant.icon}
        {status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
      </Badge>
    );
  };

  const getStatusSteps = (status: string) => {
    const steps = ["requested", "accepted", "in_progress", "completed"];
    const currentIndex = steps.indexOf(status);
    
    return steps.map((step, index) => ({
      name: step.replace("_", " ").charAt(0).toUpperCase() + step.replace("_", " ").slice(1),
      completed: index <= currentIndex && status !== "cancelled",
      current: index === currentIndex,
    }));
  };

  const isLoading = ordersLoading || tractorsLoading || laborLoading;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">
                Kisan<span className="text-primary">Connect</span>
              </span>
            </Link>
            <button className="lg:hidden p-1" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userName}</p>
                <p className="text-xs text-muted-foreground">{user?.phone || "Telangana"}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold">Track Orders</h1>
                <p className="text-sm text-muted-foreground">View delivery status and booking updates</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="w-4 h-4" />
                  Orders ({orders?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="tractors" className="gap-2">
                  <Tractor className="w-4 h-4" />
                  Tractors ({tractorBookings?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="labor" className="gap-2">
                  <Users className="w-4 h-4" />
                  Labor ({laborBookings?.length || 0})
                </TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-4">
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-card rounded-2xl p-6 border border-border shadow-soft"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                              <Package className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {(order as any).order_items?.length || 0} items • ₹{order.total_amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      {/* Progress Steps */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between">
                          {getStatusSteps(order.status).map((step, index) => (
                            <div key={step.name} className="flex-1 relative">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium z-10 ${
                                    step.completed
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
                                </div>
                                <span className="text-xs mt-2 text-center text-muted-foreground">
                                  {step.name}
                                </span>
                              </div>
                              {index < 3 && (
                                <div
                                  className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 ${
                                    step.completed && getStatusSteps(order.status)[index + 1]?.completed
                                      ? "bg-primary"
                                      : "bg-muted"
                                  }`}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          Ordered: {format(new Date(order.created_at), "MMM dd, yyyy 'at' h:mm a")}
                        </div>
                        {order.delivery_address && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {order.delivery_address}
                          </div>
                        )}
                      </div>

                      {/* Order Items */}
                      {(order as any).order_items && (order as any).order_items.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm font-medium mb-2">Items:</p>
                          <div className="flex flex-wrap gap-2">
                            {(order as any).order_items.map((item: any) => (
                              <Badge key={item.id} variant="secondary">
                                {item.product_name} x{item.quantity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-muted-foreground mb-4">Start ordering inputs for your farm</p>
                    <Button variant="hero" asChild>
                      <Link to="/dashboard/orders">
                        Order Inputs <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Tractors Tab */}
              <TabsContent value="tractors" className="space-y-4">
                {tractorBookings && tractorBookings.length > 0 ? (
                  tractorBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-card rounded-2xl p-6 border border-border shadow-soft"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                            <Tractor className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {(booking as any).tractors?.name || "Tractor"} - {(booking as any).tractors?.model || ""}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.hours} hours • ₹{booking.total_amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(booking.booking_date), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {booking.start_time}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {booking.location}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <Tractor className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tractor bookings</h3>
                    <p className="text-muted-foreground mb-4">Book a tractor for your farming needs</p>
                    <Button variant="accent" asChild>
                      <Link to="/dashboard/tractors">
                        Book Tractor <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Labor Tab */}
              <TabsContent value="labor" className="space-y-4">
                {laborBookings && laborBookings.length > 0 ? (
                  laborBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-card rounded-2xl p-6 border border-border shadow-soft"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                            <Users className="w-5 h-5 text-secondary-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {(booking as any).labor_workers?.full_name || "Worker"} - {booking.work_type}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.days_required} day(s) • ₹{booking.total_amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          Starting: {format(new Date(booking.booking_date), "MMM dd, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {booking.location}
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground">{booking.notes}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No labor bookings</h3>
                    <p className="text-muted-foreground mb-4">Hire skilled workers for your farm</p>
                    <Button variant="outline" asChild>
                      <Link to="/dashboard/labor">
                        Hire Labor <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderTracking;
