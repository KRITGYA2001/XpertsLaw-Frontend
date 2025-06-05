import React from 'react';
import { Link } from 'react-router-dom';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";

const CaseDetailsForm = ({ formData, handleChange, handleSelectChange, prevStep, handleSubmit, onTermsChange }) => {
  
  const handleCheckboxChange = (checked) => {
    handleChange({ target: { name: "agreeToTerms", type: "checkbox", checked } });
    if (onTermsChange) onTermsChange(checked);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Case Details</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="caseType">Type of Legal Matter</Label>
          <Select
            value={formData.caseType}
            onValueChange={(value) => handleSelectChange("caseType", value)}
          >
            <SelectTrigger id="caseType" className="mt-1">
              <SelectValue placeholder="Select case type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="divorce">Divorce</SelectItem>
              <SelectItem value="child-custody">Child Custody</SelectItem>
              <SelectItem value="adoption">Adoption</SelectItem>
              <SelectItem value="prenuptial">Prenuptial Agreement</SelectItem>
              <SelectItem value="domestic-violence">Domestic Violence</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="caseDescription">Brief Description of Your Case</Label>
          <Textarea
            id="caseDescription"
            name="caseDescription"
            value={formData.caseDescription}
            onChange={handleChange}
            className="mt-1"
            placeholder="Please provide a brief description of your legal issue..."
            rows={4}
          />
        </div>
        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={handleCheckboxChange}
          />
          <label
            htmlFor="agreeToTerms"
            className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the <Link to="/terms" className="text-primary hover:underline">terms of service</Link> and <Link to="/privacy" className="text-primary hover:underline">privacy policy</Link>. I understand that this booking is subject to lawyer availability and confirmation.
          </label>
        </div>
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmit} 
          disabled={!formData.agreeToTerms} 
          className="gap-2"
        >
          Complete Booking
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CaseDetailsForm;