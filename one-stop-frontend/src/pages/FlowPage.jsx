import { ArrowRight, Book, Briefcase, Code, Compass, Award, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const FlowStep = ({ icon: Icon, title, description, linkTo, color }) => (
    <div className="relative flex items-start gap-6 pb-12 last:pb-0 group">
        <div className={`absolute top-0 left-6 h-full w-0.5 bg-white/10 group-last:hidden`}></div>
        <div className={`relative z-10 flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#020617] shadow-[0_0_10px_currentColor] bg-${color}-500/20 text-${color}-400`}>
            <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 glass-card p-6 border-white/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                {title}
                {linkTo && <Link to={linkTo} className="text-sm font-normal text-indigo-400 hover:text-indigo-300 hover:underline flex items-center ml-auto">Go to Domain <ArrowRight className="h-4 w-4 ml-1" /></Link>}
            </h3>
            <p className="text-indigo-200 mb-4">{description}</p>

            {linkTo ? (
                <Link
                    to={linkTo}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-${color}-300 bg-${color}-500/10 hover:bg-${color}-500/20 border border-${color}-500/20 transition-colors`}
                >
                    Start this Phase
                </Link>
            ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-slate-400 bg-white/5 border border-white/10 cursor-not-allowed">
                    Coming Soon
                </span>
            )}
        </div>
    </div>
);

const FlowPage = () => {
    const steps = [
        {
            icon: Compass,
            title: "Discover & Assess",
            description: "Start by understanding your strengths and interests. Take our assessment to find the best engineering branch for you.",
            linkTo: "/dashboard", // Assuming assessment is in dashboard or a specific route
            color: "blue"
        },
        {
            icon: Book,
            title: "Build Fundamentals",
            description: "Master the core concepts of your chosen field. We provide curated resources and roadmaps for every semester.",
            linkTo: "/dashboard", // Placeholder
            color: "indigo"
        },
        {
            icon: Code,
            title: "Skill Acquisition",
            description: "Dive deep into technical skills. Learn by doing specifically designed projects and coding challenges.",
            linkTo: "/dashboard", // Placeholder
            color: "violet"
        },
        {
            icon: Briefcase,
            title: "Internship Preparation",
            description: "Get resume reviews, mock interviews, and access to exclusive internship listings.",
            linkTo: "/dashboard", // Placeholder
            color: "purple"
        },
        {
            icon: Award,
            title: "Get Certified",
            description: "Earn industry-recognized certifications to validate your skills and stand out to recruiters.",
            linkTo: "/payment", // Placeholder for paid certs
            color: "pink"
        },
        {
            icon: Rocket,
            title: "Launch Career",
            description: "Land your dream job! Utilize our placement support and alumni network.",
            linkTo: null,
            color: "emerald"
        }
    ];

    return (
        <div className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-white mb-4">Your Career <span className="text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">Flow</span></h1>
                    <p className="text-xl text-indigo-200">A step-by-step roadmap to guide you from fresher to professional.</p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {steps.map((step, index) => (
                        <FlowStep key={index} {...step} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FlowPage;
