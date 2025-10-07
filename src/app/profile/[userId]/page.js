"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import PropTypes from "prop-types";
import {
  FaMapMarkerAlt, FaUniversity, FaEnvelope, FaBirthdayCake,
  FaGithub, FaMedal, FaInstagram, FaLinkedin,
  FaTwitter, FaGlobe,
} from "react-icons/fa";
import {
  SiLeetcode, SiCodeforces, SiCodechef, SiGeeksforgeeks
} from "react-icons/si";

import PlatformCards from "../../components/PlatfromCards";
import DsaStatsCard from "../../components/DsaStatsCard";
import CPStatsCard from "../../components/CPStatsCard";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Info Item component from the first component
const InfoItem = ({ icon: Icon, text, link, className = "" }) => {
  if (!text) return null;

  const content = (
    <div className={`flex items-center space-x-2 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-gray-100 border border-gray-300 hover:border-gray-400 hover:bg-gray-200 transition-all duration-300 min-h-[3rem] sm:min-h-[3.5rem] ${className}`}>
      <div className="flex-shrink-0">
        <Icon className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-gray-900 text-sm sm:text-base break-all">{text}</span>
      </div>
    </div>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : content;
};

// Section Title component from the first component
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-2 mb-3 sm:mb-4 pb-2 border-b-2 border-blue-200">
    <div className="p-1.5 bg-blue-50 rounded-lg">
      <Icon className="text-blue-700 w-4 h-4 sm:w-5 sm:h-5" />
    </div>
    <h3 className="text-sm sm:text-base font-bold text-gray-900">{title}</h3>
  </div>
);

const NoDataCard = ({ message }) => (
  <Card className="bg-gray-50/80 backdrop-blur-sm shadow-lg transition-all duration-300">
    <CardContent className="flex items-center justify-center min-h-[12rem]">
      <p className="text-sm sm:text-base text-gray-500 px-4 text-center">{message}</p>
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

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const data = await response.json();
        setProfileData(data.profile);
        setUserData(data.stats);
      } catch (err) {
        console.error("Error fetching public profile:", err);
        setError("Profile not found or is not public");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchPublicProfileData();
  }, [userId]);

  // Show CTA modal after 5 seconds if user hasn't dismissed it before
  useEffect(() => {
    const hasSeenCTA = localStorage.getItem('coderstar_cta_dismissed');
    
    if (!hasSeenCTA && !isLoading && !error) {
      const timer = setTimeout(() => {
        setShowCTAModal(true);
      }, 5000); // Show after 5 seconds

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <Skeleton className="h-[500px] rounded-xl" />
          </div>
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-[180px] rounded-xl" />
            <Skeleton className="h-[350px] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 pt-20 pb-12 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Image src="/mascot.png" alt="Mascot" width={120} height={120} className="mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
            <p className="text-gray-600 mb-6">This profile may not exist or is not set to public.</p>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-4">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-xl sm:shadow-2xl border border-gray-200">
                <div className="relative h-24 sm:h-32 bg-gradient-to-r from-blue-600 to-blue-700">
                  {profileData && (
                    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-10">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white">
                        <Image
                          src={profileData.profilePic || "https://i.postimg.cc/3NNXX6kQ/mascot-head.png"}
                          alt={profileData.name || "User"}
                          width={128}
                          height={128}
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-3 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-6 relative z-0">
                  {profileData ? (
                    <>
                      <div className="text-center">
                        <h2 className="text-xl sm:text-3xl font-bold text-gray-900">
                          {profileData.name || "Anonymous User"}
                        </h2>
                        {profileData.bio && (
                          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-xl mx-auto break-words">
                            {profileData.bio}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
                        <div>
                          <SectionTitle icon={FaEnvelope} title="Personal Information" />
                          <div className="space-y-3 sm:space-y-4">
                            {profileData.primaryEmail && <InfoItem icon={FaEnvelope} text={profileData.primaryEmail} />}
                            <InfoItem icon={FaMapMarkerAlt} text={profileData.location || "Location not specified"} />
                            <InfoItem
                              icon={FaBirthdayCake}
                              text={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : "Birth date not specified"}
                            />
                            <InfoItem
                              icon={FaUniversity}
                              text={profileData.institute || "Institute not specified"}
                            />
                          </div>
                        </div>

                        <div>
                          <SectionTitle icon={FaGlobe} title="Social Links" />
                          <div className="space-y-3 sm:space-y-4">
                            {[
                              { icon: FaGithub, name: "github", link: profileData.github },
                              { icon: FaLinkedin, name: "linkedin", link: profileData.linkedin },
                              { icon: FaTwitter, name: "twitter", link: profileData.twitter },
                              { icon: FaInstagram, name: "instagram", link: profileData.instagram },
                              { icon: FaGlobe, name: "portfolio", link: profileData.portfolio },
                            ].map(({ icon, name, link }) => (
                              <InfoItem
                                key={name}
                                icon={icon}
                                text={link ? link : `${name.charAt(0).toUpperCase() + name.slice(1)}`}
                                link={link}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <SectionTitle icon={FaMedal} title="Coding Profiles" />
                          <div className="space-y-3 sm:space-y-4">
                            {[
                              { icon: SiLeetcode, name: "leetCode", username: profileData.leetCode, base: "https://leetcode.com" },
                              { icon: SiCodeforces, name: "codeforces", username: profileData.codeforces, base: "https://codeforces.com/profile" },
                              { icon: SiCodechef, name: "codechef", username: profileData.codechef, base: "https://www.codechef.com/users" },
                              { icon: SiGeeksforgeeks, name: "geeksforgeeks", username: profileData.geeksforgeeks, base: "https://auth.geeksforgeeks.org/user" },
                            ].map(({ icon, name, username, base }) => (
                              <InfoItem
                                key={name}
                                icon={icon}
                                text={username || name}
                                link={username ? `${base}/${username}` : undefined}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {profileData.createdAt && (
                        <div className="mt-6 sm:mt-8 text-[10px] sm:text-xs text-gray-400 text-right">
                          Member since: {new Date(profileData.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </>
                  ) : (
                    <NoDataCard message="No profile data available" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-gray-900 rounded-2xl shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiAxNGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTM2IDQ0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnpNNiA0NGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
              
              <div className="relative px-6 py-12 sm:px-12 sm:py-16">
                <div className="flex flex-col items-center text-center gap-4">
                  {profileData?.profilePic && (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white/30 shadow-2xl overflow-hidden bg-white ring-4 ring-white/20">
                      <Image
                        src={profileData.profilePic}
                        alt={profileData.name || "User"}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <span className="text-blue-200 text-lg sm:text-xl font-medium tracking-wide">the</span>
                      <span className="text-yellow-300 text-2xl sm:text-3xl font-black tracking-tight drop-shadow-lg">coderSTAR</span>
                      <span className="text-blue-200 text-lg sm:text-xl font-medium">:</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                      {profileData?.name || 'Anonymous User'}
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto">
                      {profileData?.bio || 'Coding achievements and statistics'}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center mt-4">
                    {profileData?.location && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                        <div className="flex items-center gap-2 text-white">
                          <FaMapMarkerAlt className="w-4 h-4" />
                          <span className="text-sm font-medium">{profileData.location}</span>
                        </div>
                      </div>
                    )}
                    {profileData?.institute && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                        <div className="flex items-center gap-2 text-white">
                          <FaUniversity className="w-4 h-4" />
                          <span className="text-sm font-medium">{profileData.institute}</span>
                        </div>
                      </div>
                    )}
                    {userData && Array.isArray(userData) && userData.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                        <div className="flex items-center gap-2 text-white">
                          <FaMedal className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {parseInt(userData.find(s => s.platform === 'LeetCode')?.solvedCount || 0) + 
                             parseInt(userData.find(s => s.platform === 'GeeksforGeeks')?.solvedCount || 0)} Problems Solved
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Statistics Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Performance across all platforms</p>
              </div>
              
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200">
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

            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Platform Progress</h2>
                <p className="text-sm text-gray-500 mt-1">Detailed breakdown by platform</p>
              </div>
              
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200">
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

      {/* CTA Modal */}
      {showCTAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCloseCTA}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl max-w-lg w-full p-8 transform animate-slideUp">
            {/* Close Button */}
            <button
              onClick={handleCloseCTA}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="text-center mb-8">
              <div className="mb-4">
                <span className="text-6xl">🌟</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Love This Profile?
              </h2>
              <p className="text-gray-600 text-lg mb-2">
                Create your own <span className="font-bold text-yellow-600">coderSTAR</span> profile
              </p>
              <p className="text-gray-500 text-sm">
                Track your coding journey across LeetCode, CodeChef, Codeforces & more!
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Auto-sync stats from all platforms</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Beautiful shareable profile page</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Track questions & maintain streaks</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseCTA}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-all"
              >
                Maybe Later
              </button>
              <a
                href="/"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-gray-900 shadow-lg hover:shadow-xl transition-all text-center"
              >
                Create Profile ✨
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}