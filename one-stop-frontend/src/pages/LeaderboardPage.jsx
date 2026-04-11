import { useState } from 'react';
import { getLeaderboard } from '../data/gamificationEngine';
import { useStudentData } from '../hooks/useStudentData';
import { getLevelTitle, getXPForNextLevel } from '../data/gamificationEngine';
import { Trophy, Flame, Zap, Crown, Medal, Star } from 'lucide-react';

const RANK_ICONS = { 1: '🥇', 2: '🥈', 3: '🥉' };

const LeaderboardPage = () => {
  const { xpData } = useStudentData();
  const [filter, setFilter] = useState('All Time');
  const leaderboard = getLeaderboard('You', xpData?.total ?? 0);

  const myRank = leaderboard.find(p => p.isYou)?.rank;

  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400/20 rounded-2xl flex items-center justify-center border border-yellow-400/30">
            <Trophy className="h-8 w-8 text-yellow-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Leaderboard</h1>
          <p className="text-indigo-200 mt-1">Compete with peers and climb the ranks</p>
        </div>

        {/* My Rank Card */}
        <div className="glass-card bg-gradient-to-r from-violet-500/20 to-indigo-500/20 border-violet-500/30 p-5 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-violet-500/30 rounded-2xl flex items-center justify-center text-2xl border border-violet-400/40">
              😊
            </div>
            <div className="flex-1">
              <p className="text-violet-300 text-xs font-semibold uppercase tracking-wide">Your Rank</p>
              <p className="text-white font-bold text-xl">#{myRank} — {getLevelTitle(xpData?.level ?? 1)}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                  <Zap className="h-3.5 w-3.5" /> {xpData?.total ?? 0} XP
                </span>
                <span className="flex items-center gap-1 text-orange-400 text-sm font-semibold">
                  <Flame className="h-3.5 w-3.5" /> {xpData?.streak ?? 0} day streak
                </span>
              </div>
            </div>
            <div className="text-4xl font-extrabold text-white/20">#{myRank}</div>
          </div>
          {/* XP bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-violet-300 mb-1">
              <span>Level {xpData?.level ?? 1}</span>
              <span>{getXPForNextLevel(xpData?.total ?? 0).needed} XP to next level</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all"
                style={{ width: `${getXPForNextLevel(xpData?.total ?? 0).percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {['All Time', 'This Week', 'Today'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-transparent'
                  : 'bg-white/5 text-indigo-300 border border-white/10 hover:border-indigo-400/40 hover:text-indigo-200 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Leaderboard List */}
        <div className="space-y-2">
          {leaderboard.map((player, i) => (
            <div
              key={player.name}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-white/10 ${
                player.isYou
                  ? 'glass-card bg-violet-500/20 border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                  : i < 3
                  ? 'glass-card bg-white/5 border-yellow-400/20'
                  : 'glass-card border-white/5'
              }`}
            >
              {/* Rank */}
              <div className="w-10 text-center shrink-0">
                {RANK_ICONS[player.rank] ? (
                  <span className="text-2xl">{RANK_ICONS[player.rank]}</span>
                ) : (
                  <span className={`text-sm font-bold ${player.isYou ? 'text-violet-300' : 'text-indigo-300'}`}>
                    #{player.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl border shrink-0 ${
                player.isYou ? 'bg-violet-500/30 border-violet-400/50' : 'bg-white/5 border-white/10'
              }`}>
                {player.avatar}
              </div>

              {/* Name + Level */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`font-bold truncate ${player.isYou ? 'text-violet-200' : 'text-white'}`}>
                    {player.name}
                    {player.isYou && <span className="ml-1 text-xs bg-violet-500/40 text-violet-300 border border-violet-500/50 px-2 py-0.5 rounded-full">You</span>}
                  </p>
                </div>
                <p className="text-xs text-indigo-300">{getLevelTitle(player.level)} · Lv.{player.level}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 shrink-0">
                {player.streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-400">
                    <Flame className="h-3.5 w-3.5" />
                    <span className="text-xs font-semibold">{player.streak}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-yellow-400">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-bold">{player.xp.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-indigo-300 text-sm pb-4">
          Complete quizzes to earn XP and climb the leaderboard 🚀
        </p>
      </div>
    </div>
  );
};

export default LeaderboardPage;
