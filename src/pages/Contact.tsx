import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+91 9876543210", subtext: "Mon-Sat, 8am-8pm" },
    { icon: Mail, label: "Email", value: "support@kisanconnect.in", subtext: "We reply within 24 hours" },
    { icon: MapPin, label: "Office", value: "Hyderabad, Telangana", subtext: "Agricultural Hub, HITEC City" },
    { icon: Clock, label: "Hours", value: "8:00 AM - 8:00 PM", subtext: "Monday to Saturday" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Have questions about our services? We're here to help. 
              Reach out in Telugu, Hindi, or English.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {contactInfo.map((info) => (
                <div key={info.label} className="bg-card rounded-2xl p-6 shadow-soft border border-border text-center card-hover">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">{info.label}</h3>
                  <p className="text-primary font-medium">{info.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{info.subtext}</p>
                </div>
              ))}
            </div>

            {/* Form Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
              <div className="bg-card rounded-3xl p-8 shadow-card border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Send us a Message</h2>
                    <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="h-12"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        className="h-12"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="h-12"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      className="h-12"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your query..."
                      className="min-h-[120px] resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    Send Message
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>

              <div className="space-y-6">
                <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
                  <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {[
                      { q: "How do I register as a farmer?", a: "Click 'Register' and enter your passbook details including name, survey number, and Aadhaar-linked mobile number." },
                      { q: "What documents do I need?", a: "Your farmer passbook with survey number and your mobile number linked to Aadhaar for verification." },
                      { q: "Are the prices subsidized?", a: "Yes! All agricultural inputs are available at government-subsidized rates." },
                      { q: "How long does delivery take?", a: "Most orders are delivered within 2-3 business days to your registered address." },
                    ].map((faq, index) => (
                      <div key={index} className="pb-4 border-b border-border last:border-0 last:pb-0">
                        <p className="font-medium mb-1">{faq.q}</p>
                        <p className="text-sm text-muted-foreground">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gradient-hero rounded-3xl p-8 text-white">
                  <h3 className="text-xl font-semibold mb-2">Need Urgent Help?</h3>
                  <p className="text-white/80 mb-4">
                    Our Telugu-speaking support team is available 7 days a week.
                  </p>
                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now: +91 9876543210
                  </a>
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

export default Contact;
