const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getPath, updateProgress } = require('../controllers/learningController');

const router = express.Router();

router.use(protect);

router.get('/path', getPath);

router.post('/progress', [
  body('topicId').notEmpty(),
  body('status').isIn(['in_progress', 'completed']),
  validate
], updateProgress);

module.exports = router;
