import { HelpCircle } from 'lucide-react';

const HelpPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.3)] border border-emerald-500/30">
                <HelpCircle size={40} />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-4">Help Center</h1>
            <p className="text-indigo-200 max-w-md mx-auto">
                Need assistance? Browse our FAQs or chat with our AI Assistant for instant help.
            </p>
        </div>
    );
};

export default HelpPage;
