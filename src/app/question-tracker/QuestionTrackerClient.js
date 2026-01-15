"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserQuestions, updateQuestionStatus, getUserProgressStats } from "../../lib/questionTrackerApi";
import { ChevronDown, ChevronRight, ChevronLeft, Loader2, Search, Filter, Calendar, Award, BookOpen, Clock, CheckCircle, BookmarkIcon, AlertCircle, TrendingUp } from "lucide-react";
import Image from "next/image";
import Leaderboard from "../components/Leaderboard";

export default function QuestionTracker() {
  const { data: session, status } = useSession();
  const isLoaded = status !== "loading";
  const user = session?.user;
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState({ status: "", difficulty: "", search: "" });
  const [expandedTopics, setExpandedTopics] = useState({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [activeTab, setActiveTab] = useState("tracker");
  const [sortBy, setSortBy] = useState("topic");


  const sourceImgMap = {
    leetcode: "/leetcode.png",
    geeksforgeeks: "/gfg.png",
    practice: "/gfg.png",
    spoj: "/spoj.png",
    techiedelight: "/TechieDelight.png",
    programiz: "/programiz.png",
    baeldung: "/baeldung.png",
    hackerearth: "/hackerearth.png",
    hackerrank: "/hackerrank.png",
    tutorialspoint: "/tutorialspoint.png",
    onedrv: "/mascot-head.png",
  };



  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchQuestions();
      fetchStats();

    } else if (isLoaded) {
      setLoading(false);
    }
  }, [user?.id, isLoaded]);

  async function fetchQuestions() {
    setLoading(true);
    try {
      const data = await getUserQuestions(user?.id || "");
      setQuestions(data);

      const topicState = {};
      data.forEach((question) => {
        const topic = question.topic || "Uncategorized";
        topicState[topic] = false;
      });
      setExpandedTopics(topicState);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      const data = await getUserProgressStats(user?.id || "");
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  async function handleStatusChange(questionId, status, url = null) {
    try {
      await updateQuestionStatus(user?.id || "", questionId, status);
      setQuestions(questions.map((q) => (q.id === questionId ? { ...q, status } : q)));
      fetchStats();

      // Open question in new tab if URL is provided
      if (url && (status === "in_progress")) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  // Handle opening question via URL and tracking progress
  const handleQuestionClick = async (question) => {
    // Only update status if not already solved or in progress
    if (question.status !== "solved" && question.status !== "in_progress") {
      await handleStatusChange(question.id, "in_progress");
    }
    window.open(question.url, '_blank');
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesStatus = activeFilter.status === "" || q.status === activeFilter.status;
    const matchesDifficulty = activeFilter.difficulty === "" || q.difficulty === activeFilter.difficulty;
    const matchesSearch = activeFilter.search === "" ||
      q.problem.toLowerCase().includes(activeFilter.search.toLowerCase()) ||
      (q.topic && q.topic.toLowerCase().includes(activeFilter.search.toLowerCase()));

    return matchesStatus && matchesDifficulty && matchesSearch;
  });

  // Group questions by chosen sorting method
  const groupedQuestions = {};
  filteredQuestions.forEach((question) => {
    const groupKey = sortBy === "topic"
      ? (question.topic || "Uncategorized")
      : sortBy === "difficulty"
        ? (question.difficulty || "Unspecified")
        : question.source || "Unknown Source";

    if (!groupedQuestions[groupKey]) groupedQuestions[groupKey] = [];
    groupedQuestions[groupKey].push(question);
  });

  const toggleTopic = (topic) => {
    setExpandedTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveFilter({ status: "", search: "" });
  };

  if (!isLoaded || loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <div className="relative w-40 h-40 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/mascot.png"
                alt="Waving Mascot"
                width={120}
                height={120}
                className="animate-bounce"
              />
            </div>
            <div className="absolute inset-0">
              <svg className="animate-spin h-full w-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="3"
                  strokeDasharray="283"
                  strokeDashoffset="100"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-4 w-full text-center">
            <h3 className="text-xl font-bold text-gray-800">
              {!isLoaded || loading ? "Preparing Your Questions" : "Welcome to Question Tracker"}
            </h3>

            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-700 h-2 rounded-full animate-pulse" style={{ width: "70%" }}></div>
            </div>

            <p className="text-gray-600">
              Getting everything ready for you...
            </p>

            {isLoaded && !user && (
              <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
                <a
                  href="/sign-in"
                  className="px-6 py-3 bg-blue-700 text-white rounded-lg shadow-md hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-1 font-medium text-center"
                >
                  Sign In
                </a>
                <a
                  href="/sign-up"
                  className="px-6 py-3 bg-white text-blue-700 border border-blue-700 rounded-lg shadow-md hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 font-medium text-center"
                >
                  Create Account
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Navigation Tabs */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("tracker")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "tracker" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
          >
            <span className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Question Tracker
            </span>
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "leaderboard" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-800"
              }`}
          >
            <span className="flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Leaderboard
            </span>
          </button>
        </div>
      </div>

      {activeTab === "tracker" ? (
        <>
          {/* User Stats and Streak Section */}
          {stats && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Progress</h2>
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="text-sm text-blue-700 hover:text-gray-900 flex items-center"
                >
                  {showStats ? "Hide Details" : "Show Details"}
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${showStats ? "transform rotate-180" : ""}`} />
                </button>
              </div>

              {showStats && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main stats card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center">
                        <div className="p-2 bg-green-200 rounded-full mb-2">
                          <CheckCircle className="h-5 w-5 text-green-700" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-green-700">{stats.solved}</p>
                        <p className="text-xs sm:text-sm text-green-600 font-medium">Solved</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center">
                        <div className="p-2 bg-yellow-200 rounded-full mb-2">
                          <Clock className="h-5 w-5 text-yellow-700" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-yellow-700">{stats.inProgress}</p>
                        <p className="text-xs sm:text-sm text-yellow-600 font-medium">In Progress</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center">
                        <div className="p-2 bg-blue-200 rounded-full mb-2">
                          <BookmarkIcon className="h-5 w-5 text-blue-700" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-700">{stats.bookmarked}</p>
                        <p className="text-xs sm:text-sm text-blue-600 font-medium">Bookmarked</p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center">
                        <div className="p-2 bg-gray-200 rounded-full mb-2">
                          <AlertCircle className="h-5 w-5 text-gray-700" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-700">{stats.notStarted}</p>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">Not Started</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Overall Progress</h3>
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-xs font-semibold inline-block text-blue-700">
                              {stats.progressPercentage.toFixed(1)}% Complete
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-700">
                              {stats.solved} / {stats.solved + stats.inProgress + stats.bookmarked + stats.notStarted}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                          <div
                            style={{ width: `${stats.progressPercentage}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-700 rounded-full transition-all duration-500"
                          ></div>
                        </div>
                      </div>

                      {/* Topic Breakdown */}

                    </div>
                  </div>

                  {/* Streak & Recent Activity Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Recently Solved</h3>
                      <div className="space-y-2">
                        {filteredQuestions
                          .filter(q => q.status === "solved")
                          .slice(0, 3)
                          .map(question => (
                            <div key={question.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 flex-shrink-0 mr-3">
                                <Image
                                  src={sourceImgMap[question.source] || "/default-source.png"}
                                  alt={question.source}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                  {question.problem}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {question.topic || "Uncategorized"}
                                </p>
                              </div>
                            </div>
                          ))}
                        {filteredQuestions.filter(q => q.status === "solved").length === 0 && (
                          <div className="text-center p-4 text-sm text-gray-500">
                            No solved questions yet
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className={`relative flex-1 max-w-lg transition-all ${isSearchFocused ? "ring-2 ring-blue-200" : ""}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-700 focus:border-blue-700"
                  placeholder="Search questions, topics..."
                  value={activeFilter.search}
                  onChange={(e) => setActiveFilter({ ...activeFilter, search: e.target.value })}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {activeFilter.search && (
                  <button
                    onClick={() => setActiveFilter({ ...activeFilter, search: "" })}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <span className="text-gray-400 hover:text-gray-600">×</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="flex items-center space-x-2">
                  <select
                    className="border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm bg-gray-50 text-gray-900 focus:ring-blue-700 focus:border-blue-700"
                    value={activeFilter.status}
                    onChange={(e) => setActiveFilter({ ...activeFilter, status: e.target.value })}
                    aria-label="Filter by status"
                  >
                    <option value="">All Statuses</option>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="solved">Solved</option>
                    <option value="bookmarked">Bookmarked</option>
                  </select>
                </div>



                <div className="flex items-center space-x-2">
                  <select
                    className="border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm bg-gray-50 text-gray-900 focus:ring-blue-700 focus:border-blue-700"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort by"
                  >
                    <option value="topic">Group by Topic</option>

                    <option value="source">Group by Source</option>
                  </select>
                </div>

                {(activeFilter.status !== "" || activeFilter.search !== "") && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center"
                  >
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Groups */}
          {Object.keys(groupedQuestions).length > 0 ? (
            <div className="space-y-6">
              {Object.keys(groupedQuestions).sort().map((groupKey) => (
                <div
                  key={groupKey}
                  className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100 transition-all hover:shadow-md"
                >
                  <div
                    className="bg-white px-4 py-3 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100"
                    onClick={() => toggleTopic(groupKey)}
                  >
                    <h2 className="text-base sm:text-lg font-medium flex items-center text-gray-800">
                      {expandedTopics[groupKey] ? (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700 mr-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700 mr-2" />
                      )}
                      {groupKey}
                      <span className="ml-2 text-xs sm:text-sm font-normal text-gray-500">
                        ({groupedQuestions[groupKey].length} questions)
                      </span>
                    </h2>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {groupedQuestions[groupKey].filter((q) => q.status === "solved").length} solved
                      </span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {groupedQuestions[groupKey].filter((q) => q.status === "in_progress").length} in progress
                      </span>
                    </div>
                  </div>

                  {expandedTopics[groupKey] && (
                    <div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                          <thead className="bg-gray-50 hidden sm:table-header-group">
                            <tr>
                              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Problem
                              </th>
                              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Source
                              </th>

                              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {groupedQuestions[groupKey].map((question) => (
                              <tr key={question.id} className="flex flex-col sm:table-row hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-2 sm:px-6 sm:py-4 block sm:table-cell">
                                  <span className="sm:hidden font-medium text-gray-700">Problem: </span>
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleQuestionClick(question);
                                    }}
                                    className="text-blue-700 hover:text-gray-900 break-words hover:underline font-medium"
                                  >
                                    {question.problem}
                                  </a>
                                </td>
                                <td className="px-4 py-2 sm:px-6 sm:py-4 block sm:table-cell">
                                  <div className="flex items-center space-x-2">
                                    <Image
                                      src={sourceImgMap[question.source] || "/default-source.png"}
                                      alt={question.source}
                                      width={28}
                                      height={28}
                                      className="rounded-full border border-gray-200"
                                    />
                                    <span className="text-sm text-gray-600">{question.source}</span>
                                  </div>
                                </td>

                                <td className="px-4 py-2 sm:px-6 sm:py-4 block sm:table-cell">
                                  <span className="sm:hidden font-medium text-gray-700">Status: </span>
                                  <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${question.status === "solved" ? "bg-green-100 text-green-800" : ""
                                      } ${question.status === "in_progress" ? "bg-yellow-100 text-yellow-800" : ""
                                      } ${question.status === "bookmarked" ? "bg-blue-100 text-blue-800" : ""} ${question.status === "not_started" || !question.status
                                        ? "bg-gray-100 text-gray-800"
                                        : ""
                                      }`}
                                  >
                                    {question.status === "not_started" || !question.status
                                      ? "Not Started"
                                      : question.status === "in_progress"
                                        ? "In Progress"
                                        : question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-4 py-2 sm:px-6 sm:py-4 block sm:table-cell">
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => handleStatusChange(question.id, "in_progress", question.url)}
                                      className="flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                      <Clock className="w-3 h-3 mr-1" />
                                      Start
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(question.id, "solved")}
                                      className="flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Solved
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(question.id, "bookmarked", question.url)}
                                      className="flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                      <BookmarkIcon className="w-3 h-3 mr-1" />
                                      Bookmark
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(question.id, "not_started")}
                                      className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-blue-50 p-4 rounded-full">
                  {/*  */}
                </div>
                <p className="text-lg font-medium text-gray-700">No questions match your filter criteria</p>
                <p className="text-sm text-gray-500">Try adjusting your filters or add new questions</p>
                <button
                  onClick={resetFilters}
                  className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <Leaderboard limit={10} />
        </div>
      )}
    </div>
  );
}