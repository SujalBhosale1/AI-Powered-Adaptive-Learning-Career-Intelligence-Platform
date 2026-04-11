import { TrendingUp, Award, Calendar, Users } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="glass-card p-6 flex flex-col justify-center items-center text-center space-y-3">
        <div className={`p-3 rounded-full bg-white/10 text-${color}-400`}>
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-xs font-bold text-indigo-200 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-extrabold text-white mt-1">{value}</p>
        </div>
    </div>
);

const StatsOverview = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={TrendingUp} label="Profile Strength" value="85%" color="blue" />
            <StatCard icon={Award} label="Skills Verified" value="12" color="green" />
            <StatCard icon={Calendar} label="Days Streak" value="7" color="orange" />
            <StatCard icon={Users} label="Profile Views" value="42" color="purple" />
        </div>
    );
};

export default StatsOverview;
