import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sprout, Home, Package, Tractor, Users, Truck,
  Settings, LogOut, Menu, X, Bell, CalendarIcon,
  Clock, MapPin, Fuel, ArrowRight, CheckCircle, Loader2
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useTractors, useCreateTractorBooking } from "@/hooks/useTractors";
import { useAuth } from "@/hooks/useAuth";

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

const TractorBooking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { data: tractors, isLoading } = useTractors();
  const createBooking = useCreateTractorBooking();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTractor, setSelectedTractor] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("");
  const [hours, setHours] = useState<number>(4);
  const [location, setLocation] = useState("");
  const [landSize, setLandSize] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Overview" },
    { path: "/dashboard/orders", icon: Package, label: "Order Inputs" },
    { path: "/dashboard/tractors", icon: Tractor, label: "Book Tractors" },
    { path: "/dashboard/labor", icon: Users, label: "Hire Labor" },
    { path: "/dashboard/tracking", icon: Truck, label: "Track Orders" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  const selectedTractorData = tractors?.find(t => t.id === selectedTractor);
  const totalAmount = selectedTractorData ? Number(selectedTractorData.hourly_rate) * hours : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Error", description: "Please login to book", variant: "destructive" });
      return;
    }

    if (!selectedTractor || !date || !startTime || !location) {
      toast({ title: "Missing Information", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createBooking.mutateAsync({
        user_id: user.id,
        tractor_id: selectedTractor,
        booking_date: format(date, "yyyy-MM-dd"),
        start_time: startTime,
        hours,
        location,
        land_size_acres: landSize ? parseFloat(landSize) : null,
        notes: notes || null,
        total_amount: totalAmount,
      });
      
      toast({ title: "Booking Confirmed!", description: "Your tractor booking request has been submitted" });
      navigate("/dashboard");
    } catch (error) {
      toast({ title: "Error", description: "Failed to create booking. Please try again.", variant: "destructive" });
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  item.path === "/dashboard/tractors"
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
                <h1 className="text-xl font-semibold">Book Tractor</h1>
                <p className="text-sm text-muted-foreground">Reserve tractors for your farm work</p>
              </div>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Booking Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tractor Selection */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                  <h2 className="text-lg font-semibold mb-4">Select Tractor</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {tractors?.map((tractor) => (
                      <button
                        key={tractor.id}
                        onClick={() => setSelectedTractor(tractor.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all",
                          selectedTractor === tractor.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center">
                            <Tractor className="w-6 h-6 text-accent-foreground" />
                          </div>
                          {selectedTractor === tractor.id && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <h3 className="font-semibold">{tractor.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{tractor.description || tractor.model}</p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <Fuel className="w-4 h-4" />
                            {tractor.horsepower} HP
                          </span>
                          <span className="text-primary font-semibold">₹{Number(tractor.hourly_rate)}/hr</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                  <h2 className="text-lg font-semibold mb-4">Date & Time</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Booking Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-12",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-popover" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Hours Required</Label>
                      <Select value={hours.toString()} onValueChange={(v) => setHours(parseInt(v))}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {[2, 4, 6, 8, 10, 12].map((h) => (
                            <SelectItem key={h} value={h.toString()}>{h} hours</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                  <h2 className="text-lg font-semibold mb-4">Location Details</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Farm Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="Village, Mandal"
                          className="pl-10 h-12"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="landSize">Land Size (acres)</Label>
                      <Input
                        id="landSize"
                        type="number"
                        placeholder="Enter land size"
                        className="h-12"
                        value={landSize}
                        onChange={(e) => setLandSize(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Type of work, special requirements, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-2xl p-6 border border-border shadow-soft sticky top-24">
                  <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>
                  
                  {selectedTractorData ? (
                    <>
                      <div className="p-4 rounded-xl bg-muted/50 mb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
                            <Tractor className="w-5 h-5 text-accent-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{selectedTractorData.name}</h3>
                            <p className="text-sm text-muted-foreground">{selectedTractorData.horsepower} HP</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Date</span>
                          <span>{date ? format(date, "PPP") : "Not selected"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Time</span>
                          <span>{startTime || "Not selected"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Duration</span>
                          <span>{hours} hours</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Rate</span>
                          <span>₹{Number(selectedTractorData.hourly_rate)}/hour</span>
                        </div>
                        <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span className="text-primary">₹{totalAmount}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Tractor className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Select a tractor to see summary</p>
                    </div>
                  )}

                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={!selectedTractor || !date || !startTime || !location || isSubmitting}
                  >
                    {isSubmitting ? "Booking..." : "Confirm Booking"}
                    <ArrowRight className="w-4 h-4" />
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

export default TractorBooking;
