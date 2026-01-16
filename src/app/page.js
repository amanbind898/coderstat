import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-dynamic";
import Navbar from "./components/Navbar";
import Hero1 from "./components/Hero1";
import Hero2 from "./components/Hero2";
import Hero3 from "./components/Hero3";

export default function Home() {
  return (
    <div className="w-full bg-white text-slate-900 font-sans overflow-x-hidden">
      <Hero1 />
      <Hero2 />
      <Hero3 />
    </div>
  );
}