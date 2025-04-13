"use client";

import { useState, useEffect } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';

export default function CodingContestTracker() {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['codeforces.com']);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [error, setError] = useState(null);
  
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
    
    try {
      const now = new Date();
      const nowString = now.toISOString().substring(0, 19);
      
      const todayStart = new Date();
      todayStart.setDate(todayStart.getDate() - 32);
      todayStart.setHours(0, 0, 0);
      const todayStartString = todayStart.toISOString().substring(0, 19);
     
      const cachedData = localStorage.getItem('contests');
      const timeStamp = localStorage.getItem('timeStamp');
      
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (cachedData && timeStamp && new Date(timeStamp) >= today) {
     
        setContests(JSON.parse(cachedData));
        setIsLoading(false);
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
        
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
      setError("Failed to load contests. Please try again later.");
      setIsLoading(false);
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
    
    setFilteredContests(filtered);
  }
  
  function formatDuration(durationInSeconds) {
    const minutes = Math.floor((durationInSeconds / 60) % 60);
    const hours = Math.floor((durationInSeconds / 3600) % 24);
    const days = Math.floor(durationInSeconds / 3600 / 24);
    
    let formattedDuration = '';
    if (days > 0) formattedDuration += `${days} day${days > 1 ? 's' : ''} `;
    if (hours > 0) formattedDuration += `${hours} hour${hours > 1 ? 's' : ''} `;
    if (minutes > 0) formattedDuration += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    
    return formattedDuration.trim();
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
    <div className="max-w-7xl mx-auto p-4">
   
      
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Filter Platforms</h2>
            <div className="flex flex-wrap gap-2">
              {Object.keys(platformLogos).map(platform => (
                <button
                  key={platform}
                  onClick={() => handlePlatformToggle(platform)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedPlatforms.includes(platform)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {platformDisplayNames[platform]}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Time Filter</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTodayOnly(true)}
                className={`px-4 py-2 rounded-md ${
                  showTodayOnly ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Today's Contests
              </button>
              <button
                onClick={() => setShowTodayOnly(false)}
                className={`px-4 py-2 rounded-md ${
                  !showTodayOnly ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Upcoming Contests
              </button>
            </div>
          </div>
          
          <button
            onClick={fetchContests}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Refresh Contests
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {showTodayOnly ? "Today's Contests" : "Upcoming Contests"}
          <span className="ml-2 text-gray-500 text-lg font-normal">
            ({filteredContests.length} contests)
          </span>
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : filteredContests.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-2xl mb-2"></p>
            <p className="text-lg">"First In First Out" says Queue,</p>
            <p className="text-lg">We have nothing to show you!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((contest, index) => {
              const [date, time] = formatDateTime(contest.start).split(', ');
              
              return (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg line-clamp-2 flex-1 mr-2">{contest.event}</h3>
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                          {platformLogos[contest.resource] ? (
                            <img 
                              src={`/${platformLogos[contest.resource]}`} 
                              alt={`${platformDisplayNames[contest.resource]} logo`} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-semibold text-xs">?</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 flex-grow">
                      <div className="mb-1"><span className="font-medium">Platform:</span> {platformDisplayNames[contest.resource]}</div>
                      <div className="mb-1"><span className="font-medium">Start:</span> {date} at {time}</div>
                      <div className="mb-1"><span className="font-medium">Duration:</span> {formatDuration(contest.duration)}</div>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => addToGoogleCalendar(contest)}
                        className="flex items-center text-blue-500 hover:text-blue-700"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Add to Calendar</span>
                      </button>
                      
                      <a 
                        href={contest.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-green-500 hover:text-green-700"
                      >
                        <span>Visit</span>
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}