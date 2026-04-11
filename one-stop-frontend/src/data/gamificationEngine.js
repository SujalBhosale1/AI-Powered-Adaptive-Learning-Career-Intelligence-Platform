// Gamification Engine — XP, levels, badges, streaks
// localStorage key: onestop_xp, onestop_badges

const XP_KEY = 'onestop_xp';
const BADGES_KEY = 'onestop_badges';

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500];

const BADGE_DEFINITIONS = [
  { id: 'first_quiz', icon: '🎯', title: 'First Steps', description: 'Complete your first quiz' },
  { id: 'perfect_quiz', icon: '⭐', title: 'Perfect Score', description: 'Get 100% on any quiz' },
  { id: 'streak_3', icon: '🔥', title: 'On Fire', description: 'Maintain a 3-day streak' },
  { id: 'streak_7', icon: '💎', title: 'Diamond Streak', description: 'Maintain a 7-day streak' },
  { id: 'topic_master', icon: '🏆', title: 'Topic Master', description: 'Achieve 80%+ in any topic' },
  { id: 'all_topics', icon: '🌟', title: 'Polymath', description: 'Attempt all 8 topics' },
  { id: 'quiz_10', icon: '📚', title: 'Knowledge Seeker', description: 'Complete 10 quizzes' },
  { id: 'level_5', icon: '🚀', title: 'Rising Star', description: 'Reach level 5' },
];

const DEFAULT_XP = {
  total: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  quizCount: 0,
};

export function getXPData() {
  try {
    const raw = localStorage.getItem(XP_KEY);
    return raw ? { ...DEFAULT_XP, ...JSON.parse(raw) } : { ...DEFAULT_XP };
  } catch {
    return { ...DEFAULT_XP };
  }
}

export function getBadges() {
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getLevel(totalXP) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXPForNextLevel(totalXP) {
  const level = getLevel(totalXP);
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const progress = totalXP - currentThreshold;
  const needed = nextThreshold - currentThreshold;
  return { progress, needed, percent: Math.round((progress / needed) * 100) };
}

export function getLevelTitle(level) {
  const titles = ['', 'Novice', 'Apprentice', 'Explorer', 'Learner', 'Scholar', 'Expert', 'Master', 'Champion', 'Legend', 'Grandmaster', 'Titan'];
  return titles[Math.min(level, titles.length - 1)];
}

// Award XP and update streak
// reason: 'quiz_complete' | 'correct_answer' | 'daily_login'
export function awardXP(reason, count = 1) {
  const data = getXPData();
  const XP_MAP = { quiz_complete: 50, correct_answer: 10, daily_login: 25 };
  const earned = (XP_MAP[reason] ?? 0) * count;
  
  // Update streak
  const today = new Date().toDateString();
  const lastActive = data.lastActiveDate ? new Date(data.lastActiveDate).toDateString() : null;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  let newStreak = data.streak;
  if (lastActive === today) {
    // already logged in today, no streak change
  } else if (lastActive === yesterday) {
    newStreak += 1;
  } else {
    newStreak = 1; // streak broken
  }

  const newTotal = data.total + earned;
  const updated = {
    ...data,
    total: newTotal,
    level: getLevel(newTotal),
    streak: newStreak,
    lastActiveDate: new Date().toISOString(),
    quizCount: reason === 'quiz_complete' ? data.quizCount + 1 : data.quizCount,
  };
  localStorage.setItem(XP_KEY, JSON.stringify(updated));
  return { earned, updated };
}

// Check and award badges based on current state
export function checkAndAwardBadges(skillScores) {
  const xpData = getXPData();
  const earnedIds = getBadges();
  const newBadges = [];

  const check = (id, condition) => {
    if (!earnedIds.includes(id) && condition) {
      earnedIds.push(id);
      newBadges.push(BADGE_DEFINITIONS.find(b => b.id === id));
    }
  };

  check('first_quiz', xpData.quizCount >= 1);
  check('quiz_10', xpData.quizCount >= 10);
  check('streak_3', xpData.streak >= 3);
  check('streak_7', xpData.streak >= 7);
  check('level_5', xpData.level >= 5);

  // topic master
  if (skillScores) {
    const mastered = Object.values(skillScores).some(s => s.total > 0 && (s.correct / s.total) >= 0.8);
    check('topic_master', mastered);
    const allAttempted = Object.values(skillScores).every(s => s.total > 0);
    check('all_topics', allAttempted);
  }

  if (newBadges.length > 0) {
    localStorage.setItem(BADGES_KEY, JSON.stringify(earnedIds));
  }

  return newBadges;
}

export function getAllBadgeDefinitions() {
  return BADGE_DEFINITIONS;
}

// Generate simulated leaderboard data
export function getLeaderboard(studentName = 'You', studentXP = null) {
  const xpData = getXPData();
  const myXP = studentXP ?? xpData.total;
  
  const peers = [
    { name: 'Riya Sharma', xp: 4200, streak: 12, level: 8, avatar: '🧠' },
    { name: 'Aarav Patel', xp: 3700, streak: 8, level: 7, avatar: '⚡' },
    { name: 'Meera Joshi', xp: 3150, streak: 15, level: 7, avatar: '🌟' },
    { name: 'Kabir Singh', xp: 2800, streak: 4, level: 6, avatar: '🔥' },
    { name: 'Ananya Nair', xp: 2500, streak: 9, level: 6, avatar: '💡' },
    { name: 'Dev Mehta', xp: 2100, streak: 3, level: 5, avatar: '🚀' },
    { name: 'Priya Agarwal', xp: 1800, streak: 6, level: 5, avatar: '📚' },
    { name: 'Ishaan Gupta', xp: 1500, streak: 2, level: 4, avatar: '🎯' },
    { name: 'Sana Khan', xp: 1200, streak: 1, level: 4, avatar: '🌈' },
    { name: 'Rohan Verma', xp: 900, streak: 0, level: 3, avatar: '⭐' },
    { name: 'Pooja Desai', xp: 650, streak: 0, level: 3, avatar: '🏆' },
    { name: 'Arjun Reddy', xp: 400, streak: 0, level: 2, avatar: '💎' },
  ];
  
  const you = { name: studentName, xp: myXP, streak: xpData.streak, level: xpData.level, avatar: '😊', isYou: true };
  const all = [...peers, you].sort((a, b) => b.xp - a.xp).map((p, i) => ({ ...p, rank: i + 1 }));
  return all;
}
