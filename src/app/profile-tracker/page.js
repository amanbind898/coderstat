"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
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
  
  const { user } = useUser();
  const clerkUserId = user?.id;
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
          clerkId: clerkUserId,
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
        body: JSON.stringify({ clerkId: clerkUserId }),
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
        body: JSON.stringify({ clerkId: clerkUserId }),
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
    if (clerkUserId) {
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
  }, [clerkUserId]);

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
          clerkId: clerkUserId,
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
    const url = `${window.location.origin}/profile/${profileData.clerkId}`;
    console.log("Profile URL:", url);
    navigator.clipboard.writeText(url);
    toast.success("Profile link copied to clipboard!");
  };
  
  if (!user) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 py-8">
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
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-gray-900 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAxNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDQ0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiA0NGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            
            <div className="relative px-6 py-12 sm:px-12 sm:py-16">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {profileData?.profilePic && (
                    <div className="hidden sm:block w-24 h-24 rounded-2xl border-4 border-white/30 shadow-2xl overflow-hidden bg-white ring-4 ring-white/20">
                      <Image
                        src={profileData.profilePic}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                      Welcome Back, {user?.firstName || 'User'}! 👋
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base">Track your coding journey and achievements across platforms</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                    <div className="text-white/80 text-xs font-medium mb-1">Total Solved</div>
                    <div className="text-2xl font-bold text-white">
                      {userData && Array.isArray(userData) 
                        ? (parseInt(userData.find(s => s.platform === 'LeetCode')?.solvedCount || 0) + 
                           parseInt(userData.find(s => s.platform === 'GeeksforGeeks')?.solvedCount || 0))
                        : 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-6">
              <Card className="shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  {profileData ? (
                    <UserProfile profileData={profileData} isEditing={true} />
                  ) : (
                    <NoDataCard message="No profile data available" />
                  )}
                </CardContent>
              </Card>
              {profileData && (
                <Button 
                  className="w-full text-sm sm:text-base py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-gray-900 shadow-md hover:shadow-lg transform transition-all"
                  onClick={handleRefreshCodingStats}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh Coding Stats'}
                </Button>
              )}
              {profileData && (
  <Card className="shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-all">
    <CardContent className="p-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {profileData.isPublic ? (
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe size={20} className="text-green-600" />
              </div>
            ) : (
              <div className="p-2 bg-gray-100 rounded-lg">
                <Lock size={20} className="text-gray-600" />
              </div>
            )}
            <div>
              <span className="text-sm font-bold text-gray-900 block">Profile Visibility</span>
              <span className="text-xs text-gray-500">
                {profileData.isPublic ? "Public" : "Private"}
              </span>
            </div>
          </div>
          <Switch 
            checked={profileData.isPublic} 
            onCheckedChange={toggleProfileVisibility} 
          />
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          {profileData.isPublic 
            ? "✅ Your profile is public and can be shared with anyone." 
            : "🔒 Your profile is private and only visible to you."}
        </p>
        <Button 
          variant={profileData.isPublic ? "default" : "outline"}
          className={`w-full text-sm py-3 font-medium ${
            profileData.isPublic 
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md' 
              : 'border-2'
          }`}
          onClick={shareProfile}
          disabled={!profileData.isPublic}
        >
          <Share2 className="mr-2 h-4 w-4" />
          {profileData.isPublic ? "Share Profile" : "Make Public to Share"}
        </Button>
      </div>
    </CardContent>
  </Card>
)}

            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Statistics Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Statistics</h2>
                  <p className="text-sm text-gray-500 mt-1">Overview of your coding achievements</p>
                </div>
              </div>
              
              <Card className="shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6 space-y-8">
                  {userData ? (
                    <>
                      <DsaStatsCard stats={userData} />
                      <div className="border-t border-gray-200 pt-6">
                        <CPStatsCard stats={userData} />
                      </div>
                    </>
                  ) : (
                    <NoDataCard message="No platform stats available" />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Platform Cards Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Platform Progress</h2>
                <p className="text-sm text-gray-500 mt-1">Detailed breakdown by coding platform</p>
              </div>
              
              <Card className="shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  {userData ? (
                    <PlatformCards stats={userData} />
                  ) : (
                    <NoDataCard message="No platform stats available" />
                  )}
                </CardContent>
              </Card>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </div>
      </div>
    </div>
  );
}
