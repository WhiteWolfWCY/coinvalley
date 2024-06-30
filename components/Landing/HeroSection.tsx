import Image from "next/image";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <MaxWidthWrapper className="min-h-screen h-full pt-28">
      <div className="flex flex-col text-center gap-2 items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-extrabold p-4">
          Take control of your finances 💸
        </h1>
        <p className="text-xl md:text-2xl p-4 font-semibold">
          With <span className="text-primary">CoinValley</span> you can track your trancactions and improve your spending habbits.
        </p>
        <div className="flex justify-between gap-10">
          <Button className="bg-primary font-semibold rounded-full">
            Sign up for free
          </Button>
          <Button variant="outline" className="font-semibold rounded-full">
            Contact us
          </Button>
        </div>
        <div className="mt-10">
          <Image 
            src="/hero.png"
            alt="App image"
            width={1000}
            height={400}
            className="rounded-xl shadow-md"
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default HeroSection;
