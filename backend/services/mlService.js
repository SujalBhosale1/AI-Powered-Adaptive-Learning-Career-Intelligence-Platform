/**
 * mlService.js
 * Service layer that communicates with the Python FastAPI ML engine.
 * All calls are wrapped with try/catch — if ML server is down,
 * fallback responses are returned so the Node API stays functional.
 */

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';
const TIMEOUT_MS = 8000; // 8 second timeout

// ── Generic fetch wrapper ─────────────────────────────────────────
async function callML(endpoint, body) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Dynamic import for node-fetch (ESM)
    const { default: fetch } = await import('node-fetch');
    const res = await fetch(`${ML_API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`ML API error ${res.status}: ${text}`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.warn(`⚠️  ML API timeout on ${endpoint}`);
    } else {
      console.warn(`⚠️  ML API unavailable (${endpoint}):`, err.message);
    }
    return null; // caller handles null → fallback
  }
}

// ── Classify skills from quiz scores ─────────────────────────────
// scores: { dsa, webdev, ml, db, systemDesign } (0–100)
async function classifySkills(scores) {
  const result = await callML('/ml/classify-skills', { scores });
  if (result) return result;

  // Fallback: simple rule-based classification
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
  const level = avg >= 70 ? 'advanced' : avg >= 45 ? 'intermediate' : 'beginner';
  return {
    skill_level: level,
    confidence: 0.65,
    recommendations: getFallbackRecommendations(level),
    source: 'fallback',
  };
}

// ── Match careers based on user skills ───────────────────────────
// skills: string array
async function matchCareers(skills) {
  const result = await callML('/ml/career-match', { skills });
  if (result) return result;

  // Fallback: static career data
  return {
    matches: getFallbackCareerMatches(skills),
    source: 'fallback',
  };
}

// ── Predict future performance ────────────────────────────────────
async function predictPerformance(currentScores, studyHours, streak) {
  const result = await callML('/ml/predict-performance', {
    current_scores: currentScores,
    study_hours: studyHours,
    streak,
  });
  if (result) return result;

  const avg = currentScores.reduce((a, b) => a + b, 0) / (currentScores.length || 1);
  const predicted = Math.min(100, Math.round(avg + streak * 1.2 + studyHours * 0.8));
  return {
    predicted_score: predicted,
    confidence: 0.55,
    trend: predicted > avg ? 'improving' : 'stable',
    source: 'fallback',
  };
}

// ── Chat with ML bot ─────────────────────────────────────────────
async function chatWithML(message, context) {
  const result = await callML('/ml/chat', { message, context });
  if (result) return result;

  // Fallback: rule-based responses
  return getRuleBasedResponse(message);
}

// ── Fallback helpers ──────────────────────────────────────────────
function getFallbackRecommendations(level) {
  const map = {
    beginner: ['Start with fundamentals of DSA and Web Development', 'Practice 2–3 problems daily on LeetCode', 'Build 1 small project per week'],
    intermediate: ['Focus on system design concepts', 'Solve medium-level DSA problems', 'Start building full-stack projects'],
    advanced: ['Attempt hard LeetCode problems', 'Study distributed systems', 'Contribute to open source projects'],
  };
  return map[level] || map.beginner;
}

function getFallbackCareerMatches(skills) {
  const s = skills.map(x => x.toLowerCase());
  const matches = [];

  if (s.some(k => ['python', 'ml', 'tensorflow', 'pytorch', 'scikit'].some(t => k.includes(t)))) {
    matches.push({ career: 'ML Engineer', match_percent: 82, gap_skills: ['MLOps', 'Kubernetes'], salary: '10–25 LPA' });
  }
  if (s.some(k => ['react', 'node', 'javascript', 'html', 'css'].some(t => k.includes(t)))) {
    matches.push({ career: 'Full Stack Developer', match_percent: 78, gap_skills: ['System Design', 'Docker'], salary: '8–20 LPA' });
  }
  if (s.some(k => ['sql', 'mongodb', 'database', 'postgres'].some(t => k.includes(t)))) {
    matches.push({ career: 'Backend Engineer', match_percent: 72, gap_skills: ['Microservices', 'Kafka'], salary: '7–18 LPA' });
  }
  if (matches.length === 0) {
    matches.push({ career: 'Software Engineer', match_percent: 65, gap_skills: ['DSA', 'System Design'], salary: '6–15 LPA' });
  }
  return matches;
}

function getRuleBasedResponse(message) {
  const lower = message.toLowerCase();
  const keywords = [
    { k: ['dsa', 'algorithm', 'data structure', 'leetcode'], r: "For DSA, I recommend starting with Arrays → Linked Lists → Trees → Graphs → Dynamic Programming. Practice consistently on LeetCode (start with easy, then medium). Aim for 2–3 problems daily!", s: ['Tell me about trees', 'What is DP?', 'DSA roadmap'] },
    { k: ['python', 'django', 'flask', 'fastapi'], r: "Python is excellent! For backend: learn FastAPI (modern, fast) or Django (batteries included). For ML/Data Science: master NumPy, Pandas, Scikit-learn, then TensorFlow/PyTorch.", s: ['Python roadmap', 'Best Python frameworks', 'Python for ML'] },
    { k: ['career', 'job', 'placement', 'interview'], r: "For placements: 1) Master DSA (3–4 months), 2) Build 2–3 strong projects, 3) Learn system design basics, 4) Practice mock interviews. The combination of DSA + projects is what companies look for most!", s: ['Interview tips', 'How to get placed?', 'Career roadmap'] },
    { k: ['machine learning', 'ml', 'ai', 'deep learning'], r: "AI/ML roadmap: Python basics → Statistics & Math → Scikit-learn → Deep Learning (TensorFlow/PyTorch) → Specialization (NLP, CV, Reinforcement Learning). Kaggle competitions are great for practice!", s: ['ML roadmap', 'How to learn AI?', 'Deep learning resources'] },
    { k: ['react', 'frontend', 'javascript', 'web'], r: "Frontend roadmap: HTML/CSS → JavaScript (ES6+) → React → State Management (Redux/Zustand) → TypeScript → Testing (Jest). Build real projects like e-commerce, dashboards, or portfolio sites!", s: ['React resources', 'Frontend roadmap', 'Learn JavaScript'] },
    { k: ['system design', 'scalability', 'microservices'], r: "System Design topics: load balancing, caching (Redis), databases (SQL vs NoSQL), message queues (Kafka), microservices vs monolith, CDNs. Read 'Designing Data-Intensive Applications' by Martin Kleppmann!", s: ['System design resources', 'Microservices explained', 'How to learn architecture'] },
  ];

  for (const { k, r, s } of keywords) {
    if (k.some(keyword => lower.includes(keyword))) {
      return { response: r, suggestions: s, source: 'fallback' };
    }
  }

  return {
    response: "That's a great question! I can help you with DSA, Python, Web Development, Machine Learning, System Design, career guidance, and interview preparation. What would you like to explore?",
    suggestions: ['DSA roadmap', 'Career guidance', 'ML basics', 'Interview tips'],
    source: 'fallback',
  };
}

module.exports = { classifySkills, matchCareers, predictPerformance, chatWithML };
