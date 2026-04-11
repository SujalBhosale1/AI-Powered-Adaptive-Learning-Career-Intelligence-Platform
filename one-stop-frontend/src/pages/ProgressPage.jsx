import { useAuth } from '../contexts/AuthContext';
import { getEngineeredData } from '../data/dummyData';
import { CheckCircle2, Clock, Circle, TrendingUp, Target, BookOpen, Zap, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    RadarChart, PolarGrid, PolarAngleAxis, Radar,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell
} from 'recharts';

// ── Status helpers ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
    completed:   { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', bar: '#10b981', label: 'Completed' },
    'in-progress': { icon: Clock,       color: 'text-amber-400',   bg: 'bg-amber-500/20',   border: 'border-amber-500/30',   bar: '#f59e0b', label: 'In Progress' },
    pending:     { icon: Circle,       color: 'text-slate-400',   bg: 'bg-slate-500/10',   border: 'border-slate-500/20',   bar: '#64748b', label: 'Pending' },
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="bg-[#0F172A] border border-white/10 rounded-xl p-3 text-sm shadow-xl">
                <p className="text-white font-bold">{label}</p>
                <p className="text-indigo-300">Score: <span className="text-white font-semibold">{payload[0].value}%</span></p>
            </div>
        );
    }
    return null;
};

const ProgressPage = () => {
    const { user } = useAuth();
    const userBranch = user?.profile?.branch || user?.branch || user?.targetRole || 'Computer Science';
    const data = getEngineeredData(userBranch);
    const { skills, roadmap } = data;

    const completedCount   = roadmap.filter(r => r.status === 'completed').length;
    const inProgressCount  = roadmap.filter(r => r.status === 'in-progress').length;
    const totalCount       = roadmap.length;
    const overallPct       = Math.round((completedCount / totalCount) * 100);

    // Skill scores for bar chart
    const skillBarData = [
        ...skills.completed.map(s => ({ name: s, score: Math.floor(Math.random() * 20) + 75, status: 'done' })),
        ...skills.missing.map(s =>   ({ name: s, score: Math.floor(Math.random() * 30) + 20, status: 'missing' })),
    ];

    // Radar chart data
    const radarData = [
        { subject: 'Core Skills',     A: skills.completed.length > 2 ? 80 : 50 },
        { subject: 'Projects',        A: completedCount > 1 ? 70 : 40 },
        { subject: 'Problem Solving', A: 60 },
        { subject: 'Tooling',         A: skills.completed.length * 15 },
        { subject: 'Communication',   A: 55 },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Your Progress</h1>
                    <p className="text-indigo-300 mt-1">
                        Tracking your journey in <span className="text-white font-semibold">{userBranch}</span>
                    </p>
                </div>
                <Link to="/quiz" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 shadow-lg text-sm">
                    <Zap className="h-4 w-4" /> Take Quiz to Update
                </Link>
            </div>

            {/* Overall Progress Bar */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-white text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-400" /> Overall Roadmap Progress
                    </h2>
                    <span className="text-2xl font-extrabold text-indigo-400">{overallPct}%</span>
                </div>
                <div className="w-full bg-[#0F172A] rounded-full h-3 border border-white/5">
                    <div
                        className="h-3 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }}
                    />
                </div>
                <div className="flex gap-6 mt-4 text-sm">
                    <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="h-4 w-4" /> {completedCount} Completed</span>
                    <span className="flex items-center gap-1.5 text-amber-400"><Clock className="h-4 w-4" /> {inProgressCount} In Progress</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><Circle className="h-4 w-4" /> {totalCount - completedCount - inProgressCount} Pending</span>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* Skill Bar Chart */}
                <div className="glass-card p-6">
                    <h2 className="font-bold text-white text-lg flex items-center gap-2 mb-4">
                        <Target className="h-5 w-5 text-rose-400" /> Skill Proficiency
                    </h2>
                    <div style={{ width: '100%', height: 220 }}>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={skillBarData} margin={{ left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#a5b4fc" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#a5b4fc" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                    {skillBarData.map((entry, i) => (
                                        <Cell key={i} fill={entry.status === 'done' ? '#10b981' : '#6366f1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex gap-4 mt-3 text-xs">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" /> Mastered</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-400 inline-block" /> To Learn</span>
                    </div>
                </div>

                {/* Radar Chart */}
                <div className="glass-card p-6">
                    <h2 className="font-bold text-white text-lg flex items-center gap-2 mb-4">
                        <Trophy className="h-5 w-5 text-amber-400" /> Competency Radar
                    </h2>
                    <div style={{ width: '100%', height: 220 }}>
                        <ResponsiveContainer width="100%" height={220}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#ffffff18" />
                                <PolarAngleAxis dataKey="subject" stroke="#a5b4fc" fontSize={11} tickLine={false} />
                                <Radar name="You" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Roadmap Timeline */}
            <div className="glass-card p-6">
                <h2 className="font-bold text-white text-lg flex items-center gap-2 mb-6">
                    <BookOpen className="h-5 w-5 text-cyan-400" /> Learning Roadmap — {userBranch}
                </h2>
                <div className="space-y-0">
                    {roadmap.map((step, i) => {
                        const cfg = STATUS_CONFIG[step.status] || STATUS_CONFIG.pending;
                        const Icon = cfg.icon;
                        return (
                            <div key={i} className="flex gap-4">
                                {/* Timeline line */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.border} shrink-0`}>
                                        <Icon className={`h-5 w-5 ${cfg.color}`} />
                                    </div>
                                    {i < roadmap.length - 1 && (
                                        <div className="w-px flex-1 bg-white/10 my-1" />
                                    )}
                                </div>
                                {/* Content */}
                                <div className={`pb-8 ${i === roadmap.length - 1 ? 'pb-0' : ''}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{step.month}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border} font-semibold`}>
                                            {cfg.label}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-white text-base">{step.title}</h3>
                                    <p className="text-sm text-indigo-300 mt-1">{step.description}</p>
                                    {step.resources?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {step.resources.map((r, j) => (
                                                <span key={j} className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <ArrowRight className="h-3 w-3" /> {r}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Skill Gap */}
            <div className="glass-card p-6">
                <h2 className="font-bold text-white text-lg flex items-center gap-2 mb-5">
                    <Target className="h-5 w-5 text-rose-400" /> Skill Gap for {userBranch}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">✅ Mastered</p>
                        <div className="flex flex-wrap gap-2">
                            {skills.completed.map(s => (
                                <span key={s} className="text-sm bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">{s}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">🎯 To Learn</p>
                        <div className="flex flex-wrap gap-2">
                            {skills.missing.map(s => (
                                <span key={s} className="text-sm bg-rose-500/10 text-rose-300 border border-rose-500/20 px-3 py-1 rounded-full font-medium">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                    <p className="text-sm text-indigo-200">
                        <span className="font-bold text-white">AI Recommendation: </span>
                        {skills.recommendation}
                    </p>
                </div>
            </div>

        </div>
    );
};

export default ProgressPage;
