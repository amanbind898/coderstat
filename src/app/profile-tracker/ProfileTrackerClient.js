"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Share2, Globe, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import UserProfile from "../components/UserProfile";
import PlatformCards from "../components/PlatfromCards";
import DsaStatsCard from "../components/DsaStatsCard";
import CPStatsCard from "../components/CPStatsCard";
import Loader from "../components/Loader";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {

  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [profileData, setProfileData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshCodingStats = async () => {
    setIsRefreshing(true);
    toast.info("Updating coding stats...");
    try {
      const response = await fetch("/api/updatePlatformStats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          leetCode: profileData.leetCode,
          geeksforgeeks: profileData.geeksforgeeks,
          codeforces: profileData.codeforces,
          codechef: profileData.codechef
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update stats");
      }

      await fetchStatsData();
      toast.success("Stats updated successfully!");
    } catch (error) {
      console.error("Error refreshing coding stats:", error);
      toast.error("Failed to update stats");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId }),
      });
      const data = await response.json();

      if (response.status === 200) {
        if (data.isNew) {
          setIsNew(true);
          toast.success("Welcome, new user! Please fill in your profile.");
        }
        setProfileData(data.profile);
        return data.profile;
      } else {
        throw new Error(data.error || "Failed to fetch profile data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to fetch profile data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatsData = async (profile) => {
    try {
      const response = await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId }),
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (jsonError) {
        console.error("Failed to parse response as JSON:", jsonError);
        throw new Error("Server returned invalid JSON");
      }

      if (response.status === 200) {
        setUserData(data.userStats || []);
      } else {
        throw new Error(data.error || `API error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching stats data:", error);
      toast.error("Failed to fetch stats data. Please try again later.");
    }
  };

  useEffect(() => {
    if (userId) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const profile = await fetchProfileData();
          await fetchStatsData(profile);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [userId]);

  const NoDataCard = ({ message }) => (
    <Card className="bg-gray-50/80 backdrop-blur-sm">
      <CardContent className="flex items-center justify-center min-h-[12rem]">
        <p className="text-sm sm:text-base text-gray-500 px-4 text-center">{message}</p>
      </CardContent>
    </Card>
  );
  const toggleProfileVisibility = async () => {
    try {
      const response = await fetch("/api/toggle-profile-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          isPublic: !profileData.isPublic
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile visibility");
      }

      // Update the local state
      setProfileData(prev => ({
        ...prev,
        isPublic: !prev.isPublic
      }));

      toast.success(`Profile is now ${!profileData.isPublic ? 'public' : 'private'}`);
    } catch (error) {
      console.error("Error toggling profile visibility:", error);
      toast.error("Failed to update profile visibility");
    }
  };

  const shareProfile = () => {
    if (!profileData.isPublic) {
      toast.warning("Make your profile public to share it");
      return;
    }

    // Create a sharable link
    const url = `${window.location.origin}/profile/${profileData.userId}`;
    console.log("Profile URL:", url);
    navigator.clipboard.writeText(url);
    toast.success("Profile link copied to clipboard!");
  };

  if (!session?.user) {
    return (
      <Loader dash={"Profile Tracker"} />

    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-4">
            <Skeleton className="h-[400px] sm:h-[500px] lg:h-[600px] rounded-xl" />
          </div>
          <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">
            <Skeleton className="h-[150px] sm:h-[180px] lg:h-[200px] rounded-xl" />
            <Skeleton className="h-[300px] sm:h-[350px] lg:h-[400px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {isNew && (
          <Alert className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-900 border-blue-300 shadow-md">
            <AlertDescription className="text-sm sm:text-base font-medium">
              🎉 Welcome! Please complete your profile in settings to get started.
            </AlertDescription>
          </Alert>
        )}

        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-slate-900 rounded-3xl shadow-xl border border-slate-800">
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="relative px-6 py-10 sm:px-12 sm:py-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {profileData?.profilePic ? (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden bg-slate-900 ring-4 ring-slate-800/50">
                      <Image
                        src={profileData.profilePic}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-800 rounded-2xl items-center justify-center text-4xl border border-slate-700 shadow-inner">
                      🚀
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em]">Dashboard</span>
                      <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                      <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">The CoderSTAR</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight font-heading">
                      Welcome Back, {session?.user?.name?.split(' ')[0] || 'Member'}
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base font-medium max-w-xl">
                      {profileData?.bio ? `"${profileData.bio}"` : "You're doing great! Keep crushing those problems."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                  <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl px-8 py-4 border border-slate-700 text-center min-w-[160px]">
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Impact Score</div>
                    <div className="text-3xl font-black text-white font-heading">
                      {userData && Array.isArray(userData)
                        ? (parseInt(userData.find(s => s.platform === 'LeetCode')?.solvedCount || 0) +
                          parseInt(userData.find(s => s.platform === 'GeeksforGeeks')?.solvedCount || 0)).toLocaleString()
                        : 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 lg:sticky lg:top-8 self-start">
            <UserProfile profileData={profileData} showImage={false} isEditing={true} />

            <div className="mt-6 flex flex-col gap-3">
              <Button
                className="w-full py-7 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 shadow-lg hover:shadow-indigo-500/20 transform transition-all active:scale-95"
                onClick={handleRefreshCodingStats}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Syncing Stats...' : 'Sync Platform Stats'}
              </Button>

              <Card className="shadow-sm border-slate-100 overflow-hidden rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${profileData?.isPublic ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {profileData?.isPublic ? <Globe size={18} /> : <Lock size={18} />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Visibility</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{profileData?.isPublic ? "Public" : "Private"}</span>
                      </div>
                    </div>
                    <Switch
                      checked={profileData?.isPublic}
                      onCheckedChange={toggleProfileVisibility}
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-xs py-5 font-bold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                    onClick={shareProfile}
                    disabled={!profileData?.isPublic}
                  >
                    <Share2 className="mr-2 h-3.5 w-3.5" />
                    Copy Share Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            {/* Statistics Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 font-heading">Performance Insight</h2>
                  <p className="text-sm text-slate-500 font-medium">Aggregated data from your connected accounts</p>
                </div>
              </div>

              <Card className="shadow-sm border-slate-100 bg-white rounded-3xl">
                <CardContent className="p-6 sm:p-8 space-y-10">
                  {userData ? (
                    <>
                      <DsaStatsCard stats={userData} />
                      <div className="border-t border-slate-100 pt-10">
                        <CPStatsCard stats={userData} />
                      </div>
                    </>
                  ) : (
                    <NoDataCard message="Connect your platforms to see statistics here." />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Platform Progress Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 font-heading">Platform breakdown</h2>
                <p className="text-sm text-slate-500 font-medium">Detailed problem-solving metrics by site</p>
              </div>

              <Card className="shadow-sm border-slate-100 bg-white rounded-3xl">
                <CardContent className="p-6 sm:p-8">
                  {userData ? (
                    <PlatformCards stats={userData} />
                  ) : (
                    <NoDataCard message="Your platform data will appear here once connected." />
                  )}
                </CardContent>
              </Card>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar
              theme="colored"
              className="font-bold"
            />
          </div>
        </div>
        );
}
