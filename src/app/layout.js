import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AuthProvider from "./components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
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
        url: "/og-image.png",
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
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-8096601763375595"></meta>
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-gray-50/50`}>
        <AuthProvider>
          <Navbar />
          <div className="min-h-[calc(100vh-72px)]">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}