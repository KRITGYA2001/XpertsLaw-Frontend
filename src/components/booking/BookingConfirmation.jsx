import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Video, CheckCircle, ArrowRight, User, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE;

const BookingConfirmation = () => {
  const { id: consultationId } = useParams(); // This would be consultation ID, not lawyer ID
  const { user } = useAuth();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      
      try {
        // If we have a consultation ID, fetch from API
        if (consultationId && user?.token) {
          const headers = {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          };

          const response = await fetch(`${API_BASE}/consultation/consultations/${consultationId}/`, {
            headers
          });

          if (response.ok) {
            const result = await response.json();
            const consultationData = result?.data || result;
            
            // Transform API data for display
            const transformedData = {
              id: consultationData.id,
              lawyerId: consultationData.lawyer?.id || consultationData.lawyer,
              lawyerName: consultationData.lawyer?.user?.first_name && consultationData.lawyer?.user?.last_name 
                ? `${consultationData.lawyer.user.first_name} ${consultationData.lawyer.user.last_name}`.trim()
                : "Legal Expert",
              lawyerSpecialty: consultationData.lawyer?.law_type?.name || "Legal Services",
              date: new Date(consultationData.date).toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              }),
              time: consultationData.time || "Time not specified",
              duration: "60 minutes", // Default duration
              meetingLink: `/meeting/${consultationData.id}`,
              fee: consultationData.lawyer?.fee ? `₹${consultationData.lawyer.fee}` : "₹2000",
              clientName: user.name || "",
              clientEmail: user.email || "",
              clientPhone: consultationData.phone || "",
              caseType: consultationData.legal_matter?.name || "",
              caseDescription: consultationData.description || "",
              status: consultationData.status || 'pending'
            };
            
            setBookingDetails(transformedData);
          } else {
            throw new Error('Failed to fetch consultation details');
          }
        } else {
          // Fallback: Show generic success message
          setBookingDetails({
            id: `CONS-${Date.now().toString().slice(-6)}`,
            lawyerId: null,
            lawyerName: "Legal Expert",
            lawyerSpecialty: "Legal Services",
            date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
            time: "Consultation scheduled",
            duration: "60 minutes",
            meetingLink: `/dashboard`,
            fee: "₹2000",
            clientName: user?.name || "",
            clientEmail: user?.email || "",
            status: 'pending'
          });
        }
      } catch (error) {
        console.error('Error fetching consultation details:', error);
        // Show generic confirmation even if API fails
        setBookingDetails({
          id: `CONS-${Date.now().toString().slice(-6)}`,
          lawyerId: null,
          lawyerName: "Legal Expert", 
          lawyerSpecialty: "Legal Services",
          date: "Consultation scheduled",
          time: "Details will be confirmed soon",
          duration: "60 minutes",
          meetingLink: `/dashboard`,
          fee: "₹2000",
          status: 'pending'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [consultationId, user]);

  if (loading) {
    return (
      <div className="container py-12 md:py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Confirming your booking...</p>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="container py-12 md:py-16 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold mb-2">Booking Details Not Found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find your booking information. Please check your dashboard.</p>
        <Link to="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your consultation with <span className="font-semibold text-primary">{bookingDetails.lawyerName}</span> has been scheduled successfully. 
            We've sent you a confirmation email with all the details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-primary/10">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-6 text-primary flex items-center">
                  <Calendar className="mr-2" size={24} />
                  Consultation Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Lawyer</h3>
                        <p className="text-muted-foreground">{bookingDetails.lawyerName}</p>
                        <p className="text-sm text-primary">{bookingDetails.lawyerSpecialty}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Date</h3>
                        <p className="text-muted-foreground">{bookingDetails.date}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Time & Duration</h3>
                        <p className="text-muted-foreground">{bookingDetails.time} IST</p>
                        <p className="text-sm text-muted-foreground">{bookingDetails.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1 flex-shrink-0">
                        <path d="M17 9.5a2.5 2.5 0 0 0-5 0"></path><path d="M17 14.5a2.5 2.5 0 0 1-5 0"></path><path d="M7 15h1M7 9h1"></path><path d="M12 7.5h0"></path><path d="M12 16.5h0"></path><path d="M3 7.5h1"></path><path d="M3 16.5h1"></path><path d="M21 7.5h-1"></path><path d="M21 16.5h-1"></path><path d="M12 3V2"></path><path d="M12 22v-1"></path><path d="M12 12a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6z"></path>
                      </svg>
                      <div>
                        <h3 className="font-medium">Consultation Fee</h3>
                        <p className="text-muted-foreground font-semibold text-lg">{bookingDetails.fee}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex items-start space-x-3">
                  <Video className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-medium">Meeting Information</h3>
                    <p className="text-muted-foreground mb-3">
                      Your consultation will take place via our secure video conferencing platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link 
                        to={bookingDetails.meetingLink}
                        className="inline-flex items-center text-primary hover:underline font-medium"
                      >
                        View in Dashboard
                        <ArrowRight size={14} className="ml-1" />
                      </Link>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Booking ID: {bookingDetails.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {bookingDetails.lawyerId && (
                    <Link to={`/lawyers/${bookingDetails.lawyerId}`} className="block">
                      <Button variant="outline" className="w-full justify-start">
                        <User className="mr-2" size={16} />
                        View Lawyer Profile
                      </Button>
                    </Link>
                  )}
                  <Link to="/dashboard" className="block">
                    <Button className="w-full justify-start">
                      <Calendar className="mr-2" size={16} />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <Link to="/lawyers" className="block">
                    <Button variant="secondary" className="w-full justify-start">
                      <User className="mr-2" size={16} />
                      Find More Lawyers
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Support */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-blue-800">Need Help?</h3>
                <p className="text-blue-700 text-sm mb-4">
                  If you have any questions about your booking or need to make changes, our support team is here to help.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-blue-700">
                    <Phone size={14} className="mr-2" />
                    <span>+91 99XXXX XXXX</span>
                  </div>
                  <div className="flex items-center text-blue-700">
                    <Mail size={14} className="mr-2" />
                    <span>support@xpertslaw.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;