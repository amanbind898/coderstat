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
import Footer from "./components/Footer";

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
  metadataBase: new URL("https://coderstat.vercel.app"),
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
 
  icons: {
    icon: "./mascot-head.png",
   
  },
};


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-[calc(100vh-72px)]  pb-20 gap-16 sm:p-20">
        <main className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8 px-2 sm:px-6 md:px-8 py-6">
  {children}
  
</main>

        </div>
  <Footer />
      </body>
    </html>
    </ClerkProvider>
  );
}
