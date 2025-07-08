import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

import BookingSteps from './BookingSteps';
import DateTimeSelection from './DateTimeSelection';
import UserInfoForm from './UserInfoForm';
import CaseDetailsForm from './CaseDetailsForm';
import BookingSummary from './BookingSummary';

const API_BASE = import.meta.env.VITE_API_BASE;

const BookingForm = () => {
  const { id: lawyerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [lawyer, setLawyer] = useState(null);
  const [loadingLawyer, setLoadingLawyer] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: "60",
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    caseType: "",
    caseDescription: "",
    agreeToTerms: false,
  });
  
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const fetchLawyerData = async () => {
      setLoadingLawyer(true);
      setError(null);
      
      try {
        const headers = {};
        if (user?.token) {
          headers.Authorization = `Bearer ${user.token}`;
        }
        
        const response = await fetch(`${API_BASE}/lawyers/lawyers/${lawyerId}/`, {
          headers
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
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
            image: lawyerData.photo || null,
            consultationFee: lawyerData.fee || 2000,
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
          };

          setLawyer(transformedLawyer);
        } else {
          throw new Error("Lawyer data not found");
        }
      } catch (err) {
        console.error('Error fetching lawyer data:', err);
        setError(err.message);
      } finally {
        setLoadingLawyer(false);
      }
    };

    if (lawyerId) {
      fetchLawyerData();
    }
  }, [lawyerId, user]);
  
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

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 
    
    if (!formData.agreeToTerms) {
        toast({
          title: "Agreement Required",
          description: "Please agree to the terms and conditions.",
          variant: "destructive",
        });
        return;
    }
  
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
        // Convert time from "06:00 PM" to "18:00:00"
        const convertTo24Hour = (time12h) => {
            const [time, modifier] = time12h.split(' ');
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours, 10);
            
            if (modifier === 'PM' && hours !== 12) {
                hours = hours + 12;
            } else if (modifier === 'AM' && hours === 12) {
                hours = 0;
            }
            
            return `${String(hours).padStart(2, '0')}:${minutes}:00`;
        };
  
        // Prepare API data
        const apiBookingData = {
            lawyer: parseInt(lawyerId),
            date: formData.date,
            time: convertTo24Hour(formData.time), // Convert time format
            user: parseInt(user.id),
            phone: formData.phone,
            legal_matter: parseInt(formData.caseType) || 1,
            description: formData.caseDescription || "",
            status: 'pending'
        };
  
        console.log('Converted time:', formData.time, '→', apiBookingData.time);
        console.log('Final API payload:', apiBookingData);
  
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (user?.token) {
            headers.Authorization = `Bearer ${user.token}`;
        }
  
        const response = await fetch(`${API_BASE}/consultation/consultations/`, {
            method: 'POST',
            headers,
            body: JSON.stringify(apiBookingData)
        });
  
        console.log('Response status:', response.status);
  
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Full error response:', errorText);
            
            let errorMessage = `HTTP ${response.status} Error`;
            
            // Try to extract meaningful error message
            if (errorText.includes('<!DOCTYPE html>')) {
                errorMessage = `Server Error (${response.status}) - Check server logs`;
            } else {
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorJson.detail || errorMessage;
                } catch (e) {
                    errorMessage = errorText.substring(0, 100) + '...';
                }
            }
            
            throw new Error(errorMessage);
        }
  
        const result = await response.json();
        console.log('Success:', result);
  
        toast({
            title: "Consultation Booked Successfully! 🎉",
            description: `Your consultation with ${lawyer?.name || 'the lawyer'} has been scheduled.`,
            duration: 5000,
        });
        
        navigate(`/dashboard`);
  
    } catch (error) {
        console.error('Booking error:', error);
        
        toast({
            title: "Booking Failed",
            description: `Error: ${error.message}`,
            variant: "destructive",
            duration: 8000,
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loadingLawyer) {
    return (
      <div className="container py-8 md:py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lawyer information...</p>
        </div>
      </div>
    );
  }

  if (error && !lawyer) {
    return (
      <div className="container py-8 md:py-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2 text-red-800">Error Loading Lawyer</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
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
                      lawyer={lawyer}
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
                      isSubmitting={isSubmitting}
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