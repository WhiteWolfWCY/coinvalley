"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMedia } from "react-use";

import { Menu } from "lucide-react";

import NavButton from "./NavButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const ROUTES = [
  {
    href: "/dashboard/",
    label: "Overview",
  },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
  },
  {
    href: "/dashboard/accounts",
    label: "Accounts",
  },
  {
    href: "/dashboard/categories",
    label: "Categories",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
  },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);

  console.log({ isMobile })

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {ROUTES.map((route) => (
              <Button
                key={route.href}
                variant={route.href === pathname ? "secondary" : "ghost"}
                onClick={() => onClick(route.href)}
                className="w-full justify-start font-semibold"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {ROUTES.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};

export default Navigation;
