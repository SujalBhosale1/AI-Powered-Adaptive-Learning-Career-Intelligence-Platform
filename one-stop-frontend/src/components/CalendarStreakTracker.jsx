import { useMemo } from 'react';
import { Calendar } from 'lucide-react';

const CalendarStreakTracker = ({ streak = 0 }) => {
    // Generate a full 4-week (28 days) contribution graph mock
    const days = useMemo(() => {
        const result = [];
        const today = new Date();
        
        for (let i = 27; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Assume if streak > 0, the most recent `streak` days are active
            const isActive = i < streak;
            
            result.push({
                date,
                active: isActive,
            });
        }
        return result;
    }, [streak]);

    return (
        <div className="glass-card p-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                    <h2 className="text-lg font-bold">Activity Streak</h2>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-extrabold text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">{streak}</span>
                    <span className="text-xs text-indigo-200 mt-1 uppercase tracking-widest">Days</span>
                </div>
            </div>

            <div className="flex items-end justify-center h-full pb-2">
                <div className="grid grid-rows-4 grid-flow-col gap-1.5">
                    {days.map((day, idx) => (
                        <div
                            key={idx}
                            title={day.date.toDateString()}
                            className={`w-4 h-4 rounded-sm transition-all duration-300 ${
                                day.active 
                                    ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' 
                                    : 'bg-white/5 border border-white/5'
                            }`}
                        />
                    ))}
                </div>
            </div>
            
            <p className="text-center text-xs text-indigo-300 mt-4">
                Log in every day and complete tasks to build your streak!
            </p>
        </div>
    );
};

export default CalendarStreakTracker;
