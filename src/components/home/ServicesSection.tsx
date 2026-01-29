import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Tractor, Users, Truck, ArrowRight, Shield, Clock, IndianRupee } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Package,
      title: "Order Agricultural Inputs",
      description: "Get quality seeds, urea, DAP, and pesticides delivered to your doorstep at subsidized rates.",
      features: ["Subsidized Prices", "Quality Assured", "Home Delivery"],
      color: "primary",
      link: "/dashboard/orders",
    },
    {
      icon: Tractor,
      title: "Book Tractors",
      description: "Reserve tractors for ploughing, sowing, or harvesting with flexible hourly and daily rates.",
      features: ["Flexible Hours", "Modern Equipment", "Trained Operators"],
      color: "accent",
      link: "/dashboard/tractors",
    },
    {
      icon: Users,
      title: "Hire Verified Labor",
      description: "Find skilled agricultural workers for your farm needs - all background verified.",
      features: ["Verified Workers", "Fair Wages", "Skill Matched"],
      color: "secondary",
      link: "/dashboard/labor",
    },
    {
      icon: Truck,
      title: "Track Deliveries",
      description: "Real-time tracking of all your orders from placement to delivery at your farm.",
      features: ["Live Updates", "SMS Alerts", "ETA Tracking"],
      color: "success",
      link: "/dashboard/tracking",
    },
  ];

  const benefits = [
    { icon: Shield, label: "100% Verified", desc: "All suppliers verified" },
    { icon: Clock, label: "Save 70% Time", desc: "No more traveling" },
    { icon: IndianRupee, label: "Best Prices", desc: "Subsidized rates" },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything Your Farm Needs
          </h2>
          <p className="text-muted-foreground">
            From seeds to labor, access all agricultural essentials through one platform
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group bg-card rounded-2xl p-6 shadow-soft border border-border card-hover animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div 
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                  service.color === "primary" ? "gradient-primary" :
                  service.color === "accent" ? "gradient-accent" :
                  service.color === "secondary" ? "bg-secondary" :
                  "bg-success"
                }`}
              >
                <service.icon className={`w-7 h-7 ${
                  service.color === "secondary" ? "text-secondary-foreground" :
                  service.color === "success" ? "text-success-foreground" :
                  "text-primary-foreground"
                }`} />
              </div>

              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant="ghost" size="sm" className="group/btn" asChild>
                <Link to={service.link}>
                  Learn More
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Benefits Bar */}
        <div className="bg-card rounded-2xl shadow-card border border-border p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.label}
                className={`flex items-center gap-4 ${
                  index !== benefits.length - 1 ? "md:border-r md:border-border" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold">{benefit.label}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
