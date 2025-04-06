import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Hero1 from "./components/Hero1";
import Hero2 from "./components/Hero2";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">

    <Hero1 />  
    <Hero2 />
      
 
    </div>
 
  
  );
}