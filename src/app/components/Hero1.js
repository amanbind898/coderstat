import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Hero1() {
  return (
    <div className="w-full relative px-4 sm:px-8 lg:px-16 ">
      {/* Headings */}
      <div className="text-center mb-2 sm:mb-16">
        
        <h2 className="mb-10 text-xl sm:text-2xl md:text-3xl font-normal text-[var(--primary-gray)]">
          <span className="text-[var(--logo-blue)] font-bold">CoderSTAT</span> helps you navigate and track your<br className="hidden sm:inline" />
          coding journey to success
        </h2>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            href="/question-tracker"
            className="px-5 py-2 sm:px-6 sm:py-3 text-base sm:text-lg font-medium border border-[var(--primary-gray)] rounded-lg hover:bg-[var(--primary-gray)/10] transition"
          >
            Question Tracker
          </Link>
          <Link
            href="/profile-tracker"
            className="px-5 py-2 sm:px-6 sm:py-3 text-base sm:text-lg font-medium text-white bg-[var(--logo-blue)] hover:bg-[var(--graph-blue)] rounded-lg shadow transition"
          >
            Profile Tracker →
          </Link>
        </div>
      </div>

      {/* Mascot & Dashboard */}
      <div className="relative w-full max-w-7xl mx-auto">
        {/* Mascot */}
        <div className="absolute left-0 bottom-4 z-0 transform -translate-x-16 translate-y-2 hidden sm:block">
          <Image
            src="/mascot.png"
            alt="CoderSTAT Mascot"
            width={150}
            height={220}
            priority
            className="animate-wave"
          />
        </div>

        {/* Dashboard Image */}
        <div className="relative z-12 w-full shadow-xl rounded-lg overflow-hidden border border-[var(--primary-gray)]">
          <Image
            src="/landing_light.png"
            alt="CoderSTAT Dashboard Preview"
            width={1200}
            height={700}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default Hero1;
