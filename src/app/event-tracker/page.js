"use client";

import { useState, useEffect } from 'react';
import { Calendar, ExternalLink, RefreshCw, Filter, Clock } from 'lucide-react';

export default function CodingContestTracker() {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['codeforces.com']);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const platformLogos = {
    "codechef.com": "codechef.jpg",
    "codeforces.com": "codeforces.jpg",
    "atcoder.jp": "atcoder.png",
    "geeksforgeeks.org": "gfg.png",
    "naukri.com/code360": "naukri.png",
    "leetcode.com": "leetcode.png",
    "topcoder.com": "topcoder.png"
  };

  const platformDisplayNames = {
    "codechef.com": "CodeChef",
    "codeforces.com": "Codeforces",
    "atcoder.jp": "AtCoder",
    "geeksforgeeks.org": "GeeksForGeeks",
    "naukri.com/code360": "Naukri Code360",
    "leetcode.com": "LeetCode",
    "topcoder.com": "TopCoder"
  };
  
  useEffect(() => {
    try {
      const savedPlatforms = localStorage.getItem('selectedPlatforms');
      if (savedPlatforms) {
        setSelectedPlatforms(JSON.parse(savedPlatforms));
      }
    } catch (e) {
      console.error("Error loading saved platforms:", e);
    }
    
    fetchContests();
  }, []);
  
  useEffect(() => {
    filterContests();
    localStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms));
  }, [contests, selectedPlatforms, showTodayOnly]);
  
  async function fetchContests() {
    setIsLoading(true);
    setError(null);
    setIsRefreshing(true);
    
    try {
      const now = new Date();
      
      const todayStart = new Date();
      todayStart.setDate(todayStart.getDate() - 32);
      todayStart.setHours(0, 0, 0);
      
      const cachedData = localStorage.getItem('contests');
      const timeStamp = localStorage.getItem('timeStamp');
      
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (cachedData && timeStamp && new Date(timeStamp) >= today) {
        setContests(JSON.parse(cachedData));
      } else {
        const apiUrl = process.env.NEXT_PUBLIC_CLIST_API;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        setContests(data.objects);
        
        // Cache the results
        localStorage.setItem('contests', JSON.stringify(data.objects));
        localStorage.setItem('timeStamp', new Date().toString());
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
      setError("Failed to load contests. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }
  
  function filterContests() {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0);
    
    const filtered = contests.filter(contest => {
      const contestStart = new Date(contest.start);
      const contestEnd = new Date(contest.end);
      
      if (!selectedPlatforms.includes(contest.resource)) {
        return false;
      }
      
      if (showTodayOnly) {
        return contestEnd > now && contestStart < tomorrow;
      } else {
        return contestStart > now;
      }
    });
    
    // Sort by start date (nearest first)
    filtered.sort((a, b) => new Date(a.start) - new Date(b.start));
    
    setFilteredContests(filtered);
  }
  
  function formatDuration(durationInSeconds) {
    const minutes = Math.floor((durationInSeconds / 60) % 60);
    const hours = Math.floor((durationInSeconds / 3600) % 24);
    const days = Math.floor(durationInSeconds / 3600 / 24);
    
    let formattedDuration = '';
    if (days > 0) formattedDuration += `${days}d `;
    if (hours > 0) formattedDuration += `${hours}h `;
    if (minutes > 0) formattedDuration += `${minutes}m`;
    
    return formattedDuration.trim() || '< 1m';
  }
  
  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { 
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
  
  function getRelativeTimeString(dateTimeString) {
    const contestStart = new Date(dateTimeString);
    const now = new Date();
    
    const diffMs = contestStart - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} from now`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} from now`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} from now`;
    } else {
      return "Starting now";
    }
  }
  
  function handlePlatformToggle(platform) {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  }
  
  function addToGoogleCalendar(contest) {
    const startDate = new Date(contest.start);
    const endDate = new Date(contest.end);
    
    const formatForGCal = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
    };
    
    const startFormatted = formatForGCal(startDate);
    const endFormatted = formatForGCal(endDate);
    
    const eventUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.event)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent(`Coding contest on ${platformDisplayNames[contest.resource] || contest.resource}.\n\nLink: ${contest.href}`)}&location=${encodeURIComponent(contest.href)}`;
    
    window.open(eventUrl, '_blank');
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 pt-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Coding Contest Tracker</h1>
          <p className="text-gray-600 mt-2">Stay updated with upcoming coding competitions across platforms</p>
        </div>
        
        {/* Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Platform Filter */}
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-2 mb-3 text-gray-700">
                <Filter className="h-5 w-5" />
                <h2 className="font-semibold">Platforms</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(platformLogos).map(platform => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformToggle(platform)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      selectedPlatforms.includes(platform)
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {platformLogos[platform] && (
                      <div className="w-4 h-4 rounded-full overflow-hidden">
                        <img 
                          src={`/${platformLogos[platform]}`} 
                          alt={`${platformDisplayNames[platform]} logo`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span>{platformDisplayNames[platform]}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Time Filter */}
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-2 mb-3 text-gray-700">
                <Clock className="h-5 w-5" />
                <h2 className="font-semibold">Time Range</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTodayOnly(true)}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    showTodayOnly ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setShowTodayOnly(false)}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    !showTodayOnly ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Upcoming
                </button>
              </div>
            </div>
            
            {/* Refresh */}
            <div className="w-full lg:w-auto">
              <button
                onClick={fetchContests}
                disabled={isRefreshing}
                className={`w-full lg:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Contests'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Contest Cards */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {showTodayOnly ? "Today's Contests" : "Upcoming Contests"}
            </h2>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              {filteredContests.length} contest{filteredContests.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-12 text-red-500">
              <div className="mb-4 bg-red-50 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-lg font-medium">{error}</p>
            </div>
          ) : filteredContests.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12 text-gray-500">
              <div className="mb-4 bg-gray-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium">No contests found</p>
              <p className="mt-1">"First In First Out" says Queue,<br />We have nothing to show you!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContests.map((contest, index) => {
                const [date, time] = formatDateTime(contest.start).split(', ');
                const relativeTime = getRelativeTimeString(contest.start);
                const startDate = new Date(contest.start);
                const isStartingSoon = startDate - new Date() < 43200000; // 12 hours in ms
                
                return (
                  <div 
                    key={index} 
                    className={`border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      isStartingSoon 
                        ? 'border-orange-200 bg-orange-50' 
                        : 'border-gray-200 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <div className="p-5 flex flex-col h-full">
                      {/* Platform badge */}
                      <div className="flex justify-between items-start mb-3">
                        <div 
                          className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                            isStartingSoon ? 'bg-orange-100 text-orange-800' : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {platformLogos[contest.resource] && (
                            <div className="w-3 h-3 rounded-full overflow-hidden flex-shrink-0">
                              <img 
                                src={`/${platformLogos[contest.resource]}`} 
                                alt={`${platformDisplayNames[contest.resource]}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <span>{platformDisplayNames[contest.resource]}</span>
                        </div>
                        
                        {isStartingSoon && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-medium">
                            Soon
                          </span>
                        )}
                      </div>
                      
                      {/* Contest title */}
                      <h3 className="font-semibold text-lg line-clamp-2 mb-3 text-gray-800">{contest.event}</h3>
                      
                      {/* Contest details */}
                      <div className="text-sm flex-grow space-y-2">
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                          <div>
                            <div className="text-gray-700">{date}</div>
                            <div className="text-gray-500">{time}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <div>
                            <span className="text-gray-700">{formatDuration(contest.duration)}</span>
                            <span className="text-gray-500 text-xs ml-1">duration</span>
                          </div>
                        </div>
                        
                        <div className="text-sm font-medium">
                          {isStartingSoon ? (
                            <span className="text-orange-600">{relativeTime}</span>
                          ) : (
                            <span className="text-indigo-600">{relativeTime}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => addToGoogleCalendar(contest)}
                          className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                          <Calendar className="h-4 w-4 mr-1.5" />
                          <span>Add to Calendar</span>
                        </button>
                        
                        <a 
                          href={contest.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                          <span>Visit</span>
                          <ExternalLink className="h-4 w-4 ml-1.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}