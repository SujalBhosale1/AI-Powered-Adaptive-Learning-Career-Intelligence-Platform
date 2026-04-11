import { AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConfusionAlert = ({ topics = [] }) => {
  if (topics.length === 0) return null;

  return (
    <div className="glass-card p-5 border-amber-500/30">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
        <h3 className="font-bold text-amber-300">Confusion Detected</h3>
      </div>
      <p className="text-sm text-amber-200/80 mb-4">
        Our AI noticed you&apos;re struggling with these topics. We&apos;ve simplified the content and added focused revision.
      </p>
      <div className="space-y-2 mb-4">
        {topics.slice(0, 3).map(topic => (
          <div key={topic} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-amber-400 rounded-full shrink-0 shadow-[0_0_8px_currentColor]" />
            <span className="font-medium text-amber-200">{topic}</span>
            <span className="text-amber-400/80 text-xs">— needs revision</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
        <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
        <p className="text-xs text-amber-200/90">
          <strong>Tip:</strong> Try the simplified quiz mode — fewer options, more hints. Build confidence first!
        </p>
      </div>
      <Link to="/quiz" className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors">
        Start Focused Revision <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default ConfusionAlert;
