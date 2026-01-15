"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronRight, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/question-tracker", label: "Question Tracker", icon: "📊" },
  { href: "/profile-tracker", label: "Profile Tracker", icon: "👤" },
  { href: "/event-tracker", label: "Event Tracker", icon: "📅" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

// User greeting component
const UserGreeting = ({ session }) => {
  const firstName = session?.user?.name?.split(' ')[0] || 'User';
  return (
    <span className="text-sm text-gray-700 hidden lg:inline">
      Hi, {firstName}
    </span>
  );
};

// User dropdown component
const UserDropdown = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
            {session?.user?.name?.[0] || 'U'}
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Mobile user info component
const MobileUserInfo = ({ session }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 py-2 px-4 bg-gray-50 rounded-lg">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
            {session?.user?.name?.[0] || 'U'}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">
            {session?.user?.name || 'User'}
          </p>
          <p className="text-xs text-gray-500">
            {session?.user?.email || 'User account'}
          </p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </div>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = !!session;

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('nav')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const MobileNavLink = ({ href, label, icon }) => (
    <Link
      href={href}
      className={`flex items-center w-full px-5 py-3 text-sm transition-all duration-300 ${pathname === href
        ? "bg-blue-50 border-l-4 border-blue-700 text-blue-700 font-medium"
        : "text-gray-700 hover:bg-gray-50 hover:pl-7"
        }`}
    >
      <span className="mr-3 text-lg">{icon}</span>
      {label}
      {pathname === href && <ChevronRight className="ml-auto w-5 h-5 text-blue-700" />}
    </Link>
  );

  const DesktopNavLink = ({ href, label, icon }) => (
    <Link
      href={href}
      className={`relative px-4 py-2 group transition-all duration-200 ${pathname === href
        ? "text-blue-700 font-medium"
        : "text-gray-600 hover:text-blue-700"
        }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="hidden lg:inline">{label}</span>
      </div>
      {pathname === href ? (
        <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-700 rounded-t-md"></span>
      ) : (
        <span className="absolute bottom-0 left-0 w-0 h-1 bg-blue-700 rounded-t-md group-hover:w-full transition-all duration-300"></span>
      )}
    </Link>
  );

  const isScrolled = scrollPosition > 10;

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={60}
              className="max-w-[150px]"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <div key={link.href} className="w-20 h-8 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="md:hidden">
            <Menu className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 border-b border-gray-100 ${isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-white"
          }`}
      >
        <div className="flex items-center justify-between px-4 py-2 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo"
                width={130}
                height={52}
                className="max-w-[130px] transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-6">
            {navLinks.map((link) => (
              <DesktopNavLink key={link.href} {...link} />
            ))}

            {/* Auth Buttons */}
            {isLoading ? (
              <div className="w-20 h-10 bg-gray-100 rounded-full animate-pulse"></div>
            ) : !isAuthenticated ? (
              <Link href="/sign-in">
                <button className="px-6 py-2 font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                  Login
                </button>
              </Link>
            ) : (
              <div className="flex items-center space-x-3 px-4 py-1 rounded-full bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                <UserGreeting session={session} />
                <UserDropdown session={session} />
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-full transition-all duration-200 ${isOpen ? "bg-blue-50 text-blue-600 rotate-90" : "text-gray-600 hover:bg-gray-50"
                }`}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Mobile Menu */}
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl fixed w-full h-[calc(100vh-60px)] left-0 top-[60px] z-50 animate-slide-in">
            <div className="flex flex-col py-2 h-full overflow-y-auto">
              {navLinks.map((link) => (
                <MobileNavLink key={link.href} {...link} />
              ))}

              <div className="mt-auto border-t border-gray-100 p-6">
                {!isAuthenticated ? (
                  <Link href="/sign-in">
                    <button
                      className="w-full font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg px-4 py-3 hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </button>
                  </Link>
                ) : (
                  <MobileUserInfo session={session} />
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Enhanced styles for animations */}
      <style jsx global>{`
        @keyframes slide-in {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        ::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #111827;
        }
      `}</style>
    </>
  );
}
