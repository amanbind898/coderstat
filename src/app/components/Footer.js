import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Logo and Description */}
        <div>
          <Link href="/" className="flex items-center gap-2 group mb-4">
            <Image
              src="/mascot-head.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-lg text-slate-900 font-heading">CoderSTAT</span>
          </Link>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            Track, analyze, and grow your competitive programming journey with powerful tools built for developers.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-bold mb-2 text-slate-900 font-heading text-sm uppercase tracking-wider">Explore</h3>
          <Link href="/question-tracker" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium w-fit">Question Tracker</Link>
          <Link href="/event-tracker" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium w-fit">Event Tracker</Link>
          <Link href="/profile-tracker" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium w-fit">Profile Tracker</Link>
          <Link href="/settings" className="text-slate-600 hover:text-indigo-600 transition-colors text-sm font-medium w-fit">Settings</Link>
        </div>

        {/* Socials */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-bold mb-2 text-slate-900 font-heading text-sm uppercase tracking-wider">Connect</h3>
          <div className="flex space-x-4">
            <a href="https://github.com/amanbind898" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:text-white hover:bg-slate-900 transition-all">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://twitter.com/akb_898" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:text-white hover:bg-sky-500 transition-all">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/amankumarbind" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:text-white hover:bg-blue-600 transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 mt-0 py-6 text-center text-xs text-slate-400 font-medium bg-slate-50/50">
        © {new Date().getFullYear()} CoderSTAT. Made with for developers.
      </div>
    </footer>
  );
}
