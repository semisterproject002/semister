import { Link } from "react-router-dom";
import { Sprout, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <Sprout className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">
                Kisan<span className="text-accent">Connect</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Empowering Telangana farmers with seamless access to agricultural inputs, 
              equipment, and labor through a single digital platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Services", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {["Order Inputs", "Book Tractors", "Hire Labor", "Track Delivery"].map((item) => (
                <li key={item}>
                  <span className="text-primary-foreground/70 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Phone className="w-4 h-4 text-accent" />
                +91 9876543210
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <Mail className="w-4 h-4 text-accent" />
                support@kisanconnect.in
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70 text-sm">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                Agricultural Hub, Hyderabad, Telangana
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="text-primary-foreground/50 text-sm">
            © 2024 KisanConnect. All rights reserved. Built for Telangana Farmers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
