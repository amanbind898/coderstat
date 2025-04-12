import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Hero1 from "./components/Hero1";
import Hero2 from "./components/Hero2";
import Hero3 from "./components/Hero3";

export default function Home() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8 px-2 sm:px-6 md:px-8 py-6 bg-[var(--background)] text-[var(--foreground)] font-sans">

    <Hero1 />  
    <Hero2 />
    <Hero3 />
      
 
    </div>
 
  
  );
}