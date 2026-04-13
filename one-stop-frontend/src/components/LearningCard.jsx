import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

const STATUS_CONFIG = {
  mastered: { color: 'green', bg: 'glass-card bg-emerald-500/5', border: 'border-emerald-500/20', badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', icon: CheckCircle, label: 'Mastered' },
  learning: { color: 'blue', bg: 'glass-card bg-indigo-500/5', border: 'border-indigo-500/20', badge: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30', icon: BookOpen, label: 'In Progress' },
  weak: { color: 'red', bg: 'glass-card bg-rose-500/5', border: 'border-rose-500/20', badge: 'bg-rose-500/20 text-rose-400 border border-rose-500/30', icon: AlertTriangle, label: 'Needs Work' },
  untouched: { color: 'slate', bg: 'glass-card', border: 'border-white/10', badge: 'bg-white/5 text-indigo-300 border border-white/10', icon: Lock, label: 'Not Started' },
};

const DIFFICULTY_LABELS = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];

const LearningCard = ({ topic, status, accuracy, recommendedDifficulty, description, onStart, onViewNotes }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.untouched;
  const StatusIcon = config.icon;

  return (
    <div className={`rounded-xl border ${config.border} ${config.bg} p-5 flex flex-col gap-4 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:-translate-y-0.5`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-white text-base">{topic}</h3>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${config.badge}`}>
              <StatusIcon className="inline h-3 w-3 mr-1" />
              {config.label}
            </span>
          </div>
          {description && (
            <p className="text-xs text-indigo-200 mt-1 leading-relaxed">{description}</p>
          )}
        </div>
        {accuracy !== null && (
          <div className="text-right shrink-0">
            <p className="text-2xl font-extrabold text-white">{accuracy}%</p>
            <p className="text-[10px] text-indigo-300">Accuracy</p>
          </div>
        )}
      </div>

      {/* Accuracy bar */}
      {accuracy !== null && (
        <div>
          <div className="w-full bg-[#0F172A] rounded-full h-1.5 border border-white/5">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 shadow-[0_0_10px_currentColor] ${
                accuracy >= 80 ? 'bg-emerald-400 text-emerald-400' : accuracy >= 50 ? 'bg-indigo-400 text-indigo-400' : 'bg-rose-400 text-rose-400'
              }`}
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs font-medium text-indigo-300">
          🎯 Next: <span className="font-bold text-indigo-200">{DIFFICULTY_LABELS[recommendedDifficulty] || 'Beginner'}</span>
        </span>
        <div className="flex gap-2">
          {onViewNotes && (
            <button
              onClick={() => onViewNotes(topic)}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 bg-white/10 text-white border border-white/20 hover:bg-white/20"
              title="Generate AI Notes"
            >
              <BookOpen className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onStart(topic)}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 shadow-[0_0_10px_currentColor] ${
              status === 'mastered'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
                : status === 'weak'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500/30'
                : status === 'untouched'
                ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50 hover:bg-indigo-500/30'
            }`}
          >
            {status === 'mastered' ? 'Review' : status === 'untouched' ? 'Begin Quiz' : 'Continue'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningCard;
