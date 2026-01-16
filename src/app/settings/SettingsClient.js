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
  Edit3, RefreshCw, User, Mail, Save, X, MapPin, Calendar,
  Github, Linkedin, Twitter, Instagram, Globe, Code,
  Settings as SettingsIcon, ChevronRight, Info
} from "lucide-react";

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

  const profileCreationAttempted = useRef(false);

  useEffect(() => {
    if (!userId) return;
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      const userProfile = await db
        .select()
        .from(ProfileData)
        .where(eq(ProfileData.userId, userId))
        .then((results) => results[0] || null);

      if (!userProfile) {
        if (!profileCreationAttempted.current) {
          profileCreationAttempted.current = true;
          await db.insert(ProfileData).values({
            primaryEmail: session?.user?.email || "",
            name: session?.user?.name || "",
            userId: userId,
            createdAt: new Date().toISOString(),
          });
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
    const trimmedValue = name === 'bio' ? value.slice(0, 500) : value;
    setProfileData((prevData) => ({ ...prevData, [name]: trimmedValue }));
  };

  const updateCodingStats = async () => {
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

  const SectionCard = ({ title, icon: Icon, children, sectionKey }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-heading">{title}</h2>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${expandedSections[sectionKey] ? 'rotate-90' : ''
            }`}
        />
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-6 py-6 border-t border-slate-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
            Profile Picture URL
          </label>
          <input
            type="url"
            name="profilePic"
            value={profileData?.profilePic || ""}
            onChange={handleInputChange}
            placeholder="https://example.com/profile.jpg"
            className={`w-full p-2.5 bg-white border rounded-lg focus:outline-none focus:border-indigo-500 transition-all ${isEditing ? 'border-slate-300' : 'border-transparent bg-transparent pl-0'}`}
            disabled={!isEditing}
          />
          {isEditing && (
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Enter a URL for your profile picture
            </p>
          )}
        </div>

        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={profileData?.dateOfBirth || ""}
            onChange={handleInputChange}
            className={`w-full p-2.5 bg-white border rounded-lg focus:outline-none focus:border-indigo-500 transition-all ${isEditing ? 'border-slate-300' : 'border-transparent bg-transparent pl-0'}`}
            disabled={!isEditing}
          />
        </div>

        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={profileData?.location || ""}
            onChange={handleInputChange}
            placeholder="City, Country"
            className={`w-full p-2.5 bg-white border rounded-lg focus:outline-none focus:border-indigo-500 transition-all ${isEditing ? 'border-slate-300' : 'border-transparent bg-transparent pl-0'}`}
            disabled={!isEditing}
          />
        </div>

        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
          <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
            Institute
          </label>
          <input
            type="text"
            name="institute"
            value={profileData?.institute || ""}
            onChange={handleInputChange}
            placeholder="Your institute/university"
            className={`w-full p-2.5 bg-white border rounded-lg focus:outline-none focus:border-indigo-500 transition-all ${isEditing ? 'border-slate-300' : 'border-transparent bg-transparent pl-0'}`}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
        <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
          Bio
        </label>
        <textarea
          name="bio"
          value={profileData?.bio || ""}
          onChange={handleInputChange}
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={500}
          className={`w-full p-3 bg-white border rounded-lg focus:outline-none focus:border-indigo-500 transition-all resize-none ${isEditing ? 'border-slate-300' : 'border-transparent bg-transparent pl-0'}`}
          disabled={!isEditing}
        />
        {isEditing && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Max 500 characters
            </p>
            <span className="text-xs text-slate-400">
              {profileData?.bio?.length || 0} / 500
            </span>
          </div>
        )}
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
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg border border-indigo-100 shadow-sm">
            <Globe className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Connect Your Social Profiles</h4>
            <p className="text-xs text-slate-600">Add links to your social media profiles to showcase your online presence</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {socialLinks.map(({ name, icon: Icon, label, placeholder }) => (
          <div key={name} className="bg-slate-50 rounded-lg p-4 border border-slate-200 transition-all hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-slate-500" />
              {label}
            </label>
            <input
              type="url"
              name={name}
              value={profileData?.[name] || ""}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`w-full p-2.5 bg-white border rounded-lg focus:outline-none focus:border-indigo-500 transition-all ${isEditing ? 'border-slate-300' : 'border-transparent bg-transparent pl-0'}`}
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
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg border border-indigo-100 shadow-sm">
            <Code className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Coding Platform Profiles</h4>
            <p className="text-xs text-slate-600">Link your coding profiles to automatically sync and display your programming statistics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {codingPlatforms.map(({ name, label, icon, placeholder }) => (
          <div key={name} className="bg-slate-50 rounded-lg p-4 border border-slate-200 transition-all hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
            <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
              <span className="w-4 h-4 relative flex items-center justify-center">
                <img src={icon} alt={label} className="max-w-full max-h-full object-contain filter grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
              </span>
              {label} Username
            </label>
            <input
              type="text"
              name={name}
              value={profileData?.[name] || ""}
              onChange={handleInputChange}
              placeholder={placeholder}
              className={`w-full p-2.5 bg-white border rounded-lg focus:outline-none focus:border-indigo-500 transition-all ${isEditing ? 'border-slate-300' : 'border-transparent bg-transparent pl-0'}`}
              disabled={!isEditing}
            />
          </div>
        ))}
      </div>

      {!isEditing && (profileData?.leetCode || profileData?.codeforces || profileData?.codechef || profileData?.geeksforgeeks) && (
        <button
          onClick={handleRefreshCodingStats}
          className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-slate-900 transition-all font-semibold shadow-md hover:shadow-lg"
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
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
            <SettingsIcon className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-heading">Settings</h1>
            <p className="text-slate-500 text-sm">Manage your profile and account preferences</p>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100">
                {isLoading ? (
                  <Skeleton circle height="100%" />
                ) : (
                  <img
                    src={profileData?.profilePic || "mascot-head.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="flex-grow space-y-4 w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {isLoading ? <Skeleton width={200} /> : session?.user?.name}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                    <Mail className="w-4 h-4" />
                    {isLoading ? <Skeleton width={150} /> : session?.user?.email}
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white py-2 px-5 rounded-lg hover:bg-emerald-600 transition-all font-medium shadow-sm hover:shadow-md"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-slate-200 text-slate-700 py-2 px-5 rounded-lg hover:bg-slate-50 transition-all font-medium"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-2 px-5 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all font-medium shadow-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      {isNew ? "Complete Profile" : "Edit Profile"}
                    </button>
                  )}
                </div>
              </div>

              {!isLoading && profileData?.location && (
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {profileData.location}
                </div>
              )}
              {!isLoading && profileData?.bio && (
                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {profileData.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4">
          <SectionCard
            title="Personal Information"
            icon={User}
            sectionKey="personal"
          >
            {renderPersonalInfo()}
          </SectionCard>

          <SectionCard
            title="Social Media Links"
            icon={Globe}
            sectionKey="social"
          >
            {renderSocialLinks()}
          </SectionCard>

          <SectionCard
            title="Coding Platforms"
            icon={Code}
            sectionKey="coding"
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