import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  FaMapMarkerAlt, FaUniversity, FaEnvelope, FaBirthdayCake,
  FaGithub, FaMedal, FaInstagram, FaLinkedin,
  FaTwitter, FaGlobe, FaEdit, FaCopy, FaCheck
} from "react-icons/fa";
import {
  SiLeetcode, SiCodeforces, SiCodechef, SiGeeksforgeeks
} from "react-icons/si";

const InfoItemWithTooltip = ({ icon: Icon, text, link, className = "", tooltip }) => {
  const [copied, setCopied] = useState(false);

  if (!text) return null;

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div
      className={`group flex items-center space-x-2 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 min-h-[3rem] sm:min-h-[3.5rem] relative ${className}`}
      title={tooltip}
    >
      <div className="flex-shrink-0">
        <Icon className="text-gray-600 group-hover:text-indigo-600 w-4 h-4 sm:w-5 sm:h-5 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-gray-900 text-sm sm:text-base break-all group-hover:text-indigo-900 transition-colors">
          {text}
        </span>
      </div>
      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-indigo-100 rounded"
        title="Copy to clipboard"
      >
        {copied ? (
          <FaCheck className="w-3 h-3 text-green-600" />
        ) : (
          <FaCopy className="w-3 h-3 text-gray-500" />
        )}
      </button>
      {copied && (
        <div className="absolute -top-8 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg">
          Copied!
        </div>
      )}
    </div>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : content;
};

const SectionTitle = ({ icon: Icon, title, count }) => (
  <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-gray-200">
    <div className="flex items-center space-x-2">
      <Icon className="text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />
      <h3 className="text-sm sm:text-base font-semibold text-gray-800">{title}</h3>
      {count !== undefined && (
        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </div>
  </div>
);

const AnimatedProfilePic = ({ src, alt, showImage }) => {
  if (!showImage) return null;
  
  return (
    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-10">
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white hover:shadow-xl hover:scale-105 transition-all duration-300">
        <Image
          src={src || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740"}
          alt={alt}
          width={128}
          height={128}
          className="object-cover hover:scale-110 transition-transform duration-300"
          priority
        />
      </div>
    </div>
  );
};

export default function UserProfile({ profileData = {}, showImage = true }) {
  const router = useRouter();
  const isProfileTracker = router.pathname === '/profile-tracker';
  
  const {
    name,
    bio,
    profilePic,
    institute,
    primaryEmail,
    location,
    dateOfBirth,
    github,
    linkedin,
    twitter,
    instagram,
    portfolio,
    leetCode,
    codeforces,
    codechef,
    geeksforgeeks,
    createdAt
  } = profileData;

  // Personal information items with conditional rendering
  const personalInfoItems = [
    { icon: FaEnvelope, text: primaryEmail, tooltip: "Email Address" },
    { icon: FaMapMarkerAlt, text: location, tooltip: "Location" },
    { 
      icon: FaBirthdayCake, 
      text: dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : null, 
      tooltip: "Date of Birth" 
    },
    { icon: FaUniversity, text: institute, tooltip: "Institute" },
  ].filter(item => item.text);

  // Social links with conditional rendering
  const socialLinks = [
    { icon: FaGithub, name: "GitHub", link: github, tooltip: "GitHub Profile" },
    { icon: FaLinkedin, name: "LinkedIn", link: linkedin, tooltip: "LinkedIn Profile" },
    { icon: FaTwitter, name: "Twitter", link: twitter, tooltip: "Twitter Profile" },
    { icon: FaInstagram, name: "Instagram", link: instagram, tooltip: "Instagram Profile" },
    { icon: FaGlobe, name: "Portfolio", link: portfolio, tooltip: "Personal Website" },
  ].filter(item => item.link);

  // Coding profiles with conditional rendering
  const codingProfiles = [
    { 
      icon: SiLeetcode, 
      name: "LeetCode", 
      username: leetCode, 
      base: "https://leetcode.com",
      tooltip: "LeetCode Profile"
    },
    { 
      icon: SiCodeforces, 
      name: "Codeforces", 
      username: codeforces, 
      base: "https://codeforces.com/profile",
      tooltip: "Codeforces Profile"
    },
    { 
      icon: SiCodechef, 
      name: "CodeChef", 
      username: codechef, 
      base: "https://www.codechef.com/users",
      tooltip: "CodeChef Profile"
    },
    { 
      icon: SiGeeksforgeeks, 
      name: "GeeksforGeeks", 
      username: geeksforgeeks, 
      base: "https://auth.geeksforgeeks.org/user",
      tooltip: "GeeksforGeeks Profile"
    },
  ].filter(item => item.username);

  return (
    <div className="w-full mx-auto p-2 sm:p-3">
      <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-xl sm:shadow-2xl border border-gray-200 hover:shadow-3xl transition-shadow duration-300">

        {/* Header Section with Gradient Animation */}
        <div className="relative h-24 sm:h-32 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 animate-gradient-x">
          <AnimatedProfilePic 
            src={profilePic} 
            alt="Profile" 
            showImage={showImage} 
          />
          
          {/* Edit Button for Profile Tracker */}
          {isProfileTracker && (
            <button
              onClick={() => router.push('/settings')}
              className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group"
              title="Edit Profile"
            >
              <FaEdit className="w-4 h-4 text-gray-600 group-hover:text-indigo-600" />
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="px-3 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-6 relative z-0">
          <div className="text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 hover:text-indigo-900 transition-colors">
              {name || "Anonymous User"}
            </h2>
            {bio && (
              <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-xl mx-auto break-words leading-relaxed">
                {bio}
              </p>
            )}
          </div>

          <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
            
            {/* Personal Information Section */}
            {personalInfoItems.length > 0 && (
              <div className="animate-fade-in">
                <SectionTitle 
                  icon={FaEnvelope} 
                  title="Personal Information" 
                  count={personalInfoItems.length}
                />
                <div className="space-y-3 sm:space-y-4">
                  {personalInfoItems.map((item, index) => (
                    <InfoItemWithTooltip
                      key={index}
                      icon={item.icon}
                      text={item.text}
                      tooltip={item.tooltip}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Social Links Section */}
            {socialLinks.length > 0 && (
              <div className="animate-fade-in">
                <SectionTitle 
                  icon={FaGlobe} 
                  title="Social Links" 
                  count={socialLinks.length}
                />
                <div className="space-y-3 sm:space-y-4">
                  {socialLinks.map((item, index) => (
                    <InfoItemWithTooltip
                      key={index}
                      icon={item.icon}
                      text={item.link}
                      link={item.link}
                      tooltip={item.tooltip}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Coding Profiles Section */}
            {codingProfiles.length > 0 && (
              <div className="animate-fade-in">
                <SectionTitle 
                  icon={FaMedal} 
                  title="Coding Profiles" 
                  count={codingProfiles.length}
                />
                <div className="space-y-3 sm:space-y-4">
                  {codingProfiles.map((item, index) => (
                    <InfoItemWithTooltip
                      key={index}
                      icon={item.icon}
                      text={item.username}
                      link={`${item.base}/${item.username}`}
                      tooltip={item.tooltip}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {personalInfoItems.length === 0 && socialLinks.length === 0 && codingProfiles.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">📝</div>
                <p className="text-gray-500 text-sm">No profile information available</p>
                {isProfileTracker && (
                  <button
                    onClick={() => router.push('/settings')}
                    className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add Profile Information
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Member Since */}
          {createdAt && (
            <div className="mt-6 sm:mt-8 text-[10px] sm:text-xs text-gray-400 text-right border-t border-gray-100 pt-4">
              Member since: {new Date(createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
