`1`
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, FileText, Share2, Printer, Loader2 } from 'lucide-react';

const ResumeBuilder = ({ userProfile }) => {
    const resumeRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const element = resumeRef.current;
            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            // Calculate dimensions to fit A4 page
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0; // Start from top

            // If content is longer than A4, we handle single page primarily for resumes, 
            // but this scales it to fit ONE page. For multi-page, logic differs.
            const componentWidth = pdfWidth;
            const componentHeight = (imgHeight * pdfWidth) / imgWidth;

            pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
            pdf.save(`${userProfile.name.replace(/\s+/g, '_')}_Resume.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Control Bar */}
            <div className="glass-card p-4 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.1)] border-white/10 flex flex-wrap gap-4 items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="text-indigo-400" />
                        Resume Builder
                    </h2>
                    <p className="text-sm text-indigo-200">Preview and download your ATS-friendly resume.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={generatePDF}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-transparent"
                    >
                        {isGenerating ? <Loader2 className="animate-spin h-4 w-4" /> : <Download className="h-4 w-4" />}
                        Download PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 text-indigo-200 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                        <Share2 className="h-4 w-4" />
                        Share
                    </button>
                </div>
            </div>

            {/* Resume Preview Area (The content to be printed) */}
            <div className="overflow-hidden glass-card border-none bg-black/20 p-4 md:p-8 rounded-xl flex justify-center">
                <div
                    ref={resumeRef}
                    className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-8 md:p-12 text-slate-800"
                    style={{ transform: "scale(0.8)", transformOrigin: "top center" }} // Scaled for preview visibility 
                >
                    {/* Header */}
                    <div className="border-b-2 border-slate-800 pb-6 mb-6">
                        <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-widest">{userProfile.name}</h1>
                        <p className="text-xl text-slate-600 mt-2 font-light">{userProfile.role || "Engineering Student"}</p>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                            <span>{userProfile.email}</span>
                            <span>•</span>
                            <span>{userProfile.phone || "+91 98765 43210"}</span>
                            <span>•</span>
                            <span>{userProfile.location || "Mumbai, India"}</span>
                            {userProfile.linkedin && (
                                <>
                                    <span>•</span>
                                    <span>{userProfile.linkedin}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-3 gap-8">

                        {/* Left Column (Skills, Education) */}
                        <div className="col-span-1 space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-slate-800 uppercase border-b border-slate-300 pb-2 mb-4">Education</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-bold text-slate-900">B.Tech in Computer Engineering</h4>
                                        <p className="text-sm text-slate-600">XYZ University</p>
                                        <p className="text-xs text-slate-500 italic">2023 - 2027</p>
                                        <p className="text-sm mt-1">CGPA: 9.2/10</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Class XII (Science)</h4>
                                        <p className="text-sm text-slate-600">ABC High School</p>
                                        <p className="text-xs text-slate-500 italic">2021 - 2023</p>
                                        <p className="text-sm mt-1">Percentage: 95%</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-slate-800 uppercase border-b border-slate-300 pb-2 mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {(userProfile.skills || ["Python", "React", "Java", "SQL", "Git"]).map((skill, i) => (
                                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-slate-800 uppercase border-b border-slate-300 pb-2 mb-4">Languages</h3>
                                <ul className="text-sm space-y-1 text-slate-700 list-disc list-inside">
                                    <li>English (Fluent)</li>
                                    <li>Hindi (Native)</li>
                                    <li>Marathi (Limited)</li>
                                </ul>
                            </section>
                        </div>

                        {/* Right Column (Experience, Projects) */}
                        <div className="col-span-2 space-y-8">
                            <section>
                                <h3 className="text-lg font-bold text-slate-800 uppercase border-b border-slate-300 pb-2 mb-4">Experience</h3>
                                {userProfile.experience && userProfile.experience.length > 0 ? (
                                    userProfile.experience.map((exp, i) => (
                                        <div key={i} className="mb-4">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-bold text-slate-900">{exp.role}</h4>
                                                <span className="text-xs text-slate-500 italic">{exp.duration}</span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-700">{exp.company}</p>
                                            <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
                                                {exp.points.map((pt, j) => <li key={j}>{pt}</li>)}
                                            </ul>
                                        </div>
                                    ))
                                ) : (
                                    <div className="mb-4">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-slate-900">Web Development Intern</h4>
                                            <span className="text-xs text-slate-500 italic">June 2025 - Aug 2025</span>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700">TechSolutions Inc.</p>
                                        <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
                                            <li>Developed responsive frontend components using React.js.</li>
                                            <li>Optimized page load speeds by 20% through code splitting.</li>
                                            <li>Collaborated with the design team to implement UI/UX improvements.</li>
                                        </ul>
                                    </div>
                                )}
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-slate-800 uppercase border-b border-slate-300 pb-2 mb-4">Projects</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-slate-900">Career Guidance AI</h4>
                                            <span className="text-xs text-slate-500 italic">React, Node.js, ML</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1">
                                            Built a platform connecting students with personalized career roadmaps used by 500+ users.
                                            Implemented JWT auth and Real-time chat.
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-slate-900">E-Commerce Dashboard</h4>
                                            <span className="text-xs text-slate-500 italic">MERN Stack</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1">
                                            Designed an admin dashboard for tracking sales and inventory with data visualization charts.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
