import { useState } from 'react';
import { useStudentData } from '../hooks/useStudentData';
import { getAccuracy } from '../data/skillEngine';
import { Users, Code2, Zap, MessageSquare, Star, Filter } from 'lucide-react';

const PEER_PROFILES = [
  { id: 1, name: 'Riya Sharma', avatar: '🧠', college: 'VJTI Mumbai', strongTopics: ['Python', 'Math', 'ML'], weakTopics: ['Networks', 'OS'], xp: 4200, streak: 12, bio: 'AI/ML enthusiast, loves competitive coding.' },
  { id: 2, name: 'Aarav Patel', avatar: '⚡', college: 'BITS Pilani', strongTopics: ['DSA', 'OOP', 'Web Dev'], weakTopics: ['DBMS', 'Math'], xp: 3700, streak: 8, bio: 'Full-stack developer building real-world apps.' },
  { id: 3, name: 'Meera Joshi', avatar: '🌟', college: 'IIT Bombay', strongTopics: ['DBMS', 'OS', 'Networks'], weakTopics: ['Python', 'Web Dev'], xp: 3150, streak: 15, bio: 'System design and backend architecture.' },
  { id: 4, name: 'Kabir Singh', avatar: '🔥', college: 'NIT Trichy', strongTopics: ['Web Dev', 'Python', 'OOP'], weakTopics: ['DSA', 'Math'], xp: 2800, streak: 4, bio: 'Open source contributor and startup builder.' },
  { id: 5, name: 'Ananya Nair', avatar: '💡', college: 'COEP Pune', strongTopics: ['Math', 'DSA', 'OOP'], weakTopics: ['Web Dev', 'Networks'], xp: 2500, streak: 9, bio: 'Research-oriented, interested in algorithms.' },
  { id: 6, name: 'Dev Mehta', avatar: '🚀', college: 'DTU Delhi', strongTopics: ['Networks', 'OS', 'DBMS'], weakTopics: ['Python', 'DSA'], xp: 2100, streak: 3, bio: 'DevOps and cloud computing enthusiast.' },
];

const computeMatchScore = (peer, mySkillScores) => {
  // Higher match = complementary skills (their strong = my weak and vice versa)
  let score = 0;
  peer.strongTopics.forEach(t => {
    const myAcc = getAccuracy(t);
    if (myAcc !== null && myAcc < 60) score += 2; // they're strong where I'm weak — good match
  });
  peer.weakTopics.forEach(t => {
    const myAcc = getAccuracy(t);
    if (myAcc !== null && myAcc > 75) score += 1; // I can help them
  });
  return Math.min(99, 60 + score * 8); // base 60%, bonus per overlap
};

const PeerMatchPage = () => {
  const { skillScores } = useStudentData();
  const [challengeModal, setChallengeModal] = useState(null);
  const [challengeScore, setChallengeScore] = useState(null);

  const peersWithMatch = PEER_PROFILES.map(p => ({
    ...p,
    matchScore: computeMatchScore(p, skillScores)
  })).sort((a, b) => b.matchScore - a.matchScore);

  const handleChallenge = (peer) => {
    setChallengeModal(peer);
    setChallengeScore(null);
    // Simulate challenge result after 2 seconds
    setTimeout(() => {
      const myScore = Math.floor(Math.random() * 4) + 5; // 5-8 out of 10
      const theirScore = Math.floor(Math.random() * 4) + 5;
      setChallengeScore({ mine: myScore, theirs: theirScore });
    }, 2000);
  };

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Collaborative Learning</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Peer Match</h1>
          <p className="text-indigo-200 mt-1">AI matches you with peers who complement your skill set for effective collaboration.</p>
        </div>

        {/* How it works */}
        <div className="bg-gradient-to-r from-cyan-600/80 to-blue-600/80 backdrop-blur-md rounded-2xl p-6 text-white grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] border border-white/10">
          {[
            { icon: Star, title: 'Skill Matching', desc: 'We analyze your strengths and weaknesses to find peers with complementary skills.' },
            { icon: Code2, title: 'Challenge Duels', desc: 'Quiz duels against peers on specific topics to test your knowledge competitively.' },
            { icon: MessageSquare, title: 'Study Together', desc: 'Connect and grow together — your strong topics help their weak ones and vice versa.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-3">
              <div className="w-9 h-9 bg-white/10 border border-white/20 shadow-inner rounded-xl flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{title}</p>
                <p className="text-cyan-100 text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Peer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {peersWithMatch.map((peer, i) => (
            <div key={peer.id} className={`glass-card p-5 flex flex-col gap-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:-translate-y-0.5 transition-all ${i === 0 ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/10'}`}>
              {/* Top */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/20 shrink-0">
                  {peer.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-white">{peer.name}</p>
                    {i === 0 && <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold px-2 py-0.5 rounded-full">Best Match</span>}
                  </div>
                  <p className="text-xs text-indigo-300">{peer.college}</p>
                  <p className="text-xs text-indigo-200 mt-1 leading-relaxed">{peer.bio}</p>
                </div>
              </div>

              {/* Match Score */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-indigo-200">Compatibility</span>
                  <span className="font-bold text-cyan-400">{peer.matchScore}%</span>
                </div>
                <div className="w-full bg-[#0F172A] rounded-full h-2 border border-white/5">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${peer.matchScore}%` }} />
                </div>
              </div>

              {/* Skill overlap */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide mb-1">Their Strengths</p>
                  <div className="flex flex-wrap gap-1">
                    {peer.strongTopics.slice(0, 3).map(t => (
                      <span key={t} className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-medium">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wide mb-1">Their Gaps</p>
                  <div className="flex flex-wrap gap-1">
                    {peer.weakTopics.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 px-1.5 py-0.5 rounded-md font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* XP + Streak */}
              <div className="flex items-center gap-3 text-xs text-indigo-300">
                <span className="flex items-center gap-1 font-semibold text-cyan-400"><Zap className="h-3.5 w-3.5" />{peer.xp} XP</span>
                <span className="flex items-center gap-1 font-semibold text-orange-400">🔥 {peer.streak}d streak</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleChallenge(peer)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5"
                >
                  <Code2 className="h-4 w-4" /> Challenge
                </button>
                <button className="flex-1 py-2.5 bg-white/5 border border-white/10 text-indigo-200 text-sm font-semibold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
                  <MessageSquare className="h-4 w-4" /> Study Together
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Challenge Modal */}
        {challengeModal && (
          <div className="fixed inset-0 bg-[#020617]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card shadow-2xl p-8 max-w-sm w-full text-center border-white/20">
              <div className="text-4xl mb-3">{challengeModal.avatar}</div>
              <h3 className="text-xl font-extrabold text-white mb-1">Quiz Duel</h3>
              <p className="text-indigo-200 text-sm mb-6">vs. <strong>{challengeModal.name}</strong></p>

              {!challengeScore ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
                  </div>
                  <p className="text-indigo-300 text-sm">Challenging {challengeModal.name}...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`rounded-2xl p-4 bg-white/5 border ${challengeScore.mine > challengeScore.theirs ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]'}`}>
                      <p className="text-2xl font-extrabold text-white">{challengeScore.mine}/10</p>
                      <p className="text-xs font-semibold text-indigo-300 mt-0.5">You</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <p className="text-2xl font-extrabold text-white">{challengeScore.theirs}/10</p>
                      <p className="text-xs font-semibold text-indigo-300 mt-0.5">{challengeModal.name.split(' ')[0]}</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg text-white">
                    {challengeScore.mine > challengeScore.theirs ? '🎉 You Win! +30 XP' : challengeScore.mine === challengeScore.theirs ? '🤝 It\'s a Tie!' : '💪 Better luck next time!'}
                  </p>
                </div>
              )}

              <button
                onClick={() => setChallengeModal(null)}
                className="mt-6 w-full py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerMatchPage;
