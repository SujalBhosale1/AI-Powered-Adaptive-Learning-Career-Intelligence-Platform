import { CheckCircle2, Circle, ArrowDown } from 'lucide-react';

const RoadmapTimeline = ({ steps }) => {
    return (
        <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10"></div>
            <div className="space-y-8 relative">
                {steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 mt-1 relative z-10 w-8 h-8 rounded-full bg-[#0F172A] border-2 border-indigo-500/50 flex items-center justify-center">
                            {step.status === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                            ) : (
                                <span className="text-sm font-bold text-indigo-400">{index + 1}</span>
                            )}
                        </div>
                        <div className="flex-grow pb-2">
                            <h4 className="font-semibold text-white">{step.title}</h4>
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 mb-2">
                                {step.month}
                            </span>
                            <p className="text-sm text-indigo-200">{step.description}</p>

                            {step.resources && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {step.resources.map((res, idx) => (
                                        <a key={idx} href="#" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline flex items-center">
                                            {res}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoadmapTimeline;
