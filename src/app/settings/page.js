"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useUser } from "@clerk/clerk-react";
import { db } from "../../db/index";
import { eq } from "drizzle-orm";
import { ProfileData } from "../../db/schema";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CodingPlatformStats } from "../../db/schema";
import { 
  Edit3, User, Mail, Key, Save, X, MapPin, Calendar,
  Github, Linkedin, Twitter, Instagram, Globe, Code, Award, Briefcase,
  Book, Feather, Bookmark, CheckCircle
} from "lucide-react";

function ProfilePage() {
  const { user } = useUser();
  const clerkUserId = user?.id;
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
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
          primaryEmail: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || "",
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
          geeksforgeeks: ""
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
        // Check if there's a last updated timestamp from platform stats
        try {
          const stats = await db
            .select()
            .from(CodingPlatformStats)
            .where(eq(CodingPlatformStats.clerkId, clerkUserId))
            .limit(1);
          
          if (stats && stats.length > 0 && stats[0].lastUpdated) {
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
    if (clerkUserId) fetchProfileData();
  }, [clerkUserId, fetchProfileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to update platform stats
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
          codechef: profileData.codechef
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update stats");
      }
      
      // Get current timestamp for last updated
      const now = new Date().toISOString();
      setStatsLastUpdated(now);
      
      // Update any db records if needed
      try {
        await db
          .update(CodingPlatformStats)
          .set({
            lastUpdated: now
          })
          .where(eq(CodingPlatformStats.clerkId, clerkUserId));
      } catch (err) {
        console.error("Error updating lastUpdated time:", err);
      }
      
      toast.success("Coding stats updated successfully!");
    } catch (error) {
      console.error("Error updating coding stats:", error);
      toast.error("Failed to update coding stats");
    }
  };

  // Check if coding profile usernames have changed
  const haveCodingProfilesChanged = (prevData) => {
    if (!prevData) return true;
    
    const platforms = ['leetCode', 'codeforces', 'codechef', 'geeksforgeeks'];
    return platforms.some(platform => 
      prevData[platform] !== profileData[platform]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    toast.info("Saving changes...");
    
    // Store the original profile data to check for changes
    const originalProfileData = { ...profileData };
    
    try {
      // Update profile data in the database
      await db
        .update(ProfileData)
        .set({
          ...profileData
        })
        .where(eq(ProfileData.clerkId, clerkUserId));

      // Check if any coding platform usernames were changed
      if (haveCodingProfilesChanged(originalProfileData)) {
        // Update platform stats automatically
        await updatePlatformStats();
      }

      setIsEditing(false);
      setIsNew(false);
      toast.success("Profile updated successfully!");
      
      // Refresh profile data to get any updates
      await fetchProfileData();
    } catch (error) {
      console.error("Error saving profile data:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfileHeader = () => (
    <div className="relative mb-8">
      <div className="h-40 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-t-lg" />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
        <div className="relative">
          {isLoading ? (
            <Skeleton circle={true} height={128} width={128} />
          ) : (
            <img
              src={user?.imageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          )}
          {!isLoading && (
            <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUserInfo = () => (
    <div className="mt-20 text-center space-y-2">
      <h1 className="text-2xl font-bold text-gray-800">
        {isLoading ? <Skeleton width={200} /> : user?.fullName}
      </h1>
      
      <div className="flex items-center justify-center gap-2 text-gray-600">
        <Mail className="w-4 h-4" />
        <span>{isLoading ? <Skeleton width={200} /> : user?.primaryEmailAddress?.emailAddress}</span>
      </div>
      
      {!isLoading && profileData?.location && (
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{profileData.location}</span>
        </div>
      )}
      
      {!isLoading && profileData?.bio && (
        <p className="text-gray-600 mt-4 max-w-md mx-auto">{profileData.bio}</p>
      )}
      
      {!isLoading && (
        <div className="flex justify-center mt-4 space-x-3">
          {profileData?.github && (
            <a href={profileData.github} target="_blank" rel="noopener noreferrer" 
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Github className="w-5 h-5 text-gray-700" />
            </a>
          )}
          {profileData?.linkedin && (
            <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Linkedin className="w-5 h-5 text-gray-700" />
            </a>
          )}
          {profileData?.twitter && (
            <a href={profileData.twitter} target="_blank" rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Twitter className="w-5 h-5 text-gray-700" />
            </a>
          )}
          {profileData?.portfolio && (
            <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer"
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Globe className="w-5 h-5 text-gray-700" />
            </a>
          )}
        </div>
      )}
    </div>
  );

  const tabs = useMemo(() => [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'social', label: 'Social Links', icon: Globe },
    { id: 'coding', label: 'Coding Profiles', icon: Code }
  ], []);

  const renderTabs = () => (
    <div className="border-b border-gray-200 mt-8">
      <nav className="flex justify-center flex-wrap">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`pb-4 px-4 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" /> Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={profileData?.dateOfBirth || ""}
            onChange={handleInputChange}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!isEditing}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" /> Location
          </label>
          <input
            type="text"
            name="location"
            value={profileData?.location || ""}
            onChange={handleInputChange}
            placeholder="Your location"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={!isEditing}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <Feather className="w-4 h-4 text-gray-500" /> Bio
        </label>
        <textarea
          name="bio"
          value={profileData?.bio || ""}
          onChange={handleInputChange}
          placeholder="Tell us about yourself"
          rows={4}
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={!isEditing}
        />
      </div>
    </div>
  );

  const socialLinks = [
    { name: 'github', icon: Github, label: 'GitHub' },
    { name: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { name: 'twitter', icon: Twitter, label: 'Twitter' },
    { name: 'instagram', icon: Instagram, label: 'Instagram' },
    { name: 'portfolio', icon: Globe, label: 'Portfolio' },
  ];

  const renderSocialLinks = () => (
    <div className="space-y-4">
      {socialLinks.map(({ name, icon: Icon, label }) => (
        <div key={name} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-500" /> {label}
          </label>
          <div className="flex">
            <div className="flex-shrink-0 bg-gray-100 flex items-center justify-center px-3 border border-r-0 border-gray-300 rounded-l-lg">
              <Icon className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="url"
              name={name}
              value={profileData?.[name] || ""}
              onChange={handleInputChange}
              placeholder={`Your ${label} URL`}
              className="flex-grow w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!isEditing}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const codingPlatforms = [
    { name: 'leetCode', label: 'LeetCode', icon: Code },
    { name: 'codeforces', label: 'Codeforces', icon: Code },
    { name: 'codechef', label: 'CodeChef', icon: Code },
    { name: 'geeksforgeeks', label: 'GeeksForGeeks', icon: Code }
  ];

  const renderCodingProfiles = () => (
    <div className="space-y-6">
      {codingPlatforms.map((platform) => (
        <div key={platform.name} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <platform.icon className="w-4 h-4 text-gray-500" /> {platform.label} Username
          </label>
          <div className="flex">
            <div className="flex-shrink-0 bg-gray-100 flex items-center justify-center px-3 border border-r-0 border-gray-300 rounded-l-lg">
              <platform.icon className="w-4 h-4 text-gray-500" />
            </div>
            <input
              name={platform.name}
              value={profileData?.[platform.name] || ""}
              onChange={handleInputChange}
              placeholder={`Enter your ${platform.label} username`}
              className="flex-grow w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!isEditing}
            />
          </div>
        </div>
      ))}
      
      {!isEditing && statsLastUpdated && (
        <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Stats last updated: {new Date(statsLastUpdated).toLocaleString()}
        </div>
      )}
      
      {!isEditing && !statsLastUpdated && profileData && (
        Object.keys(profileData).some(key => 
          ['leetCode', 'codeforces', 'codechef', 'geeksforgeeks'].includes(key) && 
          profileData[key]
        ) && (
          <div className="text-center text-sm text-gray-500">
            No stats available yet. They will update automatically when you save changes.
          </div>
        )
      )}
    </div>
  );

  // Progress indicator
  const calculateProfileCompletion = () => {
    if (!profileData) return 0;
    
    const fields = [
      'dateOfBirth', 'location', 'bio', 'github', 'linkedin', 
      'twitter', 'portfolio', 'leetCode', 'codeforces', 'codechef', 'geeksforgeeks'
    ];
    
    const completedFields = fields.filter(field => 
      profileData[field] && profileData[field].trim() !== ''
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
  };

  const completionPercentage = useMemo(() => 
    calculateProfileCompletion(), 
  [profileData]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-6">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {renderProfileHeader()}
          {renderUserInfo()}
          
          {/* Profile completion indicator */}
          {!isLoading && (
            <div className="px-6 mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Profile completion</span>
                <span className="text-sm font-medium text-blue-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {renderTabs()}
          
          <div className="p-6">
            {/* Edit/Save Buttons */}
            <div className="flex justify-end mb-6">
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors disabled:opacity-70"
                  >
                    {isSaving ? (
                      <>
                        <Save className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-70"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  {isNew ? "Complete Profile" : "Edit Profile"}
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'personal' && renderPersonalInfo()}
            {activeTab === 'social' && renderSocialLinks()}
            {activeTab === 'coding' && renderCodingProfiles()}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default ProfilePage;