const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get todos
// @route   GET /api/todos
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Set todo
// @route   POST /api/todos
// @access  Private
router.post('/', protect, async (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ message: 'Please add a title' });
    }

    try {
        const todo = await Todo.create({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            priority: req.body.priority,
            dueDate: req.body.dueDate,
            playlist: req.body.playlist,
            user: req.user.id,
        });

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the todo user
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the todo user
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await todo.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
