
import React from 'react';
import Image from 'next/image';

const Loader = ({ dash }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">

        <div className="relative w-32 h-32 mb-8">
          {/* Spinning ring */}
          <div className="absolute inset-0 animate-spin-slow">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="4"
                strokeDasharray="283"
                strokeDashoffset="75"
                strokeLinecap="round"
                className="transform -rotate-90 origin-center"
              />
            </svg>
          </div>

          {/* Mascot static or minimal animation */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <Image
              src="/mascot.png"
              alt="Loading..."
              width={80}
              height={80}
              className="animate-pulse"
            />
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900 mb-2 font-heading">
            Loading {dash}
          </h1>
          <div className="flex items-center justify-center gap-1">
            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-0"></div>
            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-150"></div>
            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loader;