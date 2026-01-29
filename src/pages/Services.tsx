import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Tractor, Users, Truck, ArrowRight, CheckCircle } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Package,
      title: "Agricultural Inputs",
      description: "Order quality seeds, fertilizers (Urea, DAP, MOP), and pesticides at subsidized government rates with doorstep delivery.",
      features: [
        "Government subsidized prices",
        "Quality certified products",
        "Doorstep delivery",
        "Multiple payment options",
        "Order tracking",
      ],
      color: "primary",
    },
    {
      icon: Tractor,
      title: "Tractor Booking",
      description: "Book tractors for ploughing, sowing, harvesting, and transportation. Flexible hourly and daily rental options available.",
      features: [
        "Modern equipment",
        "Trained operators",
        "Flexible timing",
        "Competitive rates",
        "Insurance covered",
      ],
      color: "accent",
    },
    {
      icon: Users,
      title: "Labor Hiring",
      description: "Find verified and skilled agricultural workers for all farm activities. Background-checked workers with fair wages.",
      features: [
        "Background verified",
        "Skilled workers",
        "Fair wage guarantee",
        "Flexible hiring",
        "Work tracking",
      ],
      color: "secondary",
    },
    {
      icon: Truck,
      title: "Delivery Tracking",
      description: "Real-time tracking of all your orders from placement to delivery. Stay updated with SMS alerts.",
      features: [
        "Live GPS tracking",
        "SMS notifications",
        "ETA updates",
        "Delivery confirmation",
        "Support chat",
      ],
      color: "success",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Complete Agricultural Solutions
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything your farm needs, accessible from one platform. 
              Save time, reduce costs, and focus on what matters most.
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className={`grid lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={`order-2 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                          service.color === "primary" ? "gradient-primary" :
                          service.color === "accent" ? "gradient-accent" :
                          service.color === "secondary" ? "bg-secondary" :
                          "bg-success"
                        }`}
                      >
                        <service.icon className={`w-8 h-8 ${
                          service.color === "secondary" ? "text-secondary-foreground" : "text-primary-foreground"
                        }`} />
                      </div>
                      <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-success" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button variant="hero" asChild>
                        <Link to="/register">
                          Get Started
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className={`order-1 ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                    <div 
                      className={`aspect-square rounded-3xl flex items-center justify-center ${
                        service.color === "primary" ? "bg-primary/5" :
                        service.color === "accent" ? "bg-accent/10" :
                        service.color === "secondary" ? "bg-secondary/10" :
                        "bg-success/10"
                      }`}
                    >
                      <service.icon className={`w-32 h-32 ${
                        service.color === "primary" ? "text-primary/30" :
                        service.color === "accent" ? "text-accent/50" :
                        service.color === "secondary" ? "text-secondary/30" :
                        "text-success/30"
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
