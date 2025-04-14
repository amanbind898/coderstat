"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50  ">
      <div className="container mx-auto px-4 max-w-[100vw] sm:max-w-7xl">
        {isNew && (
          <Alert className="mb-6 sm:mb-8 bg-blue-50/80 backdrop-blur-sm text-blue-700 border-blue-200">
            <AlertDescription className="text-sm sm:text-base">
              Welcome! Please complete your profile to get started.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-4">
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
                  className="w-full text-sm sm:text-base py-2 sm:py-3"
                  onClick={handleRefreshCodingStats}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`mr-2 h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh Coding Stats'}
                </Button>
              )}
              {profileData && (
  <Card className="shadow-md p-4">
    <CardContent className="p-0">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {profileData.isPublic ? <Globe size={18} className="text-green-500 mr-2" /> : <Lock size={18} className="text-gray-500 mr-2" />}
            <span className="text-sm font-medium">Profile Visibility</span>
          </div>
          <Switch 
            checked={profileData.isPublic} 
            onCheckedChange={toggleProfileVisibility} 
          />
        </div>
        <p className="text-xs text-gray-500">
          {profileData.isPublic 
            ? "Your profile is public and can be shared with anyone." 
            : "Your profile is private and only visible to you."}
        </p>
        <Button 
          variant={profileData.isPublic ? "default" : "outline"}
          className="w-full text-sm py-2" 
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

          <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {userData ? (
                  <>
                    <DsaStatsCard stats={userData} />
                    <CPStatsCard stats={userData} />
                  </>
                ) : (
                  <NoDataCard message="No platform stats available" />
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                {userData ? (
                  <PlatformCards stats={userData} />
                ) : (
                  <NoDataCard message="No platform stats available" />
                )}
              </CardContent>
            </Card>
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
