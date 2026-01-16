import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Hero2() {
  return (
    <div className="w-full relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 mb-6">
            Master Data Structures <br /> & Algorithms
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Systematically solve <strong>450+ curated questions</strong> from the Striver's SDE Sheet.
            Visualize your topic-wise strength, mark progress, and build consistency with our intuitive tracker.
          </p>

          <Link
            href="/question-tracker"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-slate-900 rounded-lg shadow transition-colors duration-300"
          >
            Start Solving Questions
          </Link>
        </div>

        {/* Feature Image */}
        <div className="flex-1 w-full relative order-1 lg:order-2">
          {/* Decorative blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>

          <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/landing_light2.png"
              alt="Question Tracker UI"
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Hero2;
