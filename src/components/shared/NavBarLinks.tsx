"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Briefcase,
  DollarSign,
  Laptop,
  Menu,
  MessageCircle,
  MessageSquare,
  Newspaper,
  School,
  Scroll,
  Users2Icon,
} from "lucide-react";
import { ChevronDown, ChevronUp, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const services = [
  {
    title: "Jobs",
    href: "/services/jobs",
    description: "Find your next career opportunity",
    icon: <Briefcase />,
  },
  {
    title: "Internships",
    href: "/services/internships",
    description: "Gain valuable work experience",
    icon: <Laptop />,
  },
  {
    title: "Mentorship",
    href: "/services/mentorship",
    description: "Connect with industry professionals",
    icon: <Users2Icon />,
  },
  {
    title: "Donations",
    href: "/services/donations",
    description: "Donate funds to the project you liked",
    icon: <DollarSign />,
  },
];

const alumni = [
  {
    title: "Alumni Directory",
    href: "/alumni-community/alumni-directory",
    description: "Find and connect with other alumni",
    icon: <School />,
  },
  {
    title: "Hall of Fame",
    href: "/alumni-community/hof",
    description: "Read about the success of our alumni",
    icon: <Scroll />,
  },
  {
    title: "Events",
    href: "/alumni-community/events",
    description: "Join our upcoming events",
    icon: <Bell />,
  },
];

const connect = [
  {
    title: "Chat",
    href: "/connect/chat",
    description: "Get in touch with our team",
    icon: <MessageCircle />,
  },
  {
    title: "Forums",
    href: "/connect/forums",
    description: "Join the discussion with other alumni",
    icon: <MessageSquare />,
  },
  {
    title: "News",
    href: "/connect/news",
    description: "Read the latest news and updates from our team",
    icon: <Newspaper />,
  },
];

// FEATURES
function Features() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="flex items-center"
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/50">
            Features{" "}
            {isOpen ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`transform rounded-xl bg-card/50 p-4 shadow-lg backdrop-blur-md transition-all duration-1000 ease-in-out ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="flex flex-col">
            {services.map((service, index) => (
              <div key={index} className="space-y-2">
                <Link href={service.href}>
                  <DropdownMenuItem
                    key={service.title}
                    className="group/fea flex cursor-pointer items-start rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border-foreground bg-background text-foreground duration-500 group-hover/fea:bg-foreground group-hover/fea:text-background">
                        {service.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium dark:text-white text-black">
                          {service.title}
                        </div>
                        <p className="text-xs dark:text-gray-400 text-gray-800 duration-500 group-hover/fea:text-black group-hover/fea:dark:text-white">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </Link>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

//
function Community() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="flex items-center"
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/50">
            Community{" "}
            {isOpen ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`transform rounded-xl bg-card/50 p-4 shadow-lg backdrop-blur-md transition-all duration-1000 ease-in-out ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="flex flex-col">
            {alumni.map((service, index) => (
              <div key={index} className="space-y-2">
                <Link href={service.href}>
                  <DropdownMenuItem
                    key={service.title}
                    className="group/fea flex cursor-pointer items-start rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border-foreground bg-background text-foreground duration-500 group-hover/fea:bg-foreground group-hover/fea:text-background">
                        {service.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium dark:text-white text-black">
                          {service.title}
                        </div>
                        <p className="text-xs dark:text-gray-400 text-gray-800 duration-500 group-hover/fea:text-black group-hover/fea:dark:text-white">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </Link>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// CONNECT
//
function Connect() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="flex items-center"
    >
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/50">
            Connect{" "}
            {isOpen ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`transform rounded-xl bg-card/50 p-4 shadow-lg backdrop-blur-md transition-all duration-1000 ease-in-out ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="flex flex-col">
            {connect.map((service, index) => (
              <div key={index} className="space-y-2">
                <Link href={service.href}>
                  <DropdownMenuItem
                    key={service.title}
                    className="group/fea flex cursor-pointer items-start rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border-foreground bg-background text-foreground duration-500 group-hover/fea:bg-foreground group-hover/fea:text-background">
                        {service.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium dark:text-white text-black">
                          {service.title}
                        </div>
                        <p className="text-xs dark:text-gray-400 text-gray-800 duration-500 group-hover/fea:text-black group-hover/fea:dark:text-white">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </Link>
              </div>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// navbar
export default function NavbarLinks() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="">
      <div className="flex items-center justify-between">
        <nav className="hidden gap-2 md:flex">
          {/* <Link href={"/"}>
            <Button
              variant="ghost"
              className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/50"
            >
              Home
            </Button>
          </Link> */}
          <Features />
          <Community />
          <Connect />
          <Link href={"/contact"}>
            <Button
              variant="ghost"
              className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/50"
            >
              Contact
            </Button>
          </Link>
        </nav>
        {/* SHEET */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Services</h2>
                {services.map((service) => (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="block pl-4 text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
              <Link
                href="/alumni"
                className="text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Alumni Community
              </Link>
              <Link
                href="/contact"
                className="text-lg font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
