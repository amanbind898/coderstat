"use client";
import React, { useMemo } from 'react';
import { AlertCircle, TrendingUp, Award, Calendar, Globe2, Code } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const StatItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-lg border border-slate-100/50">
    <div className="flex items-center gap-2.5">
      <Icon className="w-4 h-4 text-slate-400" />
      <span className="text-xs font-medium text-slate-500">{label}</span>
    </div>
    <span className="text-sm font-bold text-slate-900">{value || "N/A"}</span>
  </div>
);

const ProblemDistributionChart = ({ categories, stats, totalSolved }) => {
  const chartData = useMemo(() => {
    return Object.entries(categories).map(([level, { color }]) => {
      const rawColor = color.replace('bg-', '');
      let actualColor;

      switch (rawColor) {
        case 'emerald-400': actualColor = '#10b981'; break;
        case 'amber-400': actualColor = '#f59e0b'; break;
        case 'rose-400': actualColor = '#f43f5e'; break;
        case 'blue-400': actualColor = '#6366f1'; break;
        default: actualColor = '#64748b';
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

  if (chartData.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Simple Legend/List */}
        <div className="space-y-2 justify-center flex flex-col">
          {chartData.map((item) => {
            const percentage = totalSolved > 0 ? (item.value / totalSolved) * 100 : 0;
            return (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <div className="flex-1 flex justify-between text-xs">
                  <span className="text-slate-600">{item.name}</span>
                  <span className="font-medium text-slate-900">{item.value} ({percentage.toFixed(0)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* Tiny Chart */}
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const LanguageDistributionChart = ({ languageStats }) => {
  const chartData = useMemo(() => {
    if (!languageStats) return [];
    return Object.entries(languageStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Show top 5 languages
  }, [languageStats]);

  if (chartData.length === 0) return null;

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <Code className="w-3 h-3" />
        Language Stats
      </h4>
      <div className="flex flex-wrap gap-2">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-[10px] font-semibold text-slate-700">{item.name}</span>
            <span className="text-[10px] font-bold text-slate-400">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlatformCard = ({ platform, stats, isLoading }) => {
  if (isLoading) return <div className="h-40 bg-slate-100 animate-pulse rounded-xl" />;
  if (!stats) return null;

  const platformConfig = useMemo(() => ({
    LeetCode: {
      logo: "/leetcode.png",
      categories: {
        Easy: { color: "bg-emerald-400" },
        Medium: { color: "bg-amber-400" },
        Hard: { color: "bg-rose-400" }
      },
      rankLabel: "Global Rank"
    },
    Codeforces: {
      logo: "/codeforces.jpg",
      totalOnly: true,
      rankLabel: "Rank"
    },
    CodeChef: {
      logo: "/codechef.jpg",
      totalOnly: true,
      rankLabel: "Rank"
    },
    GeeksforGeeks: {
      logo: "/gfg.png",
      categories: {
        Easy: { color: "bg-emerald-400" },
        Medium: { color: "bg-amber-400" },
        Hard: { color: "bg-rose-400" },
        Fundamental: { color: "bg-blue-400" }
      },
      rankLabel: "Institute Rank"
    }
  }), []);

  const details = platformConfig[platform] || { rankLabel: "Rank" };
  const { logo, categories, totalOnly, rankLabel } = details;

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
    <div className="bg-white rounded-xl border border-slate-100 p-4 sm:p-5 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt={platform} className="w-8 h-8 rounded-lg" />
          <div>
            <h3 className="text-base font-bold text-slate-900">{platform}</h3>
            {stats.rating && (
              <p className="text-xs text-slate-500 font-medium">Rating: <span className="text-slate-900">{stats.rating}</span></p>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">{stats.lastUpdated}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatItem label="Problems" value={totalSolved} icon={Code} />
        <StatItem label={rankLabel} value={stats.globalRank} icon={Globe2} />
      </div>

      {!totalOnly && categories && totalSolved > 0 && (
        <ProblemDistributionChart
          categories={categories}
          stats={stats}
          totalSolved={totalSolved}
        />
      )}

      {platform === "GeeksforGeeks" && stats.languageStats && (
        <LanguageDistributionChart languageStats={stats.languageStats} />
      )}
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
    return <div className="text-center p-8 text-slate-500">Connect platforms to view stats</div>;
  }

  if (availableStats.length === 0 && !isLoading) {
    return <div className="text-center p-8 text-slate-500">No platform data found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map(({ id, name }) => (
          <PlatformCard
            key={id}
            platform={name}
            stats={availableStats.find(stat => stat.platform === name)}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default PlatformCards;