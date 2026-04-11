import { useState, useEffect } from 'react';
import { useStudentData } from '../hooks/useStudentData';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Compass, TrendingUp, ChevronRight, Briefcase, DollarSign, Loader2, GitBranch } from 'lucide-react';
import CareerFlowchart from '../components/CareerFlowchart';

const FALLBACK_CAREERS = [
  {
    id: 'sde',
    title: 'Software Development Engineer',
    icon: '💻',
    color: 'indigo',
    matchPct: 85,
    requiredStrong: ['DSA', 'OOP', 'OS'],
    salary: '₹15–60 LPA',
    demand: 'Very High',
    description: 'Build scalable, efficient software systems. Ace FAANG-style interviews with strong DSA.',
    roadmap: [
      { phase: 'DSA', duration: '3 months', items: ['Arrays, Strings, Trees', 'Graphs & DP'] },
      { phase: 'System Design', duration: '2 months', items: ['HLD / LLD', 'Distributed Systems'] },
    ],
    companies: ['Google', 'Microsoft', 'Amazon'],
  }
];

// Helper to reliably map dynamic outputs to UI styles
const getCareerStyles = (index) => {
    const styles = [
        { icon: '🤖', color: 'emerald' },
        { icon: '🌐', color: 'blue' },
        { icon: '📊', color: 'violet' },
        { icon: '⚙️', color: 'green' },
        { icon: '💻', color: 'indigo' },
    ];
    return styles[index % styles.length];
};

const CareerPathPage = () => {
  const { getAccuracy } = useStudentData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [flowchartBranch, setFlowchartBranch] = useState(null);
  
  const [rankedPaths, setRankedPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize flowchart from registered branch on load
  useEffect(() => {
    if (user?.branch) {
      setFlowchartBranch(user.branch);
    }
  }, [user]);

  useEffect(() => {
    const fetchOllamaCareers = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${apiUrl}/career/suggest`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            
            if (data.success && data.recommendation && data.recommendation.careers?.length > 0) {
                // Map backend dynamic data into UI expected shape
                const dynamicPaths = data.recommendation.careers.map((c, idx) => {
                    const style = getCareerStyles(idx);
                    return {
                        id: `career-${idx}`,
                        title: c.title || 'Tech Role',
                        icon: style.icon,
                        color: style.color,
                        matchPct: c.matchPercent || 50,
                        requiredStrong: c.requiredSkills || [],
                        salary: c.salaryRange || '₹8–15 LPA',
                        demand: 'High',
                        description: `Recommended by AI Core. Focus on bridging the gap in: ${(c.gapSkills || []).join(', ')}.`,
                        roadmap: (c.roadmap || []).map((step, sIdx) => ({
                            phase: `Phase ${sIdx + 1}`,
                            duration: '1 month',
                            items: [step]
                        })),
                        companies: c.topCompanies || ['TechCorp']
                    };
                });
                setRankedPaths(dynamicPaths.sort((a, b) => b.matchPct - a.matchPct));
            } else {
                setRankedPaths(FALLBACK_CAREERS);
            }
        } catch(err) {
            console.error("AI Career Fetch Failed:", err);
            setRankedPaths(FALLBACK_CAREERS);
        } finally {
            setIsLoading(false);
        }
    };

    fetchOllamaCareers();
  }, []);

  if (isLoading) {
      return (
          <div className="py-12 flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
              <p className="text-emerald-200 font-semibold animate-pulse">Ollama AI is analyzing your profile...</p>
          </div>
      );
  }

  const topMatch = rankedPaths[0];

  if (selected) {
    const path = rankedPaths.find(p => p.id === selected);
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors text-sm font-medium">
            ← Back to Career Paths
          </button>

          <div className={`bg-gradient-to-br from-${path.color}-600/80 to-${path.color}-800/80 backdrop-blur-md rounded-3xl p-8 text-white border border-white/10 shadow-lg`}>
            <div className="text-5xl mb-3">{path.icon}</div>
            <h1 className="text-2xl font-extrabold mb-1">{path.title}</h1>
            <p className="text-white/80 mb-4">{path.description}</p>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold">
                <DollarSign className="h-4 w-4" /> {path.salary}
              </span>
              <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl text-sm font-semibold">
                <TrendingUp className="h-4 w-4" /> {path.demand} Demand
              </span>
            </div>
          </div>

          {/* Roadmap */}
          <div className="glass-card shadow-sm p-6">
            <h2 className="text-lg font-bold text-white mb-6">📍 Recommended Learning Roadmap</h2>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-white/10" />
              <div className="space-y-6">
                {path.roadmap.map((phase, i) => (
                  <div key={i} className="flex gap-6 relative">
                    <div className={`w-10 h-10 bg-[#0F172A] rounded-full border-2 border-${path.color}-500 flex items-center justify-center text-sm font-bold text-${path.color}-400 shrink-0 z-10 shadow-[0_0_10px_currentColor]`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white">{phase.phase}</h3>
                        <span className="text-xs text-indigo-300 font-medium">{phase.duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {phase.items.map(item => (
                          <span key={item} className="text-xs bg-white/5 border border-white/10 text-indigo-200 px-2 py-1 rounded-lg font-medium">{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Companies */}
          <div className="glass-card shadow-sm p-6">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-400" /> Top Hiring Companies
            </h2>
            <div className="flex flex-wrap gap-3">
              {path.companies.map((company, idx) => (
                <span key={idx} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-semibold text-indigo-200">{company}</span>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/learn')}
            className={`w-full py-4 bg-${path.color}-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg shadow-lg`}
          >
            Start This Career Path <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="h-5 w-5 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Ollama Analysis Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Career Path Recommendations</h1>
          <p className="text-indigo-200 mt-1">Based on your local LLM performance analytics.</p>
        </div>

        {/* Top Recommendation Banner */}
        <div className="bg-gradient-to-r from-emerald-600/80 to-teal-600/80 backdrop-blur-md rounded-2xl p-6 text-white flex flex-col sm:flex-row gap-4 items-center justify-between shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{topMatch.icon}</span>
            <div>
              <p className="text-emerald-200 text-sm font-semibold">🤖 Ollama Pick for You</p>
              <h2 className="text-2xl font-extrabold">{topMatch.title}</h2>
              <p className="text-emerald-100 text-sm">{topMatch.matchPct}% skill match · {topMatch.salary} · {topMatch.demand} Demand</p>
            </div>
          </div>
          <button
            onClick={() => setSelected(topMatch.id)}
            className="shrink-0 px-6 py-3 bg-white/20 border border-white/30 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition-colors shadow-md"
          >
            View Roadmap →
          </button>
        </div>

        {/* Career Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rankedPaths.map((path, i) => (
            <div
              key={path.id}
              className="glass-card flex flex-col gap-4 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:-translate-y-0.5 p-6 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{path.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white text-lg">{path.title}</h3>
                    {i === 0 && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.5 rounded-full">Best Match</span>}
                  </div>
                  <p className="text-sm text-indigo-300 mt-1">{path.description}</p>
                </div>
              </div>

              {/* Match bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-indigo-200 font-medium">Skill Match</span>
                  <span className={`font-bold ${path.matchPct >= 60 ? 'text-emerald-400' : path.matchPct >= 30 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {path.matchPct}%
                  </span>
                </div>
                <div className="w-full bg-[#0F172A] rounded-full h-2 border border-white/5">
                  <div
                    className={`h-2 rounded-full transition-all shadow-[0_0_10px_currentColor] ${path.matchPct >= 60 ? 'bg-emerald-400 text-emerald-400' : path.matchPct >= 30 ? 'bg-amber-400 text-amber-400' : 'bg-rose-400 text-rose-400'}`}
                    style={{ width: `${path.matchPct}%` }}
                  />
                </div>
              </div>

              {/* Required skills */}
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-1.5">Key Skills Needed</p>
                <div className="flex flex-wrap gap-1.5">
                  {path.requiredStrong.map((t, idx) => {
                    const acc = getAccuracy(t);
                    const isStrong = acc !== null && acc >= 60;
                    return (
                      <span
                        key={idx}
                        className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                          isStrong ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        }`}
                      >
                        {isStrong ? '✓ ' : '✗ '}{t}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-2">
                <div className="flex gap-3 text-xs text-indigo-300">
                  <span className="font-semibold text-white">{path.salary}</span>
                  <span className={`font-medium ${path.demand === 'Very High' ? 'text-emerald-400' : 'text-indigo-400'}`}>{path.demand} Demand</span>
                </div>
                <button
                  onClick={() => setSelected(path.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/20 border border-white/10 transition-colors"
                >
                  Explore <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── AI Flowchart Section ────────────────────────────────────────────── */}
        <div className="border-t border-white/10 pt-8 space-y-4">
          
          {/* Branch selector */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-indigo-400" />
              <span className="text-white font-bold">Show AI Flowchart for Branch:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'AI/ML'].map(b => (
                <button
                  key={b}
                  onClick={() => setFlowchartBranch(b)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all border ${
                    flowchartBranch === b
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-transparent shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                      : 'bg-white/5 text-indigo-300 border-white/10 hover:border-indigo-400/40 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Flowchart Component */}
          {flowchartBranch && <CareerFlowchart branch={flowchartBranch} />}
        </div>
      </div>
    </div>
  );
};

export default CareerPathPage;
