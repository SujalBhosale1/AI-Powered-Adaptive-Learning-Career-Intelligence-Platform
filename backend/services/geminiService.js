/**
 * geminiService.js
 * All AI capabilities powered by Google Gemini (gemini-1.5-flash).
 * Drop-in replacement — same exports as openaiService.js.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const getClient = () => {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set in .env');
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const MODEL = 'gemini-1.5-flash';

/**
 * Core helper — send a prompt to Gemini and get text back.
 * When jsonMode=true the prompt explicitly asks for JSON and we clean the response.
 */
async function callGemini(userPrompt, systemPrompt = '', jsonMode = false) {
    const client = getClient();
    const model  = client.getGenerativeModel({
        model: MODEL,
        ...(systemPrompt ? { systemInstruction: systemPrompt } : {}),
    });

    const fullPrompt = jsonMode
        ? `${userPrompt}\n\nIMPORTANT: Return ONLY valid JSON. No markdown fences, no extra text.`
        : userPrompt;

    const result = await model.generateContent(fullPrompt);
    const raw    = result.response.text();
    return raw;
}

// Safe JSON extractor — strips code fences if Gemini wraps output in them
function extractJSON(raw) {
    let cleaned = raw.trim();
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Generate Interest-Based (non-MCQ) Assessment Questions
//    Questions are general/scenario-based — NO right or wrong answers.
//    Options carry a "tag" revealing which field the preference maps to.
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
        { "text": "A web app that solves a daily life problem", "tag": "coding" },
        { "text": "A robot that can navigate a maze autonomously", "tag": "robotics" },
        { "text": "An AI model that predicts stock prices", "tag": "ai_ml" },
        { "text": "A circuit that automates home appliances", "tag": "electronics" }
      ]
    }
  ]
}

Make all 10 questions varied — cover: project preferences, working style, problem-solving approach, future vision, team role, tech vs hardware preference, etc.`;

    try {
        const raw = await callGemini(userPrompt, systemPrompt, true);
        const parsed = extractJSON(raw);
        return parsed.questions || [];
    } catch (e) {
        console.error('[Gemini] generateInterestQuestions error:', e.message);
        // Structured fallback questions
        return [
            {
                id: 1, question: 'What kind of project excites you most?', category: 'Project Interest',
                options: [
                    { text: 'Building a web platform for millions of users', tag: 'coding' },
                    { text: 'Creating an autonomous robot', tag: 'robotics' },
                    { text: 'Training an AI to recognize images', tag: 'ai_ml' },
                    { text: 'Designing an electronic sensor system', tag: 'electronics' }
                ]
            },
            {
                id: 2, question: 'When you solve a problem, you prefer to:', category: 'Working Style',
                options: [
                    { text: 'Write code and test until it works', tag: 'coding' },
                    { text: 'Build a physical prototype', tag: 'robotics' },
                    { text: 'Analyze data and find patterns', tag: 'ai_ml' },
                    { text: 'Understand the circuit or hardware behind it', tag: 'electronics' }
                ]
            },
            {
                id: 3, question: 'Your dream job would involve:', category: 'Career Vision',
                options: [
                    { text: 'Building products used by millions daily', tag: 'coding' },
                    { text: 'Designing intelligent machines', tag: 'robotics' },
                    { text: 'Researching and advancing AI capabilities', tag: 'ai_ml' },
                    { text: 'Working with hardware and embedded systems', tag: 'electronics' }
                ]
            },
        ];
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Analyze student interest responses → branch recommendations
// ─────────────────────────────────────────────────────────────────────────────
async function analyzeStudentPerformance(profile, interestResponses) {
    const systemPrompt = 'You are an expert AI career counselor. Analyze a student\'s interest assessment responses and recommend the best engineering branches for them. Return ONLY valid JSON.';

    // Tally tags from selected options
    const tagCount = {};
    interestResponses.forEach(r => {
        const tag = r.selectedTag || 'general';
        tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
    const sortedTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
    const topInterests = sortedTags.slice(0, 3).map(([tag, count]) => `${tag} (${count} responses)`).join(', ');

    const userPrompt = `
Analyze this engineering student's interest assessment.

Student Profile:
- Name: ${profile.name || 'Student'}
- Declared Interests: ${(profile.interests || []).join(', ')}
- 10th marks: ${profile.marks10 || 'N/A'}%
- 12th marks: ${profile.marks12 || 'N/A'}%
- Branch preference: ${profile.branch || 'Undecided'}

Interest Assessment Results (${interestResponses.length} questions answered):
- Dominant interest areas based on choices: ${topInterests}
- All responses: ${JSON.stringify(interestResponses.map(r => ({ q: r.question?.substring(0, 60), chosen: r.selectedText, tag: r.selectedTag })))}

Based on these ACTUAL CHOICES (not guesses), return ONLY this JSON:
{
  "strengths": ["Field 1", "Field 2"],
  "weaknesses": ["Field 3"],
  "skillScores": [
    { "name": "tag_name", "score": 85 }
  ],
  "dominantInterest": "Primary interest area",
  "explanation": "2-3 clear, specific sentences explaining why these branches fit THIS student based on their actual choices.",
  "branchRecommendations": [
    { "branch": "Computer Science", "matchPct": 92, "reason": "Specific reason based on their actual responses.", "color": "green" },
    { "branch": "Electronics & Communication", "matchPct": 78, "reason": "Specific reason.", "color": "amber" },
    { "branch": "Mechanical Engineering", "matchPct": 45, "reason": "Specific reason.", "color": "red" }
  ]
}

Match percentages MUST be derived from the actual tag counts above, not random. Top tag = top branch match.`;

    try {
        const raw = await callGemini(userPrompt, systemPrompt, true);
        const parsed = extractJSON(raw);
        return parsed;
    } catch (e) {
        console.error('[Gemini] analyzeStudentPerformance error:', e.message);
        // Derive fallback from actual tag counts
        const topTag = sortedTags[0]?.[0] || 'coding';
        const tagToBranch = {
            coding: 'Computer Science', ai_ml: 'Artificial Intelligence', robotics: 'Robotics & Automation',
            electronics: 'Electronics & Communication', mechanics: 'Mechanical Engineering',
            design: 'Design Engineering', management: 'Industrial Engineering', research: 'Research & Development'
        };
        return {
            strengths: sortedTags.slice(0, 2).map(([t]) => tagToBranch[t] || t),
            weaknesses: sortedTags.slice(-2).map(([t]) => tagToBranch[t] || t),
            skillScores: sortedTags.map(([tag, count]) => ({ name: tagToBranch[tag] || tag, score: Math.round((count / interestResponses.length) * 100) + 20 })),
            dominantInterest: tagToBranch[topTag] || topTag,
            explanation: `Your assessment shows a strong preference for ${tagToBranch[topTag] || topTag}. Based on your ${interestResponses.length} responses, these branches align best with your natural inclinations and interests.`,
            branchRecommendations: sortedTags.slice(0, 3).map(([tag, count], i) => ({
                branch: tagToBranch[tag] || tag,
                matchPct: Math.min(95, Math.round((count / interestResponses.length) * 100) + 50),
                reason: `You showed strong preference for ${tag}-related choices in your assessment.`,
                color: i === 0 ? 'green' : i === 1 ? 'amber' : 'red'
            }))
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Career Prediction (for CareerPathPage)
// ─────────────────────────────────────────────────────────────────────────────
async function predictCareers(profile, performanceAnalytics) {
    const systemPrompt = 'You are an elite career counselor. Return valid JSON only.';
    const userPrompt = `
Student branch: ${profile.branch}, Interests: ${(profile.interests || []).join(', ')}, Avg score: ${performanceAnalytics.avgScore}%.
Suggest 3 matching career roles.
Return JSON: { "matches": [{ "career": "Title", "match_percent": 85, "gap_skills": ["Skill"], "salary": "10-15 LPA" }], "confidence": 0.85 }`;

    try {
        const raw = await callGemini(userPrompt, systemPrompt, true);
        const parsed = extractJSON(raw);
        return parsed.matches ? parsed : { matches: parsed };
    } catch (e) {
        console.error('[Gemini] predictCareers error:', e.message);
        return { matches: [], confidence: 0 };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Career Flowchart
// ─────────────────────────────────────────────────────────────────────────────
async function generateCareerFlowchart(branch) {
    const systemPrompt = 'You are a career advisor. Return only valid JSON.';
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
}
Include 2-3 paths, each with 4-5 steps. Colors: indigo, violet, emerald, blue, amber.`;

    try {
        const raw = await callGemini(userPrompt, systemPrompt, true);
        return extractJSON(raw);
    } catch (e) {
        console.error('[Gemini] generateCareerFlowchart error:', e.message);
        return {
            branch, paths: [{
                title: 'Software Engineer', color: 'indigo',
                steps: [
                    { id: '1', label: 'Foundation',      desc: 'Learn programming basics.',            duration: '2 months', skills: ['Python', 'JavaScript'] },
                    { id: '2', label: 'DSA',             desc: 'Master data structures & algorithms.', duration: '3 months', skills: ['Arrays', 'Graphs'] },
                    { id: '3', label: 'Web Dev',         desc: 'Build full-stack apps.',               duration: '3 months', skills: ['React', 'Node.js'] },
                    { id: '4', label: 'System Design',   desc: 'Learn architecture patterns.',         duration: '2 months', skills: ['HLD', 'Microservices'] },
                    { id: '5', label: 'Placement Ready', desc: 'Crack interviews.',                    duration: '1 month',  skills: ['LeetCode', 'Resume'] },
                ]
            }]
        };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. AI Mentor Chatbot
// ─────────────────────────────────────────────────────────────────────────────
async function chatWithMentor(message, historyContext) {
    const systemPrompt = 'You are a helpful, concise AI mentor for engineering students named OneStop Mentor. Explain concepts clearly with examples. Keep responses short and practical.';
    const userPrompt   = `${historyContext.length ? `Previous chat:\n${historyContext.join('\n')}\n\n` : ''}Student: ${message}\nMentor:`;

    try {
        const response = await callGemini(userPrompt, systemPrompt, false);
        return { response: response.trim(), source: 'gemini' };
    } catch (e) {
        console.error('[Gemini] chatWithMentor error:', e.message);
        return { response: "I can't connect right now. Please check your Gemini API key.", source: 'fallback' };
    }
}

module.exports = {
    generateInterestQuestions,
    generateQuestions: generateInterestQuestions, // backward-compat alias
    analyzeStudentPerformance,
    predictCareers,
    generateCareerFlowchart,
    chatWithMentor,
    callGemini,
};
