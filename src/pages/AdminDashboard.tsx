import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sprout, LayoutDashboard, Package, Tractor, Users, Settings,
  LogOut, Menu, X, Bell, CheckCircle, Clock, AlertCircle,
  TrendingUp, ShoppingCart, UserCheck, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  useAllOrders, 
  useAllTractorBookings, 
  useAllLaborBookings,
  useUpdateOrderStatus,
  useUpdateTractorBookingStatus,
  useUpdateLaborBookingStatus
} from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  requested: "bg-amber-500/10 text-amber-600",
  accepted: "bg-blue-500/10 text-blue-600",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusIcons: Record<string, React.ElementType> = {
  requested: Clock,
  accepted: CheckCircle,
  in_progress: TrendingUp,
  completed: CheckCircle,
  cancelled: AlertCircle,
};

const AdminDashboard = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { data: orders, isLoading: ordersLoading } = useAllOrders();
  const { data: tractorBookings, isLoading: tractorsLoading } = useAllTractorBookings();
  const { data: laborBookings, isLoading: laborLoading } = useAllLaborBookings();
  
  const updateOrderStatus = useUpdateOrderStatus();
  const updateTractorStatus = useUpdateTractorBookingStatus();
  const updateLaborStatus = useUpdateLaborBookingStatus();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/orders", icon: Package, label: "Orders" },
    { path: "/admin/tractors", icon: Tractor, label: "Tractor Bookings" },
    { path: "/admin/labor", icon: Users, label: "Labor Requests" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ id, status: newStatus });
      toast({ title: "Status Updated", description: `Order status changed to ${newStatus}` });
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleUpdateTractorStatus = async (id: string, newStatus: string) => {
    try {
      await updateTractorStatus.mutateAsync({ id, status: newStatus });
      toast({ title: "Status Updated", description: `Booking status changed to ${newStatus}` });
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const handleUpdateLaborStatus = async (id: string, newStatus: string) => {
    try {
      await updateLaborStatus.mutateAsync({ id, status: newStatus });
      toast({ title: "Status Updated", description: `Booking status changed to ${newStatus}` });
    } catch {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const pendingCount = (orders?.filter(o => o.status === "requested").length || 0) +
    (tractorBookings?.filter(b => b.status === "requested").length || 0) +
    (laborBookings?.filter(b => b.status === "requested").length || 0);

  const isLoading = ordersLoading || tractorsLoading || laborLoading;

  const stats = [
    { label: "Total Orders", value: orders?.length || 0, icon: ShoppingCart, trend: `${orders?.filter(o => o.status === "requested").length || 0} pending` },
    { label: "Tractor Bookings", value: tractorBookings?.length || 0, icon: Tractor, trend: `${tractorBookings?.filter(b => b.status === "requested").length || 0} pending` },
    { label: "Labor Requests", value: laborBookings?.length || 0, icon: Users, trend: `${laborBookings?.filter(b => b.status === "requested").length || 0} pending` },
    { label: "Active Farmers", value: new Set([
      ...(orders?.map(o => o.user_id) || []),
      ...(tractorBookings?.map(b => b.user_id) || []),
      ...(laborBookings?.map(b => b.user_id) || [])
    ]).size, icon: UserCheck, trend: "Unique users" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold block leading-none">
                  Kisan<span className="text-primary">Connect</span>
                </span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </Link>
            <button className="lg:hidden p-1" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  item.path === "/admin"
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage orders, bookings and approvals</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5" />
                {pendingCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

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
                    className="bg-card rounded-2xl p-5 border border-border shadow-soft animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground">
                        {stat.trend}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="orders" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
                  <TabsTrigger value="orders" className="gap-2">
                    <Package className="w-4 h-4" />
                    Orders
                    {(orders?.filter(o => o.status === "requested").length || 0) > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                        {orders?.filter(o => o.status === "requested").length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="tractors" className="gap-2">
                    <Tractor className="w-4 h-4" />
                    Tractors
                    {(tractorBookings?.filter(b => b.status === "requested").length || 0) > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                        {tractorBookings?.filter(b => b.status === "requested").length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="labor" className="gap-2">
                    <Users className="w-4 h-4" />
                    Labor
                    {(laborBookings?.filter(b => b.status === "requested").length || 0) > 0 && (
                      <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                        {laborBookings?.filter(b => b.status === "requested").length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Orders Tab */}
                <TabsContent value="orders">
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium">Order ID</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Date</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Items</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Amount</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders?.map((order) => {
                            const StatusIcon = statusIcons[order.status];
                            return (
                              <tr key={order.id} className="border-t border-border hover:bg-muted/30">
                                <td className="px-4 py-3 font-medium text-xs">{order.id.slice(0, 8)}...</td>
                                <td className="px-4 py-3 text-sm">{format(new Date(order.created_at), "MMM dd, yyyy")}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                  {(order as any).order_items?.length || 0} items
                                </td>
                                <td className="px-4 py-3 font-semibold">₹{Number(order.total_amount)}</td>
                                <td className="px-4 py-3">
                                  <Badge className={statusColors[order.status]}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {order.status.replace("_", " ")}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <Select value={order.status} onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}>
                                    <SelectTrigger className="w-36 h-9">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover">
                                      <SelectItem value="requested">Requested</SelectItem>
                                      <SelectItem value="accepted">Accepted</SelectItem>
                                      <SelectItem value="in_progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                              </tr>
                            );
                          })}
                          {(!orders || orders.length === 0) && (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                No orders found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                {/* Tractors Tab */}
                <TabsContent value="tractors">
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium">Booking ID</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Tractor</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Date</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Hours</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Amount</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tractorBookings?.map((booking) => {
                            const StatusIcon = statusIcons[booking.status];
                            return (
                              <tr key={booking.id} className="border-t border-border hover:bg-muted/30">
                                <td className="px-4 py-3 font-medium text-xs">{booking.id.slice(0, 8)}...</td>
                                <td className="px-4 py-3">{(booking as any).tractors?.name || "N/A"}</td>
                                <td className="px-4 py-3">{booking.booking_date}</td>
                                <td className="px-4 py-3">{booking.hours}h</td>
                                <td className="px-4 py-3 font-semibold">₹{Number(booking.total_amount)}</td>
                                <td className="px-4 py-3">
                                  <Badge className={statusColors[booking.status]}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {booking.status.replace("_", " ")}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <Select value={booking.status} onValueChange={(value) => handleUpdateTractorStatus(booking.id, value)}>
                                    <SelectTrigger className="w-36 h-9">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover">
                                      <SelectItem value="requested">Requested</SelectItem>
                                      <SelectItem value="accepted">Accepted</SelectItem>
                                      <SelectItem value="in_progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                              </tr>
                            );
                          })}
                          {(!tractorBookings || tractorBookings.length === 0) && (
                            <tr>
                              <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                No tractor bookings found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                {/* Labor Tab */}
                <TabsContent value="labor">
                  <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left px-4 py-3 text-sm font-medium">Booking ID</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Worker</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Skill</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Days</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Amount</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                            <th className="text-left px-4 py-3 text-sm font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {laborBookings?.map((booking) => {
                            const StatusIcon = statusIcons[booking.status];
                            return (
                              <tr key={booking.id} className="border-t border-border hover:bg-muted/30">
                                <td className="px-4 py-3 font-medium text-xs">{booking.id.slice(0, 8)}...</td>
                                <td className="px-4 py-3">{(booking as any).labor_workers?.full_name || "N/A"}</td>
                                <td className="px-4 py-3 capitalize">{booking.work_type}</td>
                                <td className="px-4 py-3">{booking.days_required} days</td>
                                <td className="px-4 py-3 font-semibold">₹{Number(booking.total_amount)}</td>
                                <td className="px-4 py-3">
                                  <Badge className={statusColors[booking.status]}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {booking.status.replace("_", " ")}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <Select value={booking.status} onValueChange={(value) => handleUpdateLaborStatus(booking.id, value)}>
                                    <SelectTrigger className="w-36 h-9">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover">
                                      <SelectItem value="requested">Requested</SelectItem>
                                      <SelectItem value="accepted">Accepted</SelectItem>
                                      <SelectItem value="in_progress">In Progress</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                              </tr>
                            );
                          })}
                          {(!laborBookings || laborBookings.length === 0) && (
                            <tr>
                              <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                No labor bookings found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
