import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Navbar from "./components/Navbar";
import { FileArchiveIcon } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: {
    default: "CoderSTAT – Track Your Coding Journey",
    template: "%s | CoderSTAT",
  },
  description: "Effortlessly track your coding progress, events, and profiles with CoderSTAT – your all-in-one developer dashboard.",
  keywords: [
    "CoderSTAT",
    "coding tracker",
    "developer profile tracker",
    "question tracker",
    "event tracker",
    "competitive programming",
    "coding progress",
    "software developer tools"
  ],
  metadataBase: new URL("https://coderstat.vercel.app"), // replace with your domain
  themeColor: "#f97316", // Tailwind orange-500
  openGraph: {
    title: "CoderSTAT – Track Your Coding Journey",
    description: "Monitor your coding growth with question, event, and profile trackers – built for devs who mean business.",
    url: "https://coderstat.vercel.app",
    siteName: "CoderSTAT",
    images: [
      {
        url: "/og-image.png", // Add this image in your public folder
        width: 1200,
        height: 630,
        alt: "CoderSTAT Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CoderSTAT – Track Your Coding Journey",
    description: "Track and showcase your coding skills with question, event, and profile insights.",
    images: ["/og-image.png"],
    creator: "@yourTwitterHandle", // Optional
  },
  icons: {
    icon: "./mascot.png",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-[calc(100vh-72px)] p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center max-w-6xl w-full">
        
        {children}
        </main>
        </div>
  
      </body>
    </html>
  );
}
