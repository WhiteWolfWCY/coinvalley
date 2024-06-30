import CallToAction from "@/components/Landing/CallToAction";
import Features from "@/components/Landing/Features";
import HeroSection from "@/components/Landing/HeroSection";
import LandingHeader from "@/components/Landing/LandingHeader";
import Testimonials from "@/components/Landing/Testimonials";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingPage() {
  return (
      <div className="bg-gray-100">
        <LandingHeader />
        <HeroSection />
        <Features />
        <Testimonials />
        <CallToAction />
      </div>
  );
}
