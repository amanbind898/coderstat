"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserQuestions, updateQuestionStatus, getUserProgressStats } from "../../lib/questionTrackerApi";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";

export default function QuestionTracker() {
  const { user, isLoaded } = useUser();
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState({ status: "" });
  const [expandedTopics, setExpandedTopics] = useState({});

  const sourceimgmap = {
    leetcode: "/leetcode.png",
    geeksforgeeks: "/gfg.png",
    practice: "/gfg.png",
    spoj: "/spoj.png",
    techiedelight:"/TechieDelight.png",
    programiz: "/programiz.png",
    baeldung: "/baeldung.png",
    hackerearth: "/hackerearth.png",
    hackerrank: "/hackerrank.png",
    tutorialspoint: "/tutorialspoint.png",
    onedrv:"/mascot-head.png",
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
      if (url && (status === "in_progress" || status === "bookmarked")) {
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

  const filteredQuestions = questions.filter(
    (q) => activeFilter.status === "" || q.status === activeFilter.status
  );

  const questionsByTopic = {};
  filteredQuestions.forEach((question) => {
    const topic = question.topic || "Uncategorized";
    if (!questionsByTopic[topic]) questionsByTopic[topic] = [];
    questionsByTopic[topic].push(question);
  });

  const toggleTopic = (topic) => {
    setExpandedTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));
  };

  if (!isLoaded || loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100">
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
              <div className="w-full h-full rounded-full border-t-4 border-blue-500 animate-spin"></div>
            </div>
          </div>
          
          <div className="space-y-4 w-full text-center">
            <h3 className="text-xl font-bold text-gray-800">
              {!isLoaded || loading ? "Preparing Your Questions" : "Welcome to Question Tracker"}
            </h3>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "70%" }}></div>
            </div>
            
            <p className="text-gray-600">
              {!isLoaded || loading ? "Getting everything ready for you..." : "Please log in to continue"}
            </p>
            
            {isLoaded && !user && (
              <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
                <a
                  href="/sign-in"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 font-medium text-center"
                >
                  Sign In
                </a>
                <a
                  href="/sign-up"
                  className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 font-medium text-center"
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
      {stats && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Your Progress</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs sm:text-sm text-gray-600">Solved</p>
              <p className="text-lg sm:text-2xl font-bold">{stats.solved}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs sm:text-sm text-gray-600">In Progress</p>
              <p className="text-lg sm:text-2xl font-bold">{stats.inProgress}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs sm:text-sm text-gray-600">Bookmarked</p>
              <p className="text-lg sm:text-2xl font-bold">{stats.bookmarked}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="text-xs sm:text-sm text-gray-600">Not Started</p>
              <p className="text-lg sm:text-2xl font-bold">{stats.notStarted}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${stats.progressPercentage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-gray-600 text-sm">{stats.progressPercentage.toFixed(1)}% Complete</p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
        <select
          className="mt-1 block w-full sm:max-w-xs border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          value={activeFilter.status}
          onChange={(e) => setActiveFilter({ ...activeFilter, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="solved">Solved</option>
          <option value="bookmarked">Bookmarked</option>
        </select>
      </div>

      {/* Responsive Topic Sections */}
      {Object.keys(questionsByTopic).length > 0 ? (
        Object.keys(questionsByTopic).sort().map((topic) => (
          <div key={topic} className="mb-4 bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
            <div
              className="bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleTopic(topic)}
            >
              <h2 className="text-base sm:text-lg font-medium flex items-center">
                {expandedTopics[topic] ? (
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 mr-2" />
                )}
                {topic}
                <span className="ml-2 text-xs sm:text-sm font-normal text-gray-500">
                  ({questionsByTopic[topic].length} questions)
                </span>
              </h2>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {questionsByTopic[topic].filter((q) => q.status === "solved").length} solved
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {questionsByTopic[topic].filter((q) => q.status === "in_progress").length} in progress
                </span>
              </div>
            </div>

            {expandedTopics[topic] && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
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
                  <tbody className="bg-white divide-y divide-gray-200">
                    {questionsByTopic[topic].map((question) => (
                      <tr key={question.id} className="flex flex-col sm:table-row mb-4 sm:mb-0 hover:bg-gray-50">
                        <td className="px-4 py-2 sm:px-6 sm:py-4 block sm:table-cell">
                          <span className="sm:hidden font-medium">Problem: </span>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuestionClick(question);
                            }}
                            className="text-blue-600 hover:text-blue-900 break-words hover:underline"
                          >
                            {question.problem}
                          </a>
                        </td>
                        <td className="px-4 py-2 sm:px-6 sm:py-4 block sm:table-cell">
                         

                          <div className="flex items-center space-x-2">
                            <Image
                              src={sourceimgmap[question.source] || "/default-source.png"}
                              alt={question.source}
                              width={40}
                              height={40}
                              className="rounded-full border-2 border-gray-300 p-2"
                            />
                            <span className="text-sm text-gray-700">{question.source}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 sm:px-6 sm:py-4 block sm:table-cell">
                          <span className="sm:hidden font-medium">Status: </span>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              question.status === "solved" ? "bg-green-100 text-green-800" : ""
                            } ${
                              question.status === "in_progress" ? "bg-yellow-100 text-yellow-800" : ""
                            } ${question.status === "bookmarked" ? "bg-blue-100 text-blue-800" : ""} ${
                              question.status === "not_started" || !question.status
                                ? "bg-gray-100 text-gray-800"
                                : ""
                            }`}
                          >
                            {question.status === "not_started" || !question.status
                              ? "Not Started"
                              : question.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-4 py-2 sm:px-6 sm:py-4 block sm:table-cell">
                     
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleStatusChange(question.id, "not_started")}
                              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 active:scale-95 transition-transform duration-100 shadow-sm"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => handleStatusChange(question.id, "in_progress", question.url)}
                              className="px-3 py-1.5 text-sm font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200 active:scale-95 transition-transform duration-100 shadow-sm"
                            >
                              Start
                            </button>
                            <button
                              onClick={() => handleStatusChange(question.id, "solved")}
                              className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 active:scale-95 transition-transform duration-100 shadow-sm"
                            >
                              Solved
                            </button>
                            <button
                              onClick={() => handleStatusChange(question.id, "bookmarked", question.url)}
                              className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 active:scale-95 transition-transform duration-100 shadow-sm"
                            >
                              Bookmark
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center p-6 sm:p-10 bg-white rounded-lg shadow-md border border-gray-100">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="M9.5 2L12 5.5 14.5 2"></path>
                <path d="M5 10l7-7 7 7"></path>
                <path d="M21 10v12h-3"></path>
                <path d="M3 10v12h3"></path>
                <path d="M12 10v12"></path>
                <path d="M12 17h-2"></path>
                <path d="M12 14h-2"></path>
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-700">No questions match your filter criteria.</p>
            <p className="text-sm text-gray-500">Try adjusting your filters or add new questions.</p>
          </div>
        </div>
      )}
    </div>
  );
}