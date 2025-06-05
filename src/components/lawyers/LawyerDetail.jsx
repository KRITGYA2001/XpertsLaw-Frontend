import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Briefcase, Award, Clock, Calendar, MessageSquare, Phone, Mail, Globe, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const LawyerDetail = () => {
  const { id } = useParams();
  // In a real app, you would fetch the lawyer data based on the ID
  // For now, we'll use mock data, localized for India
  const lawyer = {
    id,
    name: "Priya Sharma",
    specialty: "Family Law",
    rating: 4.9,
    reviews: 127,
    location: "Mumbai, MH",
    experience: 12,
    certifications: "Board Certified Family Law Specialist (India)",
    education: [
      { degree: "LL.B.", institution: "National Law School of India University, Bangalore", year: "2010" },
      { degree: "B.A. (Hons) Political Science", institution: "University of Delhi", year: "2007" },
    ],
    bio: "Priya Sharma is a highly experienced family law attorney with over 12 years of practice in India. She specializes in divorce, child custody, and adoption cases, providing compassionate and effective representation for her clients during difficult times. Priya is known for her strategic approach to complex family matters and her dedication to achieving the best possible outcomes for families and children.",
    practiceAreas: ["Divorce Law", "Child Custody", "Adoption Law", "Maintenance & Alimony", "Domestic Violence", "Succession & Inheritance"],
    languages: ["English", "Hindi", "Marathi"],
    consultationFee: "₹2500",
    availability: ["Monday to Friday, 10:00 AM - 6:00 PM IST", "Saturday, 11:00 AM - 3:00 PM IST (by appointment)"],
    testimonials: [
      {
        id: 1,
        name: "Anjali K.",
        date: "October 2023",
        content: "Priya was incredibly helpful during my divorce. She was compassionate yet professional, and guided me through every step of the process. I couldn't have asked for better representation.",
        rating: 5,
      },
      {
        id: 2,
        name: "Rohan M.",
        date: "August 2023",
        content: "I was impressed by Priya's knowledge and expertise in handling my child custody case. She was always available to answer my questions and kept me informed throughout the entire process.",
        rating: 5,
      },
      {
        id: 3,
        name: "Sunita P.",
        date: "June 2023",
        content: "Priya helped me navigate a complex adoption process with ease. Her attention to detail and understanding of Indian family law made all the difference. Highly recommend her services!",
        rating: 4,
      },
    ],
    contact: {
      phone: "+91 98765 43210",
      email: "priya.sharma.law@example.in",
      website: "www.priyasharmalaw.in",
      address: "123 Legal Chambers, Nariman Point, Mumbai, Maharashtra 400021"
    }
  };

  return (
    <div className="container py-8 md:py-12">
      <Link to="/lawyers" className="inline-flex items-center text-primary hover:underline mb-6">
        <ChevronLeft size={16} className="mr-1" />
        Back to Lawyers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-1/3 lg:w-1/4">
                <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                  <img  alt={`Portrait of ${lawyer.name}, ${lawyer.specialty} attorney`} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1600267185393-e158a781b353" />
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{lawyer.name}</h1>
                <p className="text-primary font-medium text-lg mb-3">{lawyer.specialty}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{lawyer.rating}</span>
                    <span className="text-muted-foreground ml-1">({lawyer.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin size={16} className="mr-2" />
                    {lawyer.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Briefcase size={16} className="mr-2" />
                    {lawyer.experience} years experience
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Award size={16} className="mr-2" />
                    {lawyer.certifications}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock size={16} className="mr-2" />
                    Consultation Fee: {lawyer.consultationFee}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to={`/book/${lawyer.id}`} className="flex-1">
                    <Button className="w-full">Book Consultation</Button>
                  </Link>
                  <Button variant="outline" className="flex-1 gap-2">
                    <MessageSquare size={16} />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <Tabs defaultValue="about" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">About {lawyer.name}</h3>
                  <p className="text-muted-foreground mb-6">{lawyer.bio}</p>
                  
                  <h4 className="font-semibold mb-2">Practice Areas</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {lawyer.practiceAreas.map((area, index) => (
                      <span key={index} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                  
                  <h4 className="font-semibold mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {lawyer.languages.map((language, index) => (
                      <span key={index} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                  
                  <h4 className="font-semibold mb-2">Availability</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-6">
                    {lawyer.availability.map((time, index) => (
                      <li key={index}>{time}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="experience" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Education</h3>
                  <div className="space-y-4 mb-8">
                    {lawyer.education.map((edu, index) => (
                      <div key={index} className="flex flex-col">
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-muted-foreground">{edu.institution}, {edu.year}</p>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                  <p className="text-muted-foreground mb-6">{lawyer.certifications}</p>
                  
                  <h3 className="text-xl font-semibold mb-4">Professional Experience</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Senior Partner</h4>
                      <p className="text-muted-foreground">Sharma Family Law Chambers, 2015 - Present</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Leading a team of family law attorneys, handling complex divorce and custody cases, and providing mentorship to junior attorneys.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Associate Advocate</h4>
                      <p className="text-muted-foreground">Desai & Partners, 2010 - 2015</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Specialized in family law matters including divorce, child custody, and adoption cases.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Client Reviews</h3>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{lawyer.rating}</span>
                      <span className="text-muted-foreground ml-1">({lawyer.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {lawyer.testimonials.map((review) => (
                      <div key={review.id} className="pb-6 border-b last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{review.name}</h4>
                            <p className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div className="flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="sticky top-20">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <Phone size={18} className="text-primary mr-3" />
                  <span>{lawyer.contact.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={18} className="text-primary mr-3" />
                  <span>{lawyer.contact.email}</span>
                </div>
                <div className="flex items-center">
                  <Globe size={18} className="text-primary mr-3" />
                  <a href={`http://${lawyer.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{lawyer.contact.website}</a>
                </div>
                <div className="flex items-start">
                  <MapPin size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                  <span>{lawyer.contact.address}</span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-xl font-semibold mb-4">Book a Consultation</h3>
              <div className="flex items-center mb-4">
                <Calendar size={18} className="text-primary mr-3" />
                <span>Available for consultations</span>
              </div>
              <p className="text-muted-foreground mb-6">
                Schedule a consultation to discuss your legal needs and get expert advice tailored to your situation.
              </p>
              
              <Link to={`/book/${lawyer.id}`}>
                <Button className="w-full">Book Appointment</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LawyerDetail;