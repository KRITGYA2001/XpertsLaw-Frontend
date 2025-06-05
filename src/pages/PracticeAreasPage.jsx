
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
    description: "Our family law attorneys provide compassionate and effective representation for divorce, child custody, adoption, and other family-related legal matters. We understand the emotional challenges involved and work to achieve the best outcomes for you and your family.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    link: "/practice-areas/family-law",
    services: ["Divorce", "Child Custody", "Child Support", "Adoption", "Prenuptial Agreements", "Domestic Violence Protection"],
  },
  {
    id: 2,
    title: "Criminal Defense",
    description: "Our criminal defense attorneys provide skilled representation for those facing criminal charges or under investigation. We protect your rights throughout the legal process and work diligently to achieve the best possible outcome for your case.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
      </svg>
    ),
    link: "/practice-areas/criminal-defense",
    services: ["Felony Defense", "Misdemeanor Defense", "DUI/DWI", "Drug Offenses", "White Collar Crimes", "Juvenile Offenses"],
  },
  {
    id: 3,
    title: "Personal Injury",
    description: "Our personal injury attorneys fight for the rights of those injured due to negligence or wrongful actions. We help you recover compensation for medical expenses, lost wages, pain and suffering, and other damages resulting from your injury.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M8 19h8a4 4 0 0 0 4-4 5 5 0 0 0-5-5 7 7 0 0 0-7-5 6 6 0 0 0-6 6c0 4 3.5 8 6 8Z"></path>
        <polyline points="12,12 12,16"></polyline>
        <line x1="12" y1="8" x2="12" y2="8"></line>
      </svg>
    ),
    link: "/practice-areas/personal-injury",
    services: ["Car Accidents", "Slip and Fall", "Medical Malpractice", "Workplace Injuries", "Product Liability", "Wrongful Death"],
  },
  {
    id: 4,
    title: "Business Law",
    description: "Our business law attorneys provide comprehensive legal services for businesses of all sizes. From formation to contracts to dispute resolution, we help protect your business interests and support your growth and success.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
    link: "/practice-areas/business-law",
    services: ["Business Formation", "Contracts", "Mergers & Acquisitions", "Intellectual Property", "Employment Law", "Business Litigation"],
  },
  {
    id: 5,
    title: "Real Estate",
    description: "Our real estate attorneys provide expert guidance for property transactions, disputes, and regulations. Whether you're buying, selling, leasing, or facing a property dispute, we help navigate the complex legal landscape of real estate.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    link: "/practice-areas/real-estate",
    services: ["Residential Transactions", "Commercial Transactions", "Landlord-Tenant Law", "Property Disputes", "Zoning Issues", "Foreclosure Defense"],
  },
  {
    id: 6,
    title: "Immigration",
    description: "Our immigration attorneys provide comprehensive assistance with visas, green cards, citizenship, and other immigration issues. We help individuals and families navigate the complex U.S. immigration system to achieve their goals.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        <path d="M2 12h20"></path>
      </svg>
    ),
    link: "/practice-areas/immigration",
    services: ["Family-Based Immigration", "Employment-Based Immigration", "Naturalization & Citizenship", "Deportation Defense", "Asylum", "DACA"],
  },
  {
    id: 7,
    title: "Estate Planning",
    description: "Our estate planning attorneys help you protect your assets and provide for your loved ones. We create comprehensive plans tailored to your specific needs and goals, ensuring your wishes are carried out and your legacy is preserved.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
        <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
        <line x1="9" y1="9" x2="10" y2="9"></line>
        <line x1="9" y1="13" x2="15" y2="13"></line>
        <line x1="9" y1="17" x2="15" y2="17"></line>
      </svg>
    ),
    link: "/practice-areas/estate-planning",
    services: ["Wills", "Trusts", "Power of Attorney", "Healthcare Directives", "Probate", "Estate Administration"],
  },
  {
    id: 8,
    title: "Employment Law",
    description: "Our employment law attorneys represent both employees and employers in workplace legal matters. We help protect rights, ensure compliance with regulations, and resolve disputes related to employment relationships.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
    link: "/practice-areas/employment-law",
    services: ["Discrimination", "Harassment", "Wage & Hour Disputes", "Wrongful Termination", "Employment Contracts", "Workplace Safety"],
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

const PracticeAreasPage = () => {
  return (
    <div className="container py-8 md:py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Practice Areas</h1>
        <p className="text-muted-foreground text-lg">
          We offer expert legal services across a wide range of practice areas to meet your specific needs.
          Our attorneys specialize in various fields to provide you with the best representation possible.
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {practiceAreas.map((area) => (
          <motion.div key={area.id} variants={item}>
            <Card className="h-full card-hover border-primary/10 hover:border-primary/30">
              <CardContent className="pt-6">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  {area.icon}
                </div>
                <h2 className="text-xl font-semibold mb-2">{area.title}</h2>
                <p className="text-muted-foreground mb-4">{area.description}</p>
                
                <h3 className="font-medium mb-2">Services Include:</h3>
                <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-1">
                  {area.services.map((service, index) => (
                    <li key={index}>{service}</li>
                  ))}
                </ul>
                
                <Link to={area.link}>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    Learn More
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PracticeAreasPage;
