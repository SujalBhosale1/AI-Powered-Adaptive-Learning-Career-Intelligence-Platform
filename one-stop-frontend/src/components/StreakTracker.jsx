import { Flame } from 'lucide-react';

const StreakTracker = ({ streak = 0 }) => {
  // Build last 7 days of activity (simulated: if streak >= N, day N is active)
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay(); // 0=Sun, 1=Mon...
  const todayIdx = today === 0 ? 6 : today - 1; // convert to Mon-first index

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h3 className="font-bold text-white">Daily Streak</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0F172A] border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full">
          <Flame className="h-3.5 w-3.5" />
          <span className="text-sm font-bold">{streak} days</span>
        </div>
      </div>

      {/* 7-day mini calendar */}
      <div className="flex gap-2 justify-between">
        {days.map((day, i) => {
          const isActive = i <= todayIdx && i >= Math.max(0, todayIdx - streak + 1);
          const isToday = i === todayIdx;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  isToday
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : isActive
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-white/10 text-indigo-200/50'
                }`}
              >
                {isActive ? <Flame className="h-4 w-4" /> : <span className="text-xs">·</span>}
              </div>
              <span className={`text-[10px] font-medium ${isToday ? 'text-orange-400' : 'text-indigo-200/70'}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-indigo-200 text-center">
        {streak === 0
          ? 'Start learning today to build your streak!'
          : streak >= 7
          ? '🔥 Amazing! You\'re on fire this week!'
          : `Keep it up! ${7 - streak} more days for a 7-day badge.`}
      </p>
    </div>
  );
};

export default StreakTracker;
