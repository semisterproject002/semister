import { UserPlus, ClipboardList, Truck, CheckCircle } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Register & Verify",
      description: "Sign up with your passbook details - name, survey number, and Aadhaar-linked mobile for quick verification.",
    },
    {
      icon: ClipboardList,
      step: "02",
      title: "Place Your Order",
      description: "Choose from agricultural inputs, book tractors, or hire labor based on your farming needs.",
    },
    {
      icon: Truck,
      step: "03",
      title: "Track in Real-Time",
      description: "Monitor your orders and bookings with live status updates from request to completion.",
    },
    {
      icon: CheckCircle,
      step: "04",
      title: "Receive & Confirm",
      description: "Get delivery at your farm, verify quality, and confirm completion through the app.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How KisanConnect Works
          </h2>
          <p className="text-muted-foreground">
            Get started in minutes with our simple 4-step process
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-30" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div
                key={item.step}
                className="relative text-center animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step Number */}
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-card relative z-10">
                    <item.icon className="w-9 h-9 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-sm font-bold text-accent-foreground shadow-soft">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
