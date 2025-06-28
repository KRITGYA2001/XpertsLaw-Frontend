import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomePage from "@/pages/HomePage";
import LawyersPage from "@/pages/LawyersPage";
import LawyerDetailPage from "@/pages/LawyerDetailPage";
import BookingPage from "@/pages/BookingPage";
import BookingConfirmationPage from "@/pages/BookingConfirmationPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import PracticeAreasPage from "@/pages/PracticeAreasPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import CookiesPage from "@/pages/CookiesPage";
import DisclaimerPage from "@/pages/DisclaimerPage";
import MeetingPage from "@/pages/MeetingPage";
import NotFoundPage from "@/pages/NotFoundPage";
import LawyerProfilePage from "@/pages/LawyerProfilePage";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lawyers" element={<LawyersPage />} />
              <Route path="/lawyers/:id" element={<LawyerDetailPage />} />
              <Route path="/book/:id" element={<BookingPage />} />
              <Route path="/booking-confirmation/:id" element={<BookingConfirmationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/practice-areas" element={<PracticeAreasPage />} />
              <Route path="/practice-areas/:areaId" element={<PracticeAreasPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/meeting/:meetingId" element={<MeetingPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/profile" element={<LawyerProfilePage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;