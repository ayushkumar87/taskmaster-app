const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        default: 5
    },
    category: {
        type: String,
        enum: ['Bug Report', 'Feature Request', 'General Feedback', 'Other'],
        default: 'General Feedback'
    },
    message: {
        type: String,
        required: [true, 'Feedback message is required'],
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
