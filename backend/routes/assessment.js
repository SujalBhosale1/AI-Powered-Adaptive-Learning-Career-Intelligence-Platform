const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getDiagnostic, submitAssessment, getHistory, generateQuiz, analyzePerformance, getInterestQuestions } = require('../controllers/assessmentController');

const router = express.Router();

router.use(protect);

router.get('/diagnostic', getDiagnostic);
router.get('/interest-questions', getInterestQuestions);
router.post('/generate', generateQuiz);
router.post('/analyze', analyzePerformance);

router.post('/submit', [
  body('answers').isArray().withMessage('Answers must be an array'),
  validate
], submitAssessment);

router.get('/history', getHistory);

module.exports = router;
