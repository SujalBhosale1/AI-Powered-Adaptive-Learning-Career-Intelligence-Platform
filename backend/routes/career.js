const express = require('express');
const { protect } = require('../middleware/auth');
const { suggestCareers, getGapAnalysis, getFlowchart } = require('../controllers/careerController');

const router = express.Router();

router.use(protect);

router.get('/suggest', suggestCareers);
router.get('/gap-analysis', getGapAnalysis);
router.get('/flowchart', getFlowchart);

module.exports = router;
