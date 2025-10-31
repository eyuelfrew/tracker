const express = require('express');
const Joi = require('joi');
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const habitSchema = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).optional(),
    category: Joi.string().valid('health', 'productivity', 'mindfulness', 'fitness', 'learning', 'discipline', 'other').default('other'),
    icon: Joi.string().default('🎯'),
    color: Joi.string().default('#3B82F6'),
    frequency: Joi.string().valid('daily', 'weekly', 'monthly').default('daily'),
    targetValue: Joi.number().min(1).default(1),
    unit: Joi.string().default('times')
});

const completeHabitSchema = Joi.object({
    value: Joi.number().min(0).default(1)
});

// @route   GET /api/habits
// @desc    Get all habits for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.json(habits);
    } catch (error) {
        console.error('Get habits error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/habits
// @desc    Create new habit
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { error } = habitSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const habit = new Habit({
            ...req.body,
            userId: req.user._id
        });

        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        console.error('Create habit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/habits/:id
// @desc    Update habit
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { error } = habitSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        Object.assign(habit, req.body);
        await habit.save();

        res.json(habit);
    } catch (error) {
        console.error('Update habit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/habits/:id/complete
// @desc    Mark habit as completed for today
// @access  Private
router.post('/:id/complete', auth, async (req, res) => {
    try {
        const { error } = completeHabitSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already completed today
        const existingEntry = habit.completedDates.find(entry => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === today.getTime();
        });

        if (existingEntry) {
            return res.status(400).json({ message: 'Habit already completed today' });
        }

        // Add completion entry
        habit.completedDates.push({
            date: new Date(),
            value: req.body.value || 1
        });

        // Update streak
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const completedYesterday = habit.completedDates.some(entry => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() === yesterday.getTime();
        });

        if (completedYesterday || habit.currentStreak === 0) {
            habit.currentStreak += 1;
        } else {
            habit.currentStreak = 1;
        }

        // Update longest streak
        if (habit.currentStreak > habit.longestStreak) {
            habit.longestStreak = habit.currentStreak;
        }

        await habit.save();
        res.json(habit);
    } catch (error) {
        console.error('Complete habit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/habits/:id/complete
// @desc    Unmark habit completion for today
// @access  Private
router.delete('/:id/complete', auth, async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Remove today's completion
        habit.completedDates = habit.completedDates.filter(entry => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            return entryDate.getTime() !== today.getTime();
        });

        // Recalculate current streak
        let currentStreak = 0;
        const sortedDates = habit.completedDates
            .map(entry => new Date(entry.date))
            .sort((a, b) => b.getTime() - a.getTime());

        if (sortedDates.length > 0) {
            const mostRecent = new Date(sortedDates[0]);
            mostRecent.setHours(0, 0, 0, 0);

            let checkDate = new Date();
            checkDate.setDate(checkDate.getDate() - 1); // Start from yesterday
            checkDate.setHours(0, 0, 0, 0);

            for (const completedDate of sortedDates) {
                const completed = new Date(completedDate);
                completed.setHours(0, 0, 0, 0);

                if (completed.getTime() === checkDate.getTime()) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }

        habit.currentStreak = currentStreak;
        await habit.save();

        res.json(habit);
    } catch (error) {
        console.error('Uncomplete habit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/habits/:id
// @desc    Delete habit
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const habit = await Habit.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        await Habit.deleteOne({ _id: req.params.id });
        res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        console.error('Delete habit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/habits/stats
// @desc    Get habit statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user._id });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = {
            totalHabits: habits.length,
            activeHabits: habits.filter(h => h.isActive).length,
            completedToday: habits.filter(habit =>
                habit.completedDates.some(entry => {
                    const entryDate = new Date(entry.date);
                    entryDate.setHours(0, 0, 0, 0);
                    return entryDate.getTime() === today.getTime();
                })
            ).length,
            longestStreak: Math.max(...habits.map(h => h.longestStreak), 0),
            averageStreak: habits.length > 0
                ? Math.round(habits.reduce((sum, h) => sum + h.currentStreak, 0) / habits.length)
                : 0
        };

        res.json(stats);
    } catch (error) {
        console.error('Get habit stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;