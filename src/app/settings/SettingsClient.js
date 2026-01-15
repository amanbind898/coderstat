"use client";

import React, { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSession } from "next-auth/react";
import { db } from "../../db/index";
import { eq } from "drizzle-orm";
import { ProfileData } from "../../db/schema";
import Loader from "../components/Loader"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Edit3, RefreshCw, User, Mail, Key, Save, X, MapPin, Calendar,
  Github, Linkedin, Twitter, Instagram, Globe, Code, Bell, Shield,
  Palette, Database, Lock, Eye, EyeOff, Settings as SettingsIcon,
  ChevronRight, Check, AlertCircle, Trash2, Info
} from "lucide-react";
import Image from "next/image";

function Settings() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    social: false,
    coding: false
  });

  // Use this ref to prevent duplicate profile creation
  const profileCreationAttempted = useRef(false);

  useEffect(() => {
    if (!userId) return;
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      // First check if we already have a profile
      const userProfile = await db
        .select()
        .from(ProfileData)
        .where(eq(ProfileData.userId, userId))
        .then((results) => results[0] || null);

      if (!userProfile) {
        // Only try to create a profile if we haven't tried before
        if (!profileCreationAttempted.current) {
          profileCreationAttempted.current = true;

          // Create a new profile
          await db.insert(ProfileData).values({
            primaryEmail: session?.user?.email || "",
            name: session?.user?.name || "",
            userId: userId,
            createdAt: new Date().toISOString(),
          });

          // Fetch the newly created profile
          const newProfile = await db
            .select()
            .from(ProfileData)
            .where(eq(ProfileData.userId, userId))
            .then((results) => results[0] || null);

          if (newProfile) {
            setProfileData(newProfile);
            setIsNew(true);
            toast.success("Welcome! Please complete your profile.");
          }
        }
      } else {
        // We found an existing profile
        setProfileData(userProfile);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to fetch profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Trim bio to 500 characters for server-side safety
    const trimmedValue = name === 'bio' ? value.slice(0, 500) : value;
    setProfileData((prevData) => ({ ...prevData, [name]: trimmedValue }));
  };

  const updateCodingStats = async () => {
    // Check if any coding platform username is provided
    const hasCodingProfiles = profileData.leetCode ||
      profileData.geeksforgeeks ||
      profileData.codeforces ||
      profileData.codechef;

    if (!hasCodingProfiles) return;

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

      toast.success("Stats updated successfully!");
    } catch (error) {
      console.error("Error refreshing coding stats:", error);
      toast.error("Failed to update stats");
    }
  };

  const handleSave = async () => {
    toast.info("Saving changes...");
    try {
      await db
        .update(ProfileData)
        .set({
          dateOfBirth: profileData.dateOfBirth,
          location: profileData.location,
          bio: profileData.bio,
          instagram: profileData.instagram,
          institute: profileData.institute,
          profilePic: profileData.profilePic,
          linkedin: profileData.linkedin,
          twitter: profileData.twitter,
          github: profileData.github,
          portfolio: profileData.portfolio,
          leetCode: profileData.leetCode,
          codeforces: profileData.codeforces,
          codechef: profileData.codechef,
          geeksforgeeks: profileData.geeksforgeeks,
        })
        .where(eq(ProfileData.userId, userId));

      setIsEditing(false);
      setIsNew(false);
      toast.success("Profile updated successfully!");


      if (profileData.leetCode ||
        profileData.codeforces ||
        profileData.codechef ||
        profileData.geeksforgeeks) {
        await updateCodingStats();
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
      toast.error("Failed to save changes");
    }
  };

  const handleRefreshCodingStats = async () => {
    await updateCodingStats();
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionCard = ({ title, icon: Icon, children, sectionKey, iconColor }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections[sectionKey] ? 'rotate-90' : ''
            }`}
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-6 py-6 border-t border-gray-100 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-blue-50 rounded">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            Profile Picture URL
          </label>
          <input
            type="url"
            name="profilePic"
            value={profileData?.profilePic || ""}
            onChange={handleInputChange}
            placeholder="https://example.com/profile.jpg"
            className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-all ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
              }`}
            disabled={!isEditing}
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Enter a URL for your profile picture
          </p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-blue-50 rounded">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={profileData?.dateOfBirth || ""}
            onChange={handleInputChange}
            className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-all ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
              }`}
            disabled={!isEditing}
          />
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-blue-50 rounded">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            Location
          </label>
          <input
            type="text"
            name="location"
            value={profileData?.location || ""}
            onChange={handleInputChange}
            placeholder="City, Country"
            className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-all ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
              }`}
            disabled={!isEditing}
          />
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-blue-50 rounded">
              <Code className="w-4 h-4 text-blue-600" />
            </div>
            Institute
          </label>
          <input
            type="text"
            name="institute"
            value={profileData?.institute || ""}
            onChange={handleInputChange}
            placeholder="Your institute/university"
            className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-all ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
              }`}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all">
        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-blue-50 rounded">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          Bio
        </label>
        <textarea
          name="bio"
          value={profileData?.bio || ""}
          onChange={handleInputChange}
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={500}
          className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-all resize-none ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
            }`}
          disabled={!isEditing}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Max 500 characters
          </p>
          <span className="text-xs text-gray-400">
            {profileData?.bio?.length || 0} / 500
          </span>
        </div>
      </div>
    </div>
  );

  const socialLinks = [
    { name: 'github', icon: Github, label: 'GitHub', placeholder: 'https://github.com/username' },
    { name: 'linkedin', icon: Linkedin, label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
    { name: 'twitter', icon: Twitter, label: 'Twitter', placeholder: 'https://twitter.com/username' },
    { name: 'instagram', icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/username' },
    { name: 'portfolio', icon: Globe, label: 'Portfolio', placeholder: 'https://yourwebsite.com' },
  ];

  const renderSocialLinks = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Globe className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-900 mb-1">Connect Your Social Profiles</h4>
            <p className="text-xs text-purple-700">Add links to your social media profiles to showcase your online presence</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {socialLinks.map(({ name, icon: Icon, label, placeholder }) => (
          <div key={name} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-all">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-purple-50 rounded">
                <Icon className="w-4 h-4 text-purple-600" />
              </div>
              {label}
            </label>
            <input
              type="url"
              name={name}
              value={profileData?.[name] || ""}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                }`}
              disabled={!isEditing}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const codingPlatforms = [
    { name: 'leetCode', label: 'LeetCode', icon: '/leetcode.png', placeholder: 'username' },
    { name: 'codeforces', label: 'Codeforces', icon: '/codeforces.jpg', placeholder: 'username' },
    { name: 'codechef', label: 'CodeChef', icon: '/codechef.jpg', placeholder: 'username' },
    { name: 'geeksforgeeks', label: 'GeeksforGeeks', icon: '/gfg.png', placeholder: 'username' }
  ];

  const renderCodingProfiles = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Code className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-green-900 mb-1">Coding Platform Profiles</h4>
            <p className="text-xs text-green-700">Link your coding profiles to automatically sync and display your programming statistics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {codingPlatforms.map(({ name, label, icon, placeholder }) => (
          <div key={name} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-300 transition-all">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-green-50 rounded flex items-center justify-center">
                <img src={icon} alt={label} className="w-4 h-4 rounded" />
              </div>
              {label} Username
            </label>
            <input
              type="text"
              name={name}
              value={profileData?.[name] || ""}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                }`}
              disabled={!isEditing}
            />
          </div>
        ))}
      </div>

      {!isEditing && (profileData?.leetCode || profileData?.codeforces || profileData?.codechef || profileData?.geeksforgeeks) && (
        <button
          onClick={handleRefreshCodingStats}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Refresh Coding Statistics</span>
        </button>
      )}
    </div>
  );

  if (!session?.user) {
    return <Loader dash="Settings" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-700 ">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <SettingsIcon className="w-16 h-16 mx-auto mb-3 opacity-90" />
                  <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                  <p className="text-blue-100 mt-2">Manage your profile and preferences</p>
                </div>
              </div>
            </div>

            {/* Profile Quick View */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  {isLoading ? (
                    <Skeleton circle={true} height={96} width={96} />
                  ) : (
                    <img
                      src={profileData?.profilePic || "mascot-head.png"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover ring-2 ring-blue-100"
                    />
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {isLoading ? <Skeleton width={180} /> : session?.user?.name}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{isLoading ? <Skeleton width={150} /> : session?.user?.email}</span>
                    </div>
                    {!isLoading && profileData?.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{profileData.location}</span>
                      </div>
                    )}
                  </div>
                  {!isLoading && profileData?.bio && (
                    <p className="text-gray-600 text-sm max-w-2xl">{profileData.bio}</p>
                  )}
                </div>

                {/* Edit/Save Buttons */}
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-blue-700 text-white py-2.5 px-5 rounded-lg hover:bg-gray-900 transition-all font-medium shadow-md hover:shadow-lg"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 py-2.5 px-5 rounded-lg hover:bg-gray-50 transition-all font-medium"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-blue-700 text-white py-2.5 px-5 rounded-lg hover:bg-gray-900 transition-all font-medium shadow-md hover:shadow-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                      {isNew ? "Complete" : "Edit"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          <SectionCard
            title="Personal Information"
            icon={User}
            sectionKey="personal"
            iconColor="bg-blue-100 text-blue-700"
          >
            {renderPersonalInfo()}
          </SectionCard>

          <SectionCard
            title="Social Media Links"
            icon={Globe}
            sectionKey="social"
            iconColor="bg-purple-100 text-purple-700"
          >
            {renderSocialLinks()}
          </SectionCard>

          <SectionCard
            title="Coding Platforms"
            icon={Code}
            sectionKey="coding"
            iconColor="bg-green-100 text-green-700"
          >
            {renderCodingProfiles()}
          </SectionCard>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Settings;