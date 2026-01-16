import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';

function Hero3() {
  return (
    <div className="w-full relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Feature Image */}
        <div className="flex-1 w-full relative order-1">
          {/* Decorative blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-amber-100/50 rounded-full blur-3xl -z-10"></div>

          <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-white transform -rotate-2 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/landing_light3.png"
              alt="Event Tracker UI"
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left order-2">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 mb-6">
            Never Miss a <br /> Coding Contest
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Stay ahead of the curve with our real-time contest tracker.
            Monitor upcoming events from <strong>Codeforces, LeetCode, AtCoder</strong>, and more.
            Add them to your calendar with a single click.
          </p>

          <Link
            href="/event-tracker"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <Calendar className="w-5 h-5 mr-2 text-indigo-600 group-hover:scale-110 transition-transform" />
            Explore Upcoming Contests
            <ChevronRight className="w-4 h-4 ml-1 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Hero3;
