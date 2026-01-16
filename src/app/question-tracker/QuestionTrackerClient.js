"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserQuestions, updateQuestionStatus, getUserProgressStats } from "../../lib/questionTrackerApi";
import { ChevronDown, ChevronRight, Loader2, Search, CheckCircle, BookmarkIcon, AlertCircle, Clock, BookOpen, Award } from "lucide-react";
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

      if (url && (status === "in_progress")) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  const handleQuestionClick = async (question) => {
    if (question.status !== "solved" && question.status !== "in_progress") {
      await handleStatusChange(question.id, "in_progress");
    }
    window.open(question.url, '_blank');
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesStatus = activeFilter.status === "" || q.status === activeFilter.status;
    const matchesSearch = activeFilter.search === "" ||
      q.problem.toLowerCase().includes(activeFilter.search.toLowerCase()) ||
      (q.topic && q.topic.toLowerCase().includes(activeFilter.search.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

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

  const resetFilters = () => {
    setActiveFilter({ status: "", search: "" });
  };

  if (!isLoaded || loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 bg-gray-50/50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your tracker...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl min-h-screen bg-transparent">
      {/* Navigation Tabs */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex bg-white rounded-xl p-1.5 border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab("tracker")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === "tracker" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <BookOpen className="w-4 h-4" />
            Question Tracker
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === "leaderboard" ? "bg-slate-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-50"
              }`}
          >
            <Award className="w-4 h-4" />
            Leaderboard
          </button>
        </div>
      </div>

      {activeTab === "tracker" ? (
        <>
          {/* User Stats Section */}
          {stats && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 font-heading">Your Progress</h2>
                  <p className="text-sm text-slate-500">Track your daily achievements</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main stats card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 lg:col-span-2 shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-emerald-50/50">
                      <CheckCircle className="h-6 w-6 text-emerald-600 mb-2" />
                      <span className="text-3xl font-bold text-slate-900 font-heading">{stats.solved}</span>
                      <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Solved</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                      <Clock className="h-6 w-6 text-amber-600 mb-2" />
                      <span className="text-3xl font-bold text-slate-900 font-heading">{stats.inProgress}</span>
                      <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">In Progress</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
                      <BookmarkIcon className="h-6 w-6 text-indigo-600 mb-2" />
                      <span className="text-3xl font-bold text-slate-900 font-heading">{stats.bookmarked}</span>
                      <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">Bookmarked</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                      <AlertCircle className="h-6 w-6 text-slate-400 mb-2" />
                      <span className="text-3xl font-bold text-slate-900 font-heading">{stats.notStarted}</span>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Pending</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">Overall Completion</span>
                      <span className="font-bold text-indigo-600">{stats.progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${stats.progressPercentage}%` }}
                        className="absolute left-0 top-0 h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Recently Solved */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-indigo-500" /> Recently Solved
                  </h3>
                  <div className="space-y-3">
                    {filteredQuestions
                      .filter(q => q.status === "solved")
                      .slice(0, 4)
                      .map(question => (
                        <div key={question.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                          <div className="w-8 h-8 flex-shrink-0 bg-white rounded-lg border border-slate-100 p-1">
                            <Image
                              src={sourceImgMap[question.source] || "/default-source.png"}
                              alt={question.source}
                              width={32}
                              height={32}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900 truncate">{question.problem}</p>
                            <p className="text-xs text-slate-500 truncate">{question.topic || "Uncategorized"}</p>
                          </div>
                        </div>
                      ))}
                    {filteredQuestions.filter(q => q.status === "solved").length === 0 && (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 mb-2">
                          <BookOpen className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-400">No solved questions yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-6 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="Search questions or topics..."
                  value={activeFilter.search}
                  onChange={(e) => setActiveFilter({ ...activeFilter, search: e.target.value })}
                />
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 lg:pb-0">
                <select
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                  value={activeFilter.status}
                  onChange={(e) => setActiveFilter({ ...activeFilter, status: e.target.value })}
                >
                  <option value="">All Statuses</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="solved">Solved</option>
                  <option value="bookmarked">Bookmarked</option>
                </select>

                <select
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="topic">Group by Topic</option>
                  <option value="source">Group by Source</option>
                </select>

                {(activeFilter.status !== "" || activeFilter.search !== "") && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question List */}
          {Object.keys(groupedQuestions).length > 0 ? (
            <div className="space-y-4">
              {Object.keys(groupedQuestions).sort().map((groupKey) => (
                <div key={groupKey} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className="px-4 py-3 bg-white flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                    onClick={() => toggleTopic(groupKey)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedTopics[groupKey] ? (
                        <ChevronDown className="h-4 w-4 text-indigo-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}

                      <div className="flex items-baseline gap-2">
                        <h3 className="font-semibold text-slate-900">{groupKey}</h3>
                        <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                          {groupedQuestions[groupKey].length}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-md border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-medium text-emerald-700">
                          {groupedQuestions[groupKey].filter((q) => q.status === "solved").length} done
                        </span>
                      </div>
                    </div>
                  </div>

                  {expandedTopics[groupKey] && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 font-medium">
                          <tr>
                            <th className="px-4 py-3 w-1/2">Problem</th>
                            <th className="px-4 py-3">Source</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {groupedQuestions[groupKey].map((question) => (
                            <tr key={question.id} className="group hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3">
                                <a
                                  href={question.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => {
                                    handleQuestionClick(question);
                                  }}
                                  className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors block"
                                >
                                  {question.problem}
                                </a>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                  <Image
                                    src={sourceImgMap[question.source] || "/default-source.png"}
                                    alt={question.source}
                                    width={20}
                                    height={20}
                                    className="rounded-full"
                                  />
                                  <span className="text-xs text-slate-500">{question.source}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${question.status === "solved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                    question.status === "in_progress" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                      question.status === "bookmarked" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                                        "bg-slate-100 text-slate-500 border border-slate-200"
                                    }`}
                                >
                                  {question.status === "not_started" || !question.status
                                    ? "Pending"
                                    : question.status === "in_progress" ? "In Progress" : question.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleStatusChange(question.id, "solved")}
                                    title="Mark as Solved"
                                    className={`p-1.5 rounded-md transition-colors ${question.status === "solved" ? "bg-emerald-100 text-emerald-700" : "hover:bg-emerald-50 text-slate-400 hover:text-emerald-600"}`}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(question.id, "in_progress", question.url)}
                                    title="Start / In Progress"
                                    className={`p-1.5 rounded-md transition-colors ${question.status === "in_progress" ? "bg-amber-100 text-amber-700" : "hover:bg-amber-50 text-slate-400 hover:text-amber-600"}`}
                                  >
                                    <Clock className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(question.id, "bookmarked", question.url)}
                                    title="Bookmark"
                                    className={`p-1.5 rounded-md transition-colors ${question.status === "bookmarked" ? "bg-indigo-100 text-indigo-700" : "hover:bg-indigo-50 text-slate-400 hover:text-indigo-600"}`}
                                  >
                                    <BookmarkIcon className="w-4 h-4" />
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
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 dashed text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No questions found</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <Leaderboard limit={10} />
        </div>
      )}
    </div>
  );
}