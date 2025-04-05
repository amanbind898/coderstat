import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Hero2(){
    return (    <div className="relative w-full">
        <div className="absolute left-0 -ml-16 -mt-20 bottom-0 hidden sm:block">
          <Image 
            src="/mascot.png" 
            alt="CoderSTAT Mascot" 
            width={250} 
            height={350} 
            priority
          />
        </div>

        <div className="text-center mb-16">
          <h1 className="mb-8 text-5xl sm:text-6xl font-bold">Track, analyze &amp; share</h1>

          <h2 className="mb-12 text-2xl sm:text-4xl font-normal text-[var(--primary-gray)]">
            <span className="text-[var(--logo-blue)] font-bold">CoderSTAT</span> helps you navigate and track your<br /> 
            coding journey to success
          </h2>

          <div className="flex justify-center gap-4 mb-16">
            <Link href="/question-tracker" className="px-6 py-3 text-lg font-medium border border-[var(--primary-gray)] rounded hover:bg-[var(--primary-gray)/10]">
              Question Tracker
            </Link>
            <Link href="/profile-tracker" className="px-6 py-3 text-lg font-medium text-white bg-[var(--graph-blue)] rounded hover:bg-[var(--logo-blue)]">
              Profile Tracker →
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Image */}
        <div className="w-full shadow-xl rounded-lg overflow-hidden">
          <Image
            src="/landing_light.png" 
            alt="CoderSTAT Dashboard Preview"
            width={1200}
            height={700}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>);
}
export default Hero2;