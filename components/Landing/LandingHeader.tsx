import Image from "next/image"
import { Button } from "../ui/button";
import { SignedIn, UserButton, UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import HeaderLogo from "../HeaderLogo";

const LandingHeader = () => {
  return (
    <div className="w-full bg-gradient-to-b from-green-600 to-green-500 shadow-md">
      <MaxWidthWrapper className="flex items-center justify-between px-0 md:px-0">
        <HeaderLogo />

        <div className="flex items-center p-6 gap-x-8 justify-center">
            <Link href="/dashboard">
                <Button variant="landing" className="font-bold">
                    Get started &rarr;
                </Button>
            </Link>
            <SignedIn>
              <UserButton />  
            </SignedIn>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default LandingHeader;
