import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Info, Star, MapPin, User } from "lucide-react";

const BookingSummary = ({ lawyer, formData }) => {
  // Calculate total based on duration
  const calculateTotal = () => {
    const baseFee = lawyer.consultationFee || 2000;
    const duration = parseInt(formData.duration || 60);
    
    // Different pricing tiers based on duration
    if (duration === 30) {
      return Math.round(baseFee * 0.7); // 30% discount for shorter sessions
    } else if (duration === 90) {
      return Math.round(baseFee * 1.4); // 40% premium for longer sessions
    }
    return baseFee; // Standard 60-minute rate
  };

  const total = calculateTotal();
  const baseFee = lawyer.consultationFee || 2000;

  return (
    <Card className="sticky top-24 shadow-lg border-primary/10">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4 text-primary">Booking Summary</h3>
        
        {/* Lawyer Information */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
              {lawyer.image ? (
                <img 
                  src={lawyer.image} 
                  alt={`${lawyer.name} profile picture`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{lawyer.name}</h4>
              <p className="text-sm text-primary font-medium">{lawyer.specialty}</p>
              <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                  <span>{lawyer.rating}</span>
                  <span className="ml-1">({lawyer.reviews} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{lawyer.location}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <span>📼 {lawyer.experience} experience</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Consultation Details */}
        <div className="space-y-3">
          <h5 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Consultation Details</h5>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <Calendar size={14} className="mr-2 text-primary" />
              <span>Date:</span>
            </div>
            <div className="font-medium text-sm">
              {formData.date ? (
                new Date(formData.date).toLocaleDateString('en-IN', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })
              ) : (
                <span className="text-muted-foreground">Not selected</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <Clock size={14} className="mr-2 text-primary" />
              <span>Time:</span>
            </div>
            <div className="font-medium text-sm">
              {formData.time ? (
                <span>{formData.time} IST</span>
              ) : (
                <span className="text-muted-foreground">Not selected</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm">
              <Clock size={14} className="mr-2 text-primary" />
              <span>Duration:</span>
            </div>
            <div className="font-medium text-sm">
              {formData.duration ? (
                <span>{formData.duration} minutes</span>
              ) : (
                <span className="text-muted-foreground">Not selected</span>
              )}
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {/* Pricing Breakdown */}
        <div className="space-y-3">
          <h5 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">Pricing</h5>
          
          <div className="flex justify-between">
            <span className="text-sm">Base Consultation Fee:</span>
            <span className="font-medium">₹{baseFee}</span>
          </div>
          
          {/* Duration-based pricing adjustments */}
          {formData.duration && formData.duration !== "60" && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {formData.duration === "30" ? "Short session discount (30%):" : "Extended session premium (40%):"}
              </span>
              <span className={`font-medium ${formData.duration === "30" ? "text-green-600" : "text-blue-600"}`}>
                {formData.duration === "30" ? "-" : "+"}₹{Math.abs(total - baseFee)}
              </span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount:</span>
            <span className="text-primary">₹{total}</span>
          </div>
        </div>
        
        {/* Payment and Policy Information */}
        <div className="mt-6 space-y-3">
          <div className="bg-primary/10 p-3 rounded-md">
            <div className="flex items-start space-x-2">
              <Info size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-primary mb-1">Payment Information</p>
                <p className="text-muted-foreground">
                  Payment will be collected securely at the time of consultation through our integrated payment gateway.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
            <div className="flex items-start space-x-2">
              <svg className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">Cancellation Policy</p>
                <p className="text-amber-700">
                  Free cancellation up to 24 hours before your appointment. Late cancellations may incur charges.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Completion Status */}
        {formData.date && formData.time && formData.duration && (
          <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-green-800 text-sm font-medium">
                Ready to proceed with booking!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingSummary;