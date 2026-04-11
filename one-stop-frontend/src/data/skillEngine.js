// Skill Engine — tracks per-topic accuracy from quiz history
// All state stored in localStorage under key: onestop_skill_scores

const STORAGE_KEY = 'onestop_skill_scores';

const TOPIC_DEFAULTS = {
  Python: { correct: 0, total: 0, lastAttempt: null },
  DSA: { correct: 0, total: 0, lastAttempt: null },
  OOP: { correct: 0, total: 0, lastAttempt: null },
  OS: { correct: 0, total: 0, lastAttempt: null },
  DBMS: { correct: 0, total: 0, lastAttempt: null },
  Networks: { correct: 0, total: 0, lastAttempt: null },
  'Web Dev': { correct: 0, total: 0, lastAttempt: null },
  Math: { correct: 0, total: 0, lastAttempt: null },
};

export function getSkillScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    // Merge with defaults so new topics always exist
    return { ...TOPIC_DEFAULTS, ...saved };
  } catch {
    return { ...TOPIC_DEFAULTS };
  }
}

export function saveSkillScores(scores) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

// Record answers from a quiz session
// results: [{ topic, isCorrect }]
export function recordQuizResults(results) {
  const scores = getSkillScores();
  results.forEach(({ topic, isCorrect }) => {
    if (!scores[topic]) scores[topic] = { correct: 0, total: 0, lastAttempt: null };
    scores[topic].total += 1;
    if (isCorrect) scores[topic].correct += 1;
    scores[topic].lastAttempt = new Date().toISOString();
  });
  saveSkillScores(scores);
  return scores;
}

// Compute accuracy % for a topic
export function getAccuracy(topic) {
  const scores = getSkillScores();
  const s = scores[topic];
  if (!s || s.total === 0) return null; // untouched
  return Math.round((s.correct / s.total) * 100);
}

// Classify topic mastery level
export function getTopicStatus(topic) {
  const acc = getAccuracy(topic);
  if (acc === null) return 'untouched';
  if (acc >= 80) return 'mastered';
  if (acc >= 50) return 'learning';
  return 'weak';
}

// Returns all topics sorted: weak first, then learning, then mastered, then untouched
export function getPrioritizedTopics() {
  const scores = getSkillScores();
  const ORDER = { weak: 0, learning: 1, mastered: 2, untouched: 3 };
  return Object.keys(scores).sort((a, b) => ORDER[getTopicStatus(a)] - ORDER[getTopicStatus(b)]);
}

// Detect confusion — topic where student takes >2 retries OR accuracy < 40%
export function getConfusedTopics() {
  return Object.keys(getSkillScores()).filter(topic => {
    const acc = getAccuracy(topic);
    return acc !== null && acc < 40;
  });
}

// Recommended difficulty for a topic based on accuracy
export function getRecommendedDifficulty(topic) {
  const acc = getAccuracy(topic);
  if (acc === null || acc < 40) return 1;
  if (acc < 60) return 2;
  if (acc < 75) return 3;
  if (acc < 90) return 4;
  return 5;
}

// Overall platform score across all topics
export function getOverallScore() {
  const scores = getSkillScores();
  const attempted = Object.values(scores).filter(s => s.total > 0);
  if (attempted.length === 0) return 0;
  const totalCorrect = attempted.reduce((sum, s) => sum + s.correct, 0);
  const totalQ = attempted.reduce((sum, s) => sum + s.total, 0);
  return Math.round((totalCorrect / totalQ) * 100);
}
