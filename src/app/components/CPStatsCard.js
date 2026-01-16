"use client";
import React from "react";
import { Trophy, Code } from "lucide-react";

const StatItem = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-indigo-50">
        <Icon className="w-4 h-4 text-indigo-600" />
      </div>
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-2xl font-bold text-slate-900 font-heading">
      {value}
    </div>
  </div>
);

const CPStatsCard = ({ stats }) => {
  const statsArray = Array.isArray(stats) ? stats : [];
  const cfStats = statsArray.find(s => s.platform === 'Codeforces');
  const ccStats = statsArray.find(s => s.platform === 'CodeChef');
  const totalSolved = parseInt(cfStats?.solvedCount || 0, 10) + parseInt(ccStats?.solvedCount || 0, 10);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-50 rounded-xl">
          <Code className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-heading leading-tight">Competitive Programming</h2>
          <p className="text-xs text-slate-500 font-medium">CodeForces & CodeChef</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatItem
          icon={Code}
          label="CodeForces"
          value={cfStats?.solvedCount || "0"}
        />
        <StatItem
          icon={Code}
          label="CodeChef"
          value={ccStats?.solvedCount || "0"}
        />
        <StatItem
          icon={Trophy}
          label="Total Solved"
          value={totalSolved}
        />
      </div>
    </div>
  );
};

export default CPStatsCard;
