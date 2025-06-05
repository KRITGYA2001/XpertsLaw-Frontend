
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Jennifer M.",
    title: "Family Law Client",
    content: "Working with Sarah Johnson was a game-changer for my divorce case. She was compassionate yet professional, and guided me through every step of the process. I couldn't have asked for better representation.",
    rating: 5,
  },
  {
    id: 2,
    name: "Robert T.",
    title: "Business Owner",
    content: "Michael Chen helped me navigate a complex contract dispute that could have cost my business everything. His expertise in corporate law was evident from our first meeting, and the outcome exceeded my expectations.",
    rating: 5,
  },
  {
    id: 3,
    name: "Maria G.",
    title: "Immigration Client",
    content: "Elena Rodriguez made my citizenship process smooth and stress-free. She was always available to answer my questions and kept me informed throughout the entire journey. I'm forever grateful for her help.",
    rating: 5,
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

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 testimonial-gradient">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground text-lg">
            Read about the experiences of clients who have found legal solutions through XpertsLaw.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={item}
              className="bg-background rounded-xl p-6 shadow-sm border relative"
            >
              <div className="absolute -top-5 left-6 bg-primary text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                </svg>
              </div>
              
              <div className="flex items-center mb-4 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="mb-6 text-muted-foreground">"{testimonial.content}"</p>
              
              <div className="flex items-center">
                <div className="bg-primary/10 rounded-full w-10 h-10 flex items-center justify-center text-primary font-medium">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
