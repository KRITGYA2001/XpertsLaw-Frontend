
import React from "react";
import Hero from "@/components/home/Hero";
import PracticeAreas from "@/components/home/PracticeAreas";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedLawyers from "@/components/home/FeaturedLawyers";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

const HomePage = () => {
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
