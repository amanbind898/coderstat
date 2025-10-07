 
 import React from 'react';
import Image from 'next/image';
 const Loader = ({ dash }) => {
  return (
 <div className="relative w-full h-screen overflow-hidden">
         <div className="absolute inset-0 backdrop-blur-sm bg-black/30 z-10 flex items-center justify-center">
           <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full justify-center">
             <div className="relative w-full flex justify-center items-center mb-6">
               <div className="relative w-40 h-40">
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Image
                     src="/mascot.png"
                     alt="Waving Mascot"
                     width={120}
                     height={120}
                     className="animate-bounce"
                   />
                 </div>
                 <div className="absolute inset-0">
                   <svg className="animate-spin h-full w-full" viewBox="0 0 100 100">
                     <circle
                       cx="50"
                       cy="50"
                       r="45"
                       fill="none"
                       stroke="#1d4ed8"
                       strokeWidth="3"
                       strokeDasharray="283"
                       strokeDashoffset="100"
                       strokeLinecap="round"
                     />
                   </svg>
                 </div>
               </div>
             </div>
            
           </div>
         </div>
         <div className="blur-sm pointer-events-none">
         
           <div className="h-full flex items-center justify-center text-black">
             <h1 className="text-3xl">Loading {dash} Page...</h1>
           </div>
         </div>
       </div>
    );
    }

export default Loader;