const Feedback = require('../models/Feedback');

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
const submitFeedback = async (req, res) => {
    try {
        const { name, email, rating, category, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                message: 'Please provide name, email, and feedback message'
            });
        }

        // Create feedback
        const feedback = await Feedback.create({
            name,
            email,
            rating: rating || 5,
            category: category || 'General Feedback',
            message,
            userId: req.user?._id // Optional: if user is authenticated
        });

        res.status(201).json({
            success: true,
            message: 'Thank you for your feedback! We appreciate your input.',
            feedback: {
                id: feedback._id,
                name: feedback.name,
                rating: feedback.rating,
                category: feedback.category,
                createdAt: feedback.createdAt
            }
        });
    } catch (error) {
        console.error('Feedback submission error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        res.status(500).json({
            message: 'Failed to submit feedback. Please try again later.'
        });
    }
};

// @desc    Get all feedback (admin only)
// @route   GET /api/feedback
// @access  Private/Admin
const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');

        res.status(200).json({
            success: true,
            count: feedback.length,
            feedback
        });
    } catch (error) {
        console.error('Get feedback error:', error);
        res.status(500).json({
            message: 'Failed to retrieve feedback'
        });
    }
};

module.exports = {
    submitFeedback,
    getAllFeedback
};
