import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Sprout, Target, Heart, Users, MapPin, Award } from "lucide-react";

const About = () => {
  const team = [
    { name: "Agricultural Experts", count: "10+", desc: "Domain specialists" },
    { name: "Tech Engineers", count: "15+", desc: "Building the platform" },
    { name: "Support Staff", count: "20+", desc: "Telugu-speaking agents" },
  ];

  const values = [
    {
      icon: Target,
      title: "Mission",
      description: "To digitally empower every farmer in Telangana with seamless access to agricultural resources, eliminating middlemen and reducing operational friction.",
    },
    {
      icon: Heart,
      title: "Vision",
      description: "A future where no farmer has to travel hours for seeds or spend days finding labor—everything accessible from their fingertips.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Built by understanding the real challenges faced by farmers in rural Telangana. Every feature is designed with farmer feedback.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6">
                <Sprout className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About <span className="text-gradient">KisanConnect</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                KisanConnect was born from witnessing the daily struggles of farmers in rural Telangana—
                traveling long distances for basic agricultural inputs, dealing with unreliable middlemen, 
                and facing challenges in coordinating labor for their fields.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Our Story
                </span>
                <h2 className="text-3xl font-bold mb-6">
                  From Problem to Platform
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Agriculture in rural Telangana faces unique challenges—fragmented procurement 
                    of essentials, labor coordination difficulties, and verification issues that 
                    cost farmers both time and money.
                  </p>
                  <p>
                    KisanConnect addresses these by providing a single platform where farmers 
                    register and verify via passbook details, then access everything they need: 
                    order inputs with delivery tracking, book tractors, and hire verified labor.
                  </p>
                  <p>
                    Our platform has already helped reduce travel time by 70%, eliminated 
                    middlemen, ensured subsidized input access, and streamlined farm operations 
                    across 100+ villages.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                  <div className="text-4xl font-bold text-primary mb-2">70%</div>
                  <p className="text-muted-foreground">Travel Time Reduced</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                  <div className="text-4xl font-bold text-primary mb-2">5000+</div>
                  <p className="text-muted-foreground">Farmers Registered</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                  <div className="text-4xl font-bold text-primary mb-2">100+</div>
                  <p className="text-muted-foreground">Villages Covered</p>
                </div>
                <div className="bg-card rounded-2xl p-6 shadow-soft border border-border">
                  <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                  <p className="text-muted-foreground">Support Available</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Our core values shape every decision we make
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Team</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A dedicated team combining agricultural expertise with technology
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {team.map((member) => (
                <div key={member.name} className="bg-card rounded-2xl p-6 text-center shadow-soft border border-border">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <Award className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">{member.count}</div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-card rounded-3xl p-8 md:p-12 shadow-card border border-border max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-medium">Our Location</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Based in Telangana</h2>
                  <p className="text-muted-foreground mb-4">
                    Headquartered in Hyderabad with field offices across major agricultural 
                    districts to ensure we stay connected with the farmers we serve.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Address:</strong> Agricultural Hub, HITEC City, Hyderabad</p>
                    <p><strong>Phone:</strong> +91 9876543210</p>
                    <p><strong>Email:</strong> support@kisanconnect.in</p>
                  </div>
                </div>
                <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-muted-foreground/30" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
