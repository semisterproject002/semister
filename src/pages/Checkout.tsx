import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sprout, Home, Package, Tractor, Users, Truck,
  Settings, LogOut, Menu, X, Bell, MapPin, ArrowLeft, ShoppingCart
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useCreateOrder } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const createOrder = useCreateOrder();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Overview" },
    { path: "/dashboard/orders", icon: Package, label: "Order Inputs" },
    { path: "/dashboard/tractors", icon: Tractor, label: "Book Tractors" },
    { path: "/dashboard/labor", icon: Users, label: "Hire Labor" },
    { path: "/dashboard/tracking", icon: Truck, label: "Track Orders" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Error", description: "Please login to place order", variant: "destructive" });
      return;
    }

    if (items.length === 0) {
      toast({ title: "Cart Empty", description: "Add items to cart before checkout", variant: "destructive" });
      return;
    }

    if (!deliveryAddress) {
      toast({ title: "Missing Information", description: "Please enter delivery address", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createOrder.mutateAsync({
        order: {
          user_id: user.id,
          total_amount: totalAmount,
          delivery_address: deliveryAddress,
          delivery_notes: deliveryNotes || null,
        },
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity * (item.isSubsidized ? (1 - item.subsidyPercentage / 100) : 1),
        })),
      });

      clearCart();
      toast({ title: "Order Placed!", description: "Your order has been submitted successfully" });
      navigate("/dashboard");
    } catch (error) {
      toast({ title: "Error", description: "Failed to place order. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <span className="font-bold">
                Kisan<span className="text-primary">Connect</span>
              </span>
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
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/login">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Link>
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
                <h1 className="text-xl font-semibold">Checkout</h1>
                <p className="text-sm text-muted-foreground">Complete your order</p>
              </div>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Button variant="ghost" className="mb-6" onClick={() => navigate("/dashboard/orders")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-4">Add products before checkout</p>
              <Button variant="hero" onClick={() => navigate("/dashboard/orders")}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                  <h2 className="text-lg font-semibold mb-4">Order Items ({items.length})</h2>
                  <div className="space-y-4">
                    {items.map((item) => {
                      const finalPrice = item.isSubsidized
                        ? item.price * (1 - item.subsidyPercentage / 100)
                        : item.price;
                      return (
                        <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ₹{finalPrice.toFixed(0)} x {item.quantity} {item.unit}
                            </p>
                          </div>
                          <span className="font-semibold">₹{(finalPrice * item.quantity).toFixed(0)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                  <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="address"
                          placeholder="Village, Mandal, District"
                          className="pl-10 h-12"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special instructions..."
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </form>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-soft sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                      <span>₹{items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-success">
                      <span>Subsidy Discount</span>
                      <span>-₹{(items.reduce((sum, item) => sum + item.price * item.quantity, 0) - totalAmount).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="text-success">Free</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">₹{totalAmount.toFixed(0)}</span>
                    </div>
                  </div>

                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isSubmitting || items.length === 0}
                  >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </Button>
                </div>
              </div>
            </div>
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

export default Checkout;
