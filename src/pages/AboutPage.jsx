import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, HeartHandshake as Handshake, Lightbulb } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-background text-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 tracking-tight">About XpertsLaw</h1>
            <p className="text-lg text-muted-foreground mb-6">
              XpertsLaw is a leading legal platform connecting clients with expert attorneys across various practice areas. Our mission is to make legal services more accessible, transparent, and efficient for everyone.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Founded in 2023, we've helped thousands of clients find the right legal representation for their specific needs. Our innovative platform combines technology with personalized service to create a seamless experience for both clients and attorneys. We believe in empowering individuals and businesses with the legal support they need to navigate complex challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/lawyers">
                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg hover:shadow-primary/40 transition-shadow">
                  Find a Lawyer
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-primary/20">
              <img  alt="The XpertsLaw team collaborating in a modern office setting" className="w-full h-auto" src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
             <div className="absolute -bottom-6 -right-6 p-4 bg-background/80 backdrop-blur-md rounded-lg shadow-xl border">
                <p className="text-sm font-semibold text-primary">Trusted by Thousands</p>
                <p className="text-xs text-muted-foreground">For expert legal solutions.</p>
            </div>
          </motion.div>
        </div>

        <Separator className="my-16 md:my-20 bg-border/50" />

        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission & Values</h2>
          <p className="text-lg text-muted-foreground">
            At XpertsLaw, we're committed to transforming how legal services are delivered and experienced. Our platform is built on the following core values:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { icon: <ShieldCheck className="text-primary" />, title: "Accessibility", description: "Making quality legal representation available to everyone, easily and affordably." },
            { icon: <Users className="text-primary" />, title: "Transparency", description: "Providing clear information on qualifications, fees, and verified reviews to empower informed decisions." },
            { icon: <Handshake className="text-primary" />, title: "Integrity", description: "Upholding the highest ethical standards in all interactions and promoting trust within the legal community." },
            { icon: <Lightbulb className="text-primary" />, title: "Innovation", description: "Leveraging technology to streamline legal processes and enhance the client-attorney experience." },
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="bg-card rounded-xl p-6 border shadow-lg hover:shadow-primary/20 transition-shadow card-hover"
            >
              <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p className="text-muted-foreground text-sm">{value.description}</p>
            </motion.div>
          ))}
        </div>
        
        <Separator className="my-16 md:my-20 bg-border/50" />

        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet the Team (Coming Soon)</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Our dedicated team of professionals is passionate about revolutionizing the legal industry. We're working hard to bring you the best possible platform.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[...Array(4)].map((_, i) => (
                     <div key={i} className="flex flex-col items-center p-4 bg-card rounded-lg border shadow-sm">
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-3">
                           <Users size={40} className="text-muted-foreground" />
                        </div>
                        <p className="font-semibold text-foreground">Team Member</p>
                        <p className="text-xs text-primary">Role</p>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;