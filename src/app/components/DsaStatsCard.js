const SimpleStat = ({ label, value, color }) => (
  <div className="flex justify-between items-center text-sm text-gray-800">
    <span>{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

const DsaStatsCard = ({ stats }) => {
  const statsArray = Array.isArray(stats) ? stats : [];

  const leetcode = statsArray.find(s => s.platform === 'LeetCode') || {};
  const gfg = statsArray.find(s => s.platform === 'GeeksforGeeks') || {};

  const total = parseInt(leetcode.solvedCount || 0) + parseInt(gfg.solvedCount || 0);

  return (
    <div className="w-full p-4 rounded-xl bg-white border shadow text-sm space-y-3">
      <h3 className="text-lg font-semibold text-gray-700">DSA Stats</h3>

      <SimpleStat label="Total Solved" value={total} color="text-indigo-600" />
      <SimpleStat label="LeetCode" value={leetcode.solvedCount || 0} color="text-yellow-500" />
      <SimpleStat label="GFG" value={gfg.solvedCount || 0} color="text-green-500" />
      <SimpleStat label="Easy" value={leetcode.easyCount || 0} color="text-emerald-500" />
      <SimpleStat label="Medium" value={leetcode.mediumCount || 0} color="text-orange-500" />
      <SimpleStat label="Hard" value={leetcode.hardCount || 0} color="text-red-500" />
    </div>
  );
};

export default DsaStatsCard;
