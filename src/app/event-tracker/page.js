"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar as CalendarIcon, ExternalLink, RefreshCw, Filter, Clock, ChevronRight, Check, X } from 'lucide-react';
import ContestCalendar from '../components/ContestCalendar';
import Image from 'next/image';

const PLATFORM_LOGOS = {
  "codechef.com": "codechef.jpg",
  "codeforces.com": "codeforces.jpg",
  "atcoder.jp": "atcoder.png",
  "geeksforgeeks.org": "gfg.png",
  "naukri.com/code360": "naukri.png",
  "leetcode.com": "leetcode.png",
  "topcoder.com": "topcoder.png"
};
const PLATFORM_DISPLAY_NAMES = {
  "codechef.com": "CodeChef",
  "codeforces.com": "Codeforces",
  "atcoder.jp": "AtCoder",
  "geeksforgeeks.org": "GeeksForGeeks",
  "naukri.com/code360": "Naukri Code360",
  "leetcode.com": "LeetCode",
  "topcoder.com": "TopCoder"
};

// Convert UTC date to IST (UTC+5:30)
function convertToIST(date) {
  return new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000);
}

export default function CodingContestTracker() {
  const [contests, setContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['codeforces.com']);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounced localStorage update for selected platforms
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms));
    }, 300);
    return () => clearTimeout(timeout);
  }, [selectedPlatforms]);

  // Load persisted platform filter and fetch contests
  useEffect(() => {
    try {
      const savedPlatforms = localStorage.getItem('selectedPlatforms');
      if (savedPlatforms) setSelectedPlatforms(JSON.parse(savedPlatforms));
    } catch (e) { /* ignore */ }
    fetchContests();
    // eslint-disable-next-line
  }, []);

  // Filter contests whenever dependencies change
  useEffect(() => {
    filterContests();
    // eslint-disable-next-line
  }, [contests, selectedPlatforms, showTodayOnly]);

  // Fetch contests with caching
  const fetchContests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsRefreshing(true);
    try {
      const cachedData = localStorage.getItem('contests');
      const timeStamp = localStorage.getItem('timeStamp');
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      if (cachedData && timeStamp && new Date(timeStamp) >= today) {
        setContests(JSON.parse(cachedData));
      } else {
        const apiUrl = process.env.NEXT_PUBLIC_CLIST_API;
        if (!apiUrl) throw new Error("API URL is not defined.");
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API request failed: ${response.status}`);
        const data = await response.json();
        setContests(data.objects);
        localStorage.setItem('contests', JSON.stringify(data.objects));
        localStorage.setItem('timeStamp', new Date().toString());
      }
    } catch (error) {
      setError("Failed to load contests. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Filtering logic
  const filterContests = useCallback(() => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0);
    const filtered = contests.filter(contest => {
      const istContestStart = convertToIST(new Date(contest.start));
      const istContestEnd = convertToIST(new Date(contest.end));
      if (!selectedPlatforms.includes(contest.resource)) return false;
      if (showTodayOnly) {
        return istContestEnd > now && istContestStart < tomorrow;
      }
      return istContestStart > now;
    });
    filtered.sort((a, b) => new Date(a.start) - new Date(b.start));
    setFilteredContests(filtered);
  }, [contests, selectedPlatforms, showTodayOnly]);

  // Utility functions
  const formatDuration = useCallback((durationInSeconds) => {
    const minutes = Math.floor((durationInSeconds / 60) % 60);
    const hours = Math.floor((durationInSeconds / 3600) % 24);
    const days = Math.floor(durationInSeconds / 3600 / 24);
    let formatted = '';
    if (days > 0) formatted += `${days}d `;
    if (hours > 0) formatted += `${hours}h `;
    if (minutes > 0) formatted += `${minutes}m`;
    return formatted.trim() || '< 1m';
  }, []);

  const formatDateTime = useCallback((dateTimeString) => {
    const istDate = convertToIST(new Date(dateTimeString));
    return istDate.toLocaleString('en-US', {
      month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }, []);

  const getRelativeTimeString = useCallback((dateTimeString) => {
    const istContestStart = convertToIST(new Date(dateTimeString));
    const now = new Date();
    const diffMs = istContestStart - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) return `${diffDays}d left`;
    if (diffHours > 0) return `${diffHours}h left`;
    if (diffMins > 0) return `${diffMins}m left`;
    return "Starting now";
  }, []);

  // Platform toggle with useCallback for stable function reference
  const handlePlatformToggle = useCallback((platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  }, []);

  // Add to Google Calendar
  const addToGoogleCalendar = useCallback((contest) => {
    const startDate = new Date(contest.start);
    const endDate = new Date(contest.end);
    const formatForGCal = (date) =>
      date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
    const startFormatted = formatForGCal(startDate);
    const endFormatted = formatForGCal(endDate);
    const eventUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.event)}&dates=${startFormatted}/${endFormatted}&details=${encodeURIComponent(`Coding contest on ${PLATFORM_DISPLAY_NAMES[contest.resource] || contest.resource}.\n\nLink: ${contest.href}`)}&location=${encodeURIComponent(contest.href)}`;
    window.open(eventUrl, '_blank');
  }, []);

  // Memoized calendar events for performance
  const calendarEvents = useMemo(() =>
    filteredContests.map(contest => ({
      title: contest.event,
      start: convertToIST(new Date(contest.start)),
      end: convertToIST(new Date(contest.end)),
      resource: contest.resource,
      url: contest.href,
    })), [filteredContests]
  );

  const handleCalendarEventClick = useCallback((event) => {
    if (event.url) window.open(event.url, '_blank');
  }, []);

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 pt-8">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 font-heading">Event Tracker</h1>
            <p className="text-slate-500 mt-1 text-sm">Upcoming coding contests & hackathons</p>
          </div>
          <button
            onClick={fetchContests}
            disabled={isRefreshing}
            className={`px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2 ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Sync Events'}
          </button>
        </header>

        {/* Filters */}
        <section className="mb-6 space-y-4">
          {/* Time Filter Tabs */}
          <div className="flex justify-center md:justify-start">
            <div className="inline-flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
              <button
                onClick={() => setShowTodayOnly(false)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${!showTodayOnly ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All Upcoming
              </button>
              <button
                onClick={() => setShowTodayOnly(true)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${showTodayOnly ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Today
              </button>
            </div>
          </div>

          {/* Platform Filters */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(PLATFORM_LOGOS).map(platform => (
              <button
                key={platform}
                onClick={() => handlePlatformToggle(platform)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 border ${selectedPlatforms.includes(platform)
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
              >
                {selectedPlatforms.includes(platform) && <Check className="w-3 h-3" />}
                <span>{PLATFORM_DISPLAY_NAMES[platform]}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contest List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-500" />
                {showTodayOnly ? "Today's Schedule" : "Upcoming Events"}
              </h2>
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                {filteredContests.length} events
              </span>
            </div>

            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white rounded-xl border border-slate-100 animate-pulse"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-red-500 font-medium">{error}</p>
              </div>
            ) : filteredContests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                  <Filter className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-900 font-medium">No events found</p>
                <p className="text-slate-500 text-sm mt-1">Try adjusting your filters</p>
                <button
                  onClick={() => { setSelectedPlatforms(Object.keys(PLATFORM_LOGOS)); setShowTodayOnly(false); }}
                  className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContests.map((contest, index) => {
                  const istStartDate = convertToIST(new Date(contest.start));
                  const isStartingSoon = istStartDate - new Date() < 43200000; // 12 hours
                  const formattedDate = formatDateTime(contest.start);

                  return (
                    <div
                      key={index}
                      className="group bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center relative overflow-hidden"
                    >
                      {isStartingSoon && (
                        <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-1.5 flex-shrink-0">
                          {PLATFORM_LOGOS[contest.resource] ? (
                            <img
                              src={`/${PLATFORM_LOGOS[contest.resource]}`}
                              alt={contest.resource}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-indigo-100 rounded-md"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-slate-900 font-semibold leading-tight group-hover:text-indigo-600 transition-colors">
                            {contest.event}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formattedDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Filter className="w-3.5 h-3.5" />
                              {formatDuration(contest.duration)}
                            </span>
                            {isStartingSoon && (
                              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                Starting Soon
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-slate-50">
                        <button
                          onClick={() => addToGoogleCalendar(contest)}
                          className="flex-1 sm:flex-none px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-center"
                        >
                          Add to Calendar
                        </button>
                        <a
                          href={contest.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-indigo-600 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          Participate <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Calendar View (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm sticky top-24">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Calendar View</h3>
              <div className="calendar-container text-xs">
                <ContestCalendar events={calendarEvents} onEventClick={handleCalendarEventClick} />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-slate-400 text-xs">
          <p>Last synced: {new Date().toLocaleDateString()} • Powered by Clist API</p>
        </footer>
      </div>
    </div>
  );
}
