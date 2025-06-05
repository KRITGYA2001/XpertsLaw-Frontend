
import React from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Video, CheckCircle } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Find the Right Lawyer",
    description: "Search and filter through our network of qualified attorneys based on practice area, location, and expertise.",
    icon: <Search className="h-8 w-8 text-primary" />,
  },
  {
    id: 2,
    title: "Schedule a Consultation",
    description: "Book a convenient time for your initial consultation directly through our platform.",
    icon: <Calendar className="h-8 w-8 text-primary" />,
  },
  {
    id: 3,
    title: "Meet Virtually",
    description: "Connect with your lawyer through our secure video conferencing platform for your consultation.",
    icon: <Video className="h-8 w-8 text-primary" />,
  },
  {
    id: 4,
    title: "Get Expert Legal Advice",
    description: "Receive professional guidance and solutions tailored to your specific legal situation.",
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How XpertsLaw Works</h2>
          <p className="text-muted-foreground text-lg">
            Our streamlined process makes it easy to connect with legal experts and get the help you need.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={item}
              className="relative"
            >
              <div className="bg-background rounded-xl p-6 h-full border shadow-sm">
                <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {step.id < steps.length && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
