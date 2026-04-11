import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import FeatureCard from '../components/FeatureCard';
import FAQ from '../components/FAQ';
import { Compass, BookOpen, Briefcase, Map, Star, Users, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);
    return (
        <div className="flex flex-col font-sans text-white min-h-screen bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617]">

            {/* HERO SECTION */}
            <div className="relative overflow-hidden">

                {/* Background glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center justify-between gap-10">

                    {/* LEFT */}
                    <div className="max-w-xl">

                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm mb-6">
                            ⭐ #1 Career Guidance Platform
                        </div>

                        <h1 className="text-5xl font-bold leading-tight mb-6">
                            Build Your Future <br />
                            with{" "}
                            <span className="bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
                                Precision
                            </span>
                        </h1>

                        <p className="text-gray-400 mb-8">
                            Discover your perfect engineering path, bridge skill gaps,
                            and land top internships with AI-powered recommendations.
                        </p>

                        <div className="flex gap-4">
                            <Link
                                to="/register"
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-105 transition"
                            >
                                Get Started 🚀
                            </Link>

                            <Link
                                to="/flow"
                                className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition"
                            >
                                Explore
                            </Link>
                        </div>

                    </div>

                    {/* RIGHT GLASS CARD (CURVED ROADMAP) */}
                    <div className="w-full lg:w-[550px] min-h-[420px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_rgba(99,102,241,0.15)] flex flex-col justify-between relative overflow-hidden group">
                        
                        {/* Background subtle glow effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none"></div>

                        {/* Header */}
                        <div className="text-center z-10 relative">
                            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                                Curved Roadmap Infographic
                            </h3>
                            <p className="text-xs md:text-sm text-gray-400 mt-2">
                                Your learning journey beautifully mapped
                            </p>
                        </div>

                        {/* Curved Area */}
                        <div className="relative flex-grow w-full mt-12 mb-4 h-[220px]">
                            
                            {/* SVG Wavy Line Background */}
                            <svg className="absolute w-full h-full top-0 left-0 pointer-events-none drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path 
                                    d="M 10 25 C 20 25, 20 75, 30 75 S 40 25, 50 25 S 60 75, 70 75 S 80 25, 90 25" 
                                    fill="none" 
                                    stroke="url(#gradient-line)" 
                                    strokeWidth="1.5" 
                                    strokeDasharray="4, 4" 
                                    vectorEffect="non-scaling-stroke"
                                />
                                <defs>
                                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#c084fc" />
                                        <stop offset="50%" stopColor="#818cf8" />
                                        <stop offset="100%" stopColor="#3b82f6" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Nodes Overlay */}
                            {[
                                { id: '01', title: 'Goal', icon: '🎯', desc: 'Set target', top: true, pos: 10 },
                                { id: '02', title: 'Analyze', icon: '🤖', desc: 'AI tech scan', top: false, pos: 30 },
                                { id: '03', title: 'Skill Gap', icon: '📊', desc: 'Find missing', top: true, pos: 50 },
                                { id: '04', title: 'Roadmap', icon: '📈', desc: 'Generate path', top: false, pos: 70 },
                                { id: '05', title: 'Internship', icon: '💼', desc: 'Get hired', top: true, pos: 90 },
                            ].map((node, i) => (
                                <div 
                                    key={i} 
                                    className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 z-10 w-24 hover:scale-110 transition-transform duration-300 cursor-default"
                                    style={{ left: `${node.pos}%`, top: node.top ? '25%' : '75%' }}
                                >
                                    {/* Text Above for Bottom Nodes */}
                                    {!node.top && (
                                        <div className="mb-4 text-center">
                                            <h4 className="text-sm font-bold text-white tracking-wide drop-shadow-md">{node.title}</h4>
                                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{node.desc}</p>
                                        </div>
                                    )}

                                    {/* Glassmorphic Circle Node */}
                                    <div className="relative w-14 h-14 rounded-full bg-slate-900/50 backdrop-blur-md border-[1px] border-white/20 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-gradient-to-br from-white/10 to-transparent">
                                        <span className="text-2xl drop-shadow-lg">{node.icon}</span>

                                        {/* Number Badge */}
                                        <div className={`absolute w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-900 shadow-xl ${node.top ? '-top-3' : '-bottom-3'}`}>
                                            {node.id}
                                        </div>
                                    </div>

                                    {/* Text Below for Top Nodes */}
                                    {node.top && (
                                        <div className="mt-4 text-center">
                                            <h4 className="text-sm font-bold text-white tracking-wide drop-shadow-md">{node.title}</h4>
                                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{node.desc}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                        </div>
                    </div>

                </div>
            </div>

            {/* FEATURES */}
            <div className="max-w-7xl mx-auto px-6 py-20">

                <div className="text-center mb-16">
                    <h2 className="text-purple-400 font-semibold uppercase">Features</h2>
                    <p className="text-4xl font-bold mt-2">
                        Everything you need 🚀
                    </p>
                    <p className="text-gray-400 mt-4">
                        A powerful platform for your career growth.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    <FeatureCard title="Smart Guidance" description="AI suggestions" icon={Compass} />
                    <FeatureCard title="Skill Mastery" description="Personal learning path" icon={BookOpen} />
                    <FeatureCard title="Internships" description="Get real opportunities" icon={Briefcase} />
                    <FeatureCard title="Roadmap" description="Track your journey" icon={Map} />
                    <FeatureCard title="Trends" description="Market insights" icon={TrendingUp} />
                    <FeatureCard title="Fast Track" description="Accelerated learning" icon={Zap} />
                    <FeatureCard title="Community" description="Connect & grow" icon={Users} />
                    <FeatureCard title="Certification" description="Boost resume" icon={Star} />

                </div>
            </div>

            {/* FAQ */}
            <div className="px-6">
                <FAQ />
            </div>

            {/* CTA */}
            <div className="py-20 text-center">

                <h2 className="text-4xl font-bold mb-6">
                    Ready to start? 🚀
                </h2>

                <p className="text-gray-400 mb-8">
                    Join thousands of students today.
                </p>

                <Link
                    to="/register"
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-105 transition"
                >
                    Join Now
                </Link>

            </div>

        </div>
    );
};

export default LandingPage;