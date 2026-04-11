/**
 * ollamaService.js
 * Interfaces locally with Ollama (qwen2.5-coder:14b) for AI capabilities.
 */

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b';

/**
 * Common fetch utility for Ollama HTTP API
 */
async function callOllama(prompt, systemMsg = "", jsonMode = false) {
    try {
        const { default: fetch } = await import('node-fetch');

        const payload = {
            model: DEFAULT_MODEL,
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.7
            }
        };

        if (systemMsg) {
            payload.system = systemMsg;
        }

        if (jsonMode) {
            payload.format = 'json';
        }

        console.log(`[Ollama] Sending request to ${DEFAULT_MODEL}...`);
        const res = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Ollama Error: ${res.status} ${errText}`);
        }

        const data = await res.json();
        return data.response;
    } catch (error) {
        console.error('[Ollama] Connection Failed:', error.message);
        throw error;
    }
}

/**
 * 1. Adaptive Question Engine
 * Generates technical questions dynamically avoiding repetition.
 */
async function generateQuestions(topic, difficultyLevel, count = 1) {
    const systemMsg = "You are an expert technical interviewer designing multiple-choice questions for engineering students. You only output valid JSON arrays containing the exact objects requested.";

    // Difficulty mapped roughly 1-5 to descriptors
    const desc = ['Extremely Basic', 'Beginner', 'Intermediate', 'Advanced', 'Expert / System Design'][Math.min(4, Math.max(0, difficultyLevel - 1))];

    const prompt = `
Generate ${count} multiple-choice question(s) strictly about "${topic}" at a "${desc}" difficulty level.
Return a valid JSON Array. Do not include markdown codeblocks or extra text.
Format for each object:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": 2, // The integer index of the correct option (0-3)
  "difficulty": ${difficultyLevel}
}`;

    try {
        const rawRes = await callOllama(prompt, systemMsg, true);
        // Safely parse out if it returned surrounded by ```json
        let cleaned = rawRes.trim();
        if (cleaned.startsWith('```json')) cleaned = cleaned.replace('```json', '');
        if (cleaned.endsWith('```')) cleaned = cleaned.substring(0, cleaned.length - 3);

        const parsed = JSON.parse(cleaned.trim());
        // Standardize returning an array
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
        console.error("Failed to parse Ollama question JSON:", e);
        // Fallback question
        return [{
            question: `What is a core concept of ${topic}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            answer: 0,
            difficulty: difficultyLevel,
            fallback: true
        }];
    }
}

/**
 * 2. Formulate Career Predictions
 */
async function predictCareers(profile, performanceAnalytics) {
    const systemMsg = "You are an elite career counselor for software and hardware engineers. Return valid JSON only.";

    const prompt = `
Analyze this student.
Profile: Branch: ${profile.branch}, Interests: ${profile.interests?.join(',')}.
Performance: Average Quiz Score: ${performanceAnalytics.avgScore}%.
Suggest 3 matching career domains.

Return a JSON strictly in this format:
{
    "matches": [
        {
            "career": "Title",
            "match_percent": 85,
            "gap_skills": ["Skill 1", "Skill 2"],
            "salary": "10-15 LPA"
        }
    ]
}`;

    try {
        const rawRes = await callOllama(prompt, systemMsg, true);
        const parsed = JSON.parse(rawRes);
        return parsed.matches ? parsed : { matches: parsed };
    } catch (e) {
        console.error("Failed to parse Ollama career JSON:", e);
        return { matches: [] };
    }
}

/**
 * 3. Chat with Mentor
 */
async function chatWithMentor(message, historyContext) {
    const systemMsg = "You are a helpful, concise AI mentor for engineering students. You explain concepts clearly, provide small examples, and guide learning paths without writing overly long essays. Your name is OneStop Mentor.";

    // Simplistic formatting for context if needed
    const prompt = `
History Context:
${historyContext.join('\n')}

Student: ${message}
Mentor Response:`;

    try {
        const responseText = await callOllama(prompt, systemMsg, false);
        return {
            response: responseText.trim(),
            source: 'ollama'
        };
    } catch (e) {
        return {
            response: "I'm currently unable to connect to my AI core. Please ensure Ollama is running.",
            source: 'fallback'
        };
    }
}

/**
 * 4. Generate a visual career flowchart for a specific branch
 * Returns a structured path: nodes + edges
 */
async function generateCareerFlowchart(branch) {
    const systemMsg = "You are a career advisor for engineering students. Output only valid JSON, no markdown, no prose.";

    const prompt = `
Generate a detailed career learning flowchart for a student in the "${branch}" engineering branch.
Return ONLY a JSON object (no markdown, no extra text) exactly in this shape:
{
  "branch": "${branch}",
  "paths": [
    {
      "title": "Path Name (e.g. Software Engineer)",
      "color": "indigo",
      "steps": [
        { "id": "1", "label": "Step Label", "desc": "1-sentence description", "duration": "2 months", "skills": ["Skill1", "Skill2"] },
        { "id": "2", "label": "Next Step", "desc": "1-sentence description", "duration": "2 months", "skills": ["Skill3"] }
      ]
    }
  ]
}
Include 2-3 paths, each with 4-5 steps. Color options: indigo, violet, emerald, blue, amber.
`;

    try {
        const rawRes = await callOllama(prompt, systemMsg, true);
        let cleaned = rawRes.trim();
        // Strip any accidental markdown fences
        cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        return parsed;
    } catch (e) {
        console.error('[Ollama] generateCareerFlowchart parse error:', e.message);
        // Structured fallback so the UI always works
        return {
            branch,
            paths: [
                {
                    title: 'Software Engineer',
                    color: 'indigo',
                    steps: [
                        { id: '1', label: 'Foundation', desc: 'Learn programming fundamentals.', duration: '2 months', skills: ['Python', 'JavaScript', 'Git'] },
                        { id: '2', label: 'Data Structures & Algorithms', desc: 'Master DSA for competitive coding.', duration: '3 months', skills: ['Arrays', 'Graphs', 'DP'] },
                        { id: '3', label: 'Web Development', desc: 'Build full-stack applications.', duration: '3 months', skills: ['React', 'Node.js', 'MongoDB'] },
                        { id: '4', label: 'System Design', desc: 'Learn scalability and architecture.', duration: '2 months', skills: ['HLD', 'LLD', 'Microservices'] },
                        { id: '5', label: 'Placement Ready', desc: 'Apply and crack tech interviews.', duration: '1 month', skills: ['Mock Interviews', 'LeetCode', 'Resume'] },
                    ]
                }
            ]
        };
    }
}

/**
 * 5. Analyze student quiz performance and predict branch suitability
 * Core of the assessment pipeline
 */
async function analyzeStudentPerformance(profile, quizResults) {
    const systemMsg = "You are an expert AI career counselor for engineering students. Analyze student quiz performance and academic data. Return ONLY a valid JSON object with no markdown, no extra text.";

    const correctCount = quizResults.filter(r => r.isCorrect).length;
    const accuracy = Math.round((correctCount / quizResults.length) * 100);
    const avgTime = Math.round(quizResults.reduce((s, r) => s + (r.timeSpent || 15), 0) / quizResults.length);

    // Compute per-topic accuracy scores
    const topicMap = {};
    quizResults.forEach(r => {
        const t = r.topic || 'General';
        if (!topicMap[t]) topicMap[t] = { correct: 0, total: 0 };
        topicMap[t].total++;
        if (r.isCorrect) topicMap[t].correct++;
    });
    const topicScores = Object.entries(topicMap).map(([topic, d]) => ({
        topic,
        score: Math.round((d.correct / d.total) * 100)
    }));

    const prompt = `
Analyze this engineering student's profile and quiz results.

Profile:
- Interests: ${(profile.interests || []).join(', ')}
- 10th marks: ${profile.marks10 || 'N/A'}%
- 12th marks: ${profile.marks12 || 'N/A'}%
- Target branch preference: ${profile.branch || 'Undecided'}

Quiz Performance:
- Overall accuracy: ${accuracy}%
- Average time per question: ${avgTime}s
- Per-topic scores: ${JSON.stringify(topicScores)}

Based on this data, return ONLY this JSON (no extra text):
{
  "strengths": ["Topic 1", "Topic 2"],
  "weaknesses": ["Topic 3"],
  "skillScores": [
    { "name": "Coding Logic", "score": 85 },
    { "name": "Math", "score": 70 }
  ],
  "dominantInterest": "Computer Science",
  "explanation": "2-3 sentences explaining why these are the recommended branches.",
  "branchRecommendations": [
    { "branch": "Computer Science", "matchPct": 92, "reason": "One sentence why.", "color": "green" },
    { "branch": "Electronics", "matchPct": 78, "reason": "One sentence why.", "color": "amber" },
    { "branch": "Mechanical Engineering", "matchPct": 45, "reason": "One sentence why.", "color": "red" }
  ]
}`;

    try {
        const rawRes = await callOllama(prompt, systemMsg, true);
        let cleaned = rawRes.trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
        const parsed = JSON.parse(cleaned);
        return parsed;
    } catch (e) {
        console.error('[Ollama] analyzeStudentPerformance parse error:', e.message);
        // Rule-based fallback
        const csScore = topicScores.find(t => t.topic?.toLowerCase().includes('coding') || t.topic?.toLowerCase().includes('cs'))?.score || accuracy;
        return {
            strengths: topicScores.filter(t => t.score >= 60).map(t => t.topic).slice(0, 3),
            weaknesses: topicScores.filter(t => t.score < 60).map(t => t.topic).slice(0, 3),
            skillScores: topicScores.map(t => ({ name: t.topic, score: t.score })),
            dominantInterest: (profile.interests || ['Coding'])[0],
            explanation: `Based on your ${accuracy}% accuracy and interest in ${(profile.interests || ['technology']).join(', ')}, these branches best match your profile.`,
            branchRecommendations: [
                { branch: 'Computer Science', matchPct: Math.min(95, csScore + 10), reason: 'Strong coding-based performance detected.', color: 'green' },
                { branch: 'Information Technology', matchPct: Math.min(85, csScore + 5), reason: 'Good aptitude for IT roles.', color: 'amber' },
                { branch: 'Electronics', matchPct: Math.max(30, csScore - 15), reason: 'Decent physics base.', color: 'red' },
            ]
        };
    }
}

module.exports = { generateQuestions, predictCareers, chatWithMentor, generateCareerFlowchart, analyzeStudentPerformance, callOllama };
