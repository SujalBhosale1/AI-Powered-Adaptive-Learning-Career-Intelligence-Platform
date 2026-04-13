const Assessment = require('../models/Assessment');
const { classifySkills } = require('../services/mlService');
const { generateInterestQuestions, analyzeStudentPerformance, generateDiagnosticQuestions, generateTopicQuestion } = require('../services/geminiService');

const userQuizCache = new Map();

exports.getDiagnostic = async (req, res, next) => {
  try {
    const questions = await generateDiagnosticQuestions();
    userQuizCache.set(req.user.id, questions);

    // Send back questions without the answers
    const sanitized = questions.map(({ answer, explanation, ...q }) => q);
    
    res.status(200).json({
      success: true,
      questions: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/assessment/interest-questions
exports.getInterestQuestions = async (req, res, next) => {
  try {
    const interests = req.user.interests || [];
    const name = req.user.name || 'Student';
    const questions = await generateInterestQuestions(interests, name);
    res.status(200).json({ success: true, questions });
  } catch (error) {
    next(error);
  }
};

// POST /api/assessment/generate (kept for AdaptiveQuizPage compatibility)
exports.generateQuiz = async (req, res, next) => {
  try {
    const { topic, difficulty } = req.body;
    
    // If topic is provided, it's an Adaptive Quiz request
    if (topic) {
        const q = await generateTopicQuestion(topic, difficulty || 2);
        return res.status(200).json({ success: true, questions: [q] });
    }

    // Default fallback to Interest Questions (used if body is missing)
    const interests = req.user.interests || [];
    const name = req.user.name || 'Student';
    const questions = await generateInterestQuestions(interests, name);
    res.status(200).json({ success: true, questions });
  } catch (error) {
    next(error);
  }
};

exports.analyzePerformance = async (req, res, next) => {
  try {
    // Accept both new (interestResponses) and legacy (quizResults) formats
    const interestResponses = req.body.interestResponses || req.body.quizResults || [];
    if (!Array.isArray(interestResponses) || interestResponses.length === 0) {
      return res.status(400).json({ success: false, message: 'interestResponses array is required' });
    }

    const profile = {
      name:     req.user.name,
      interests: req.user.interests || [],
      branch:   req.user.branch || 'Undecided',
      marks10:  req.user.marks10,
      marks12:  req.user.marks12,
    };

    const analysis = await analyzeStudentPerformance(profile, interestResponses);

    res.status(200).json({ success: true, analysis });
  } catch (error) {
    next(error);
  }
};

exports.submitAssessment = async (req, res, next) => {
  try {
    const { answers } = req.body; // [{ questionId, selectedOption, timeTaken }]

    // Compute scores on the backend
    const scores = { dsa: 0, webdev: 0, ml: 0, db: 0, systemDesign: 0 };
    const maxScores = { dsa: 0, webdev: 0, ml: 0, db: 0, systemDesign: 0 };
    
    const cachedQuestions = userQuizCache.get(req.user.id) || [];
    
    const processedAnswers = answers.map(ans => {
      const q = cachedQuestions.find(q => q.id === ans.questionId);
      if (!q) return null;
      
      const isCorrect = q.answer === ans.selectedOption;
      
      // Calculate weighted score based on difficulty
      maxScores[q.subject] += q.difficulty;
      if (isCorrect) {
        scores[q.subject] += q.difficulty;
      }

      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
        timeTaken: ans.timeTaken
      };
    }).filter(a => a !== null);

    // Normalize scores to percentage (0-100)
    const finalScores = {};
    for (let subj in scores) {
      finalScores[subj] = maxScores[subj] > 0 
        ? Math.round((scores[subj] / maxScores[subj]) * 100) 
        : 0;
    }

    // Call ML service to classify skills based on scores
    const mlAnalysis = await classifySkills(finalScores);

    // Save Assessment
    const assessment = await Assessment.create({
      userId: req.user.id,
      questions: cachedQuestions,
      answers: processedAnswers,
      scores: finalScores,
      level: mlAnalysis.skill_level,
      mlConfidence: mlAnalysis.confidence,
      mlRecommendations: mlAnalysis.recommendations,
    });

    // Award XP to user
    req.user.totalXP += 500; // 500 XP for completing assessment
    req.user.level = Math.floor(req.user.totalXP / 1000) + 1;
    await req.user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      assessment,
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      assessments,
    });
  } catch (error) {
    next(error);
  }
};
