import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10 last:border-0">

            <button
                className="w-full py-4 flex justify-between items-center text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-white">
                    {question}
                </span>

                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-purple-400" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
            </button>

            {isOpen && (
                <div className="pb-4 text-gray-400">
                    {answer}
                </div>
            )}
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "How does One Stop help me choose a career?",
            answer: "We analyze your academic strengths, interests, and market trends to suggest the best path."
        },
        {
            question: "Is it free to use?",
            answer: "Basic features are free. Premium features are available in paid plans."
        },
        {
            question: "Can I find internships here?",
            answer: "Yes! We provide curated internships for students and freshers."
        },
        {
            question: "How does the 'Flow' work?",
            answer: "It is a step-by-step roadmap guiding you from college to job."
        }
    ];

    return (
        <div className="py-16">

            <div className="max-w-3xl mx-auto px-6">

                {/* TITLE */}
                <h2 className="text-3xl font-bold text-center text-white mb-10">
                    Frequently Asked Questions ❓
                </h2>

                {/* GLASS CONTAINER */}
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-6 py-4 shadow-[0_0_30px_rgba(99,102,241,0.2)]">

                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                        />
                    ))}

                </div>

            </div>
        </div>
    );
};

export default FAQ;