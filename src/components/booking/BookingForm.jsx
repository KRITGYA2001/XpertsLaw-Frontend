import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import BookingSteps from './BookingSteps';
import DateTimeSelection from './DateTimeSelection';
import UserInfoForm from './UserInfoForm';
import CaseDetailsForm from './CaseDetailsForm';
import BookingSummary from './BookingSummary';

const BookingForm = () => {
  const { id: lawyerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [lawyer, setLawyer] = useState(null);
  const [loadingLawyer, setLoadingLawyer] = useState(true);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: "60",
    name: "",
    email: "",
    phone: "",
    caseType: "",
    caseDescription: "",
    agreeToTerms: false,
  });
  
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchLawyerData = async () => {
      setLoadingLawyer(true);
      await new Promise(resolve => setTimeout(resolve, 500)); 
      const mockLawyers = {
        "lawyer-1": { id: "lawyer-1", name: "Priya Sharma", specialty: "Family Law", image: "https://images.unsplash.com/photo-1600267185393-e158a781b353", consultationFee: "₹2500" },
        "lawyer-2": { id: "lawyer-2", name: "Rajesh Kumar", specialty: "Corporate Law", image: "https://images.unsplash.com/photo-1556157382-97eda2d62296", consultationFee: "₹3000" },
        "lawyer-3": { id: "lawyer-3", name: "Aisha Khan", specialty: "Cyber Law", image: "https://images.unsplash.com/photo-1589254066007-388213c6a9a6", consultationFee: "₹2800" },
        "lawyer-4": { id: "lawyer-4", name: "Vikram Singh", specialty: "Criminal Law", image: "https://images.unsplash.com/photo-1610642372651-fe6e7bc20934", consultationFee: "₹3500" },
        "lawyer-5": { id: "lawyer-5", name: "Sunita Reddy", specialty: "Property Law", image: "https://images.unsplash.com/photo-1507591064342-c575625a0136", consultationFee: "₹2200" },
        "lawyer-6": { id: "lawyer-6", name: "Amit Patel", specialty: "Tax Law", image: "https://images.unsplash.com/photo-1590650213165-c69ce7f9565f", consultationFee: "₹3200" },
        "lawyer-7": { id: "lawyer-7", name: "Deepika Das", specialty: "Labour Law", image: "https://images.unsplash.com/photo-1542744095-291d1f67b221", consultationFee: "₹2600" },
        "lawyer-8": { id: "lawyer-8", name: "Arjun Mehta", specialty: "Intellectual Property", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f", consultationFee: "₹4000" },
      };
      const foundLawyer = mockLawyers[lawyerId] || { id: lawyerId, name: "Selected Lawyer", specialty: "Legal Services", image: "", consultationFee: "₹2000" };
      setLawyer(foundLawyer);
      setLoadingLawyer(false);
    };

    if (lawyerId) {
      fetchLawyerData();
    }
  }, [lawyerId]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.date || !formData.time || !formData.duration) {
        toast({
          title: "Missing Information",
          description: "Please select a date, time, and duration for your consultation.",
          variant: "destructive",
        });
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required personal information fields.",
          variant: "destructive",
        });
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return false;
      }
      // Basic Indian phone number validation (10 digits)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid 10-digit Indian mobile number.",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault(); 
    if (!formData.agreeToTerms) {
        toast({
          title: "Agreement Required",
          description: "Please agree to the terms and conditions.",
          variant: "destructive",
        });
        return;
    }
    
    // Store minimal data for confirmation page (in real app, this would be a proper booking record)
    localStorage.setItem(`booking-${lawyerId}`, JSON.stringify({
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
    }));
    
    console.log("Booking submitted:", { lawyerId, ...formData });
    
    toast({
      title: "Consultation Booked!",
      description: `Your consultation with ${lawyer?.name || 'the lawyer'} has been scheduled.`,
      duration: 5000,
    });
    
    navigate(`/booking-confirmation/${lawyerId}`);
  };

  if (loadingLawyer) {
    return (
      <div className="container py-8 md:py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lawyer) {
     return (
      <div className="container py-8 md:py-12 text-center">
        <h1 className="text-2xl font-semibold">Lawyer not found.</h1>
        <p className="text-muted-foreground">Please try selecting a lawyer again.</p>
      </div>
    );
  }
  
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold mb-2">Book a Consultation</h1>
          <p className="text-muted-foreground">
            Schedule your consultation with {lawyer.name} ({lawyer.specialty}).
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <BookingSteps currentStep={currentStep} />
                
                <form onSubmit={handleSubmit}>
                  {currentStep === 1 && (
                    <DateTimeSelection 
                      formData={formData} 
                      handleSelectChange={handleSelectChange} 
                      nextStep={nextStep}
                      onDateTimeChange={handleSelectChange}
                    />
                  )}
                  {currentStep === 2 && (
                    <UserInfoForm 
                      formData={formData} 
                      handleChange={handleChange} 
                      nextStep={nextStep} 
                      prevStep={prevStep} 
                    />
                  )}
                  {currentStep === 3 && (
                    <CaseDetailsForm 
                      formData={formData} 
                      handleChange={handleChange} 
                      handleSelectChange={handleSelectChange} 
                      prevStep={prevStep} 
                      handleSubmit={handleSubmit}
                      onTermsChange={(checked) => handleChange({ target: { name: "agreeToTerms", type: "checkbox", checked } })}
                    />
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:sticky md:top-24">
            <BookingSummary lawyer={lawyer} formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;