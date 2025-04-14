"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

const navLinks = [
  { href: "/question-tracker", label: "Question Tracker", icon: "📊" },
  { href: "/profile-tracker", label: "Profile Tracker", icon: "👤" },
  { href: "/event-tracker", label: "Event Tracker", icon: "📅" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const pathname = usePathname();
  const { user } = useUser();

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const MobileNavLink = ({ href, label, icon }) => (
    <Link
      href={href}
      className={`flex items-center w-full px-6 py-4 text-base transition-all duration-300 ${
        pathname === href
          ? "bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-500 text-blue-600 font-medium"
          : "text-gray-700 hover:bg-blue-50 hover:pl-8"
      }`}
    >
      <span className="mr-3 text-xl">{icon}</span>
      {label}
      {pathname === href && <ChevronRight className="ml-auto w-5 h-5 text-blue-500" />}
    </Link>
  );

  const DesktopNavLink = ({ href, label, icon }) => (
    <Link
      href={href}
      className={`relative px-4 py-2 group transition-all duration-200 ${
        pathname === href
          ? "text-blue-600 font-medium"
          : "text-gray-600 hover:text-blue-500"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </div>
      {pathname === href ? (
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-md"></span>
      ) : (
        <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-md group-hover:w-full transition-all duration-300"></span>
      )}
    </Link>
  );

  const isScrolled = scrollPosition > 10;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-lg"
          : "bg-white"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo with subtle animation */}
        <Link href="/" className="flex items-center group">
          <div className="overflow-hidden">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={150} 
              height={60} 
              className="max-w-[150px] transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <DesktopNavLink key={link.href} {...link} />
          ))}

          {/* Auth Buttons */}
          <SignedOut>
            <a href="/sign-up">
              <button className="px-6 py-2 font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                Login
              </button>
            </a>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center space-x-3 px-4 py-1 rounded-full bg-gray-50 border border-gray-100">
              <span className="text-sm text-gray-700 hidden lg:inline">
                Hi, {user?.firstName || 'User'}
              </span>
              <div className="p-1 bg-white rounded-full shadow-sm">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu} 
            className={`p-2 rounded-full transition-colors duration-200 ${
              isOpen ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown - With slide animation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg fixed w-full h-screen left-0 top-[72px] animate-slide-in">
          <div className="flex flex-col py-2 h-full overflow-y-auto">
            {navLinks.map((link) => (
              <MobileNavLink key={link.href} {...link} />
            ))}
            
            <div className=" border-t border-gray-100 p-6">
              <SignedOut>
                <a href="/sign-up">
                  <button
                    className="w-full font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg px-4 py-3 hover:shadow-md transition-all duration-200"
                  >
                    Login
                  </button>
                </a>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center gap-4 py-2 px-4 bg-gray-50 rounded-lg">
                  <UserButton afterSignOutUrl="/" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.emailAddresses?.[0]?.emailAddress || 'User account'}
                    </p>
                  </div>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}

      {/* Add required styles for animations */}
      <style jsx global>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}