import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Hero3() {
  return (
    <div className="relative w-full px-4 sm:px-6 lg:px-16 mt-20">
      {/* Mascot */}
      <div className="absolute right-0 bottom-0 z-0 transform translate-x-12 translate-y-2 hidden sm:block">
        <Image
          src="/mascot-head.png"
          alt="CoderSTAT Mascot"
          width={180}
          height={250}
          priority
        />
      </div>

      {/* Main Text */}
      <div className="text-center mb-12 sm:mb-16">
        <p className="max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Stay updated with all <strong>upcoming programming contests</strong> from platforms like Codeforces, CodeChef, LeetCode, and more.
          Filter by platform, add contests to your calendar, and never miss a challenge again!
        </p>
      </div>

      {/* Event Tracker Preview Image */}
      <div className="w-full shadow-xl rounded-lg overflow-hidden border border-[var(--primary-gray)">
        <Image
          src="/landing_light3.png"
          alt="CoderSTAT Event Tracker Preview"
          width={1200}
          height={700}
          className="w-full h-auto"
          priority
        />
      </div>

      
    </div>
  );
}

export default Hero3;
