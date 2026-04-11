/**
 * openaiService.js
 * All AI capabilities powered by OpenAI Chat Completions API.
 * Drop-in replacement for ollamaService.js — same function signatures.
 */

const OpenAI = require('openai');

const getClient = () => {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
        throw new Error('OPENAI_API_KEY is not set in .env. Please add your key.');
    }
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const MODEL = () => process.env.OPENAI_MODEL || 'gpt-4o-mini';

/**
 * Core chat helper — wraps OpenAI chat.completions.create
 * @param {string} userPrompt
 * @param {string} systemPrompt
 * @param {boolean} jsonMode — force JSON response format
 */
async function callOpenAI(userPrompt, systemPrompt = '', jsonMode = false) {
    const client = getClient();
    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: userPrompt });

    const options = {
        model: MODEL(),
        messages,
        temperature: 0.7,
    };

    if (jsonMode) {
        options.response_format = { type: 'json_object' };
    }

    console.log(`[OpenAI] Calling ${MODEL()}...`);
    const completion = await client.chat.completions.create(options);
    return completion.choices[0].message.content;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Adaptive Question Engine
// ─────────────────────────────────────────────────────────────────────────────
async function generateQuestions(topic, difficultyLevel, count = 1) {
    const systemPrompt = 'You are an expert technical interviewer designing multiple-choice questions for engineering students. You only output valid JSON.';
    const desc = ['Extremely Basic', 'Beginner', 'Intermediate', 'Advanced', 'Expert / System Design'][Math.min(4, Math.max(0, difficultyLevel - 1))];

    const userPrompt = `Generate ${count} multiple-choice question(s) strictly about "${topic}" at "${desc}" difficulty.
Return a JSON object with a single key "questions" whose value is an array.
Each item must have exactly:
{
  "question": "string",
  "options": ["A","B","C","D"],
  "answer": 0,
  "difficulty": ${difficultyLevel}
}
No markdown, no extra keys.`;

    try {
        const raw = await callOpenAI(userPrompt, systemPrompt, true);
        const parsed = JSON.parse(raw);
        const qs = Array.isArray(parsed) ? parsed : (parsed.questions || [parsed]);
        return qs.map(q => ({ ...q, topic }));
    } catch (e) {
        console.error('[OpenAI] generateQuestions error:', e.message);
        return [{
            question: `What is a core concept of ${topic}?`,
            options: ['Abstraction', 'Recursion', 'Iteration', 'Compilation'],
            answer: 0,
            difficulty: difficultyLevel,
            topic,
            fallback: true
        }];
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Career Prediction
// ─────────────────────────────────────────────────────────────────────────────
async function predictCareers(profile, performanceAnalytics) {
    const systemPrompt = 'You are an elite career counselor for software and hardware engineers. Return valid JSON only.';

    const userPrompt = `Analyze this engineering student.
Branch: ${profile.branch}, Interests: ${(profile.interests || []).join(', ')}.
Average Quiz Score: ${performanceAnalytics.avgScore}%.
Suggest 3 matching career domains.

Return JSON with this exact shape:
{
  "matches": [
    { "career": "Title", "match_percent": 85, "gap_skills": ["Skill1"], "salary": "10-15 LPA" }
  ],
  "confidence": 0.85
}`;

    try {
        const raw = await callOpenAI(userPrompt, systemPrompt, true);
        const parsed = JSON.parse(raw);
        return parsed.matches ? parsed : { matches: parsed };
    } catch (e) {
        console.error('[OpenAI] predictCareers error:', e.message);
        return { matches: [], confidence: 0 };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. AI Mentor Chatbot
// ─────────────────────────────────────────────────────────────────────────────
async function chatWithMentor(message, historyContext) {
    const systemPrompt = 'You are a helpful, concise AI mentor for engineering students. Explain concepts clearly with small examples and guide their learning. Your name is OneStop Mentor. Never write overly long responses.';

    const userPrompt = `${historyContext.length ? `Conversation so far:\n${historyContext.join('\n')}\n\n` : ''}Student: ${message}\nMentor:`;

    try {
        const response = await callOpenAI(userPrompt, systemPrompt, false);
        return { response: response.trim(), source: 'openai' };
    } catch (e) {
        console.error('[OpenAI] chatWithMentor error:', e.message);
        return { response: "I'm currently unable to connect. Please check your OpenAI API key.", source: 'fallback' };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Career Flowchart Generator
// ─────────────────────────────────────────────────────────────────────────────
async function generateCareerFlowchart(branch) {
    const systemPrompt = 'You are a career advisor for engineering students. Output only valid JSON, no markdown, no prose.';

    const userPrompt = `Generate a detailed career learning flowchart for a student in the "${branch}" engineering branch.
Return ONLY a JSON object with this exact shape:
{
  "branch": "${branch}",
  "paths": [
    {
      "title": "Path Name",
      "color": "indigo",
      "steps": [
        { "id": "1", "label": "Step", "desc": "One sentence.", "duration": "2 months", "skills": ["Skill1", "Skill2"] }
      ]
    }
  ]
}
Include 2-3 paths, each with 4-5 steps. Color options: indigo, violet, emerald, blue, amber.`;

    try {
        const raw = await callOpenAI(userPrompt, systemPrompt, true);
        const parsed = JSON.parse(raw);
        return parsed;
    } catch (e) {
        console.error('[OpenAI] generateCareerFlowchart error:', e.message);
        return {
            branch,
            paths: [{
                title: 'Software Engineer',
                color: 'indigo',
                steps: [
                    { id: '1', label: 'Foundation',           desc: 'Learn programming fundamentals.',       duration: '2 months', skills: ['Python', 'JavaScript', 'Git'] },
                    { id: '2', label: 'Data Structures',      desc: 'Master DSA for interviews.',            duration: '3 months', skills: ['Arrays', 'Graphs', 'DP'] },
                    { id: '3', label: 'Web Development',      desc: 'Build full-stack applications.',        duration: '3 months', skills: ['React', 'Node.js', 'MongoDB'] },
                    { id: '4', label: 'System Design',        desc: 'Learn scalability & architecture.',     duration: '2 months', skills: ['HLD', 'LLD', 'Microservices'] },
                    { id: '5', label: 'Placement Ready',      desc: 'Apply and crack interviews.',           duration: '1 month',  skills: ['Mock Interviews', 'LeetCode'] },
                ]
            }]
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Student Performance Analysis (Core of the pipeline)
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeStudentPerformance(profile, quizResults) {
    const systemPrompt = 'You are an expert AI career counselor for engineering students. Analyze performance data and return ONLY a valid JSON object.';

    const correctCount = quizResults.filter(r => r.isCorrect).length;
    const accuracy = Math.round((correctCount / quizResults.length) * 100);
    const avgTime  = Math.round(quizResults.reduce((s, r) => s + (r.timeSpent || 15), 0) / quizResults.length);

    const topicMap = {};
    quizResults.forEach(r => {
        const t = r.topic || 'General';
        if (!topicMap[t]) topicMap[t] = { correct: 0, total: 0 };
        topicMap[t].total++;
        if (r.isCorrect) topicMap[t].correct++;
    });
    const topicScores = Object.entries(topicMap).map(([topic, d]) => ({
        topic, score: Math.round((d.correct / d.total) * 100)
    }));

    const userPrompt = `Analyze this engineering student's profile and quiz results.

Profile:
- Interests: ${(profile.interests || []).join(', ')}
- 10th marks: ${profile.marks10 || 'N/A'}%
- 12th marks: ${profile.marks12 || 'N/A'}%
- Branch preference: ${profile.branch || 'Undecided'}

Quiz Performance:
- Overall accuracy: ${accuracy}%
- Avg time per question: ${avgTime}s
- Per-topic scores: ${JSON.stringify(topicScores)}

Return ONLY this JSON structure (no extra text or markdown):
{
  "strengths": ["Topic A", "Topic B"],
  "weaknesses": ["Topic C"],
  "skillScores": [{ "name": "Coding Logic", "score": 85 }],
  "dominantInterest": "Computer Science",
  "explanation": "2-3 clear sentences on why these branches fit the student.",
  "branchRecommendations": [
    { "branch": "Computer Science",       "matchPct": 92, "reason": "One sentence.", "color": "green"  },
    { "branch": "Electronics",            "matchPct": 78, "reason": "One sentence.", "color": "amber"  },
    { "branch": "Mechanical Engineering", "matchPct": 45, "reason": "One sentence.", "color": "red"    }
  ]
}`;

    try {
        const raw = await callOpenAI(userPrompt, systemPrompt, true);
        return JSON.parse(raw);
    } catch (e) {
        console.error('[OpenAI] analyzeStudentPerformance error:', e.message);
        const csScore = topicScores.find(t => /coding|cs|software/i.test(t.topic))?.score || accuracy;
        return {
            strengths:   topicScores.filter(t => t.score >= 60).map(t => t.topic).slice(0, 3),
            weaknesses:  topicScores.filter(t => t.score < 60).map(t => t.topic).slice(0, 3),
            skillScores: topicScores.map(t => ({ name: t.topic, score: t.score })),
            dominantInterest: (profile.interests || ['Coding'])[0],
            explanation: `Based on your ${accuracy}% accuracy and interest in ${(profile.interests || ['technology']).join(', ')}, these branches best match your profile.`,
            branchRecommendations: [
                { branch: 'Computer Science',       matchPct: Math.min(95, csScore + 10), reason: 'Strong coding-based performance detected.', color: 'green' },
                { branch: 'Information Technology', matchPct: Math.min(85, csScore + 5),  reason: 'Good aptitude for IT roles.',               color: 'amber' },
                { branch: 'Electronics',            matchPct: Math.max(30, csScore - 15), reason: 'Decent physics base.',                      color: 'red'   },
            ]
        };
    }
}

module.exports = {
    generateQuestions,
    predictCareers,
    chatWithMentor,
    generateCareerFlowchart,
    analyzeStudentPerformance,
    callOpenAI,
};
