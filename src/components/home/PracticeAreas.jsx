
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const practiceAreas = [
  {
    id: 1,
    title: "Family Law",
    description: "Divorce, child custody, adoption, and other family-related legal matters.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    link: "/practice-areas/family-law",
  },
  {
    id: 2,
    title: "Criminal Defense",
    description: "Legal representation for those facing criminal charges or under investigation.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
      </svg>
    ),
    link: "/practice-areas/criminal-defense",
  },
  {
    id: 3,
    title: "Personal Injury",
    description: "Representation for those injured due to negligence or wrongful actions.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M8 19h8a4 4 0 0 0 4-4 5 5 0 0 0-5-5 7 7 0 0 0-7-5 6 6 0 0 0-6 6c0 4 3.5 8 6 8Z"></path>
        <polyline points="12,12 12,16"></polyline>
        <line x1="12" y1="8" x2="12" y2="8"></line>
      </svg>
    ),
    link: "/practice-areas/personal-injury",
  },
  {
    id: 4,
    title: "Business Law",
    description: "Legal services for businesses, including formation, contracts, and disputes.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
    link: "/practice-areas/business-law",
  },
  {
    id: 5,
    title: "Real Estate",
    description: "Legal assistance with property transactions, disputes, and regulations.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    link: "/practice-areas/real-estate",
  },
  {
    id: 6,
    title: "Immigration",
    description: "Assistance with visas, green cards, citizenship, and immigration issues.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        <path d="M2 12h20"></path>
      </svg>
    ),
    link: "/practice-areas/immigration",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PracticeAreas = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Practice Areas</h2>
          <p className="text-muted-foreground text-lg">
            We offer expert legal services across a wide range of practice areas to meet your specific needs.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {practiceAreas.map((area) => (
            <motion.div key={area.id} variants={item}>
              <Link to={area.link}>
                <Card className="h-full card-hover border-primary/10 hover:border-primary/30">
                  <CardContent className="pt-6">
                    <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                      {area.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
                    <p className="text-muted-foreground mb-4">{area.description}</p>
                    <div className="flex items-center text-primary font-medium">
                      Learn more <ArrowRight size={16} className="ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center">
          <Link to="/practice-areas">
            <Button size="lg" variant="outline">
              View All Practice Areas
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas;
