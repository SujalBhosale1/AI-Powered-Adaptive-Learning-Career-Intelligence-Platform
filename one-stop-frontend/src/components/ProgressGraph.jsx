import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const defaultMockData = [
  { day: 'Mon', xp: 50 },
  { day: 'Tue', xp: 120 },
  { day: 'Wed', xp: 90 },
  { day: 'Thu', xp: 210 },
  { day: 'Fri', xp: 150 },
  { day: 'Sat', xp: 300 },
  { day: 'Sun', xp: 280 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
        <p className="text-white font-bold text-sm mb-1">{label}</p>
        <p className="text-indigo-300 font-semibold text-xs">
          {payload[0].value} <span className="text-indigo-400">XP</span>
        </p>
      </div>
    );
  }
  return null;
};

const ProgressGraph = ({ data = defaultMockData, totalXPThisWeek = "1,200 XP" }) => {
  return (
    <div className="glass-card p-6 h-[300px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-white">
          <TrendingUp className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-bold">Weekly Progress</h2>
        </div>
        <div className="text-xs text-indigo-200">
          Total this week: <span className="font-bold text-white">{totalXPThisWeek}</span>
        </div>
      </div>

      <div style={{ width: '100%', height: 200 }} className="-ml-[10px]">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
            <XAxis dataKey="day" stroke="#a5b4fc" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#a5b4fc" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff33', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area type="monotone" dataKey="xp" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#xpGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressGraph;
