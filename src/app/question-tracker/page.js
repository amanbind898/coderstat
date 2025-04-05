"use client"
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserQuestions, updateQuestionStatus, getUserProgressStats } from '../../lib/questionTrackerApi';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function QuestionTracker() {
  const { user } = useUser();
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState({ status: '' });
  const [expandedTopics, setExpandedTopics] = useState({});
  
  useEffect(() => {
    if (user?.id) {
      fetchQuestions();
      fetchStats();
    }
  }, [user?.id]);
  
  async function fetchQuestions() {
    setLoading(true);
    try {
      const data = await getUserQuestions(user?.id || '');
      setQuestions(data);
      
      // Initialize all topics as collapsed
      const topicState = {};
      data.forEach(question => {
        const topic = question.topic || 'Uncategorized';
        topicState[topic] = false; // Set each topic as initially collapsed
      });
      setExpandedTopics(topicState);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  }
  
  async function fetchStats() {
    try {
      const data = await getUserProgressStats(user?.id || '');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }
  
  async function handleStatusChange(questionId, status) {
    try {
      await updateQuestionStatus(user?.id || '', questionId, status);
      
      setQuestions(questions.map(q => {
        if (q.id === questionId) {
          return { ...q, status };
        }
        return q;
      }));
      
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }
  
  // Filter questions by status only
  const filteredQuestions = questions.filter(q => 
    activeFilter.status === '' || q.status === activeFilter.status
  );
  
  // Group questions by topic
  const questionsByTopic = {};
  filteredQuestions.forEach(question => {
    const topic = question.topic || 'Uncategorized';
    if (!questionsByTopic[topic]) {
      questionsByTopic[topic] = [];
    }
    questionsByTopic[topic].push(question);
  });
  
  // Toggle topic expansion
  const toggleTopic = (topic) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };
  
  if (loading) {
    return <div className="flex justify-center p-10">Loading questions...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      {stats && (
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Solved</p>
              <p className="text-2xl font-bold">{stats.solved}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Bookmarked</p>
              <p className="text-2xl font-bold">{stats.bookmarked}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Not Started</p>
              <p className="text-2xl font-bold">{stats.notStarted}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${stats.progressPercentage}%` }}
            ></div>
          </div>
          <p className="mt-2 text-gray-600">{stats.progressPercentage.toFixed(1)}% Complete</p>
        </div>
      )}
      
      <div className="mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
          <select 
            className="mt-1 block w-full max-w-xs border border-gray-300 rounded-md shadow-sm p-2"
            value={activeFilter.status}
            onChange={(e) => setActiveFilter({...activeFilter, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="solved">Solved</option>
            <option value="bookmarked">Bookmarked</option>
          </select>
        </div>
      </div>
      
      {/* Display questions grouped by topic with collapsible sections */}
      {Object.keys(questionsByTopic).length > 0 ? (
        Object.keys(questionsByTopic).sort().map(topic => (
          <div key={topic} className="mb-4 bg-white shadow rounded-lg overflow-hidden">
            <div 
              className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleTopic(topic)}
            >
              <h2 className="text-lg font-medium flex items-center">
                {expandedTopics[topic] ? (
                  <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                )}
                {topic} 
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({questionsByTopic[topic].length} questions)
                </span>
              </h2>
              <div className="flex space-x-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {questionsByTopic[topic].filter(q => q.status === 'solved').length} solved
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {questionsByTopic[topic].filter(q => q.status === 'in_progress').length} in progress
                </span>
              </div>
            </div>
            
            {expandedTopics[topic] && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {questionsByTopic[topic].map((question) => (
                      <tr key={question.id}>
                        <td className="px-6 py-4">
                          <div className="max-w-md break-words">
                            <a href={question.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900">
                              {question.problem}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${question.status === 'solved' ? 'bg-green-100 text-green-800' : ''}
                            ${question.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${question.status === 'bookmarked' ? 'bg-blue-100 text-blue-800' : ''}
                            ${question.status === 'not_started' || !question.status ? 'bg-gray-100 text-gray-800' : ''}
                          `}>
                            {question.status === 'not_started' || !question.status ? 'Not Started' : question.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusChange(question.id, 'not_started')}
                              className="text-xs px-2 py-1 border border-gray-300 rounded"
                            >
                              Reset
                            </button>
                            <button
                              onClick={() => handleStatusChange(question.id, 'in_progress')}
                              className="text-xs px-2 py-1 bg-yellow-100 border border-yellow-300 rounded"
                            >
                              Start
                            </button>
                            <button
                              onClick={() => handleStatusChange(question.id, 'solved')}
                              className="text-xs px-2 py-1 bg-green-100 border border-green-300 rounded"
                            >
                              Solve
                            </button>
                            <button
                              onClick={() => handleStatusChange(question.id, 'bookmarked')}
                              className="text-xs px-2 py-1 bg-blue-100 border border-blue-300 rounded"
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
        <div className="text-center p-10 bg-white rounded-lg shadow">
          <p>No questions match your filter criteria.</p>
        </div>
      )}
    </div>
  );
}