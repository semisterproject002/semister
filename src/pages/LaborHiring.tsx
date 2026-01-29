import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sprout, Home, Package, Tractor, Users, Truck,
  Settings, LogOut, Menu, X, Bell, CalendarIcon,
  MapPin, Star, CheckCircle, Briefcase, Search, Loader2, ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useWorkers, useCreateLaborBooking } from "@/hooks/useWorkers";
import { useAuth } from "@/hooks/useAuth";

const skillCategories = [
  { id: "all", label: "All Skills" },
  { id: "harvesting", label: "Harvesting" },
  { id: "planting", label: "Planting" },
  { id: "spraying", label: "Spraying" },
  { id: "weeding", label: "Weeding" },
  { id: "irrigation", label: "Irrigation" },
  { id: "general", label: "General" },
];

const skillColors: Record<string, string> = {
  harvesting: "bg-success/10 text-success",
  planting: "bg-primary/10 text-primary",
  spraying: "bg-destructive/10 text-destructive",
  weeding: "bg-accent/20 text-accent-foreground",
  irrigation: "bg-blue-500/10 text-blue-500",
  general: "bg-muted text-muted-foreground",
};

const LaborHiring = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { data: workers, isLoading } = useWorkers();
  const createBooking = useCreateLaborBooking();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSkill, setActiveSkill] = useState("all");
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Booking form state
  const [date, setDate] = useState<Date>();
  const [daysRequired, setDaysRequired] = useState<number>(1);
  const [location, setLocation] = useState("");
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

  const filteredWorkers = workers?.filter((worker) => {
    const matchesSearch = worker.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (worker.village?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesSkill = activeSkill === "all" || worker.skill === activeSkill;
    return matchesSearch && matchesSkill;
  }) || [];

  const selectedWorkerData = workers?.find(w => w.id === selectedWorker);
  const totalAmount = selectedWorkerData ? Number(selectedWorkerData.daily_rate) * daysRequired : 0;

  const handleHireWorker = (workerId: string) => {
    setSelectedWorker(workerId);
    setShowBookingForm(true);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Error", description: "Please login to hire", variant: "destructive" });
      return;
    }

    if (!selectedWorker || !date || !location) {
      toast({ title: "Missing Information", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createBooking.mutateAsync({
        user_id: user.id,
        worker_id: selectedWorker,
        work_type: selectedWorkerData?.skill || "general",
        booking_date: format(date, "yyyy-MM-dd"),
        days_required: daysRequired,
        location,
        notes: notes || null,
        total_amount: totalAmount,
      });
      
      toast({ title: "Worker Hired!", description: "Your labor booking request has been submitted" });
      setShowBookingForm(false);
      setSelectedWorker(null);
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
                  item.path === "/dashboard/labor"
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
                <h1 className="text-xl font-semibold">Hire Labor</h1>
                <p className="text-sm text-muted-foreground">Find verified workers for your farm</p>
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
          ) : !showBookingForm ? (
            <>
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search workers by name or village..."
                    className="pl-10 h-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Skill Categories */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4">
                {skillCategories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeSkill === cat.id ? "default" : "outline"}
                    className="shrink-0"
                    onClick={() => setActiveSkill(cat.id)}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>

              {/* Workers Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkers.map((worker, index) => (
                  <div
                    key={worker.id}
                    className="bg-card rounded-2xl p-5 border border-border shadow-soft card-hover animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground shrink-0">
                        {worker.full_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{worker.full_name}</h3>
                          {worker.is_verified && (
                            <CheckCircle className="w-4 h-4 text-success shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {worker.village || "Telangana"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={skillColors[worker.skill] || skillColors.general}>
                        {worker.skill}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {worker.experience_years || 0} years
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="font-medium">{Number(worker.rating) || 0}</span>
                        <span className="text-sm text-muted-foreground">({worker.total_jobs || 0} jobs)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">₹{Number(worker.daily_rate)}</span>
                        <span className="text-sm text-muted-foreground">/day</span>
                      </div>
                    </div>

                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={() => handleHireWorker(worker.id)}
                    >
                      Hire Worker
                    </Button>
                  </div>
                ))}
              </div>

              {filteredWorkers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-1">No workers found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </>
          ) : (
            /* Booking Form */
            <div className="max-w-2xl mx-auto">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => { setShowBookingForm(false); setSelectedWorker(null); }}
              >
                ← Back to Workers
              </Button>

              <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                <h2 className="text-xl font-semibold mb-6">Book Worker</h2>

                {selectedWorkerData && (
                  <div className="p-4 rounded-xl bg-muted/50 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                        {selectedWorkerData.full_name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{selectedWorkerData.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedWorkerData.skill} • {selectedWorkerData.village || "Telangana"}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary">₹{Number(selectedWorkerData.daily_rate)}</span>
                        <span className="text-sm text-muted-foreground">/day</span>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
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
                      <Label>Days Required</Label>
                      <Select value={daysRequired.toString()} onValueChange={(v) => setDaysRequired(parseInt(v))}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {[1, 2, 3, 5, 7, 10, 14, 30].map((d) => (
                            <SelectItem key={d} value={d.toString()}>{d} {d === 1 ? "day" : "days"}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

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
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Work Description</Label>
                    <Textarea
                      id="notes"
                      placeholder="Describe the work to be done..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Daily Rate</span>
                      <span>₹{Number(selectedWorkerData?.daily_rate) || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Days</span>
                      <span>{daysRequired}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-primary/20">
                      <span>Total</span>
                      <span className="text-primary">₹{totalAmount}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Confirm Hiring"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
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

export default LaborHiring;
