"use client";
import React, { useState, useMemo } from "react";
import { Trophy, Circle, AlertTriangle, Target, Info, ChevronDown, ChevronUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const StatItem = ({ icon: Icon, label, value, colorType }) => {
  // Map types to solid flat colors
  const colors = {
    green: "text-emerald-600 bg-emerald-50",
    yellow: "text-amber-600 bg-amber-50",
    red: "text-rose-600 bg-rose-50",
    blue: "text-indigo-600 bg-indigo-50",
    gray: "text-slate-600 bg-slate-50",
  }[colorType] || "text-slate-600 bg-slate-50";

  const iconColor = colors.split(" ")[0];
  const bgColor = colors.split(" ")[1];

  return (
    <div className="flex flex-col p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${bgColor}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-slate-900 font-heading">
        {value.toLocaleString()}
      </div>
    </div>
  );
};

const DsaDistributionChart = ({ stats }) => {
  const [expanded, setExpanded] = useState(false);

  const chartData = useMemo(() => [
    { name: 'Easy', value: stats.easyCount, color: '#10b981' },   // emerald-500
    { name: 'Medium', value: stats.mediumCount, color: '#f59e0b' }, // amber-500
    { name: 'Hard', value: stats.hardCount, color: '#f43f5e' },   // rose-500
    { name: 'Fundamental', value: stats.fundamentalCount, color: '#6366f1' } // indigo-500
  ].filter(item => item.value > 0), [stats]);

  const totalProblems = stats.totalDSASolved;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const percentage = totalProblems > 0 ? ((value / totalProblems) * 100).toFixed(1) : 0;
      return (
        <div className="px-3 py-2 bg-slate-800 text-white text-xs rounded-lg shadow-xl border border-slate-700">
          <p className="font-semibold mb-0.5">{name}</p>
          <p className="text-slate-300">{value} ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) return null;

  return (
    <div className="mt-6 pt-6 border-t border-slate-100">
      <button
        className="flex w-full justify-between items-center group"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Problem Distribution</span>
        {expanded ?
          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" /> :
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
        }
      </button>

      {expanded && (
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                startAngle={90}
                endAngle={450}
                cornerRadius={4}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs font-medium text-slate-600 ml-1">{value}</span>}
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

  const leetcodeCount = parseInt(stats.statsArray.find(s => s.platform === 'LeetCode')?.solvedCount || 0, 10);
  const gfgCount = parseInt(stats.statsArray.find(s => s.platform === 'GeeksforGeeks')?.solvedCount || 0, 10);
  const total = stats.totalDSASolved;
  const leetcodePercentage = total > 0 ? (leetcodeCount / total) * 100 : 0;
  const gfgPercentage = total > 0 ? (gfgCount / total) * 100 : 0;

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <button
        className="flex w-full justify-between items-center group"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">Platform Breakdown</span>
        {expanded ?
          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" /> :
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
        }
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-medium">
              <span className="text-slate-700">LeetCode</span>
              <span className="text-slate-900">{leetcodeCount}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${leetcodePercentage}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-medium">
              <span className="text-slate-700">GeeksforGeeks</span>
              <span className="text-slate-900">{gfgCount}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${gfgPercentage}%` }} />
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

  const enhancedStats = { ...totalStats, statsArray };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-50 rounded-xl">
          <Trophy className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-heading leading-tight">DSA Performance</h2>
          <p className="text-xs text-slate-500 font-medium">LeetCode & GeeksforGeeks</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatItem
          icon={Circle}
          label="Easy"
          value={totalStats.easyCount}
          colorType="green"
        />
        <StatItem
          icon={AlertTriangle}
          label="Medium"
          value={totalStats.mediumCount}
          colorType="yellow"
        />
        <StatItem
          icon={Target}
          label="Hard"
          value={totalStats.hardCount}
          colorType="red"
        />
        <StatItem
          icon={Info}
          label="Base"
          value={totalStats.fundamentalCount}
          colorType="blue"
        />
      </div>

      <DsaDistributionChart stats={enhancedStats} />
      <PlatformBreakdown stats={enhancedStats} />
    </div>
  );
};

export default DsaStatsCard;