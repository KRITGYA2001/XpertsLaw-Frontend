import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Mail } from "lucide-react";

// API base URL - use HTTP to match your backend configuration
const API_BASE_URL = "http://xpertslaw-backend-env.eba-s2nkai2i.us-east-1.elasticbeanstalk.com";

const ForgotPasswordForm = () => {
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const isValidEmail = (email) => {
    if (!email || email.trim().length === 0) return false;
    const trimmed = email.trim();
  
    if (trimmed.length > 254 || /\s/.test(trimmed)) return false;
    if (trimmed.includes('..') || trimmed.startsWith('.') || trimmed.endsWith('.')) return false;
  
    const emailRegex = /^[a-zA-Z0-9._'-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(trimmed);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Sending request to reset password for email:", email.trim());
      
      // Use consistent HTTP protocol
      const response = await fetch(`${API_BASE_URL}/resetpassword`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: email.trim()
        })
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      // Handle non-JSON responses
      let data;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Handle text responses
        const textResponse = await response.text();
        console.log("Response text:", textResponse);
        
        // Try to parse as JSON if it looks like JSON
        try {
          data = JSON.parse(textResponse);
        } catch {
          // If not JSON, create a response object
          data = { 
            message: textResponse || "Server response received",
            status: response.ok ? "success" : "error"
          };
        }
      }

      console.log("Response data:", data);

      if (!response.ok) {
        // Handle different error cases
        if (response.status === 404) {
          throw new Error("No account found with this email address.");
        } else if (response.status === 400) {
          throw new Error(data.message || "Invalid request. Please check your email address.");
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again later.");
        } else {
          throw new Error(data.message || "Failed to send reset email.");
        }
      }

      // Success - show confirmation
      setEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
      
    } catch (error) {
      console.error("Reset password error:", error);
      
      // Handle network errors
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
          description: error.message || "There was a problem sending the reset email.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (emailSent) {
    return (
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground mt-2">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder, or try again with a different email address.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setEmailSent(false);
              setEmail("");
            }}
          >
            Try different email
          </Button>
          
          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
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
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending reset link..." : "Send reset link"}
        </Button>
      </form>
      
      <div className="text-center">
        <Link 
          to="/login" 
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;