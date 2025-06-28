import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

// API base URL - consistent with ForgotPasswordForm
const API_BASE_URL = "http://xpertslaw-backend-env.eba-s2nkai2i.us-east-1.elasticbeanstalk.com";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    isValid: false
  });
  
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  
  useEffect(() => {
    // Verify token on component mount
    if (!token || !email) {
      setTokenValid(false);
      return;
    }
    
    verifyResetToken();
  }, [token, email]);
  
  const verifyResetToken = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/verify-reset-token?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.ok) {
        setTokenValid(true);
      } else {
        setTokenValid(false);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      setTokenValid(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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

  const isValidPassword = (password) => {
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidPassword(formData.password)) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password that meets all requirements.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isConfirmPasswordValid(formData.password, formData.confirmPassword)) {
      toast({
        title: "Passwords Don't Match",
        description: "Please confirm your password correctly.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use URLSearchParams instead of FormData for better compatibility
      const requestBody = new URLSearchParams({
        token: token,
        email: email,
        password: formData.password,
        confirm_password: formData.confirmPassword
      });

      const response = await fetch(`${API_BASE_URL}/change-password`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody
      });

      // Handle response similar to forgot password form
      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        try {
          data = JSON.parse(textResponse);
        } catch {
          data = { 
            message: textResponse || "Password reset completed",
            status: response.ok ? "success" : "error"
          };
        }
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      // Check for success status if available
      if (data.status && data.status !== "success") {
        throw new Error(data.message || "Failed to reset password");
      }

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully. You can now sign in with your new password.",
      });

      // Redirect to login page
      navigate("/login", { replace: true });
      
    } catch (error) {
      console.error("Reset password error:", error);
      
      // Handle different types of errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your internet connection.",
          variant: "destructive",
        });
      } else if (error.message.includes('CERT') || error.message.includes('SSL')) {
        toast({
          title: "Connection Error",
          description: "There was a problem connecting to the server. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset Failed",
          description: error.message || "There was a problem resetting your password.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Loading state while verifying token
  if (tokenValid === null) {
    return (
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">Verifying reset link...</h1>
          <p className="text-muted-foreground mt-2">
            Please wait while we verify your password reset link
          </p>
        </div>
      </div>
    );
  }
  
  // Invalid or expired token
  if (tokenValid === false) {
    return (
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold">Invalid or expired link</h1>
          <p className="text-muted-foreground mt-2">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/forgot-password">
              Request new reset link
            </Link>
          </Button>
          
          <div className="text-center">
            <Link to="/login" className="text-sm text-primary hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-md w-full mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your new password below
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
        
        <Button type="submit" className="w-full" disabled={isLoading || !passwordValidation.isValid}>
          {isLoading ? "Resetting password..." : "Reset Password"}
        </Button>
      </form>
      
      <div className="text-center">
        <Link to="/login" className="text-sm text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;