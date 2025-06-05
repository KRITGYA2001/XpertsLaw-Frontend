import React from 'react';

const BookingSteps = ({ currentStep, totalSteps = 3 }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex space-x-2">
        {[...Array(totalSteps)].map((_, i) => {
          const stepNumber = i + 1;
          return (
            <div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors duration-300 ease-in-out
                ${currentStep >= stepNumber ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
              `}
            >
              {stepNumber}
            </div>
          );
        })}
      </div>
      <div className="text-sm text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
};

export default BookingSteps;