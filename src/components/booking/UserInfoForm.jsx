import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const UserInfoForm = ({ formData, handleChange, nextStep, prevStep }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Information</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1"
            required
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1"
            required
            autoComplete="tel"
          />
        </div>
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button type="button" onClick={nextStep} className="gap-2">
          Continue
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default UserInfoForm;