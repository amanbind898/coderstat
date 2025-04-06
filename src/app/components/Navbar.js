"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

const navLinks = [
  { href: "/question-tracker", label: "Question Tracker" },
  { href: "/profile-tracker", label: "Profile Tracker" },
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

  const toggleMenu = () => setIsOpen(!isOpen);

  const NavLink = ({ href, label }) => (

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
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo" width={200} height={80} />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}

          {/* Theme Toggle (placeholder) */}
          <button className="text-gray-500 hover:text-gray-800">
            <Sun className="w-5 h-5" />
          </button>

          {/* Auth Buttons */}
          <SignedOut>
           
              <a href="/sign-up"><button className="px-4 py-2 font-semibold text-white bg-[var(--graph-blue)] rounded hover:bg-[var(--logo-blue)]" >
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
          <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}

          <SignedOut>
            <SignInButton mode="modal">
              <button
                className="w-full font-semibold text-white bg-[var(--graph-blue)] rounded px-4 py-2 hover:bg-[var(--logo-blue)]"
                onClick={() => setIsOpen(false)}
              >
                Login
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex justify-start items-center gap-2">
              <UserButton afterSignOutUrl="/" />
              <span className="text-sm text-gray-700">Hi, {user?.firstName}</span>
            </div>
          </SignedIn>
        </div>
      )}
    </nav>
  );
}
