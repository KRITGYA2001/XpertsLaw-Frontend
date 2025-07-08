import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Briefcase, Award, Clock, Calendar, MessageSquare, Phone, Mail, Globe, ChevronLeft, User } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE;

const LawyerDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is a lawyer
  const isLawyer = user?.role === "lawyer";

  useEffect(() => {
    fetchLawyerDetail();
  }, [id, user]);

  const fetchLawyerDetail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = {};
      if (user?.token) {
        headers.Authorization = `Bearer ${user.token}`;
      }
      
      const response = await fetch(`${API_BASE}/lawyers/lawyers/${id}/`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Handle different possible response structures
      const lawyerData = result?.data || result;
      
      if (lawyerData && lawyerData.user) {
        // Transform API data to match component expectations
        const firstName = lawyerData.user?.first_name || "";
        const lastName = lawyerData.user?.last_name || "";
        const fullName = `${firstName} ${lastName}`.trim() || lawyerData.user?.name || "Unknown Lawyer";

        const transformedLawyer = {
          id: lawyerData.id,
          name: fullName,
          firstName,
          lastName,
          email: lawyerData.user?.email || "",
          specialty: lawyerData.law_type?.name || "General Practice",
          rating: lawyerData.rating || 4.5,
          reviews: lawyerData.reviews_count || 0,
          location: lawyerData.city?.name || "Location not specified",
          experience: lawyerData.total_experience?.years || 
                     lawyerData.total_experience?.name || 
                     "Experience not specified",
          certifications: lawyerData.certifications || null,
          image: lawyerData.photo || null,
          consultationFee: lawyerData.fee ? `₹${lawyerData.fee}` : "Fee not specified",
          about: lawyerData.about || "",
          practiceAreas: Array.isArray(lawyerData.practice_area) 
            ? lawyerData.practice_area.map(area => area.name)
            : lawyerData.practice_area?.name ? [lawyerData.practice_area.name] : [],
          languages: Array.isArray(lawyerData.languages)
            ? lawyerData.languages.map(lang => lang.name)
            : lawyerData.languages?.name ? [lawyerData.languages.name] : [],
          address: lawyerData.address || "",
          website: lawyerData.website || "",
          phone: lawyerData.phone || "",
          
          // Education data
          education: Array.isArray(lawyerData.education) 
            ? lawyerData.education.map(edu => ({
                degree: edu.degree || "N/A",
                institution: edu.institution?.name || "N/A",
                year: edu.end_date ? new Date(edu.end_date).getFullYear() : "N/A",
                startDate: edu.start_date || "",
                endDate: edu.end_date || ""
              }))
            : [],
          
          // Work experience data
          workExperience: Array.isArray(lawyerData.work_experience)
            ? lawyerData.work_experience.map(exp => ({
                position: exp.position || "N/A",
                lawFirm: exp.law_firm || "N/A",
                startDate: exp.start_date || "",
                endDate: exp.end_date || "",
                description: exp.description || ""
              }))
            : [],
          
          // Availability (if available)
          availability: lawyerData.availability || [
            "Monday to Friday, 10:00 AM - 6:00 PM IST",
            "Saturday, by appointment only"
          ],
          
          // Contact information
          contact: {
            phone: lawyerData.phone || "",
            email: lawyerData.user?.email || "",
            website: lawyerData.website || "",
            address: lawyerData.address || ""
          },
          
          // Mock testimonials (since not available in API)
          testimonials: [
            {
              id: 1,
              name: "Client Review",
              date: "Recent",
              content: "Professional and knowledgeable lawyer. Highly recommended for legal consultation.",
              rating: Math.floor(lawyerData.rating || 4.5),
            }
          ]
        };

        setLawyer(transformedLawyer);
      } else {
        throw new Error("Lawyer data not found");
      }
    } catch (err) {
      console.error('Error fetching lawyer detail:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lawyer profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 md:py-12">
        <Link to="/lawyers" className="inline-flex items-center text-primary hover:underline mb-6">
          <ChevronLeft size={16} className="mr-1" />
          Back to Lawyers
        </Link>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
            <User className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-red-800">Error Loading Profile</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={fetchLawyerDetail}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="container py-8 md:py-12">
        <Link to="/lawyers" className="inline-flex items-center text-primary hover:underline mb-6">
          <ChevronLeft size={16} className="mr-1" />
          Back to Lawyers
        </Link>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Lawyer not found</h3>
          <p className="text-muted-foreground mb-6">The lawyer profile you're looking for doesn't exist.</p>
          <Link to="/lawyers">
            <Button>Browse Lawyers</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                  {lawyer.image ? (
                    <img 
                      src={lawyer.image} 
                      alt={`Portrait of ${lawyer.name}, ${lawyer.specialty} attorney`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
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
                  {lawyer.certifications && (
                    <div className="flex items-center text-muted-foreground">
                      <Award size={16} className="mr-2" />
                      {lawyer.certifications}
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <Clock size={16} className="mr-2" />
                    Consultation Fee: {lawyer.consultationFee}
                  </div>
                </div>
                
                {/* Only show booking buttons for non-lawyers */}
                {!isLawyer && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link to={`/book/${lawyer.id}`} className="flex-1">
                      <Button className="w-full">Book Consultation</Button>
                    </Link>
                    <Button variant="outline" className="flex-1 gap-2">
                      <MessageSquare size={16} />
                      Message
                    </Button>
                  </div>
                )}
                
                {/* Show different message for lawyers */}
                {isLawyer && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      👋 You're viewing this profile as a fellow lawyer. Clients can book consultations and contact this lawyer directly.
                    </p>
                  </div>
                )}
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
                  <p className="text-muted-foreground mb-6">
                    {lawyer.about || `${lawyer.name} is a skilled ${lawyer.specialty} attorney with ${lawyer.experience} years of experience. They are dedicated to providing quality legal services to their clients.`}
                  </p>
                  
                  {lawyer.practiceAreas.length > 0 && (
                    <>
                      <h4 className="font-semibold mb-2">Practice Areas</h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {lawyer.practiceAreas.map((area, index) => (
                          <span key={index} className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {lawyer.languages.length > 0 && (
                    <>
                      <h4 className="font-semibold mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {lawyer.languages.map((language, index) => (
                          <span key={index} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                            {language}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  
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
                  {lawyer.education.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-4">Education</h3>
                      <div className="space-y-4 mb-8">
                        {lawyer.education.map((edu, index) => (
                          <div key={index} className="flex flex-col">
                            <h4 className="font-medium">{edu.degree}</h4>
                            <p className="text-muted-foreground">{edu.institution}</p>
                            {edu.startDate && edu.endDate && (
                              <p className="text-sm text-muted-foreground">
                                {edu.startDate} - {edu.endDate}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {lawyer.certifications && (
                    <>
                      <h3 className="text-xl font-semibold mb-4">Certifications</h3>
                      <p className="text-muted-foreground mb-6">{lawyer.certifications}</p>
                    </>
                  )}
                  
                  {lawyer.workExperience.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-4">Professional Experience</h3>
                      <div className="space-y-4">
                        {lawyer.workExperience.map((exp, index) => (
                          <div key={index}>
                            <h4 className="font-medium">{exp.position}</h4>
                            <p className="text-muted-foreground">{exp.lawFirm}</p>
                            {exp.startDate && exp.endDate && (
                              <p className="text-sm text-muted-foreground">
                                {exp.startDate} - {exp.endDate}
                              </p>
                            )}
                            {exp.description && (
                              <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {lawyer.education.length === 0 && lawyer.workExperience.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      No detailed experience information available.
                    </p>
                  )}
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
                            <p className="text-sm text-muted-foreground">{review.date}</p>
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
                {lawyer.contact.phone && (
                  <div className="flex items-center">
                    <Phone size={18} className="text-primary mr-3" />
                    <span>{lawyer.contact.phone}</span>
                  </div>
                )}
                {lawyer.contact.email && (
                  <div className="flex items-center">
                    <Mail size={18} className="text-primary mr-3" />
                    <span>{lawyer.contact.email}</span>
                  </div>
                )}
                {lawyer.contact.website && (
                  <div className="flex items-center">
                    <Globe size={18} className="text-primary mr-3" />
                    <a href={`http://${lawyer.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {lawyer.contact.website}
                    </a>
                  </div>
                )}
                {lawyer.contact.address && (
                  <div className="flex items-start">
                    <MapPin size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                    <span>{lawyer.contact.address}</span>
                  </div>
                )}
              </div>
              
              {/* Only show booking section for non-lawyers */}
              {!isLawyer && (
                <>
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
                </>
              )}
              
              {/* Show different content for lawyers */}
              {isLawyer && (
                <>
                  <Separator className="my-6" />
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Professional Network</h4>
                    <p className="text-sm text-muted-foreground">
                      This lawyer is part of the XpertsLaw professional network. Clients can book consultations and contact them directly through the platform.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LawyerDetail;