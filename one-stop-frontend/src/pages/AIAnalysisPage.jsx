import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Brain, CheckCircle, XCircle, ChevronRight, Loader2, Zap, Target, TrendingUp, ArrowRight } from 'lucide-react';
import CareerFlowchart from '../components/CareerFlowchart';

// ── Color helpers ──────────────────────────────────────────────────────────────
const MATCH_COLOR = {
    green:  { bg: 'rgba(16,185,129,0.12)', border: '#10b981', bar: '#10b981', badge: 'bg-emerald-500 text-white', text: 'text-emerald-400' },
    amber:  { bg: 'rgba(245,158,11,0.12)',  border: '#f59e0b', bar: '#f59e0b', badge: 'bg-amber-500 text-white',   text: 'text-amber-400'  },
    red:    { bg: 'rgba(239,68,68,0.12)',   border: '#ef4444', bar: '#ef4444', badge: 'bg-rose-600 text-white',    text: 'text-rose-400'   },
};

// ── Journey Flowchart Node ─────────────────────────────────────────────────────
const JourneyNode = ({ icon, label, sub, glow, isLast }) => (
    <div className="flex items-center gap-0">
        <div className="flex flex-col items-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border border-white/10 shadow-[0_0_20px_${glow}] bg-white/5`}>
                {icon}
            </div>
            <p className="text-xs font-bold text-white mt-2 text-center leading-tight max-w-[70px]">{label}</p>
            <p className="text-[10px] text-indigo-300 text-center leading-tight max-w-[70px]">{sub}</p>
        </div>
        {!isLast && (
            <div className="flex items-center mx-1 mb-5">
                <div className="w-6 h-0.5 bg-indigo-500/40" />
                <ArrowRight className="h-4 w-4 text-indigo-400 -ml-1" />
            </div>
        )}
    </div>
);

// ── Branch Recommendation Card ─────────────────────────────────────────────────
const BranchCard = ({ rec, selected, onSelect }) => {
    const c = MATCH_COLOR[rec.color] || MATCH_COLOR.green;
    const isSelected = selected === rec.branch;
    return (
        <div
            onClick={() => onSelect(rec.branch)}
            className="rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
            style={{
                background: c.bg,
                border: `1.5px solid ${isSelected ? c.border : `${c.border}40`}`,
                boxShadow: isSelected ? `0 0 24px ${c.border}40` : 'none',
            }}
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-white text-lg">{rec.branch}</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {rec.matchPct}% Match
                </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#0F172A] rounded-full h-2 mb-3">
                <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${rec.matchPct}%`, backgroundColor: c.bar, boxShadow: `0 0 8px ${c.bar}` }}
                />
            </div>

            <p className="text-sm text-indigo-200">
                <span className="font-bold text-white">Why: </span>
                <span className="italic">{rec.reason}</span>
            </p>

            {isSelected && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-bold" style={{ color: c.bar }}>
                    <CheckCircle className="h-4 w-4" /> Selected — Scroll down for your roadmap
                </div>
            )}
        </div>
    );
};

// ── Custom Tooltip for Bar Chart ───────────────────────────────────────────────
const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="glass-card p-3 border-white/10 text-sm">
                <p className="text-white font-bold">{label}</p>
                <p className="text-indigo-300">Score: <span className="text-white font-semibold">{payload[0].value}%</span></p>
            </div>
        );
    }
    return null;
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const AIAnalysisPage = () => {
    const location  = useLocation();
    const navigate  = useNavigate();
    const { user }  = useAuth();

    const analysis         = location.state?.analysis     || null;
    const interestResponses = location.state?.interestResponses || location.state?.quizResults || [];
    const error            = location.state?.error;

    const [selectedBranch, setSelectedBranch] = useState(null);

    // Fallback if we land here without data
    if (!analysis) {
        return (
            <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
                <div className="glass-card p-10 max-w-sm w-full text-center space-y-4">
                    <XCircle className="h-12 w-12 text-rose-400 mx-auto" />
                    <h2 className="text-xl font-bold text-white">No Analysis Data</h2>
                    <p className="text-indigo-300 text-sm">
                        {error || 'Please complete the interest assessment first.'}
                    </p>
                    <button
                        onClick={() => navigate('/initial-assessment')}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-colors"
                    >
                        Take Assessment
                    </button>
                </div>
            </div>
        );
    }

    const { strengths = [], weaknesses = [], skillScores = [], explanation = '', branchRecommendations = [], dominantInterest = '' } = analysis;

    // Tally interest tags from responses
    const tagCount = {};
    interestResponses.forEach(r => {
        const tag = r.selectedTag || 'general';
        tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
    const topTag = Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0]?.[0] || dominantInterest;

    return (
        <div className="min-h-screen bg-mesh py-10 px-4">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* ── Page Header ───────────────────────────────────────────── */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-4">
                        <Zap className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">AI Analysis Complete</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white">Your Career Intelligence Report</h1>
                    <p className="text-indigo-300 mt-2">Powered by <span className="text-white font-semibold">Gemini AI</span> · {interestResponses.length} interest questions analysed</p>
                </div>

                {/* ── Journey Flowchart ─────────────────────────────────────── */}
                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Brain className="h-5 w-5 text-indigo-400" />
                        <h2 className="font-bold text-white text-lg">Your Assessment Journey</h2>
                    </div>
                    <div className="flex items-start justify-center gap-0 overflow-x-auto pb-2">
                        <JourneyNode icon="👤" label="You" sub={user?.name?.split(' ')[0] || 'Student'} glow="rgba(99,102,241,0.4)" />
                        <JourneyNode icon="🎯" label="Interests" sub={dominantInterest || topTag || 'Coding'} glow="rgba(139,92,246,0.4)" />
                        <JourneyNode icon="📝" label="Assessment" sub={`${interestResponses.length} questions`} glow="rgba(245,158,11,0.4)" />
                        <JourneyNode icon="✨" label="Gemini AI" sub="Analysis" glow="rgba(16,185,129,0.4)" />
                        <JourneyNode icon="🚀" label="Career Path" sub="Predicted!" glow="rgba(239,68,68,0.4)" isLast />
                    </div>
                </div>

                {/* ── Stats + Skill Chart ───────────────────────────────────── */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Stats */}
                    <div className="glass-card p-6 space-y-4">
                        <h2 className="font-bold text-white text-lg flex items-center gap-2">
                            <Target className="h-5 w-5 text-emerald-400" /> Assessment Summary
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
                                <p className="text-2xl font-extrabold text-indigo-400">{interestResponses.length}</p>
                                <p className="text-xs text-indigo-400 font-medium mt-1">Questions Answered</p>
                            </div>
                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 text-center">
                                <p className="text-2xl font-extrabold text-violet-400">{branchRecommendations.length}</p>
                                <p className="text-xs text-violet-400 font-medium mt-1">Paths Found</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2">Strengths</p>
                            <div className="flex flex-wrap gap-1.5">
                                {strengths.map((s, i) => (
                                    <span key={i} className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">✓ {s}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-rose-400 uppercase tracking-wide mb-2">Needs Work</p>
                            <div className="flex flex-wrap gap-1.5">
                                {weaknesses.map((w, i) => (
                                    <span key={i} className="text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2.5 py-1 rounded-full font-medium">✗ {w}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Skill bar chart */}
                    <div className="glass-card p-6">
                        <h2 className="font-bold text-white text-lg flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-indigo-400" /> Skill Strength Analysis
                        </h2>
                        {skillScores.length > 0 ? (
                            <div style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={skillScores} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                                        <XAxis dataKey="name" stroke="#a5b4fc" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#a5b4fc" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                                        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                            {skillScores.map((entry, index) => (
                                                <Cell key={index} fill={entry.score >= 70 ? '#10b981' : entry.score >= 45 ? '#f59e0b' : '#ef4444'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[200px] text-indigo-400 text-sm">No skill score data available</div>
                        )}
                    </div>
                </div>

                {/* ── AI Explanation ────────────────────────────────────────── */}
                <div className="glass-card p-6 border-indigo-500/20">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center shrink-0 border border-violet-500/30">
                            <Brain className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">AI Mentor Explanation</p>
                            <p className="text-white leading-relaxed">{explanation}</p>
                        </div>
                    </div>
                </div>

                {/* ── Branch Recommendations ────────────────────────────────── */}
                <div>
                    <div className="flex items-center gap-2 mb-5">
                        <Zap className="h-5 w-5 text-amber-400" />
                        <h2 className="text-xl font-extrabold text-white">Top Branch Recommendations</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {branchRecommendations.map((rec, i) => (
                            <BranchCard key={i} rec={rec} selected={selectedBranch} onSelect={setSelectedBranch} />
                        ))}
                    </div>
                </div>

                {/* ── Career Roadmap Flowchart ──────────────────────────────── */}
                {selectedBranch && (
                    <div className="border-t border-white/10 pt-8">
                        <div className="flex items-center gap-2 mb-2">
                            <ChevronRight className="h-5 w-5 text-indigo-400" />
                            <h2 className="text-xl font-extrabold text-white">
                                AI Roadmap for <span className="text-indigo-400">{selectedBranch}</span>
                            </h2>
                        </div>
                        <p className="text-indigo-300 text-sm mb-6">
                            qwen2.5-coder is generating your personalized step-by-step learning path…
                        </p>
                        <CareerFlowchart branch={selectedBranch} />
                    </div>
                )}

                {/* ── Dashboard CTA ─────────────────────────────────────────── */}
                <div className="flex justify-center pt-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center gap-3 text-lg"
                    >
                        Go to Dashboard <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AIAnalysisPage;
