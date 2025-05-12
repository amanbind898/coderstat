"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, ExternalLink, RefreshCw, Filter, Clock } from 'lucide-react';
import ContestCalendar from '../components/ContestCalendar';

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
      month: '2-digit', day: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }) + ' IST';
  }, []);

  const getRelativeTimeString = useCallback((dateTimeString) => {
    const istContestStart = convertToIST(new Date(dateTimeString));
    const now = new Date();
    const diffMs = istContestStart - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} from now`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} from now`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} from now`;
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

  // Calendar event click handler
  const handleCalendarEventClick = useCallback((event) => {
    if (event.url) window.open(event.url, '_blank');
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 pt-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Coding Contest Tracker</h1>
          <p className="text-gray-600 mt-2">Stay updated with upcoming coding competitions across platforms</p>
        </header>

        {/* Filters */}
        <section className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-100" aria-label="Contest filters">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Platform Filter */}
            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-2 mb-3 text-gray-700">
                <Filter className="h-5 w-5" />
                <h2 className="font-semibold">Platforms</h2>
              </div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Platform filter">
                {Object.keys(PLATFORM_LOGOS).map(platform => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformToggle(platform)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 focus:outline-indigo-600 ${
                      selectedPlatforms.includes(platform)
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                    aria-pressed={selectedPlatforms.includes(platform)}
                    tabIndex={0}
                    aria-label={`Filter by ${PLATFORM_DISPLAY_NAMES[platform]}`}
                  >
                    {PLATFORM_LOGOS[platform] && (
                      <span className="w-4 h-4 rounded-full overflow-hidden">
                        <img
                          src={`/${PLATFORM_LOGOS[platform]}`}
                          alt={`${PLATFORM_DISPLAY_NAMES[platform]} logo`}
                          className="w-full h-full object-cover"
                        />
                      </span>
                    )}
                    <span>{PLATFORM_DISPLAY_NAMES[platform]}</span>
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
              <div className="flex gap-2" role="group" aria-label="Time range filter">
                <button
                  onClick={() => setShowTodayOnly(true)}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-indigo-600 ${
                    showTodayOnly ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={showTodayOnly}
                  tabIndex={0}
                  aria-label="Show today's contests"
                >
                  Today
                </button>
                <button
                  onClick={() => setShowTodayOnly(false)}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-indigo-600 ${
                    !showTodayOnly ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={!showTodayOnly}
                  tabIndex={0}
                  aria-label="Show all upcoming contests"
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
                aria-busy={isRefreshing}
                aria-label="Refresh contests"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Contests'}
              </button>
            </div>
          </div>
        </section>

        {/* Calendar Grid */}
        <section className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-100" aria-label="Contest calendar">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contest Calendar</h2>
          <ContestCalendar events={calendarEvents} onEventClick={handleCalendarEventClick} />
        </section>

        {/* Contest Cards */}
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-100" aria-label="Contest list">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {showTodayOnly ? "Today's Contests" : "Upcoming Contests"}
            </h2>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
              {filteredContests.length} contest{filteredContests.length !== 1 ? 's' : ''}
            </span>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64" aria-busy="true">
              <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center py-12 text-red-500" role="alert">
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
                const istStartDate = convertToIST(new Date(contest.start));
                const isStartingSoon = istStartDate - new Date() < 43200000; // 12 hours in ms
                return (
                  <article
                    key={index}
                    className={`border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg focus-within:ring-2 focus-within:ring-indigo-400 ${
                      isStartingSoon
                        ? 'border-orange-200 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-indigo-200'
                    }`}
                    tabIndex={0}
                    aria-label={`Contest: ${contest.event}`}
                  >
                    <div className="p-5 flex flex-col h-full">
                      {/* Platform badge */}
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${
                            isStartingSoon ? 'bg-orange-100 text-orange-800' : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {PLATFORM_LOGOS[contest.resource] && (
                            <span className="w-3 h-3 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={`/${PLATFORM_LOGOS[contest.resource]}`}
                                alt={`${PLATFORM_DISPLAY_NAMES[contest.resource]}`}
                                className="w-full h-full object-cover"
                              />
                            </span>
                          )}
                          <span>{PLATFORM_DISPLAY_NAMES[contest.resource]}</span>
                        </span>
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
                            <div className="text-gray-500">{time} IST</div>
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
                          <span className={isStartingSoon ? "text-orange-600" : "text-indigo-600"}>
                            {relativeTime}
                          </span>
                        </div>
                      </div>
                      {/* Action buttons */}
                      <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => addToGoogleCalendar(contest)}
                          className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-indigo-600"
                          aria-label="Add to Google Calendar"
                        >
                          <Calendar className="h-4 w-4 mr-1.5" />
                          <span>Add to Calendar</span>
                        </button>
                        <a
                          href={contest.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-indigo-600"
                          aria-label="Visit contest page"
                        >
                          <span>Visit</span>
                          <ExternalLink className="h-4 w-4 ml-1.5" />
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </footer>
      </div>
    </div>
  );
}
