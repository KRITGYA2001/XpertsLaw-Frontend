
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight } from "lucide-react";

const lawyers = [
  {
    id: 1,
    name: "Sarah Johnson",
    specialty: "Family Law",
    rating: 4.9,
    reviews: 127,
    location: "New York, NY",
    image: "",
    initials: "SJ",
    link: "/lawyers/sarah-johnson",
  },
  {
    id: 2,
    name: "Michael Chen",
    specialty: "Corporate Law",
    rating: 4.8,
    reviews: 93,
    location: "San Francisco, CA",
    image: "",
    initials: "MC",
    link: "/lawyers/michael-chen",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    specialty: "Immigration Law",
    rating: 4.9,
    reviews: 156,
    location: "Miami, FL",
    image: "",
    initials: "ER",
    link: "/lawyers/elena-rodriguez",
  },
  {
    id: 4,
    name: "David Williams",
    specialty: "Criminal Defense",
    rating: 4.7,
    reviews: 112,
    location: "Chicago, IL",
    image: "",
    initials: "DW",
    link: "/lawyers/david-williams",
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

const FeaturedLawyers = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div className="max-w-2xl mb-6 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Featured Lawyers</h2>
            <p className="text-muted-foreground text-lg">
              Highly qualified legal professionals ready to help with your specific needs.
            </p>
          </div>
          <Link to="/lawyers">
            <Button variant="outline" className="gap-2">
              View All Lawyers
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {lawyers.map((lawyer) => (
            <motion.div key={lawyer.id} variants={item}>
              <Link to={lawyer.link}>
                <Card className="h-full lawyer-card overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-[3/2] w-full bg-muted relative">
                      <img  alt={`Portrait of ${lawyer.name}, ${lawyer.specialty} attorney`} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1636369555100-e0ba574af653" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1 text-xs font-medium">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{lawyer.rating}</span>
                        <span className="text-muted-foreground">({lawyer.reviews})</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold mb-1">{lawyer.name}</h3>
                      <p className="text-primary font-medium mb-2">{lawyer.specialty}</p>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin size={14} className="mr-1" />
                        {lawyer.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedLawyers;
