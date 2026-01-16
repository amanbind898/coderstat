"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Share2, Globe, Medal, MapPin, School, Mail } from "lucide-react";

import PlatformCards from "../../components/PlatfromCards";
import DsaStatsCard from "../../components/DsaStatsCard";
import CPStatsCard from "../../components/CPStatsCard";
import UserProfile from "../../components/UserProfile";
import Loader from "../../components/Loader";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const NoDataCard = ({ message }) => (
  <Card className="bg-slate-50 border border-slate-100">
    <CardContent className="flex items-center justify-center min-h-[12rem]">
      <p className="text-sm sm:text-base text-slate-400 font-medium px-4 text-center">{message}</p>
    </CardContent>
  </Card>
);

export default function PublicProfile() {
  const params = useParams();
  const userId = params.userId;

  const [profileData, setProfileData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCTAModal, setShowCTAModal] = useState(false);

  useEffect(() => {
    const fetchPublicProfileData = async () => {
      try {
        const response = await fetch("/api/public-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) throw new Error("Profile not found or is private");

        const data = await response.json();
        setProfileData(data.profile);
        setUserData(data.stats);
      } catch (err) {
        console.error("Error fetching public profile:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchPublicProfileData();
  }, [userId]);

  useEffect(() => {
    const hasSeenCTA = localStorage.getItem('coderstar_cta_dismissed');
    if (!hasSeenCTA && !isLoading && !error) {
      const timer = setTimeout(() => setShowCTAModal(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, error]);

  const handleCloseCTA = () => {
    setShowCTAModal(false);
    localStorage.setItem('coderstar_cta_dismissed', 'true');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <Skeleton className="h-[600px] rounded-2xl" />
          </div>
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-[200px] rounded-2xl" />
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 pb-12 flex items-center justify-center px-4">
        <Card className="w-full max-w-md mx-auto shadow-xl border-slate-200">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Image src="/mascot-head.png" alt="Mascot" width={100} height={100} className="mx-auto" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2 font-heading">Oops! Profile Hidden</h1>
            <p className="text-slate-500 mb-8 text-sm leading-relaxed">This profile might be private or doesn't exist anymore.</p>
            <Button onClick={() => (window.location.href = "/")} className="w-full bg-slate-900 hover:bg-indigo-600 transition-colors py-6">
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Profile Hero Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-slate-900 rounded-3xl shadow-xl border border-slate-800">
            {/* Subtle pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="relative px-6 py-10 sm:px-12 sm:py-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {profileData?.profilePic && (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden bg-slate-900 ring-4 ring-slate-800/50">
                      <Image
                        src={profileData.profilePic}
                        alt={profileData.name || "User"}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <span className="text-slate-400 text-sm font-bold tracking-widest uppercase">The CoderSTAR</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight font-heading">
                      {profileData?.name || 'Anonymous User'}
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base max-w-xl italic">
                      {profileData?.bio || 'Building the future, one line of code at a time.'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                  {userData && (
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl px-8 py-4 border border-slate-700 text-center">
                      <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Impact Score</div>
                      <div className="text-3xl font-black text-white font-heading">
                        {(parseInt(userData.find(s => s.platform === 'LeetCode')?.solvedCount || 0) +
                          parseInt(userData.find(s => s.platform === 'GeeksforGeeks')?.solvedCount || 0)).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 lg:sticky lg:top-8 self-start">
            <UserProfile profileData={profileData} showImage={false} isEditing={false} />

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Profile link copied!");
                }}
                className="w-full bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 py-6"
              >
                <Share2 className="w-4 h-4 mr-2" /> Share Profile
              </Button>
              <a href="/" className="w-full">
                <Button className="w-full bg-slate-900 hover:bg-indigo-600 transition-colors py-6">
                  Create Your Own ✨
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {/* Statistics Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 font-heading">Performance Dashboard</h2>
                  <p className="text-sm text-slate-500 font-medium">Real-time statistics from coding platforms</p>
                </div>
              </div>

              <Card className="shadow-sm border-slate-100 bg-white">
                <CardContent className="p-6 space-y-10">
                  {userData ? (
                    <>
                      <DsaStatsCard stats={userData} />
                      <div className="border-t border-slate-100 pt-10">
                        <CPStatsCard stats={userData} />
                      </div>
                    </>
                  ) : (
                    <NoDataCard message="No platform stats available" />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Platform Progress Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 font-heading">Platform breakdown</h2>
                <p className="text-sm text-slate-500 font-medium">Detailed metrics per platform</p>
              </div>

              <Card className="shadow-sm border-slate-100 bg-white">
                <CardContent className="p-6">
                  {userData ? (
                    <PlatformCards stats={userData} />
                  ) : (
                    <NoDataCard message="No platform stats available" />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modern CTA Modal */}
      {showCTAModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseCTA}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 transform animate-in slide-in-from-bottom-10 duration-500">
            <button onClick={handleCloseCTA} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-8">
              <div className="mb-6 inline-flex p-5 bg-indigo-50 rounded-3xl">
                <Globe className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 font-heading tracking-tight">Claim Your Profile</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">Join the best developers and track your journey across all platforms.</p>
            </div>

            <div className="space-y-4 mb-10">
              {[
                "Auto-sync LeetCode, GFG & more",
                "Personalized performance dashboard",
                "Shareable professional profile"
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                  </div>
                  {f}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button onClick={handleCloseCTA} variant="outline" className="flex-1 py-7 rounded-2xl font-bold text-slate-600 border-slate-200">
                Dismiss
              </Button>
              <a href="/" className="flex-1">
                <Button className="w-full py-7 rounded-2xl font-bold bg-slate-900 hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/25">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}