
import { useState } from 'react';
import { Lightbulb, Code, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';

const ProjectIdeaGenerator = ({ userSkills = [] }) => {
    const [interests, setInterests] = useState(userSkills.join(', ') || "React, Node.js");
    const [generatedIdeas, setGeneratedIdeas] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock AI generation logic
    const generateIdeas = () => {
        setIsGenerating(true);
        // Simulate API delay
        setTimeout(() => {
            const techs = interests.split(',').map(s => s.trim());
            const mainTech = techs[0] || "General";

            const ideas = [
                {
                    title: `Decentralized Voting System using ${mainTech}`,
                    difficulty: "Advanced",
                    description: `Build a secure, transparent voting platform using Blockchain and ${mainTech}. Ensure voter anonymity and real-time tallying.`,
                    techStack: ["Blockchain", mainTech, "Solidity", "TailwindCSS"]
                },
                {
                    title: `AI-Powered Career Counselor with ${mainTech}`,
                    difficulty: "Intermediate",
                    description: `Create a chatbot that analyzes student resumes and suggests career paths. Integrate OpenAI API with a ${mainTech} backend.`,
                    techStack: ["OpenAI API", mainTech, "Python", "Redis"]
                },
                {
                    title: `Real-time Collaboration Tool`,
                    difficulty: "Advanced",
                    description: `A whiteboard or code editor allowing multiple users to work together in real-time using WebSockets and ${mainTech}.`,
                    techStack: ["WebSockets", mainTech, "Socket.io", "MongoDB"]
                }
            ];

            setGeneratedIdeas(ideas);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <section className="glass-card shadow-[0_0_20px_rgba(99,102,241,0.1)] border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-indigo-400 h-5 w-5" />
                <h2 className="text-xl font-bold text-white">AI Project Idea Generator</h2>
            </div>

            <p className="text-indigo-200 mb-4 text-sm">
                Stuck on what to build for your final year? Enter your favorite technologies, and our AI will suggest unique, impressive project ideas.
            </p>

            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Code className="absolute left-3 top-2.5 h-5 w-5 text-indigo-300" />
                    <input
                        type="text"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#0F172A]/50 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white/5 outline-none transition-all placeholder:text-indigo-300/50"
                        placeholder="e.g. React, Python, Machine Learning"
                    />
                </div>
                <button
                    onClick={generateIdeas}
                    disabled={isGenerating}
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw className="h-4 w-4 animate-spin" /> Generating...
                        </>
                    ) : (
                        <>
                            <Lightbulb className="h-4 w-4" /> Generate Ideas
                        </>
                    )}
                </button>
            </div>

            {generatedIdeas.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {generatedIdeas.map((idea, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-400/50 transition-all cursor-default">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white">{idea.title}</h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${idea.difficulty === 'Advanced' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                                        idea.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    }`}>
                                    {idea.difficulty}
                                </span>
                            </div>
                            <p className="text-sm text-indigo-200/80 mb-3">{idea.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {idea.techStack.map(stack => (
                                    <span key={stack} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded text-indigo-200">
                                        {stack}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ProjectIdeaGenerator;
