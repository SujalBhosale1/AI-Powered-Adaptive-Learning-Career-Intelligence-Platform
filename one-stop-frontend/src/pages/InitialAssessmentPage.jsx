import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, ChevronRight, Sparkles, Loader2, CheckCircle } from 'lucide-react';

const INTEREST_EMOJI = {
    coding: '💻', ai_ml: '🤖', robotics: '🦾', electronics: '⚡', mechanics: '⚙️',
    design: '🎨', management: '📊', research: '🔬', general: '🎯',
};

const InitialAssessmentPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [phase, setPhase] = useState('loading'); // loading | questions | submitting
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState([]); // [{ questionId, question, selectedText, selectedTag }]
    const [hoveredOpt, setHoveredOpt] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('onestop_token');

    // Fetch the interest-based questions from Gemini via backend
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${apiUrl}/assessment/interest-questions`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.questions?.length) {
                    setQuestions(data.questions);
                    setPhase('questions');
                } else {
                    // Try fallback endpoint
                    const res2 = await fetch(`${apiUrl}/assessment/generate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({})
                    });
                    const data2 = await res2.json();
                    if (data2.success) {
                        setQuestions(data2.questions || []);
                        setPhase('questions');
                    }
                }
            } catch (err) {
                console.error('Failed to fetch questions:', err);
                // Still move to questions phase; we'll show fallback inline
                setPhase('questions');
            }
        })();
    }, []);

    const currentQ = questions[currentIndex];
    const progress = questions.length > 0 ? Math.round((responses.length / questions.length) * 100) : 0;

    const handleSelect = (opt) => {
        const newResponse = {
            questionId: currentQ.id,
            question: currentQ.question,
            selectedText: opt.text,
            selectedTag: opt.tag,
        };

        const updatedResponses = [...responses, newResponse];
        setResponses(updatedResponses);

        // Short delay for visual feedback then advance
        setTimeout(() => {
            if (currentIndex + 1 >= questions.length) {
                submitAndAnalyze(updatedResponses);
            } else {
                setCurrentIndex(i => i + 1);
                setHoveredOpt(null);
            }
        }, 400);
    };

    const submitAndAnalyze = async (finalResponses) => {
        setPhase('submitting');
        try {
            const res = await fetch(`${apiUrl}/assessment/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ interestResponses: finalResponses })
            });
            const data = await res.json();
            navigate('/ai-analysis', {
                state: {
                    analysis: data.success ? data.analysis : null,
                    interestResponses: finalResponses,
                    error: data.success ? null : 'Analysis failed — showing fallback results.'
                }
            });
        } catch (err) {
            navigate('/ai-analysis', { state: { error: err.message, interestResponses: finalResponses } });
        }
    };

    // ── Loading ──────────────────────────────────────────────────────────────
    if (phase === 'loading') return (
        <div className="min-h-screen bg-mesh flex items-center justify-center">
            <div className="text-center space-y-6 max-w-sm px-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                    <Brain className="h-10 w-10 text-indigo-400 animate-pulse" />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-white">Preparing Your Assessment</h2>
                    <p className="text-indigo-300 mt-2 text-sm">
                        Gemini AI is crafting 10 personalised questions based on your interests in{' '}
                        <span className="text-white font-semibold">{(user?.interests || []).join(', ') || 'technology'}</span>…
                    </p>
                </div>
                <div className="flex justify-center gap-1.5">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
            </div>
        </div>
    );

    // ── Submitting ────────────────────────────────────────────────────────────
    if (phase === 'submitting') return (
        <div className="min-h-screen bg-mesh flex items-center justify-center">
            <div className="glass-card p-10 max-w-sm w-full mx-4 text-center space-y-5">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                    <Sparkles className="h-10 w-10 text-white animate-spin" />
                </div>
                <div>
                    <h2 className="text-2xl font-extrabold text-white">Analyzing Your Profile</h2>
                    <p className="text-indigo-300 mt-2 text-sm">
                        Gemini is studying your responses and predicting your ideal career branches…
                    </p>
                </div>
                <Loader2 className="h-6 w-6 text-indigo-400 animate-spin mx-auto" />
            </div>
        </div>
    );

    if (!currentQ) return null;

    const optionLetters = ['A', 'B', 'C', 'D'];

    // ── Question UI ───────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-mesh py-10 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Top bar */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Brain className="h-5 w-5 text-indigo-400" />
                        <span className="text-white font-bold text-sm">Interest Assessment</span>
                    </div>
                    <span className="text-indigo-300 text-sm font-medium">
                        {currentIndex + 1} / {questions.length}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#0F172A] rounded-full h-2 mb-8 border border-white/5">
                    <div
                        className="h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                        style={{
                            width: `${((currentIndex) / questions.length) * 100}%`,
                            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                        }}
                    />
                </div>

                {/* Question dots */}
                <div className="flex gap-1.5 mb-8">
                    {questions.map((_, i) => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${
                            i < responses.length ? 'bg-indigo-500' :
                            i === currentIndex ? 'bg-indigo-400/60' : 'bg-white/10'
                        }`} />
                    ))}
                </div>

                {/* Category badge */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-violet-500/20 text-violet-300 text-xs font-bold rounded-full border border-violet-500/30 uppercase tracking-wider">
                        {currentQ.category || 'Interest Assessment'}
                    </span>
                    <span className="text-xs text-indigo-400">No right or wrong answers — just your preference</span>
                </div>

                {/* Question card */}
                <div className="glass-card p-8 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.15)] border-indigo-500/20">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0">
                            {INTEREST_EMOJI[(currentQ.options?.[0]?.tag)] || '🎯'}
                        </div>
                        <h2 className="text-xl font-bold text-white leading-relaxed">
                            {currentQ.question}
                        </h2>
                    </div>
                </div>

                {/* Options — click to select, no reveal of correct/wrong */}
                <div className="space-y-3">
                    {(currentQ.options || []).map((opt, idx) => {
                        const emoji = INTEREST_EMOJI[opt.tag] || '•';
                        const isHovered = hoveredOpt === idx;

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelect(opt)}
                                onMouseEnter={() => setHoveredOpt(idx)}
                                onMouseLeave={() => setHoveredOpt(null)}
                                className="w-full p-4 rounded-2xl border text-left font-medium flex items-center gap-4 transition-all duration-200 group"
                                style={{
                                    background: isHovered ? 'rgba(99,102,241,0.15)' : 'rgba(15,23,42,0.6)',
                                    borderColor: isHovered ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)',
                                    boxShadow: isHovered ? '0 0 20px rgba(99,102,241,0.25)' : 'none',
                                    transform: isHovered ? 'translateX(4px)' : 'none',
                                }}
                            >
                                {/* Letter badge */}
                                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 border transition-all"
                                    style={{
                                        background: isHovered ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.05)',
                                        borderColor: isHovered ? '#6366f1' : 'rgba(255,255,255,0.1)',
                                        color: isHovered ? '#a5b4fc' : '#94a3b8'
                                    }}>
                                    {optionLetters[idx]}
                                </span>

                                {/* Text */}
                                <span className={`flex-1 transition-colors ${isHovered ? 'text-white' : 'text-indigo-200'}`}>
                                    {opt.text}
                                </span>

                                {/* Emoji tag indicator */}
                                <span className="text-lg shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                                    {emoji}
                                </span>

                                {/* Arrow on hover */}
                                <ChevronRight className={`h-4 w-4 shrink-0 transition-all ${isHovered ? 'text-indigo-400 translate-x-0.5' : 'text-transparent'}`} />
                            </button>
                        );
                    })}
                </div>

                {/* Footer hint */}
                <p className="text-center text-xs text-indigo-500 mt-8">
                    💡 Select the option that best describes <em>you</em> — there are no correct or incorrect answers.
                </p>
            </div>
        </div>
    );
};

export default InitialAssessmentPage;
