import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs"

import HeaderLogo from "./HeaderLogo"
import Navigation from "./Navigation"

import { Loader2 } from "lucide-react"
import WelcomeMessage from "./WelcomeMessage"
import { Filters } from "./Filters"

const Header = () => {
  return (
    <header className='bg-gradient-to-b from-green-600 to-green-500 px-4 py-8 lg:px-14 pb-36'>
        <div className='max-w-screen-2xl mx-auto'>
            <div className='w-full flex items-center justify-between mb-14'>
                <div className='flex items-center lg:gap-x-16'>
                    <HeaderLogo />
                    <Navigation />
                </div>
                <ClerkLoaded>
                    <UserButton afterSignOutUrl="/" />
                </ClerkLoaded>
                <ClerkLoading>
                    <Loader2 className="animate-spin size-8 text-white" />
                </ClerkLoading>
            </div>
            <WelcomeMessage />
            <Filters />
        </div>
    </header>
  )
}

export default Header