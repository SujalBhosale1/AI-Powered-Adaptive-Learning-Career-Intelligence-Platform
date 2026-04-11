const Assessment = require('../models/Assessment');
const { classifySkills } = require('../services/mlService');
const { generateInterestQuestions, analyzeStudentPerformance } = require('../services/geminiService');

// Static diagnostic questions (could be moved to DB later)
const DIAGNOSTIC_QUESTIONS = [
  { id: 'q1', subject: 'dsa', difficulty: 1, question: 'What is the time complexity of searching an element in a balanced binary search tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], answer: 2 },
  { id: 'q2', subject: 'dsa', difficulty: 3, question: 'Which data structure is used to implement a priority queue?', options: ['Stack', 'Linked List', 'Array', 'Heap'], answer: 3 },
  { id: 'q3', subject: 'dsa', difficulty: 4, question: 'What is the most efficient algorithm to find the shortest path in an unweighted graph?', options: ['Dijkstra', 'BFS', 'DFS', 'Bellman-Ford'], answer: 1 },
  { id: 'q4', subject: 'webdev', difficulty: 1, question: 'Which HTML tag is used for the largest heading?', options: ['<head>', '<h6>', '<heading>', '<h1>'], answer: 3 },
  { id: 'q5', subject: 'webdev', difficulty: 3, question: 'What does CSS flex-wrap property do?', options: ['Aligns items vertically', 'Allows items to wrap onto multiple lines', 'Changes font size dynamically', 'Hides overflowing items'], answer: 1 },
  { id: 'q6', subject: 'webdev', difficulty: 4, question: 'In React, what hook is used to handle side effects?', options: ['useState', 'useEffect', 'useMemo', 'useContext'], answer: 1 },
  { id: 'q7', subject: 'ml', difficulty: 2, question: 'Which algorithm is typically used for binary classification?', options: ['Linear Regression', 'K-Means', 'Logistic Regression', 'PCA'], answer: 2 },
  { id: 'q8', subject: 'ml', difficulty: 3, question: 'What is the purpose of a loss function in neural networks?', options: ['Increase accuracy', 'Measure prediction error', 'Normalize data', 'Speed up training'], answer: 1 },
  { id: 'q9', subject: 'ml', difficulty: 5, question: 'Which technique helps prevent overfitting in decision trees?', options: ['Gradient Descent', 'Backpropagation', 'Pruning', 'Activation Functions'], answer: 2 },
  { id: 'q10', subject: 'db', difficulty: 1, question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Question Language', 'Standard Query Logic', 'Sequential Query Language'], answer: 0 },
  { id: 'q11', subject: 'db', difficulty: 3, question: 'Which normal form ensures there are no transitive dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], answer: 2 },
  { id: 'q12', subject: 'db', difficulty: 4, question: 'What is an index in a database used for?', options: ['Encrypting data', 'Speeding up data retrieval', 'Storing backups', 'Enforcing foreign keys'], answer: 1 },
  { id: 'q13', subject: 'systemDesign', difficulty: 2, question: 'What is the main advantage of microservices architecture?', options: ['Easier to test as a whole', 'Shared single database', 'Independent deployability', 'Lower latency'], answer: 2 },
  { id: 'q14', subject: 'systemDesign', difficulty: 4, question: 'Which component distributes incoming network traffic across multiple servers?', options: ['CDN', 'Load Balancer', 'API Gateway', 'Message Queue'], answer: 1 },
  { id: 'q15', subject: 'systemDesign', difficulty: 5, question: 'What theorem states that a distributed system can only provide two out of Consistency, Availability, and Partition tolerance?', options: ['CAP Theorem', 'BASE Theorem', 'ACID Theorem', 'Paxos Theorem'], answer: 0 }
];

exports.getDiagnostic = async (req, res, next) => {
  try {
    // Send back questions without the answers
    const questions = DIAGNOSTIC_QUESTIONS.map(({ answer, explanation, ...q }) => q);
    
    res.status(200).json({
      success: true,
      questions,
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
    
    const processedAnswers = answers.map(ans => {
      const q = DIAGNOSTIC_QUESTIONS.find(q => q.id === ans.questionId);
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
      questions: DIAGNOSTIC_QUESTIONS,
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
