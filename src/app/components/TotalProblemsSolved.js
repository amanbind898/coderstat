const TotalProblemsSolved = ({ stats }) => {
    const statsArray = Array.isArray(stats) ? stats : [];
    
    const totalStats = statsArray.reduce(
        (acc, platform) => {
        acc.totalSolved += parseInt(platform.solvedCount || 0, 10);
       
        return acc;
        },
        { totalSolved: 0, easyCount: 0, mediumCount: 0, hardCount: 0 }
    );
    
    return (
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-xl bg-white border border-black/10 shadow">
        <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider">Total Problems Solved</span>
            <span className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-fuchsia-700">
            {totalStats.totalSolved.toLocaleString()}
            </span>
        </div>
        </div>
    );
    }