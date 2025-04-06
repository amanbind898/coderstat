import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Hero2() {
  return (
    <div className="relative w-full px-4 sm:px-6 lg:px-16 mt-20">
      {/* Mascot */}
      <div className="absolute right-0 bottom-0 z-0 transform translate-x-12 translate-y-2 hidden sm:block">
        <Image
          src="/mascot.png"
          alt="CoderSTAT Mascot"
          width={180}
          height={250}
          priority
        />
      </div>

      {/* Main Text */}
      <div className="text-center mb-12 sm:mb-16">
        <p className="max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Start solving <strong>450+ curated questions</strong> from Striver's SDE Sheet. Click to mark progress, track questions solved,
          and visualize your <strong>topic-wise preparation</strong> with ease.
        </p>
      </div>

      {/* Dashboard Preview Image */}
      <div className="w-full shadow-xl rounded-lg overflow-hidden">
        <Image
          src="/landing_light2.png"
          alt="CoderSTAT Dashboard Preview"
          width={1200}
          height={700}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <Link
          href="/question-tracker"
          className="inline-block w-full max-w-xs sm:max-w-sm md:max-w-md px-6 py-3 text-base sm:text-lg font-semibold text-white bg-[var(--logo-blue)] hover:bg-[var(--graph-blue)] rounded-lg shadow-md transition-all duration-300"
        >
      Question Tracker
        </Link>
      </div>
    </div>
  );
}

export default Hero2;
