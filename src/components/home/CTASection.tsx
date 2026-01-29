import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sprout } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-16 text-center">
          {/* Background Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.3'%3E%3Cpath fill-rule='evenodd' d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-6">
              <Sprout className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Farming Experience?
            </h2>

            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of Telangana farmers who have already simplified their 
              agricultural operations with KisanConnect.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="accent" 
                size="xl" 
                className="shadow-elevated"
                asChild
              >
                <Link to="/register">
                  Register Now - It's Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-white/60">
              No registration fee • Aadhaar verification • Instant access
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
