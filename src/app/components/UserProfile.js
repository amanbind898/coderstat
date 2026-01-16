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
      className={`group flex items-center space-x-2 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all duration-300 min-h-[3rem] sm:min-h-[3.5rem] shadow-sm hover:shadow-md relative ${className}`}
      title={tooltip}
    >
      <div className="flex-shrink-0">
        <Icon className="text-slate-400 group-hover:text-indigo-600 w-4 h-4 sm:w-5 sm:h-5 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-slate-600 text-sm sm:text-base break-all group-hover:text-slate-900 transition-colors font-medium">
          {text}
        </span>
      </div>
      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-indigo-50 rounded-lg"
        title="Copy to clipboard"
      >
        {copied ? (
          <FaCheck className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <FaCopy className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>
      {copied && (
        <div className="absolute -top-10 right-0 bg-indigo-600 text-white text-[10px] px-2.5 py-1 rounded-md shadow-lg font-bold animate-in fade-in slide-in-from-bottom-2">
          COPIED!
        </div>
      )}
    </div>
  );

  return link ? (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block transform hover:-translate-y-0.5 transition-transform">
      {content}
    </a>
  ) : content;
};

const SectionTitle = ({ icon: Icon, title, count }) => (
  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
    <div className="flex items-center space-x-2">
      <div className="p-1.5 bg-indigo-50 rounded-lg">
        <Icon className="text-indigo-600 w-4 h-4" />
      </div>
      <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider font-heading">{title}</h3>
      {count !== undefined && (
        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
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
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 ring-1 ring-slate-200">
        <Image
          src={src || "/mascot-head.png"}
          alt={alt}
          width={128}
          height={128}
          className="object-cover hover:scale-110 transition-transform duration-300 w-full h-full"
          priority
        />
      </div>
    </div>
  );
};

export default function UserProfile({ profileData = {}, showImage = true, isEditing = false }) {
  const router = useRouter();

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
    <div className="w-full mx-auto p-0">
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 hover:border-slate-200 transition-all duration-300">

        {/* Header Section */}
        <div className="relative h-24 sm:h-32 bg-slate-100">
          {/* Subtle pattern background */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <AnimatedProfilePic
            src={profilePic}
            alt="Profile"
            showImage={showImage}
          />

          {/* Edit Button for Profile Tracker */}
          {isEditing && (
            <button
              onClick={() => router.push('/settings')}
              className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-50 transition-all duration-200 group border border-slate-100"
              title="Edit Profile"
            >
              <FaEdit className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="px-4 sm:px-8 pt-16 sm:pt-20 pb-6 sm:pb-8 relative z-0">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
              {name || "Anonymous User"}
            </h2>
            {bio && (
              <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed italic">
                "{bio}"
              </p>
            )}
          </div>

          <div className="space-y-8 sm:space-y-10">

            {/* Personal Information Section */}
            {personalInfoItems.length > 0 && (
              <div>
                <SectionTitle
                  icon={FaEnvelope}
                  title="Contact Information"
                  count={personalInfoItems.length}
                />
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
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
              <div>
                <SectionTitle
                  icon={FaGlobe}
                  title="Social Links"
                  count={socialLinks.length}
                />
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
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
              <div>
                <SectionTitle
                  icon={FaMedal}
                  title="Coding Profiles"
                  count={codingProfiles.length}
                />
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
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
              <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="text-slate-900 font-bold mb-1">Your profile is feeling a bit empty</h3>
                <p className="text-slate-500 text-sm mb-6">Add your social links and coding usernames to showcase your work.</p>
                {isEditing && (
                  <button
                    onClick={() => router.push('/settings')}
                    className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    Complete Profile
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Member Since */}
          {createdAt && (
            <div className="mt-10 sm:mt-12 text-[10px] text-slate-400 text-center border-t border-slate-100 pt-6 font-bold uppercase tracking-widest">
              Journey began on {new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

