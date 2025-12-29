const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/authMiddleware');

// Public route - anyone can submit feedback
router.post('/', submitFeedback);

// Protected route - get all feedback (optional: add admin middleware)
router.get('/', protect, getAllFeedback);

module.exports = router;
