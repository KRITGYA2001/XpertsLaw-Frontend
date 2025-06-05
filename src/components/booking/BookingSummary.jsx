import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Info } from "lucide-react";

const BookingSummary = ({ lawyer, formData }) => {
  const consultationFee = lawyer.consultationFee ? lawyer.consultationFee.replace("$", "₹") : "₹1500"; // Default to INR if not set

  return (
    <Card className="sticky top-24">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <img  alt={`${lawyer.name} profile picture`} className="w-full h-full object-cover" src={lawyer.image || "https://images.unsplash.com/photo-1544212408-c711b7c19b92"} />
          </div>
          <div>
            <h4 className="font-medium">{lawyer.name}</h4>
            <p className="text-sm text-primary">{lawyer.specialty}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="flex items-center text-sm">
              <Calendar size={14} className="mr-2 text-muted-foreground" />
              Date:
            </div>
            <div className="font-medium text-sm">
              {formData.date ? new Date(formData.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : "Not selected"}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center text-sm">
              <Clock size={14} className="mr-2 text-muted-foreground" />
              Time:
            </div>
            <div className="font-medium text-sm">
              {formData.time || "Not selected"}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center text-sm">
              <Clock size={14} className="mr-2 text-muted-foreground" />
              Duration:
            </div>
            <div className="font-medium text-sm">
              {formData.duration ? `${formData.duration} minutes` : "Not selected"}
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">Consultation Fee:</span>
            <span className="font-medium">{consultationFee}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>{consultationFee}</span>
          </div>
        </div>
        <div className="mt-6 bg-primary/10 p-3 rounded-md text-sm flex items-start space-x-2">
          <Info size={18} className="text-primary mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground">
            Payment will be collected at the time of the consultation. Cancellations must be made at least 24 hours in advance to avoid cancellation fees.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;