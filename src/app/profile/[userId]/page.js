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
  <div className="flex items-center space-x-2 mb-3 sm:mb-4 pb-2 border-b border-gray-300">
    <Icon className="text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />
    <h3 className="text-sm sm:text-base font-medium text-gray-800">{title}</h3>
  </div>
);

const NoDataCard = ({ message }) => (
  <Card className="bg-gray-50/80 backdrop-blur-sm shadow-lg transition-all duration-300">
    <CardContent className="flex items-center justify-center min-h-[12rem]">
      <p className="text-sm sm:text-base text-gray-500 px-4 text-center">{message}</p>
    </CardContent>
  </Card>
);

NoDataCard.propTypes = {
  message: PropTypes.string.isRequired,
};

export default function PublicProfile() {
  const params = useParams();
  const userId = params.userId;

  const [profileData, setProfileData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-[100vw] sm:max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-8 space-y-4">
              {/* Updated Profile Card with the first component's structure */}
              <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-xl sm:shadow-2xl border border-gray-200">
                {/* Header Section */}
                <div className="relative h-24 sm:h-32 bg-gradient-to-br from-gray-100 via-indigo-100 to-purple-100">
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

                {/* Content Section */}
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
                        {/* Personal Information Section */}
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

                        {/* Social Links Section */}
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

                        {/* Coding Profiles Section */}
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
            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100">
              <CardContent className="p-6 space-y-6">
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

            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100">
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
  );
}