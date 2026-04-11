import { ArrowRight } from 'lucide-react';

const FeatureCard = ({ title, description, icon: Icon }) => {
    return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:scale-105 transition duration-300 shadow-[0_0_25px_rgba(99,102,241,0.2)]">

            {/* Icon */}
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-white/20 text-purple-400">
                <Icon size={24} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-white mb-2">
                {title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 mb-4">
                {description}
            </p>

            {/* Learn More */}
            <div className="text-purple-400 font-medium flex items-center text-sm group cursor-pointer">
                Learn more
                <ArrowRight
                    size={16}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                />
            </div>

        </div>
    );
};

export default FeatureCard;