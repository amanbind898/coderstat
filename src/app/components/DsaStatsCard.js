"use client";
import React, { useState, useMemo } from "react";
import { Trophy, Circle, AlertTriangle, Target, Info, ChevronDown, ChevronUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const StatItem = ({ icon: Icon, label, value, color, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="group relative p-4 sm:p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="absolute -top-3 -right-3 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 border border-gray-200 rounded-lg">
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
      </div>
      <div className="space-y-1 sm:space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
          {tooltip && (
            <div className="relative">
              <Info
                className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 cursor-help hover:text-gray-700 transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              />
              {showTooltip && (
                <div className="absolute -top-2 left-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-white shadow-lg border border-gray-200 text-gray-900 text-xs rounded-lg whitespace-nowrap z-10">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
};

const DsaDistributionChart = ({ stats }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Prepare data for pie chart
  const chartData = useMemo(() => [
    { name: 'Easy', value: stats.easyCount, color: '#22c55e' },  // green-500
    { name: 'Medium', value: stats.mediumCount, color: '#fb923c' }, // orange-400
    { name: 'Hard', value: stats.hardCount, color: '#ef4444' },  // red-500
    { name: 'Fundamental', value: stats.fundamentalCount, color: '#1d4ed8' }  // blue-700
  ].filter(item => item.value > 0), [stats]);

  const totalProblems = stats.totalDSASolved;
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const percentage = totalProblems > 0 ? ((value / totalProblems) * 100).toFixed(1) : 0;
      
      return (
        <div className="px-3 py-2 bg-white shadow-lg border border-black/10 rounded-lg text-xs">
          <p className="font-semibold">{name}</p>
          <p>{value} problems ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-sm font-medium text-gray-700">Problem Distribution</h3>
        {expanded ? 
          <ChevronUp className="w-4 h-4 text-gray-500" /> : 
          <ChevronDown className="w-4 h-4 text-gray-500" />
        }
      </div>
      
      {expanded && (
        <div className="mt-4 h-64 bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={450}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value) => <span className="text-xs text-gray-700">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

const PlatformBreakdown = ({ stats }) => {
  const [expanded, setExpanded] = useState(false);
  
  const leetcodeCount = parseInt(
    stats.statsArray.find(s => s.platform === 'LeetCode')?.solvedCount || 0,
    10
  );
  
  const gfgCount = parseInt(
    stats.statsArray.find(s => s.platform === 'GeeksforGeeks')?.solvedCount || 0,
    10
  );
  
  const total = stats.totalDSASolved;
  const leetcodePercentage = total > 0 ? (leetcodeCount / total) * 100 : 0;
  const gfgPercentage = total > 0 ? (gfgCount / total) * 100 : 0;
  
  return (
    <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-sm font-medium text-gray-700">Platform Breakdown</h3>
        {expanded ? 
          <ChevronUp className="w-4 h-4 text-gray-500" /> : 
          <ChevronDown className="w-4 h-4 text-gray-500" />
        }
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span>LeetCode</span>
              <span className="font-medium">{leetcodeCount} problems</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400"
                style={{ width: `${leetcodePercentage}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span>GeeksforGeeks</span>
              <span className="font-medium">{gfgCount} problems</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500"
                style={{ width: `${gfgPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DsaStatsCard = ({ stats }) => {
  const statsArray = Array.isArray(stats) ? stats : [];

  const totalStats = statsArray.reduce(
    (acc, platform) => {
      acc.totalSolved += parseInt(platform.solvedCount || 0, 10);
      acc.easyCount += parseInt(platform.easyCount || 0, 10);
      acc.mediumCount += parseInt(platform.mediumCount || 0, 10);
      acc.hardCount += parseInt(platform.hardCount || 0, 10);
      acc.fundamentalCount = parseInt(
        statsArray.find(s => s.platform === 'GeeksforGeeks')?.fundamentalCount || 0,
        10
      );
      acc.totalDSASolved = parseInt(
        statsArray.find(s => s.platform === 'LeetCode')?.solvedCount || 0,
        10
      ) + parseInt(
        statsArray.find(s => s.platform === 'GeeksforGeeks')?.solvedCount || 0,
        10
      );
      return acc;
    },
    { totalSolved: 0, easyCount: 0, mediumCount: 0, hardCount: 0, fundamentalCount: 0, totalDSASolved: 0 }
  );

  const enhancedStats = {
    ...totalStats,
    statsArray
  };

  return (
    <div className="w-full max-w-3xl p-4 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-lg">
      <div className="flex justify-between items-start mb-6 sm:mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">
            DSA Matrix
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest">LeetCode + GeeksforGeeks</p>
        </div>
        <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-blue-50 border border-blue-200">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-blue-700" />
        </div>
      </div>

      <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Total Problems Solved</span>
          <span className="text-2xl sm:text-3xl font-bold text-blue-700">
            {totalStats.totalDSASolved.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4">
        <StatItem
          icon={Circle}
          label="Easy"
          value={totalStats.easyCount}
          color="text-emerald-500"
        />
        <StatItem
          icon={AlertTriangle}
          label="Medium"
          value={totalStats.mediumCount}
          color="text-amber-500"
        />
        <StatItem
          icon={Target}
          label="Hard"
          value={totalStats.hardCount}
          color="text-rose-500"
        />
        <StatItem
          icon={Info}
          label="Fundamentals"
          value={totalStats.fundamentalCount}
          color="text-blue-700"
          tooltip="GFG Fundamental Problems"
        />
      </div>
      
      <DsaDistributionChart stats={enhancedStats} />
      <PlatformBreakdown stats={enhancedStats} />
    </div>
  );
};

export default DsaStatsCard;