import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react"; // Or any icons you prefer

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo and Description */}
        <div>
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/mascot-head.png" alt="CoderSTAT Logo" width={40} height={40} />
            <span className="font-bold text-lg">CoderSTAT</span>
          </Link>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Track, analyze, and grow your coding journey with powerful tools built just for developers.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Navigation</h3>
          <Link href="/question-tracker" className="hover:text-orange-500">Question Tracker</Link>
          <Link href="/event-tracker" className="hover:text-orange-500">Event Tracker</Link>
          <Link href="/profile-tracker" className="hover:text-orange-500">Profile Tracker</Link>
          <Link href="/settings" className="hover:text-orange-500">Settings</Link>
          <Link href="/upload" className="hover:text-orange-500">Upload</Link>
        </div>

        {/* Socials */}
        <div className="flex flex-col space-y-3">
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="https://github.com/amanbind898" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
              <Github />
            </a>
            <a href="https://twitter.com/akb_898" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
              <Twitter />
            </a>
            <a href="https://linkedin.com/amankumarbind" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
              <Linkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} CoderSTAT. All rights reserved.
      </div>
    </footer>
  );
}
