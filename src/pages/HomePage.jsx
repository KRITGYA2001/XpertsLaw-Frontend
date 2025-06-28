
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Hero from "@/components/home/Hero";
import PracticeAreas from "@/components/home/PracticeAreas";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedLawyers from "@/components/home/FeaturedLawyers";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

const HomePage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Hero />
      <HowItWorks />
      <PracticeAreas />
      <FeaturedLawyers />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default HomePage;
