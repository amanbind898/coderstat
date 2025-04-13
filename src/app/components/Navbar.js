"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

const navLinks = [
  { href: "/question-tracker", label: "Question Tracker" },
  { href: "/profile-tracker", label: "Profile Tracker" },
  { href: "/event-tracker", label: "Event Tracker" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setHasShadow(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const NavLink = ({ href, label }) => (
    <Link
      href={href}
      className={`block w-full px-4 py-3 text-base ${
        pathname === href
          ? "text-[var(--graph-blue)] font-semibold"
          : "text-gray-600 hover:text-[var(--graph-blue)]"
      }`}
    >
      {label}
    </Link>
  );

  const DesktopNavLink = ({ href, label }) => (
    <Link
      href={href}
      className={`px-4 py-2 transition-colors duration-150 ${
        pathname === href
          ? "text-[var(--graph-blue)] font-semibold"
          : "text-gray-600 hover:text-[var(--graph-blue)]"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        hasShadow ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={150} height={60} className="max-w-[150px]" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <DesktopNavLink key={link.href} href={link.href} label={link.label} />
          ))}

          {/* Auth Buttons */}
          <SignedOut>
            <a href="/sign-up">
              <button className="px-4 py-2 font-semibold text-white bg-[var(--graph-blue)] rounded hover:bg-[var(--logo-blue)]">
                Login
              </button>
            </a>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 hidden lg:inline">
                Hi, {user?.firstName}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button 
            onClick={toggleMenu} 
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown - Full width and better spacing */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg absolute w-full left-0">
          <div className="flex flex-col py-2">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
            
            <div className="px-4 py-3 border-t border-gray-100">
              <SignedOut>
                <a href="/sign-up">
                  <button
                    className="w-full font-semibold text-white bg-[var(--graph-blue)] rounded px-4 py-3 hover:bg-[var(--logo-blue)] text-center"
                  >
                    Login
                  </button>
                </a>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center gap-3 py-1">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-sm text-gray-700">Hi, {user?.firstName}</span>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}