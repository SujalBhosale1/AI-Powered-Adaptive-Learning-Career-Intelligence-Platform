const RecommendationCard = ({ branch, percentage, reason }) => {
    // Determine color based on match percentage
    let barColor = 'bg-red-500';
    let textColor = 'text-red-400';
    let bgColor = 'bg-red-500/20';

    if (percentage >= 80) {
        barColor = 'bg-green-500';
        textColor = 'text-green-400';
        bgColor = 'bg-green-500/20';
    } else if (percentage >= 60) {
        barColor = 'bg-yellow-500';
        textColor = 'text-yellow-400';
        bgColor = 'bg-yellow-500/20';
    }

    return (
        <div className="glass-card p-5 hover:opacity-90 transition-opacity">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-white">{branch}</h3>
                <span className={`px-2 py-1 rounded text-sm font-bold ${bgColor} ${textColor}`}>
                    {percentage}% Match
                </span>
            </div>

            <div className="mb-4">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${barColor}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>

            <p className="text-sm text-indigo-200 leading-relaxed">
                <span className="font-semibold text-indigo-100">Why:</span> {reason}
            </p>
        </div>
    );
};

export default RecommendationCard;
