import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Sprout, Tractor, Users } from "lucide-react";

const HeroSection = () => {
  const features = [
    "Verified Farmer Registration",
    "Real-time Order Tracking",
    "Subsidized Input Access",
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23166534' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 pt-20 pb-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sprout className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                For Telangana Farmers
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Empowering{" "}
              <span className="text-gradient">Agriculture</span>{" "}
              Through Technology
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              One platform for all your farming needs. Order seeds, urea, pesticides, 
              book tractors, and hire verified labor - all with real-time tracking.
            </p>

            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/register">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">70%</div>
                <div className="text-sm text-muted-foreground">Travel Time Saved</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">5000+</div>
                <div className="text-sm text-muted-foreground">Farmers Registered</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Villages Covered</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-float">
              {/* Main Card */}
              <div className="bg-card rounded-3xl shadow-elevated p-8 border border-border">
                <div className="grid grid-cols-2 gap-4">
                  {/* Service Cards */}
                  <div className="bg-primary/5 rounded-2xl p-6 text-center card-hover">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                      <Sprout className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">Order Inputs</h3>
                    <p className="text-xs text-muted-foreground mt-1">Seeds, Urea, Pesticides</p>
                  </div>
                  
                  <div className="bg-accent/10 rounded-2xl p-6 text-center card-hover">
                    <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-4">
                      <Tractor className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">Book Tractors</h3>
                    <p className="text-xs text-muted-foreground mt-1">Hourly & Daily Rental</p>
                  </div>
                  
                  <div className="col-span-2 bg-secondary/10 rounded-2xl p-6 text-center card-hover">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4">
                      <Users className="w-7 h-7 text-secondary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">Hire Verified Labor</h3>
                    <p className="text-xs text-muted-foreground mt-1">Background Checked Workers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full gradient-accent opacity-20 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full gradient-primary opacity-20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
