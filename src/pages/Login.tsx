import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signInWithEmail } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    if (!formData.password.trim()) {
      toast({ title: "Error", description: "Please enter your password", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    const { error } = await signInWithEmail(formData.email, formData.password);
    
    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    
    toast({ title: "Welcome back!", description: "Successfully logged in" });
    navigate("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sprout className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              Kisan<span className="text-primary">Connect</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground mb-8">
            Login to access your farming dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {!loading && (
                <>
                  Login to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Register as Farmer
            </Link>
          </p>

          <div className="mt-8 pt-8 border-t border-border">
            <Link to="/admin/login" className="block text-center text-sm text-muted-foreground hover:text-primary">
              Admin Login →
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex relative gradient-hero items-center justify-center p-12">
        <div className="relative z-10 text-center text-white max-w-lg">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-8">
            <Sprout className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Empowering Rural Agriculture
          </h2>
          <p className="text-white/80 leading-relaxed">
            Access seeds, fertilizers, tractors, and verified labor—all from one platform. 
            Reduce travel time by 70% and get subsidized rates on all inputs.
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">5000+</div>
              <div className="text-sm text-white/60">Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-white/60">Villages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-white/60">Support</div>
            </div>
          </div>
        </div>
        
        {/* Decorative */}
        <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
      </div>
    </div>
  );
};

export default Login;
