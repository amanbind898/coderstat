import React from "react";
import { Trophy, Code } from "lucide-react";

const StatItem = ({ icon: Icon, label, value, color }) => (
  <div className="group relative p-4 sm:p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:translate-y-[-2px] shadow-sm">
    <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 group-hover:border-gray-300">
      <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${color}`} />
    </div>
    <div className="space-y-1 sm:space-y-2">
      <p className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
        {value}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 tracking-wider uppercase">{label}</p>
    </div>
  </div>
);

const CPStatsCard = ({ stats }) => {
  const statsArray = Array.isArray(stats) ? stats : [];
  const cfStats = statsArray.find(s => s.platform === 'Codeforces');
  const ccStats = statsArray.find(s => s.platform === 'CodeChef');
  const totalSolved = parseInt(cfStats?.solvedCount || 0, 10) + parseInt(ccStats?.solvedCount || 0, 10);

  return (
    <div className="w-full max-w-3xl p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white via-blue-100 to-blue-50 border border-gray-200 shadow-xl">
      <div className="flex justify-between items-start mb-6 sm:mb-8">
        <div className="space-y-0.5 sm:space-y-1">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400">
            CP Matrix
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest">
            Performance Analytics
          </p>
        </div>
        <div className="relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-100 border border-blue-200">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
        <StatItem
          icon={Code}
          label="CodeForces"
          value={cfStats?.solvedCount || "0"}
          color="text-blue-600"
        />
        <StatItem
          icon={Code}
          label="CodeChef"
          value={ccStats?.solvedCount || "0"}
          color="text-blue-600"
        />
        <StatItem
          icon={Trophy}
          label="Total Solved"
          value={totalSolved}
          color="text-blue-600"
        />
      </div>
    </div>
  );
};

export default CPStatsCard;
