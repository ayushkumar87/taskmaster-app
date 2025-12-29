const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    },
    dueDate: {
        type: Date,
    },
    playlist: {
        link: { type: String, default: '' },
        totalVideos: { type: Number, default: 0 },
        watchedVideos: { type: Number, default: 0 }
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Todo', todoSchema);
