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
    <span className="text-sm text-slate-700 hidden lg:inline font-medium">
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
        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-slate-200"
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
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
            {session?.user?.name?.[0] || 'U'}
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">{session?.user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
            >
              <LogOut className="w-4 h-4 ml-0.5" />
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
      <div className="flex items-center gap-4 py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
            {session?.user?.name?.[0] || 'U'}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {session?.user?.name || 'User'}
          </p>
          <p className="text-xs text-slate-500">
            {session?.user?.email || 'User account'}
          </p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
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
      className={`flex items-center w-full px-5 py-3.5 text-sm transition-all duration-200 border-l-4 ${pathname === href
        ? "bg-slate-50 border-indigo-600 text-indigo-700 font-semibold"
        : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
    >
      <span className="mr-3 text-lg opacity-80">{icon}</span>
      {label}
      {pathname === href && <ChevronRight className="ml-auto w-4 h-4 text-indigo-600" />}
    </Link>
  );

  const DesktopNavLink = ({ href, label, icon }) => (
    <Link
      href={href}
      className={`relative px-4 py-2 group transition-all duration-200 text-sm font-medium ${pathname === href
        ? "text-slate-900 bg-slate-50/80 rounded-lg"
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
        }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">{icon}</span>
        <span className="hidden lg:inline">{label}</span>
      </div>
    </Link>
  );

  const isScrolled = scrollPosition > 10;

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white border-b border-white">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">CoderSTAT</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-slate-200/60"
          : "bg-white border-transparent"
          }`}
      >
        <div className="flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/mascot-head.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-xl tracking-tight text-slate-900 font-heading group-hover:text-indigo-600 transition-colors">CoderSTAT</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => (
              <DesktopNavLink key={link.href} {...link} />
            ))}

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {/* Auth Buttons */}
            {isLoading ? (
              <div className="w-20 h-9 bg-slate-100 rounded-lg animate-pulse"></div>
            ) : !isAuthenticated ? (
              <Link href="/sign-in">
                <button className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                  Sign In
                </button>
              </Link>
            ) : (
              <div className="flex items-center space-x-3 pl-2">
                <UserGreeting session={session} />
                <UserDropdown session={session} />
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg transition-all duration-200 ${isOpen ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
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
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Mobile Menu */}
          <div className="md:hidden bg-white border-t border-slate-100 shadow-2xl fixed w-full h-[calc(100vh-60px)] left-0 top-[60px] z-50 animate-slide-in">
            <div className="flex flex-col py-4 h-full overflow-y-auto">
              <div className="px-4 mb-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <MobileNavLink key={link.href} {...link} />
                  ))}
                </div>
              </div>

              <div className="mt-auto border-t border-slate-100 p-6 bg-slate-50/50">
                {!isAuthenticated ? (
                  <Link href="/sign-in">
                    <button
                      className="w-full font-semibold text-white bg-slate-900 rounded-xl px-4 py-3.5 hover:bg-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                      onClick={() => setIsOpen(false)}
                    >
                      Login to Continue
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
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}
