import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Video, CheckCircle, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";

const BookingConfirmation = () => {
  const { id: lawyerId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); 

      const mockLawyers = {
        "lawyer-1": { name: "Priya Sharma", specialty: "Family Law", consultationFee: "₹2500" },
        "lawyer-2": { name: "Rajesh Kumar", specialty: "Corporate Law", consultationFee: "₹3000" },
        "lawyer-3": { name: "Aisha Khan", specialty: "Cyber Law", consultationFee: "₹2800" },
        "lawyer-4": { name: "Vikram Singh", specialty: "Criminal Law", consultationFee: "₹3500" },
        "lawyer-5": { name: "Sunita Reddy", specialty: "Property Law", consultationFee: "₹2200" },
        "lawyer-6": { name: "Amit Patel", specialty: "Tax Law", consultationFee: "₹3200" },
        "lawyer-7": { name: "Deepika Das", specialty: "Labour Law", consultationFee: "₹2600" },
        "lawyer-8": { name: "Arjun Mehta", specialty: "Intellectual Property", consultationFee: "₹4000" },
      };
      const lawyerInfo = mockLawyers[lawyerId] || { name: "Selected Lawyer", specialty: "Legal Services", consultationFee: "₹2000" };
      
      const storedFormData = JSON.parse(localStorage.getItem(`booking-${lawyerId}`)) || {
        date: new Date().toISOString().split('T')[0], 
        time: "10:00 AM",   
        duration: "60"    
      };

      const newBookingId = `BKIN-${Date.now().toString().slice(-6)}`;

      setBookingDetails({
        id: newBookingId,
        lawyerId: lawyerId,
        lawyerName: lawyerInfo.name,
        lawyerSpecialty: lawyerInfo.specialty,
        date: new Date(storedFormData.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: storedFormData.time,
        duration: `${storedFormData.duration} minutes`,
        meetingLink: `/meeting/${newBookingId}`,
        fee: lawyerInfo.consultationFee,
      });
      setLoading(false);
    };

    fetchBookingDetails();
  }, [lawyerId]);

  if (loading) {
    return (
      <div className="container py-12 md:py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="container py-12 md:py-16 text-center">
        <h1 className="text-2xl font-semibold">Booking details not found.</h1>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-lg text-muted-foreground">
            Your consultation with {bookingDetails.lawyerName} has been scheduled successfully.
          </p>
        </motion.div>

        <Card className="mb-8 shadow-xl border-primary/10">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-6 text-primary">Consultation Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Lawyer</h3>
                  <p className="text-muted-foreground">{bookingDetails.lawyerName} ({bookingDetails.lawyerSpecialty})</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Date</h3>
                  <p className="text-muted-foreground">{bookingDetails.date}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Time</h3>
                  <p className="text-muted-foreground">{bookingDetails.time} ({bookingDetails.duration})</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1 flex-shrink-0">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                <div>
                  <h3 className="font-medium">Booking Reference</h3>
                  <p className="text-muted-foreground">{bookingDetails.id}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1 flex-shrink-0">
                   <path d="M17 9.5a2.5 2.5 0 0 0-5 0"></path><path d="M17 14.5a2.5 2.5 0 0 1-5 0"></path><path d="M7 15h1M7 9h1"></path><path d="M12 7.5h0"></path><path d="M12 16.5h0"></path><path d="M3 7.5h1"></path><path d="M3 16.5h1"></path><path d="M21 7.5h-1"></path><path d="M21 16.5h-1"></path><path d="M12 3V2"></path><path d="M12 22v-1"></path><path d="M12 12a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6z"></path>
                </svg>
                <div>
                  <h3 className="font-medium">Consultation Fee</h3>
                  <p className="text-muted-foreground">{bookingDetails.fee}</p>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex items-start space-x-3">
              <Video className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Meeting Link</h3>
                <p className="text-muted-foreground mb-2">
                  Your consultation will take place via our secure video conferencing platform.
                </p>
                <Link 
                  to={bookingDetails.meetingLink}
                  className="inline-flex items-center text-primary hover:underline font-medium"
                >
                  Join Meeting Room
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">What to Expect</h2>
            <ul className="space-y-3">
              {[
                "You'll receive a confirmation email with all the details of your booking.",
                "You'll receive a reminder 24 hours before your scheduled consultation.",
                "On the day of your consultation, click the meeting link to join the video call.",
                "Prepare any relevant documents or questions you have for your lawyer."
              ].map((item, index) => (
                 <li key={index} className="flex items-start space-x-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-0.5 flex-shrink-0">
                      <CheckCircle size={14} className="text-primary"/>
                    </div>
                    <p className="text-muted-foreground">{item}</p>
                  </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={`/lawyers/${bookingDetails.lawyerId}`}>
            <Button variant="outline" className="w-full sm:w-auto">
              Back to Lawyer Profile
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;