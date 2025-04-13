"use client";

import React, { useEffect, useState, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useUser } from "@clerk/clerk-react";
import { db } from "../../db/index";
import { eq } from "drizzle-orm";
import { ProfileData, CodingPlatformStats } from "../../db/schema";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User, Mail, MapPin, Github, Linkedin, Twitter, Instagram,
} from "lucide-react";

function ProfilePage() {
  const { user } = useUser();
  const clerkUserId = user?.id;
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statsLastUpdated, setStatsLastUpdated] = useState(null);

  const fetchProfileData = useCallback(async () => {
    if (!clerkUserId) return;

    try {
      setIsLoading(true);
      const userProfile = await db
        .select()
        .from(ProfileData)
        .where(eq(ProfileData.clerkId, clerkUserId))
        .then(([result]) => result);

      if (!userProfile) {
        await db.insert(ProfileData).values({
          primaryEmail: user?.primaryEmailAddress?.emailAddress || "",
          name: user?.fullName || "",
          clerkId: clerkUserId,
          createdAt: new Date().toISOString(),
          dateOfBirth: null,
          location: "",
          bio: "",
          instagram: "",
          linkedin: "",
          twitter: "",
          github: "",
          portfolio: "",
          leetCode: "",
          codeforces: "",
          codechef: "",
          geeksforgeeks: "",
        });
        setIsNew(true);

        const newProfile = await db
          .select()
          .from(ProfileData)
          .where(eq(ProfileData.clerkId, clerkUserId))
          .then(([result]) => result);

        setProfileData(newProfile);
        toast.success("Welcome! Please complete your profile.");
      } else {
        setProfileData(userProfile);

        try {
          const stats = await db
            .select()
            .from(CodingPlatformStats)
            .where(eq(CodingPlatformStats.clerkId, clerkUserId))
            .limit(1);

          if (stats.length > 0 && stats[0].lastUpdated) {
            setStatsLastUpdated(stats[0].lastUpdated);
          }
        } catch (error) {
          console.error("Error fetching stats last updated:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to fetch profile data");
    } finally {
      setIsLoading(false);
    }
  }, [clerkUserId, user]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const updatePlatformStats = async () => {
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
          codechef: profileData.codechef,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update stats");
      }

      const now = new Date().toISOString();
      setStatsLastUpdated(now);

      await db
        .update(CodingPlatformStats)
        .set({ lastUpdated: now })
        .where(eq(CodingPlatformStats.clerkId, clerkUserId));

      toast.success("Coding stats updated successfully!");
    } catch (error) {
      console.error("Error updating coding stats:", error);
      toast.error("Failed to update coding stats");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    toast.info("Saving changes...");

    try {
      await db
        .update(ProfileData)
        .set(profileData)
        .where(eq(ProfileData.clerkId, clerkUserId));

      await updatePlatformStats();

      setIsEditing(false);
      setIsNew(false);
      toast.success("Profile updated successfully!");
      await fetchProfileData();
    } catch (error) {
      console.error("Error saving profile data:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <Image src="/mascot.png" alt="Mascot" width={120} height={120} />
          <h2 className="text-xl font-bold text-red-600 mt-4">You are not logged in!</h2>
          <p className="text-gray-700 mt-2">Please sign in to modify settings.</p>
          <a
            href="/sign-in"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ToastContainer />
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-t-lg" />
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
          {isLoading ? (
            <Skeleton circle height={128} width={128} />
          ) : (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          )}
        </div>
      </div>
      <div className="mt-24 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isLoading ? <Skeleton width={200} /> : user.fullName}
        </h1>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{isLoading ? <Skeleton width={200} /> : user.primaryEmailAddress?.emailAddress}</span>
        </div>
        {profileData?.location && (
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{profileData.location}</span>
          </div>
        )}
        {profileData?.bio && (
          <p className="text-gray-600 mt-4 max-w-md mx-auto">{profileData.bio}</p>
        )}
        <div className="flex justify-center mt-4 space-x-3">
          {profileData?.github && (
            <a href={profileData.github} target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 text-gray-700" />
            </a>
          )}
          {profileData?.linkedin && (
            <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-5 h-5 text-gray-700" />
            </a>
          )}
          {profileData?.twitter && (
            <a href={profileData.twitter} target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5 text-gray-700" />
            </a>
          )}
          {profileData?.instagram && (
            <a href={profileData.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram className="w-5 h-5 text-gray-700" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
