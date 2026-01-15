import React, { useMemo } from 'react';
import { AlertCircle, TrendingUp, Award, Calendar, Globe2, Flag, Code, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const StatItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between p-2 sm:p-3" role="group" aria-label={`${label} stat`}>
    <div className="flex items-center gap-2">
      <div className="p-1.5 sm:p-2 rounded-lg bg-gray-100 border border-gray-300">
        <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
      </div>
      <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
    </div>
    <span className="text-xs sm:text-sm font-bold text-gray-900">{value || "N/A"}</span>
  </div>
);

const ProblemDistributionChart = ({ categories, stats, totalSolved }) => {
  const chartData = useMemo(() => {
    return Object.entries(categories).map(([level, { color }]) => {
      const rawColor = color.replace('bg-', '');
      let actualColor;

      // Map Tailwind color classes to hex values - Updated Theme
      switch (rawColor) {
        case 'emerald-400': actualColor = '#22c55e'; break; // green-500
        case 'amber-400': actualColor = '#fb923c'; break;   // orange-400
        case 'rose-400': actualColor = '#ef4444'; break;    // red-500
        case 'blue-400': actualColor = '#1d4ed8'; break;    // blue-700
        default: actualColor = '#374151'; // gray-700 as fallback
      }

      const count = level === "Fundamental"
        ? parseInt(stats.fundamentalCount || 0)
        : parseInt(stats[`${level.toLowerCase()}Count`] || 0);

      return {
        name: level,
        value: count,
        color: actualColor
      };
    }).filter(item => item.value > 0);
  }, [categories, stats]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const percentage = totalSolved > 0 ? ((value / totalSolved) * 100).toFixed(1) : 0;

      return (
        <div className="bg-white p-2 shadow-md rounded border border-gray-200 text-xs">
          <p className="font-medium">{name}</p>
          <p>{value} problems ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  // Don't render chart if no data or all zeros
  if (chartData.length === 0 || chartData.every(item => item.value === 0)) {
    return null;
  }

  return (
    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
      <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Problems Distribution</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="flex justify-center items-center h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={36}
                outerRadius={60}
                paddingAngle={2}
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
                iconSize={10}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs text-gray-700">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Progress */}
        <div className="flex flex-col justify-center space-y-3">
          {Object.entries(categories).map(([level, { color }]) => {
            const count = level === "Fundamental"
              ? parseInt(stats.fundamentalCount || 0)
              : parseInt(stats[`${level.toLowerCase()}Count`] || 0);
            const percentage = totalSolved > 0 ? (count / totalSolved) * 100 : 0;

            return (
              <div key={level} className="flex items-center gap-2" role="group" aria-label={`${level} problems`}>
                <span className="text-xs text-gray-600 w-20">{level}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
                <span className="text-xs font-medium text-gray-800 min-w-[3rem] text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Language Distribution Chart for GFG
const LanguageDistributionChart = ({ languageStats }) => {
  const langData = useMemo(() => {
    if (!languageStats || typeof languageStats !== 'object') return [];

    const langColors = {
      cpp: '#00599C',
      'c++': '#00599C',
      python3: '#3776AB',
      python: '#3776AB',
      java: '#ED8B00',
      javascript: '#F7DF1E',
      c: '#A8B9CC',
      csharp: '#239120',
      go: '#00ADD8',
      rust: '#DEA584',
      kotlin: '#7F52FF',
      swift: '#FA7343',
    };

    return Object.entries(languageStats)
      .map(([lang, count]) => ({
        name: lang.toUpperCase(),
        value: count,
        color: langColors[lang.toLowerCase()] || '#6B7280'
      }))
      .sort((a, b) => b.value - a.value);
  }, [languageStats]);

  const totalProblems = useMemo(() =>
    langData.reduce((sum, item) => sum + item.value, 0),
    [langData]
  );

  if (langData.length === 0) return null;

  return (
    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
      <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Languages Used</h3>
      <div className="space-y-2">
        {langData.map(({ name, value, color }) => {
          const percentage = totalProblems > 0 ? (value / totalProblems) * 100 : 0;
          return (
            <div key={name} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-16 font-medium">{name}</span>
              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-xs font-medium text-gray-800 min-w-[3.5rem] text-right">
                {value} ({percentage.toFixed(0)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-gray-200">
    <div className="p-3 sm:p-4 bg-gray-100 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
    <div className="p-3 sm:p-4 bg-gray-50">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  </div>
);

const PlatformCard = ({ platform, stats, isLoading }) => {
  if (isLoading) return <SkeletonCard />;
  if (!stats) return null;

  const platformConfig = useMemo(() => ({
    LeetCode: {
      logo: "/leetcode.png",
      bgColor: "bg-yellow-50",
      categories: {
        Easy: { color: "bg-emerald-400" },
        Medium: { color: "bg-amber-400" },
        Hard: { color: "bg-rose-400" }
      },
      rankLabel: "Global Rank"
    },
    Codeforces: {
      logo: "/codeforces.jpg",
      bgColor: "bg-blue-50",
      totalOnly: true,
      rankLabel: "Rank"
    },
    CodeChef: {
      logo: "/codechef.jpg",
      bgColor: "bg-gray-100",
      totalOnly: true,
      rankLabel: "Rank"
    },
    GeeksforGeeks: {
      logo: "/gfg.png",
      bgColor: "bg-green-50",
      categories: {
        Easy: { color: "bg-emerald-400" },
        Medium: { color: "bg-amber-400" },
        Hard: { color: "bg-rose-400" },
        Fundamental: { color: "bg-blue-400" }
      },
      rankLabel: "Coding Score"
    }
  }), []);

  const details = platformConfig[platform] || {
    bgColor: "bg-gray-100",
    rankLabel: "Rank"
  };

  const { logo, bgColor, categories, totalOnly, rankLabel } = details;

  const totalSolved = useMemo(() => {
    if (totalOnly) return parseInt(stats.solvedCount) || 0;
    if (platform === "GeeksforGeeks") {
      return parseInt(stats.easyCount || 0) +
        parseInt(stats.mediumCount || 0) +
        parseInt(stats.hardCount || 0) +
        parseInt(stats.fundamentalCount || 0);
    }
    return parseInt(stats.easyCount || 0) +
      parseInt(stats.mediumCount || 0) +
      parseInt(stats.hardCount || 0);
  }, [stats, totalOnly, platform]);

  return (
    <div
      className="rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-gray-200 transition-all duration-300 hover:border-gray-400 hover:shadow-md"
      role="article"
      aria-label={`${platform} statistics`}
    >
      <div className={`p-3 sm:p-4 ${bgColor} border-b border-gray-200`}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 sm:p-2 bg-white/50 rounded-lg border border-gray-300">
            <img
              src={logo}
              alt={`${platform} Logo`}
              className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">{platform}</h2>
            <p className="text-[10px] sm:text-xs text-gray-600">{stats.lastUpdated}</p>
          </div>
          {stats.rating && (
            <div className="text-right">
              <div className="text-[10px] sm:text-xs text-gray-600">Rating</div>
              <div className="text-sm sm:text-base font-bold text-gray-900">{stats.rating}</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <StatItem label="Problems" value={totalSolved} icon={Code} />
          <StatItem label="Contests" value={stats.totalcontest} icon={Award} />
          <StatItem label="Best" value={stats.highestRating} icon={TrendingUp} />
          <StatItem label={rankLabel} value={stats.globalRank} icon={Globe2} />
        </div>

        {!totalOnly && categories && totalSolved > 0 && (
          <ProblemDistributionChart
            categories={categories}
            stats={stats}
            totalSolved={totalSolved}
          />
        )}

        {/* Language Distribution for GFG */}
        {platform === "GeeksforGeeks" && stats.languageStats && (
          <LanguageDistributionChart languageStats={stats.languageStats} />
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ message, isLoading }) => {
  if (isLoading) return <SkeletonCard />;

  return (
    <div className="w-full rounded-xl sm:rounded-2xl bg-white border border-gray-200 p-4 sm:p-8">
      <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
        <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
        <div className="space-y-1 sm:space-y-2">
          <h3 className="font-semibold text-base sm:text-lg text-gray-900">No Data Available</h3>
          <p className="text-xs sm:text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
};

const PlatformCards = ({ stats, isLoading }) => {
  const platforms = useMemo(() => [
    { id: "leetcode", name: "LeetCode" },
    { id: "geeksforgeeks", name: "GeeksforGeeks" },
    { id: "codeforces", name: "Codeforces" },
    { id: "codechef", name: "CodeChef" }
  ], []);

  const availableStats = useMemo(() => {
    const statsArray = Array.isArray(stats) ? stats : stats ? [stats] : [];
    return statsArray.filter(stat => platforms.map(p => p.name).includes(stat.platform));
  }, [stats, platforms]);

  if (!stats && !isLoading) {
    return <EmptyState message="Connect your coding platforms to see your stats" />;
  }

  if (availableStats.length === 0 && !isLoading) {
    return <EmptyState message="No platform data found" />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Coding Platforms</h2>
        <p className="text-xs sm:text-sm text-gray-600">
          {availableStats.length} of {platforms.length} platforms connected
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {platforms.map(({ id, name }) => (
          <PlatformCard
            key={id}
            platform={name}
            stats={availableStats.find(stat => stat.platform === name)}
            isLoading={isLoading}
          />
        ))}
      </div>

      {!isLoading && availableStats.length > 0 && availableStats.length < platforms.length && (
        <Alert className="bg-gray-100 border-gray-200 text-gray-800">
          <AlertDescription className="text-xs sm:text-sm">
            💡 Connect more coding platforms to track all your progress
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PlatformCards;