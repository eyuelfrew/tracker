const express = require('express');
const Joi = require('joi');
const Journal = require('../models/Journal');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const journalSchema = Joi.object({
    title: Joi.string().max(200).optional(),
    content: Joi.string().min(1).max(5000).required(),
    mood: Joi.string().valid('amazing', 'great', 'good', 'okay', 'tired', 'stressed', 'sad', 'angry').required(),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    gratitude: Joi.array().items(Joi.string().max(200)).optional(),
    goals: Joi.array().items(Joi.string().max(200)).optional(),
    isPrivate: Joi.boolean().default(true)
});

// @route   GET /api/journal/stats
// @desc    Get journal statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const entries = await Journal.find({ userId: req.user._id });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thisWeek = new Date();
        thisWeek.setDate(thisWeek.getDate() - 7);

        const thisMonth = new Date();
        thisMonth.setMonth(thisMonth.getMonth() - 1);

        // Calculate writing streak
        let currentStreak = 0;
        const sortedEntries = entries
            .map(entry => new Date(entry.createdAt))
            .sort((a, b) => b.getTime() - a.getTime());

        if (sortedEntries.length > 0) {
            let checkDate = new Date();
            checkDate.setHours(0, 0, 0, 0);

            for (let i = 0; i < sortedEntries.length; i++) {
                const entryDate = new Date(sortedEntries[i]);
                entryDate.setHours(0, 0, 0, 0);

                if (entryDate.getTime() === checkDate.getTime()) {
                    currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else if (entryDate.getTime() < checkDate.getTime()) {
                    break;
                }
            }
        }

        // Mood analysis
        const moodCounts = entries.reduce((acc, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc;
        }, {});

        const mostCommonMood = Object.keys(moodCounts).reduce((a, b) =>
            moodCounts[a] > moodCounts[b] ? a : b, 'good'
        );

        const stats = {
            totalEntries: entries.length,
            entriesThisWeek: entries.filter(entry =>
                new Date(entry.createdAt) >= thisWeek
            ).length,
            entriesThisMonth: entries.filter(entry =>
                new Date(entry.createdAt) >= thisMonth
            ).length,
            currentStreak,
            mostCommonMood,
            moodDistribution: moodCounts,
            averageWordsPerEntry: entries.length > 0
                ? Math.round(entries.reduce((sum, entry) =>
                    sum + entry.content.split(' ').length, 0) / entries.length)
                : 0
        };

        res.json(stats);
    } catch (error) {
        console.error('Get journal stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/journal
// @desc    Get all journal entries for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const entries = await Journal.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Journal.countDocuments({ userId: req.user._id });

        res.json({
            entries,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get journal entries error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/journal/:id
// @desc    Get single journal entry
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const entry = await Journal.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!entry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }

        res.json(entry);
    } catch (error) {
        console.error('Get journal entry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/journal
// @desc    Create new journal entry
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { error } = journalSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const entry = new Journal({
            ...req.body,
            userId: req.user._id
        });

        await entry.save();
        res.status(201).json(entry);
    } catch (error) {
        console.error('Create journal entry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/journal/:id
// @desc    Update journal entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { error } = journalSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const entry = await Journal.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!entry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }

        Object.assign(entry, req.body);
        await entry.save();

        res.json(entry);
    } catch (error) {
        console.error('Update journal entry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/journal/:id
// @desc    Delete journal entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const entry = await Journal.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!entry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }

        await Journal.deleteOne({ _id: req.params.id });
        res.json({ message: 'Journal entry deleted successfully' });
    } catch (error) {
        console.error('Delete journal entry error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;