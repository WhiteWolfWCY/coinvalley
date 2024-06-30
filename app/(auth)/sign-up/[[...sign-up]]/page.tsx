import Image from "next/image"
import { SignUp, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

const SignInPage = () => {
  return (
    <div className="min-h-screen grid gird-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-[#2E2A47]">Welcome back!</h1>
          <p className="text-base text-[#7E8CA0]">
            Log in or Create an account to get back to your dashboard
          </p>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignUp fallbackRedirectUrl="/dashboard/" path="/sign-up" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
      <div className="h-full bg-green-500 hidden lg:flex items-center justify-center">
        <Image src="/logo.svg" height={400} width={400} alt="logo" />
      </div>
    </div>
  );
};

export default SignInPage;
