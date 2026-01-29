import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, User, Phone, Lock, MapPin, FileText, ArrowRight, Eye, EyeOff, CheckCircle, Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUpWithEmail } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    surveyNumber: "",
    village: "",
    mandal: "",
    district: "",
    password: "",
    confirmPassword: "",
  });

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      toast({ title: "Error", description: "Please enter your full name", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" });
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast({ title: "Error", description: "Please enter a valid 10-digit mobile number", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.village.trim()) {
      toast({ title: "Error", description: "Please enter your village name", variant: "destructive" });
      return false;
    }
    if (formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateStep2()) return;
    
    setLoading(true);
    const { error } = await signUpWithEmail(formData.email, formData.password, {
      full_name: formData.fullName,
      phone: formData.phone,
      survey_number: formData.surveyNumber,
      village: formData.village,
      mandal: formData.mandal,
      district: formData.district,
    });
    
    if (error) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    
    toast({ title: "Welcome to KisanConnect!", description: "Your account has been created successfully" });
    navigate("/dashboard");
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      handleSignUp();
    }
  };

  const steps = [
    { number: 1, title: "Personal Details" },
    { number: 2, title: "Farm & Security" },
  ];

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

          <h1 className="text-3xl font-bold mb-2">Farmer Registration</h1>
          <p className="text-muted-foreground mb-6">
            Enter your details to get started
          </p>

          {/* Steps Indicator */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= s.number
                      ? "gradient-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s.number ? <CheckCircle className="w-5 h-5" /> : s.number}
                </div>
                <span className={`text-sm ${step >= s.number ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-6 h-0.5 ${step > s.number ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name (as per Passbook)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10 h-12"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>

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
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      className="pl-10 h-12"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surveyNumber">Survey Number (Optional)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="surveyNumber"
                      type="text"
                      placeholder="Enter land survey number"
                      className="pl-10 h-12"
                      value={formData.surveyNumber}
                      onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="village">Village</Label>
                    <Input
                      id="village"
                      type="text"
                      placeholder="Village name"
                      className="h-12"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mandal">Mandal</Label>
                    <Input
                      id="mandal"
                      type="text"
                      placeholder="Mandal name"
                      className="h-12"
                      value={formData.mandal}
                      onChange={(e) => setFormData({ ...formData, mandal: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="district"
                      type="text"
                      placeholder="Enter your district"
                      className="pl-10 h-12"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      className="pl-10 h-12"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3">
              {step > 1 && (
                <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className={step === 1 ? "w-full" : "flex-1"}
                disabled={loading}
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {!loading && (
                  <>
                    {step === 1 && "Continue"}
                    {step === 2 && "Create Account"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex relative gradient-hero items-center justify-center p-12">
        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-3xl font-bold mb-6">
            Why Register with KisanConnect?
          </h2>
          
          <ul className="space-y-4">
            {[
              { icon: CheckCircle, text: "Verified farmer identity" },
              { icon: CheckCircle, text: "Access subsidized agricultural inputs" },
              { icon: CheckCircle, text: "Book tractors at competitive rates" },
              { icon: CheckCircle, text: "Hire background-verified labor" },
              { icon: CheckCircle, text: "Real-time delivery tracking" },
              { icon: CheckCircle, text: "24/7 customer support in Telugu" },
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-accent" />
                <span className="text-white/90">{item.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 p-6 rounded-2xl bg-white/10 backdrop-blur">
            <p className="text-white/80 italic">
              "KisanConnect saved me hours of travel. Now I order everything from home!"
            </p>
            <p className="mt-3 text-sm text-white/60">— Ramesh, Warangal District</p>
          </div>
        </div>
        
        {/* Decorative */}
        <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
      </div>
    </div>
  );
};

export default Register;
