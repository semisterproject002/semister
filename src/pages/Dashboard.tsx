import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sprout, Home, Package, Tractor, Users, Truck, 
  Settings, LogOut, Menu, X, Bell, ChevronRight,
  TrendingUp, Clock, CheckCircle, AlertCircle, Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserOrders } from "@/hooks/useOrders";
import { useUserTractorBookings } from "@/hooks/useTractors";
import { useUserLaborBookings } from "@/hooks/useWorkers";
import { format } from "date-fns";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
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

  const isLoading = ordersLoading || tractorsLoading || laborLoading;

  const activeOrders = orders?.filter(o => o.status !== "completed" && o.status !== "cancelled").length || 0;
  const pendingDeliveries = orders?.filter(o => o.status === "in_progress").length || 0;
  const activeTractorBookings = tractorBookings?.filter(b => b.status !== "completed" && b.status !== "cancelled").length || 0;
  const activeLaborHired = laborBookings?.filter(b => b.status === "in_progress" || b.status === "accepted").length || 0;

  const stats = [
    { label: "Active Orders", value: activeOrders.toString(), icon: Package, color: "primary", trend: `${orders?.filter(o => o.status === "requested").length || 0} pending` },
    { label: "Pending Deliveries", value: pendingDeliveries.toString(), icon: Truck, color: "accent", trend: "In transit" },
    { label: "Tractor Bookings", value: activeTractorBookings.toString(), icon: Tractor, color: "secondary", trend: "Scheduled" },
    { label: "Labor Hired", value: activeLaborHired.toString(), icon: Users, color: "success", trend: "Active" },
  ];

  const recentOrders = orders?.slice(0, 3).map(order => ({
    id: order.id,
    item: `${(order as any).order_items?.length || 0} items`,
    status: order.status === "completed" ? "Delivered" : 
            order.status === "in_progress" ? "In Transit" : 
            order.status === "accepted" ? "Processing" : "Pending",
    date: format(new Date(order.created_at), "MMM dd"),
    statusColor: order.status === "completed" ? "success" : 
                 order.status === "in_progress" ? "accent" : "primary"
  })) || [];

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
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {userName.split(" ")[0]}!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5" />
                {activeOrders > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
                )}
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
            <>
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-card rounded-2xl p-5 border border-border shadow-soft card-hover animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          stat.color === "primary" ? "gradient-primary" :
                          stat.color === "accent" ? "gradient-accent" :
                          stat.color === "secondary" ? "bg-secondary" :
                          "bg-success"
                        }`}
                      >
                        <stat.icon className={`w-6 h-6 ${
                          stat.color === "secondary" ? "text-secondary-foreground" : "text-primary-foreground"
                        }`} />
                      </div>
                      <TrendingUp className="w-4 h-4 text-success" />
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-xs text-primary mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {stat.trend}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions & Recent Orders */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-1 bg-card rounded-2xl p-6 border border-border shadow-soft">
                  <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button variant="hero" className="w-full justify-between" asChild>
                      <Link to="/dashboard/orders">
                        Order Inputs
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="accent" className="w-full justify-between" asChild>
                      <Link to="/dashboard/tractors">
                        Book Tractor
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-between" asChild>
                      <Link to="/dashboard/labor">
                        Hire Labor
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-soft">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Orders</h2>
                    <Link to="/dashboard/tracking" className="text-sm text-primary hover:underline">
                      View All
                    </Link>
                  </div>
                  {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                              <Package className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{order.item}</p>
                              <p className="text-sm text-muted-foreground">{order.id.slice(0, 8)}... • {order.date}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                            order.statusColor === "success" ? "bg-success/10 text-success" :
                            order.statusColor === "accent" ? "bg-accent/20 text-accent-foreground" :
                            "bg-primary/10 text-primary"
                          }`}>
                            {order.statusColor === "success" ? <CheckCircle className="w-3 h-3" /> :
                             order.statusColor === "accent" ? <Truck className="w-3 h-3" /> :
                             <AlertCircle className="w-3 h-3" />}
                            {order.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No orders yet</p>
                      <Button variant="hero" className="mt-4" asChild>
                        <Link to="/dashboard/orders">Place Your First Order</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
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

export default Dashboard;
