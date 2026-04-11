import { getXPForNextLevel, getLevelTitle } from '../data/gamificationEngine';
import { Zap } from 'lucide-react';

const XPBadge = ({ xpData, compact = false }) => {
  const level = xpData?.level ?? 1;
  const total = xpData?.total ?? 0;
  const levelInfo = getXPForNextLevel(total);
  const title = getLevelTitle(level);

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
        <Zap className="h-3.5 w-3.5" />
        <span>Lv.{level}</span>
        <span className="opacity-75">·</span>
        <span>{total} XP</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-purple-200 text-xs font-medium uppercase tracking-widest">Level {level}</p>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Zap className="h-6 w-6 text-yellow-300" />
        </div>
      </div>

      {/* XP Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-purple-200 mb-1">
          <span>{levelInfo.progress} XP</span>
          <span>{levelInfo.needed} XP to next level</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-yellow-300 h-2 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(levelInfo.percent, 100)}%` }}
          />
        </div>
      </div>

      <p className="mt-3 text-sm text-purple-100">
        <span className="font-bold text-yellow-300">{total}</span> total XP earned
      </p>
    </div>
  );
};

export default XPBadge;
