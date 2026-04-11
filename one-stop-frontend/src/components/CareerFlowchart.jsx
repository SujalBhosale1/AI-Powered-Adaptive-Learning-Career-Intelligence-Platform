import { useState, useEffect } from 'react';
import { ChevronDown, Loader2, RefreshCw, Zap } from 'lucide-react';

// Color map for safe Tailwind class usage
const COLOR_MAP = {
    indigo:  { border: '#6366f1', glow: 'rgba(99,102,241,0.4)',  badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',  dot: '#6366f1' },
    violet:  { border: '#8b5cf6', glow: 'rgba(139,92,246,0.4)',  badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',  dot: '#8b5cf6' },
    emerald: { border: '#10b981', glow: 'rgba(16,185,129,0.4)',  badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot: '#10b981' },
    blue:    { border: '#3b82f6', glow: 'rgba(59,130,246,0.4)',  badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',    dot: '#3b82f6' },
    amber:   { border: '#f59e0b', glow: 'rgba(245,158,11,0.4)',  badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',   dot: '#f59e0b' },
};

const FlowStep = ({ step, isLast, colorKey, index }) => {
    const [expanded, setExpanded] = useState(false);
    const color = COLOR_MAP[colorKey] || COLOR_MAP.indigo;

    return (
        <div className="relative flex flex-col items-center">
            {/* Connector line above (not for first) */}
            {index > 0 && (
                <div className="w-0.5 h-6" style={{ backgroundColor: color.border, opacity: 0.4 }} />
            )}

            {/* Node Card */}
            <button
                onClick={() => setExpanded(e => !e)}
                className="w-full text-left group"
            >
                <div
                    className="w-full rounded-xl border p-4 transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                        borderColor: color.border,
                        background: `linear-gradient(135deg, ${color.border}18, transparent)`,
                        boxShadow: expanded ? `0 0 20px ${color.glow}` : `0 0 8px ${color.glow}40`,
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Step circle */}
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                style={{ backgroundColor: color.border }}
                            >
                                {index + 1}
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm">{step.label}</p>
                                <p className="text-xs text-indigo-300">{step.duration}</p>
                            </div>
                        </div>
                        <ChevronDown
                            className="h-4 w-4 text-indigo-400 transition-transform shrink-0"
                            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                    </div>

                    {/* Expanded detail */}
                    {expanded && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                            <p className="text-sm text-indigo-200">{step.desc}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {(step.skills || []).map((skill, i) => (
                                    <span
                                        key={i}
                                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${color.badge}`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </button>

            {/* Arrow down (not for last) */}
            {!isLast && (
                <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4" style={{ backgroundColor: color.border, opacity: 0.4 }} />
                    <div
                        className="w-0 h-0"
                        style={{
                            borderLeft: '5px solid transparent',
                            borderRight: '5px solid transparent',
                            borderTop: `7px solid ${color.border}`,
                            opacity: 0.7,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

const CareerFlowchart = ({ branch }) => {
    const [flowchart, setFlowchart] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activePath, setActivePath] = useState(0);

    const fetchFlowchart = async (branchName) => {
        setIsLoading(true);
        setFlowchart(null);
        try {
            const token = localStorage.getItem('onestop_token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${apiUrl}/career/flowchart?branch=${encodeURIComponent(branchName)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.flowchart) {
                setFlowchart(data.flowchart);
                setActivePath(0);
            }
        } catch (err) {
            console.error('Flowchart fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (branch) {
            fetchFlowchart(branch);
        }
    }, [branch]);

    if (isLoading) {
        return (
            <div className="glass-card p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
                <div className="w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <Loader2 className="h-7 w-7 text-indigo-400 animate-spin" />
                </div>
                <div className="text-center">
                    <p className="text-white font-bold">Generating Career Flowchart…</p>
                    <p className="text-indigo-300 text-sm mt-1">
                        qwen2.5-coder:7b is mapping out your <span className="text-white font-semibold">{branch}</span> roadmap
                    </p>
                </div>
                <div className="flex gap-1 mt-2">
                    {[0,1,2].map(i => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (!flowchart) return null;

    const paths = flowchart.paths || [];
    const currentPath = paths[activePath];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">AI Generated Flowchart</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white">
                        {flowchart.branch} Career Paths
                    </h3>
                </div>
                <button
                    onClick={() => fetchFlowchart(branch)}
                    className="flex items-center gap-2 text-xs text-indigo-300 hover:text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
                >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                </button>
            </div>

            {/* Path Tabs */}
            {paths.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                    {paths.map((path, idx) => {
                        const color = COLOR_MAP[path.color] || COLOR_MAP.indigo;
                        return (
                            <button
                                key={idx}
                                onClick={() => setActivePath(idx)}
                                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all border"
                                style={activePath === idx ? {
                                    backgroundColor: `${color.border}30`,
                                    borderColor: color.border,
                                    color: 'white',
                                    boxShadow: `0 0 15px ${color.glow}`,
                                } : {
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    color: '#a5b4fc',
                                }}
                            >
                                {path.title}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Active Path Flowchart */}
            {currentPath && (
                <div className="glass-card p-6">
                    <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-full inline-block"
                            style={{ backgroundColor: COLOR_MAP[currentPath.color]?.border || '#6366f1' }}
                        />
                        {currentPath.title}
                    </h4>

                    <div className="max-w-md mx-auto">
                        {(currentPath.steps || []).map((step, idx) => (
                            <FlowStep
                                key={step.id || idx}
                                step={step}
                                index={idx}
                                colorKey={currentPath.color}
                                isLast={idx === currentPath.steps.length - 1}
                            />
                        ))}
                    </div>

                    <p className="text-center text-xs text-indigo-400 mt-6 border-t border-white/5 pt-4">
                        Click any step to expand its details & skills
                    </p>
                </div>
            )}
        </div>
    );
};

export default CareerFlowchart;
