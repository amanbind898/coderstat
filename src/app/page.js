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
      
      {/* Footer */}
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-[var(--primary-gray)]">
        <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="#">
          <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
          About
        </a>
        <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="#">
          <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
          Features
        </a>
        <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="#">
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Get Started →
        </a>
      </footer>
    </div>
 
  
  );
}