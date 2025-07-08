import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Calendar, Clock, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Generate available dates (next 30 days, excluding Sundays)
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  let currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow
  
  while (dates.length < 20) {
    // Skip Sundays (0 = Sunday)
    if (currentDate.getDay() !== 0) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Available time slots
const availableTimes = [
  { value: "09:00 AM", label: "9:00 AM", period: "Morning" },
  { value: "10:00 AM", label: "10:00 AM", period: "Morning" },
  { value: "11:00 AM", label: "11:00 AM", period: "Morning" },
  { value: "12:00 PM", label: "12:00 PM", period: "Afternoon" },
  { value: "02:00 PM", label: "2:00 PM", period: "Afternoon" },
  { value: "03:00 PM", label: "3:00 PM", period: "Afternoon" },
  { value: "04:00 PM", label: "4:00 PM", period: "Afternoon" },
  { value: "05:00 PM", label: "5:00 PM", period: "Evening" },
  { value: "06:00 PM", label: "6:00 PM", period: "Evening" }
];

const DateTimeSelection = ({ formData, lawyer, handleSelectChange, nextStep, onDateTimeChange }) => {
  const [availableDates] = useState(generateAvailableDates());
  const [currentWeekStart, setCurrentWeekStart] = useState(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(formData.time);

  const handleDateSelect = (date) => {
    const dateString = date.toISOString().split('T')[0];
    handleSelectChange("date", dateString);
    if (onDateTimeChange) onDateTimeChange("date", dateString);
  };

  const handleTimeSelect = (time) => {
    setSelectedTimeSlot(time);
    handleSelectChange("time", time);
    if (onDateTimeChange) onDateTimeChange("time", time);
  };
  
  const handleDurationChange = (value) => {
    handleSelectChange("duration", value);
    if (onDateTimeChange) onDateTimeChange("duration", value);
  };

  const nextWeek = () => {
    if (currentWeekStart + 7 < availableDates.length) {
      setCurrentWeekStart(prev => prev + 7);
    }
  };

  const prevWeek = () => {
    if (currentWeekStart > 0) {
      setCurrentWeekStart(prev => Math.max(0, prev - 7));
    }
  };

  const getCurrentWeekDates = () => {
    return availableDates.slice(currentWeekStart, currentWeekStart + 7);
  };

  const isSelectedDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return formData.date === dateString;
  };

  const groupTimesByPeriod = () => {
    const grouped = { Morning: [], Afternoon: [], Evening: [] };
    availableTimes.forEach(time => {
      grouped[time.period].push(time);
    });
    return grouped;
  };

  return (
    <div className="space-y-8">
      {/* Lawyer Header */}
      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {lawyer.image ? (
            <img 
              src={lawyer.image} 
              alt={lawyer.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <User className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-primary">{lawyer.name}</h3>
          <p className="text-muted-foreground">{lawyer.specialty}</p>
          <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
            <span>📍 {lawyer.location}</span>
            <span>⭐ {lawyer.rating} ({lawyer.reviews} reviews)</span>
            <span>💼 {lawyer.experience} experience</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Consultation Fee</p>
          <p className="text-xl font-bold text-primary">₹{lawyer.consultationFee}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold flex items-center">
        <Calendar className="mr-2 text-primary" size={24} />
        Select Date & Time
      </h2>
      
      {/* Date Selection - Calendar Style */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-base font-medium">Choose a Date</Label>
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={prevWeek}
              disabled={currentWeekStart === 0}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={nextWeek}
              disabled={currentWeekStart + 7 >= availableDates.length}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {getCurrentWeekDates().map((date, index) => {
            const isSelected = isSelectedDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <motion.button
                key={index}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateSelect(date)}
                className={`
                  p-3 rounded-lg border-2 text-center transition-all duration-200
                  ${isSelected 
                    ? 'border-primary bg-primary text-primary-foreground shadow-md' 
                    : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                  }
                  ${isToday ? 'ring-2 ring-primary/30' : ''}
                `}
              >
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg font-semibold">
                  {date.getDate()}
                </div>
                <div className="text-xs">
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </motion.button>
            );
          })}
        </div>
        
        {formData.date && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-green-800 text-sm font-medium">
              📅 Selected: {new Date(formData.date).toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </motion.div>
        )}
      </div>

      {/* Time Selection */}
      <div>
        <Label className="text-base font-medium flex items-center mb-4">
          <Clock className="mr-2 text-primary" size={20} />
          Choose a Time (IST)
        </Label>
        
        <div className="space-y-4">
          {Object.entries(groupTimesByPeriod()).map(([period, times]) => (
            <div key={period}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{period}</h4>
              <div className="grid grid-cols-3 gap-2">
                {times.map((time) => {
                  const isSelected = selectedTimeSlot === time.value;
                  
                  return (
                    <motion.button
                      key={time.value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTimeSelect(time.value)}
                      className={`
                        p-3 rounded-lg border-2 text-center transition-all duration-200
                        ${isSelected 
                          ? 'border-primary bg-primary text-primary-foreground shadow-md' 
                          : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                        }
                      `}
                    >
                      <div className="font-medium">{time.label}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {formData.time && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-blue-800 text-sm font-medium">
              🕐 Selected Time: {formData.time} (India Standard Time)
            </p>
          </motion.div>
        )}
      </div>

      {/* Duration Selection */}
      <div>
        <Label className="text-base font-medium mb-3 block">Consultation Duration</Label>
        <Select
          value={formData.duration}
          onValueChange={handleDurationChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">
              <div className="flex items-center space-x-2">
                <span>30 minutes</span>
                <span className="text-muted-foreground text-sm">- Quick consultation</span>
              </div>
            </SelectItem>
            <SelectItem value="60">
              <div className="flex items-center space-x-2">
                <span>60 minutes</span>
                <span className="text-muted-foreground text-sm">- Standard consultation</span>
              </div>
            </SelectItem>
            <SelectItem value="90">
              <div className="flex items-center space-x-2">
                <span>90 minutes</span>
                <span className="text-muted-foreground text-sm">- Extended consultation</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Card */}
      <AnimatePresence>
        {formData.date && formData.time && formData.duration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3 text-primary">Consultation Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-primary" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">{new Date(formData.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-primary" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-muted-foreground">{formData.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-primary" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-muted-foreground">{formData.duration} minutes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={nextStep} 
          className="gap-2"
          disabled={!formData.date || !formData.time || !formData.duration}
        >
          Continue to Personal Information
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelection;