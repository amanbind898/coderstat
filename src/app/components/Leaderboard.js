"use client";
import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Activity, Clock } from 'lucide-react';

const Leaderboard = ({ limit = 10 }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('rank');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/leaderboard?limit=${limit}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch leaderboard');
      }
      
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [limit]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortedData = () => {
    if (!leaderboard.length) return [];
    
    return [...leaderboard].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'solvedCount':
          comparison = a.solvedCount - b.solvedCount;
          break;
        case 'lastSolvedDate':
          const dateA = a.lastSolvedDate ? new Date(a.lastSolvedDate) : new Date(0);
          const dateB = b.lastSolvedDate ? new Date(b.lastSolvedDate) : new Date(0);
          comparison = dateA - dateB;
          break;
        default:
          comparison = a.rank - b.rank;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const SortIcon = ({ active, direction }) => {
    return (
      <span className={`inline-block ml-1 ${active ? 'text-blue-500' : 'text-gray-400'}`}>
        {direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const SortableHeader = ({ column, label, icon }) => {
    const Icon = icon;
    return (
      <th 
        className="px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => handleSort(column)}
      >
        <div className="flex items-center space-x-1">
          {Icon && <Icon size={16} className="text-gray-500" />}
          <span>{label}</span>
          <SortIcon 
            active={sortBy === column} 
            direction={sortBy === column ? sortOrder : 'asc'} 
          />
        </div>
      </th>
    );
  };

  if (loading) {
    return (
      <div className="w-full p-8 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
          <div className="w-full max-w-2xl">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex w-full mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full mr-4"></div>
                <div className="h-12 flex-grow bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <div className="font-medium">Failed to load leaderboard</div>
          <div className="text-sm">{error}</div>
          <button 
            onClick={fetchLeaderboard}
            className="mt-3 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const sortedData = getSortedData();

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Trophy className="mr-2 text-yellow-500" size={24} />
          Top Problem Solvers
        </h2>
        <button
          onClick={fetchLeaderboard}
          className="text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-md transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path d="M17.6 10.37a6 6 0 100 3.26" />
          </svg>
          Refresh
        </button>
      </div>

      {sortedData.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-lg">No leaderboard data available yet</p>
          <p className="text-sm mt-2">Be the first to start solving problems!</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader column="rank" label="Rank" icon={Medal} />
                <SortableHeader column="name" label="Name" />
                <SortableHeader column="solvedCount" label="Solved" icon={Activity} />
                <SortableHeader column="lastSolvedDate" label="Last Solved" icon={Clock} />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((entry) => (
                <tr 
                  key={entry.clerkId} 
                  className={`hover:bg-gray-50 transition-colors ${
                    entry.rank <= 3 ? 'bg-gradient-to-r from-transparent to-yellow-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {entry.rank === 1 && (
                        <div className="flex justify-center items-center w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full mr-2">
                          <Trophy size={16} />
                        </div>
                      )}
                      {entry.rank === 2 && (
                        <div className="flex justify-center items-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full mr-2">
                          <Medal size={16} />
                        </div>
                      )}
                      {entry.rank === 3 && (
                        <div className="flex justify-center items-center w-8 h-8 bg-orange-100 text-orange-600 rounded-full mr-2">
                          <Medal size={16} />
                        </div>
                      )}
                      {entry.rank > 3 && (
                        <div className="flex justify-center items-center w-8 h-8 text-gray-500 mr-2">
                          {entry.rank}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{entry.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900 font-semibold">{entry.solvedCount}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-500">{formatDate(entry.lastSolvedDate)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;