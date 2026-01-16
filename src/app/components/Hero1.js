import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Hero1() {
  return (
    <div className="w-full relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16">
      {/* Headings */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading text-slate-900 tracking-tight mb-6">
          Your Coding Journey, <br className="hidden sm:inline" />
          <span className="text-indigo-600">Tracked & Visualize.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The ultimate companion for competitive programmers. Track progress, manage contest schedules, and analyze your growth across platforms.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/profile-tracker"
            className="px-8 py-4 text-base font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Track Profile →
          </Link>
          <Link
            href="/question-tracker"
            className="px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            View Questions
          </Link>
        </div>
      </div>

      {/* Hero Image Container */}
      <div className="relative w-full max-w-6xl mx-auto">
        {/* Abstract Background Element - Subtle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-50/50 rounded-full blur-3xl -z-10 opacity-60"></div>

        {/* Mascot - Positioned elegantly */}
        <div className="absolute -left-12 bottom-0 z-10 hidden xl:block animate-fade-in-up">
          <Image
            src="/mascot.png"
            alt="CoderSTAT Mascot"
            width={160}
            height={160}
            className="drop-shadow-lg transform rotate-6 hover:rotate-12 transition-transform duration-500"
            priority
          />
        </div>

        {/* Main Dashboard Preview */}
        <div className="relative z-0 rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 bg-white">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent pointer-events-none"></div>
          <Image
            src="/landing_light.png"
            alt="CoderSTAT Dashboard Preview"
            width={1400}
            height={800}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default Hero1;
