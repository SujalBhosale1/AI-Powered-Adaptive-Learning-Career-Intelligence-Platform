const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { setupProfile, updateProfile, getProfile } = require('../controllers/userController');

const router = express.Router();

// All user routes are protected
router.use(protect);

router.post('/setup', [
  body('branch').trim().notEmpty(),
  body('year').isInt({ min: 1, max: 5 }),
  validate
], setupProfile);

router.put('/profile', updateProfile);

router.get('/profile', getProfile);

module.exports = router;
