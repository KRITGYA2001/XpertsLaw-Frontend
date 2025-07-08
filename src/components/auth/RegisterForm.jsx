import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

const RegisterForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "client",
    agreeToTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    isValid: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Real-time password validation
    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    validation.isValid = validation.length && validation.uppercase && 
                        validation.lowercase && validation.number && validation.special;

    setPasswordValidation(validation);
  };
  
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isValidName = (name) => {
    if (!name || name.trim().length === 0) return false;
  
    const trimmed = name.trim();
  
    if (trimmed.length < 2 || trimmed.length > 50) return false;
  
    const emojiRegex = /[\u{1F600}-\u{1F6FF}]/u;
    if (emojiRegex.test(trimmed) || /<script.*?>.*?<\/script>/i.test(trimmed)) return false;

    if (/\s{2,}/.test(trimmed)) return false;
  
    const nameRegex = /^[\p{L}\p{M}][\p{L}\p{M}'\- ]*[\p{L}\p{M}]$/u;
    return nameRegex.test(trimmed);
  };  

  const isValidEmail = (email) => {
    if (!email || email.trim().length === 0) return false;
    const trimmed = email.trim();
  
    if (trimmed.length > 254 || /\s/.test(trimmed)) return false;
    if (trimmed.includes('..') || trimmed.startsWith('.') || trimmed.endsWith('.')) return false;
  
    const emailRegex = /^[a-zA-Z0-9._'-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(trimmed);
  };   

  const isValidPassword = (password, userInfo = {}) => {
    if (!password || typeof password !== "string") return false;
  
    // Length check
    if (password.length < 8 || password.length > 128) return false;
  
    // No leading/trailing/internal whitespace
    if (password.trim() !== password || /\s/.test(password)) return false;
  
    // Required character types
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (!(hasUpper && hasLower && hasDigit && hasSpecial)) return false;
  
    // Disallow emojis and control chars (including NULL)
    if (/[\u{1F600}-\u{1F6FF}\u0000-\u001F\u007F]/u.test(password)) return false;
  
    // Disallow script injection
    if (/<script.*?>.*?<\/script>/i.test(password)) return false;
  
    // Disallow weak/common/repetitive/keyboard patterns
    const weakPatterns = [
      "12345678", "password", "qwerty", "asdf", "letmein",
      "admin", "welcome", "11111111", "abc123", "passw0rd"
    ];
    const lower = password.toLowerCase();
    if (weakPatterns.some(p => lower.includes(p))) return false;
  
    // Repeated characters (e.g., aaaaaaaa)
    if (/^(.)\1+$/.test(password)) return false;
  
    return true;
  };

  const isConfirmPasswordValid = (password, confirmPassword) => {
    if (!confirmPassword || typeof confirmPassword !== "string") return false;
    if (confirmPassword.trim() !== confirmPassword) return false;
    return password === confirmPassword;
  };

  // Enhanced error handling function
  const handleRegistrationError = (data) => {
    // Check if there are specific field errors
    if (data.errors) {
      // Handle email-specific errors
      if (data.errors.email) {
        const emailError = data.errors.email[0];
        if (emailError.includes('unique') || emailError.includes('already') || emailError.includes('exists')) {
          toast({
            title: "Email Already Registered",
            description: "This email address is already associated with an account. Please use a different email or try signing in.",
            variant: "destructive",
          });
          return;
        }
        if (emailError.includes('invalid') || emailError.includes('format')) {
          toast({
            title: "Invalid Email Format",
            description: "Please enter a valid email address (e.g., name@example.com).",
            variant: "destructive",
          });
          return;
        }
      }

      // Handle password-specific errors
      if (data.errors.password) {
        const passwordError = data.errors.password[0];
        if (passwordError.includes('weak') || passwordError.includes('strength')) {
          toast({
            title: "Password Too Weak",
            description: "Password must contain at least 8 characters with uppercase, lowercase, number, and special character.",
            variant: "destructive",
          });
          return;
        }
        if (passwordError.includes('common') || passwordError.includes('dictionary')) {
          toast({
            title: "Password Too Common",
            description: "This password is too common. Please choose a more unique password.",
            variant: "destructive",
          });
          return;
        }
      }

      // Handle name-specific errors
      if (data.errors.first_name) {
        toast({
          title: "Invalid First Name",
          description: "First name can only contain letters, hyphens, and apostrophes.",
          variant: "destructive",
        });
        return;
      }

      if (data.errors.last_name) {
        toast({
          title: "Invalid Last Name",
          description: "Last name can only contain letters, hyphens, and apostrophes.",
          variant: "destructive",
        });
        return;
      }

      // Handle user type errors
      if (data.errors.user_type) {
        toast({
          title: "Invalid Account Type",
          description: "Please select a valid account type (Client or Lawyer).",
          variant: "destructive",
        });
        return;
      }

      // Handle general validation errors
      if (data.errors.general || data.errors.form) {
        toast({
          title: "Form Validation Error",
          description: data.errors.general?.[0] || data.errors.form?.[0] || "Please check all required fields.",
          variant: "destructive",
        });
        return;
      }
    }

    // Handle specific HTTP status codes
    if (data.status_code) {
      switch (data.status_code) {
        case 409:
          toast({
            title: "Account Already Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
          return;
        case 422:
          toast({
            title: "Invalid Information",
            description: "Please check your information and try again. Make sure all fields are filled correctly.",
            variant: "destructive",
          });
          return;
        case 429:
          toast({
            title: "Too Many Attempts",
            description: "You've made too many registration attempts. Please wait a few minutes before trying again.",
            variant: "destructive",
          });
          return;
        case 500:
          toast({
            title: "Server Error",
            description: "We're experiencing technical difficulties. Please try again in a few minutes.",
            variant: "destructive",
          });
          return;
      }
    }

    // Handle specific error messages from the server
    if (data.message) {
      const message = data.message.toLowerCase();
      
      if (message.includes('email') && (message.includes('exists') || message.includes('taken') || message.includes('duplicate'))) {
        toast({
          title: "Email Already Registered",
          description: "This email address is already in use. Please use a different email or sign in to your existing account.",
          variant: "destructive",
        });
        return;
      }
      
      if (message.includes('password') && message.includes('weak')) {
        toast({
          title: "Password Requirements Not Met",
          description: "Your password doesn't meet our security requirements. Please ensure it has at least 8 characters with mixed case, numbers, and symbols.",
          variant: "destructive",
        });
        return;
      }
      
      if (message.includes('network') || message.includes('connection')) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to our servers. Please check your internet connection and try again.",
          variant: "destructive",
        });
        return;
      }
    }

    // Fallback for unknown errors
    toast({
      title: "Registration Failed",
      description: data.message || "We couldn't create your account right now. Please try again or contact support if the problem persists.",
      variant: "destructive",
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidName(formData.firstName)) {
      toast({
        title: "Invalid First Name",
        description: "Please enter a valid first name (no numbers, emojis, or special characters).",
        variant: "destructive",
      });
      return;
    }
    
    if (!isValidName(formData.lastName)) {
      toast({
        title: "Invalid Last Name",
        description: "Please enter a valid last name (no numbers, emojis, or special characters).",
        variant: "destructive",
      });
      return;
    }     

    if (!isValidEmail(formData.email)) {
      toast({ 
        title: "Invalid Email", 
        description: "Please enter a valid email address (e.g., name@example.com).", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!isValidPassword(formData.password)) {
      toast({ 
        title: "Password Requirements Not Met", 
        description: "Password must be at least 8 characters with uppercase, lowercase, number, and special character.", 
        variant: "destructive" 
      });
      return;
    }
    
    if (!isConfirmPasswordValid(formData.password, formData.confirmPassword)) {
      toast({ 
        title: "Passwords Don't Match", 
        description: "Please make sure both password fields match exactly.", 
        variant: "destructive" 
      });
      return;
    }    
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "You must agree to the terms and conditions to create an account.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const formPayload = new FormData();
      formPayload.append("email", formData.email);
      formPayload.append("first_name", formData.firstName);
      formPayload.append("last_name", formData.lastName);
      formPayload.append("password", formData.password);
      formPayload.append("confirm_password", formData.confirmPassword);
      formPayload.append("user_type", formData.accountType);

      for (let [key, value] of formPayload.entries()) {
        console.log(key, ":", value);
      }

      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        body: formPayload,
      });

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        // Use the enhanced error handling
        handleRegistrationError(data);
        return;
      }

      toast({
        title: "Welcome to XpertsLaw! 🎉",
        description: "Your account has been created successfully. You can now sign in and start exploring our legal services.",
        variant: "default",
      });
      
      navigate("/login", { replace: true });
      
    } catch (error) {
      // Handle network errors and other exceptions
      if (error.name === 'NetworkError' || error.message.includes('fetch')) {
        toast({
          title: "Connection Problem",
          description: "Unable to reach our servers. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        toast({
          title: "Network Error",
          description: "Could not connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unexpected Error",
          description: "Something went wrong while creating your account. Please try again or contact support if the issue persists.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground mt-2">
          Sign up to get started with XpertsLaw
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className={formData.password ? (passwordValidation.isValid ? "border-green-500 focus:border-green-500" : "border-red-500 focus:border-red-500") : ""}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          {/* Password requirements checklist */}
          {formData.password && (
            <div className="space-y-1 mt-2">
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordValidation.length ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={passwordValidation.length ? 'text-green-600' : 'text-red-600'}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordValidation.uppercase ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={passwordValidation.uppercase ? 'text-green-600' : 'text-red-600'}>
                  One uppercase letter
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordValidation.lowercase ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={passwordValidation.lowercase ? 'text-green-600' : 'text-red-600'}>
                  One lowercase letter
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordValidation.number ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={passwordValidation.number ? 'text-green-600' : 'text-red-600'}>
                  One number
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${passwordValidation.special ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={passwordValidation.special ? 'text-green-600' : 'text-red-600'}>
                  One special character
                </span>
              </div>
              {passwordValidation.isValid && (
                <div className="flex items-center space-x-2 text-xs text-green-600 font-medium mt-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Password is strong!</span>
                </div>
              )}
            </div>
          )}
          
          {!formData.password && (
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 8 characters long with atleast one uppercase, one lowercase and one number
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="accountType">Account Type</Label>
          <Select
            value={formData.accountType}
            onValueChange={(value) => handleSelectChange("accountType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client - Looking for legal help</SelectItem>
              <SelectItem value="lawyer">Lawyer - Offering legal services</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onCheckedChange={(checked) => 
              setFormData({...formData, agreeToTerms: checked})
            }
          />
          <label
            htmlFor="agreeToTerms"
            className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I agree to the{" "}
            <Link to="/terms" className="text-primary hover:underline">
              terms of service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              privacy policy
            </Link>
          </label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;