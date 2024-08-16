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
      <div className="bg-gray-100 pb-44">
        <LandingHeader />
        <HeroSection />
        <h1 className="mt-48 text-7xl font-semibold text-muted-foreground text-center">
          Landing page in development...
        </h1>
      </div>
  );
}
