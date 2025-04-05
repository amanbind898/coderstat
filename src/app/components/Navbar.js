"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react"; 


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-2 py-2  shadow-sm sticky top-0 bg-white z-50">
      <div className="flex items-center">
        <a href="/"><Image 
          src="/logo.png" 
          alt="Codfolio Logo" 
          width={200} 
          height={80} 
          className="mr-2"
        /> 
        </a>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/question-tracker" className="px-4 py-2 text-[var(--logo-blue)]  hover:text-[var(--graph-blue)]">
          Question Tracker
        </Link>
      
        <Link href="/profile-tracker" className="px-4 py-2 text-[var(--logo-blue)] hover:text-[var(--graph-blue)]">
          Profile Tracker
        </Link>
        <button className="p-2 text-gray-500 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>
        <Link href="/login" className="px-4 py-2 font-bold text-white bg-[var(--graph-blue)] rounded hover:bg-[var(--logo-blue)]">
          Login
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden z-50 px-6 py-4 flex flex-col space-y-3">
          <Link href="/question-tracker" className="hover:text-orange-500" onClick={() => setIsOpen(false)}>
            Question Tracker
          </Link>
         
          <Link href="/profile-tracker" className="hover:text-orange-500" onClick={() => setIsOpen(false)}>
            Profile Tracker
          </Link>
          <Link href="/login" className="font-bold text-white bg-[var(--graph-blue)] rounded px-4 py-2 hover:bg-[var(--logo-blue)] text-center" onClick={() => setIsOpen(false)}>
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
