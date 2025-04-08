import React from "react";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import {
  FaMapMarkerAlt, FaUniversity, FaEnvelope, FaBirthdayCake,
  FaGithub, FaMedal, FaInstagram, FaLinkedin,
  FaTwitter, FaGlobe,
} from "react-icons/fa";
import { SiLeetcode, SiCodeforces, SiCodechef, SiGeeksforgeeks } from "react-icons/si";

const InfoItem = ({ icon: Icon, text, link, className = "" }) => {
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

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-2 mb-3 sm:mb-4 pb-2 border-b border-gray-300">
    <Icon className="text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />
    <h3 className="text-sm sm:text-base font-medium text-gray-800">{title}</h3>
  </div>
);

export default function UserProfile({ profileData = {} }) {
  const { user } = useUser();

  return (
    <div className="w-full mx-auto p-2 sm:p-3">
      <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-xl sm:shadow-2xl border border-gray-200">
        {/* Header Section */}
        <div className="relative h-24 sm:h-32 bg-gradient-to-br from-gray-100 via-indigo-100 to-purple-100">
          {/* Profile Image Container */}
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white">
              <Image
                src={user.imageUrl}
                alt="User Profile"
                width={128}
                height={128}
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-3 sm:px-6 pt-16 sm:pt-20 pb-4 sm:pb-6 relative z-0">
          <div className="text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900">
              {profileData.name || "Anonymous User"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">@{profileData.clerkId}</p>
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
                <InfoItem icon={FaEnvelope} text={profileData.primaryEmail} />
                <InfoItem icon={FaMapMarkerAlt} text={profileData.location || "Location not specified"} />
                <InfoItem icon={FaBirthdayCake} text={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : "Birth date not specified"} />
                <InfoItem 
                  icon={FaUniversity} 
                  text="Indian Institute of Information Technology (IIIT), Bhagalpur" 
                  className="break-words"
                />
              </div>
            </div>

            <div>
              <SectionTitle icon={FaGlobe} title="Social Links" />
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: FaGithub, name: "github" },
                  { icon: FaLinkedin, name: "linkedin" },
                  { icon: FaTwitter, name: "twitter" },
                  { icon: FaInstagram, name: "instagram" },
                  { icon: FaGlobe, name: "portfolio" }
                ].map(({ icon, name }) => (
                  <InfoItem
                    key={name}
                    icon={icon}
                    text={profileData[name] || name.charAt(0).toUpperCase() + name.slice(1)}
                    link={profileData[name]}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionTitle icon={FaMedal} title="Coding Profiles" />
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: SiLeetcode, name: "leetCode", url: "leetcode.com" },
                  { icon: SiCodeforces, name: "codeforces", url: "codeforces.com/profile" },
                  { icon: SiCodechef, name: "codechef", url: "codechef.com/users" },
                  { icon: SiGeeksforgeeks, name: "geeksforgeeks", url: "auth.geeksforgeeks.org/user" }
                ].map(({ icon, name, url }) => (
                  <InfoItem
                    key={name}
                    icon={icon}
                    text={profileData[name] || name}
                    link={profileData[name] ? `https://${url}/${profileData[name]}` : undefined}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-[10px] sm:text-xs text-gray-400 text-right">
            Member since: {new Date(profileData.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
