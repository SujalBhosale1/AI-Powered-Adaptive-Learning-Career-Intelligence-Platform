import { CheckCircle, ArrowRightCircle, Star, BookOpen, Trophy, Code2, Cpu, Wrench } from 'lucide-react';

// Branch-specific recent activity entries
const BRANCH_ACTIVITIES = {
    Electronics: [
        { color: 'green',  Icon: CheckCircle,     title: "Completed 'Microcontrollers & Arduino' Module",  time: '2 hours ago' },
        { color: 'yellow', Icon: Star,             title: "Earned 'Embedded C Basics' Badge",               time: '1 day ago' },
        { color: 'blue',   Icon: ArrowRightCircle, title: "Started IoT Cloud Integration lab",              time: '2 days ago' },
        { color: 'purple', Icon: Trophy,           title: "Topped weekly Electronics quiz",                 time: '1 week ago' },
    ],
    'Computer Science': [
        { color: 'green',  Icon: CheckCircle,     title: "Completed 'Data Structures' Module",            time: '2 hours ago' },
        { color: 'yellow', Icon: Star,             title: "Earned 'Python Basics' Badge",                  time: '1 day ago' },
        { color: 'blue',   Icon: Code2,            title: "Submitted LeetCode challenge",                  time: '3 days ago' },
        { color: 'purple', Icon: ArrowRightCircle, title: "Started System Design course",                  time: '1 week ago' },
    ],
    Mechanical: [
        { color: 'green',  Icon: CheckCircle,     title: "Completed 'SolidWorks Basics' Module",          time: '2 hours ago' },
        { color: 'yellow', Icon: Star,             title: "Earned 'CAD/CAM Beginner' Badge",               time: '1 day ago' },
        { color: 'blue',   Icon: Wrench,           title: "Started FEA Analysis lab",                      time: '3 days ago' },
        { color: 'purple', Icon: Trophy,           title: "Topped weekly Mechanical quiz",                 time: '1 week ago' },
    ],
    default: [
        { color: 'green',  Icon: CheckCircle,     title: "Completed your interest assessment",             time: '2 hours ago' },
        { color: 'yellow', Icon: Star,             title: "Profile setup complete",                        time: '1 day ago' },
        { color: 'blue',   Icon: BookOpen,         title: "Started your personalized roadmap",             time: '2 days ago' },
        { color: 'purple', Icon: Trophy,           title: "Joined OneStop Learning Platform",              time: '1 week ago' },
    ],
};

const ActivityItem = ({ Icon, color, title, time }) => (
    <div className="flex items-start space-x-3 pb-6 last:pb-0 border-l-2 border-white/10 last:border-0 pl-4 relative">
        <div className={`absolute -left-[9px] top-0 bg-[#0F172A] p-1 rounded-full border border-white/10`}>
            <div className={`h-2 w-2 rounded-full`}
                style={{ backgroundColor: color === 'green' ? '#34d399' : color === 'yellow' ? '#fbbf24' : color === 'blue' ? '#60a5fa' : '#c084fc' }} />
        </div>
        <div>
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="text-xs text-indigo-300 mt-0.5">{time}</p>
        </div>
    </div>
);

const ActivityFeed = ({ branch = '' }) => {
    // Match branch string to an activity list
    const key = Object.keys(BRANCH_ACTIVITIES).find(k =>
        k !== 'default' && branch.toLowerCase().includes(k.toLowerCase())
    ) || 'default';

    const activities = BRANCH_ACTIVITIES[key];

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-1">Recent Activity</h3>
            {key !== 'default' && (
                <p className="text-xs text-indigo-400 mb-5 flex items-center gap-1">
                    <Cpu className="h-3 w-3" /> Personalized for <span className="text-indigo-300 font-semibold ml-1">{branch}</span>
                </p>
            )}
            <div className={`space-y-1 ${key === 'default' ? 'mt-5' : ''}`}>
                {activities.map((act, i) => (
                    <ActivityItem key={i} Icon={act.Icon} color={act.color} title={act.title} time={act.time} />
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
