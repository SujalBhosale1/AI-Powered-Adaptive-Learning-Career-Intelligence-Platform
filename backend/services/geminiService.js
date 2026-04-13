/**
 * aiService.js (replaces geminiService.js)
 * All AI capabilities powered by local Ollama (qwen2.5-coder7b).
 * Drop-in replacement — same exports as before.
 */

const OLLAMA_URL = 'http://127.0.0.1:11434/api/generate';
const MODEL = 'qwen2.5-coder:7b'; // As requested by user

async function callOllama(userPrompt, systemPrompt = '', jsonMode = false) {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${userPrompt}` : userPrompt;
    let finalPrompt = jsonMode
        ? `${fullPrompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown fences, no extra text.`
        : fullPrompt;

    const body = {
        model: MODEL,
        prompt: finalPrompt,
        stream: false,
        format: jsonMode ? "json" : undefined
    };

    try {
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`Ollama error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('[Ollama] call error:', error);
        throw error;
    }
}

function extractJSON(raw) {
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    try {
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Failed to parse JSON:", cleaned);
        throw e;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Generate Interest-Based (non-MCQ) Assessment Questions
// ─────────────────────────────────────────────────────────────────────────────
async function generateInterestQuestions(interests, name = 'Student') {
    const interestList = interests.length ? interests.join(', ') : 'technology, engineering';
    const systemPrompt = 'You are a career counselor designing an interest assessment for an engineering student. Generate intelligent scenario-based questions to understand their personality, preferences, and career inclinations. There are NO right or wrong answers.';

    const userPrompt = `
Create 10 scenario-based interest assessment questions for an engineering student named "${name}".
Their stated interests are: ${interestList}.

Rules:
- Questions must be general preference/scenario questions — NOT knowledge questions.
- Each question should reveal something about the student's interests or working style.
- Options should reflect different engineering/tech fields naturally.
- Do NOT have a correct answer — these are preference-based.
- Each option must have a "tag" field linking it to a domain: one of [coding, ai_ml, electronics, robotics, mechanics, design, management, research]

Return ONLY this JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "You have a weekend free to work on a personal project. What would you build?",
      "category": "Project Preference",
      "options": [
        { "text": "A web app", "tag": "coding" },
        { "text": "A robot", "tag": "robotics" },
        { "text": "An AI model", "tag": "ai_ml" },
        { "text": "A circuit", "tag": "electronics" }
      ]
    }
  ]
}
Make all 10 questions varied.`;

    try {
        const raw = await callOllama(userPrompt, systemPrompt, true);
        const parsed = extractJSON(raw);
        return parsed.questions || [];
    } catch (e) {
        console.error('[Ollama] generateInterestQuestions error:', e.message);
        throw e;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Analyze student interest responses → branch recommendations
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeStudentPerformance(profile, interestResponses) {
    const systemPrompt = 'You are an expert AI career counselor. Analyze a student\'s assessment responses. Return ONLY valid JSON.';

    const tagCount = {};
    interestResponses.forEach(r => {
        const tag = r.selectedTag || 'general';
        tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
    const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
    const topInterests = sortedTags.slice(0, 3).map(([tag, count]) => `${tag} (${count} responses)`).join(', ');

    const userPrompt = `
Student Profile: Name: ${profile.name}, Interests: ${(profile.interests || []).join(', ')}, Branch: ${profile.branch}.
Top Interests: ${topInterests}

Return ONLY this JSON based on their profile and responses:
{
  "strengths": ["Field 1"],
  "weaknesses": ["Field 3"],
  "skillScores": [
    { "name": "tag_name", "score": 85 }
  ],
  "dominantInterest": "Primary interest area",
  "explanation": "2-3 clear sentences.",
  "branchRecommendations": [
    { "branch": "Computer Science", "matchPct": 92, "reason": "Specific reason.", "color": "green" }
  ]
}`;

    try {
        const raw = await callOllama(userPrompt, systemPrompt, true);
        return extractJSON(raw);
    } catch (e) {
        console.error('[Ollama] analyzeStudentPerformance error:', e.message);
        throw e;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Career Prediction (for CareerPathPage)
// ─────────────────────────────────────────────────────────────────────────────
async function predictCareers(profile, performanceAnalytics) {
    const systemPrompt = 'You are a career counselor. Return JSON only.';
    const userPrompt = `
Student branch: ${profile.branch}, Interests: ${(profile.interests || []).join(', ')}.
Suggest 3 matching career roles.
Return ONLY JSON: { "matches": [{ "career": "Title", "match_percent": 85, "gap_skills": ["Skill"], "salary": "10-15 LPA" }], "confidence": 0.85 }`;

    try {
        const raw = await callOllama(userPrompt, systemPrompt, true);
        const parsed = extractJSON(raw);
        return parsed.matches ? parsed : { matches: parsed };
    } catch (e) {
        throw e;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Career Flowchart
// ─────────────────────────────────────────────────────────────────────────────
async function generateCareerFlowchart(branch) {
    const systemPrompt = 'You are a career advisor. Return JSON only.';
    const userPrompt = `
Generate a career learning flowchart for "${branch}" engineering students.
Return ONLY JSON:
{
  "branch": "${branch}",
  "paths": [
    {
      "title": "Path Name",
      "color": "indigo",
      "steps": [
        { "id": "1", "label": "Step", "desc": "One sentence.", "duration": "2 months", "skills": ["Skill1"] }
      ]
    }
  ]
}`;

    try {
        const raw = await callOllama(userPrompt, systemPrompt, true);
        return extractJSON(raw);
    } catch (e) {
        throw e;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. AI Mentor Chatbot
// ─────────────────────────────────────────────────────────────────────────────
async function chatWithMentor(message, historyContext) {
    const systemPrompt = 'You are a helpful AI mentor for engineering students named OneStop Mentor. Explain clearly.';
    const userPrompt   = `${historyContext.length ? `Context:\n${historyContext.join('\n')}\n\n` : ''}Student: ${message}\nMentor:`;

    try {
        const response = await callOllama(userPrompt, systemPrompt, false);
        return { response: response.trim(), source: 'ollama' };
    } catch (e) {
        return { response: "I can't connect right now. Check Ollama.", source: 'fallback' };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Generate Diagnostic Questions
// ─────────────────────────────────────────────────────────────────────────────
async function generateDiagnosticQuestions() {
    const systemPrompt = 'You are a technical examiner preparing a comprehensive diagnostic test for engineering students. Return ONLY JSON.';
    const userPrompt = `
Create 15 multiple choice diagnostic questions covering these subjects: dsa (3 questions), webdev (3 questions), ml (3 questions), db (3 questions), systemDesign (3 questions).
Each question needs a difficulty from 1 to 5.
Return ONLY JSON:
{
  "questions": [
    {
      "id": "q1",
      "subject": "dsa",
      "difficulty": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0 
    }
  ]
}`;

    try {
        const raw = await callOllama(userPrompt, systemPrompt, true);
        const parsed = extractJSON(raw);
        return parsed.questions || [];
    } catch (e) {
        console.error('[Ollama] generateDiagnosticQuestions error:', e.message);
        throw e;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6a. Generate Specific Topic Question
// ─────────────────────────────────────────────────────────────────────────────
async function generateTopicQuestion(topic, difficulty) {
    const systemPrompt = 'You are a strict technical examiner. Generate ONLY valid JSON.';
    const difStr = difficulty <= 2 ? 'Beginner' : difficulty <= 4 ? 'Intermediate' : 'Advanced';
    const userPrompt = `
Generate exactly 1 multiple choice question about "${topic}".
Difficulty level: ${difStr} (${difficulty}/5).
Do NOT include any extra text. Return ONLY JSON:
{
  "question": "Actual problem statement here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": 0,
  "difficulty": ${difficulty}
}`;

    try {
        const raw = await callOllama(userPrompt, systemPrompt, true);
        const parsed = extractJSON(raw);
        return parsed.questions ? parsed.questions[0] : parsed;
    } catch (e) {
        console.error('[Ollama] generateTopicQuestion error:', e.message);
        throw e;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Generate Learning Path
// ─────────────────────────────────────────────────────────────────────────────
async function generateLearningPath(assessment, role) {
    const systemPrompt = 'You are a curriculum designer building custom learning plans. Return ONLY JSON.';
    const strAreas = JSON.stringify(assessment?.strongAreas || []);
    const weakAreas = JSON.stringify(assessment?.weakAreas || []);
    const userPrompt = `
Generate a personalized learning path topics array for a target role of "${role}".
The student is strong in: ${strAreas} and weak in: ${weakAreas}.
Provide ~8 topics prioritized for this role. Set "status" to "completed" if it falls under their strong areas easy topics, else "not_started".
Return ONLY JSON:
{
  "topics": [
    {
      "id": "t1",
      "title": "Topic Title",
      "subject": "Category (dsa, webdev, etc.)",
      "difficulty": 2,
      "status": "not_started",
      "resources": [
        { "title": "Resource Name", "url": "https://example.com", "type": "video", "duration": "10 min" }
      ]
    }
  ]
}`;

    try {
        const raw = await callOllama(userPrompt, systemPrompt, true);
        const parsed = extractJSON(raw);
        return parsed.topics || [];
    } catch (e) {
        console.error('[Ollama] generateLearningPath error:', e.message);
        throw e;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Generate Study Notes
// ─────────────────────────────────────────────────────────────────────────────
async function generateStudyNotes(topic, level, weakAreas) {
    const systemPrompt = 'You are a highly skilled tutor. Explain the topic clearly formatting the response in basic HTML (using <h2>, <p>, <ul>, <li>, <strong>) which can be rendered directly by the frontend. Do NOT wrap in markdown fences.';
    const userPrompt = `
Generate concise but comprehensive study notes for the topic: "${topic}".
The student is currently at level ${level}. Their weak areas in general are: ${(weakAreas || []).join(', ')}.
Tailor the explanation to be easy to understand for their level. Focus on conceptual clarity, an example, and bullet points.
Return ONLY raw HTML.`;

    try {
        const response = await callOllama(userPrompt, systemPrompt, false);
        return response.trim();
    } catch (e) {
        console.error('[Ollama] generateStudyNotes error:', e.message);
        throw e;
    }
}

module.exports = {
    generateInterestQuestions,
    generateQuestions: generateInterestQuestions,
    analyzeStudentPerformance,
    predictCareers,
    generateCareerFlowchart,
    chatWithMentor,
    callGemini: callOllama,
    generateDiagnosticQuestions,
    generateTopicQuestion,
    generateLearningPath,
    generateStudyNotes
};
