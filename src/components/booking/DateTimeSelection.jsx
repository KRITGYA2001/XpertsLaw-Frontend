import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

// Mock available dates (in a real app, these would come from the backend)
const availableDates = [
  "2025-06-01", "2025-06-02", "2025-06-03", "2025-06-04", "2025-06-05",
  "2025-06-08", "2025-06-09", "2025-06-10", "2025-06-11", "2025-06-12",
  "2025-06-15", "2025-06-16", "2025-06-17", "2025-06-18", "2025-06-19",
];

// Mock available time slots
const availableTimes = [
  "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
];

const DateTimeSelection = ({ formData, handleSelectChange, nextStep, onDateTimeChange }) => {
  const handleDateChange = (value) => {
    handleSelectChange("date", value);
    if (onDateTimeChange) onDateTimeChange("date", value);
  };

  const handleTimeChange = (value) => {
    handleSelectChange("time", value);
     if (onDateTimeChange) onDateTimeChange("time", value);
  };
  
  const handleDurationChange = (value) => {
    handleSelectChange("duration", value);
     if (onDateTimeChange) onDateTimeChange("duration", value);
  };


  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Date & Time</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="date">Consultation Date</Label>
          <Select
            value={formData.date}
            onValueChange={handleDateChange}
          >
            <SelectTrigger id="date" className="mt-1">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              {availableDates.map((date) => (
                <SelectItem key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="time">Consultation Time (IST)</Label>
          <Select
            value={formData.time}
            onValueChange={handleTimeChange}
          >
            <SelectTrigger id="time" className="mt-1">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="duration">Consultation Duration</Label>
          <Select
            value={formData.duration}
            onValueChange={handleDurationChange}
          >
            <SelectTrigger id="duration" className="mt-1">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={nextStep} className="gap-2">
          Continue
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelection;