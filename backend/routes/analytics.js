const express = require('express');
const { protect } = require('../middleware/auth');
const { getDashboardData } = require('../controllers/analyticsController');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardData);

module.exports = router;
