const express = require('express');
const { protect } = require('../middleware/auth');
const { sendMessage, getHistory } = require('../controllers/chatController');

const router = express.Router();

router.use(protect);

router.post('/message', sendMessage);
router.get('/history', getHistory);

module.exports = router;
