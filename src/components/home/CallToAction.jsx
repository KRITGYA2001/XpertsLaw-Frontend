
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Expert Legal Help?</h2>
            <p className="text-primary-foreground/80 text-lg max-w-xl">
              Take the first step toward resolving your legal issues. Connect with a qualified attorney today and get the professional guidance you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/lawyers">
                <Button size="lg" variant="secondary" className="gap-2">
                  Find a Lawyer
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Why Choose XpertsLaw?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Verified Professionals</h4>
                    <p className="text-primary-foreground/70 text-sm">All lawyers on our platform are thoroughly vetted and qualified.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Secure Consultations</h4>
                    <p className="text-primary-foreground/70 text-sm">Our platform ensures your meetings and information remain confidential.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Transparent Pricing</h4>
                    <p className="text-primary-foreground/70 text-sm">Clear fee structures with no hidden costs or surprises.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1 mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Convenient Access</h4>
                    <p className="text-primary-foreground/70 text-sm">Connect with legal experts from anywhere, anytime.</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
