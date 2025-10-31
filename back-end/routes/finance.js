const express = require('express');
const Joi = require('joi');
const Finance = require('../models/Finance');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const financeSchema = Joi.object({
    type: Joi.string().valid('income', 'expense').required(),
    amount: Joi.number().min(0).required(),
    category: Joi.string().min(1).required(),
    subcategory: Joi.string().optional(),
    description: Joi.string().max(500).optional(),
    date: Joi.date().default(Date.now),
    paymentMethod: Joi.string().valid('cash', 'card', 'bank_transfer', 'digital_wallet', 'other').default('other'),
    isRecurring: Joi.boolean().default(false),
    recurringFrequency: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').when('isRecurring', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    tags: Joi.array().items(Joi.string().trim()).optional()
});

// @route   GET /api/finance
// @desc    Get all finance records for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const { type, category, startDate, endDate } = req.query;

        // Build filter
        const filter = { userId: req.user._id };

        if (type) filter.type = type;
        if (category) filter.category = new RegExp(category, 'i');

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const records = await Finance.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Finance.countDocuments(filter);

        res.json({
            records,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get finance records error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/finance/:id
// @desc    Get single finance record
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const record = await Finance.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!record) {
            return res.status(404).json({ message: 'Finance record not found' });
        }

        res.json(record);
    } catch (error) {
        console.error('Get finance record error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/finance
// @desc    Create new finance record
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { error } = financeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const record = new Finance({
            ...req.body,
            userId: req.user._id
        });

        await record.save();
        res.status(201).json(record);
    } catch (error) {
        console.error('Create finance record error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/finance/:id
// @desc    Update finance record
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { error } = financeSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const record = await Finance.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!record) {
            return res.status(404).json({ message: 'Finance record not found' });
        }

        Object.assign(record, req.body);
        await record.save();

        res.json(record);
    } catch (error) {
        console.error('Update finance record error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/finance/:id
// @desc    Delete finance record
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const record = await Finance.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!record) {
            return res.status(404).json({ message: 'Finance record not found' });
        }

        await Finance.deleteOne({ _id: req.params.id });
        res.json({ message: 'Finance record deleted successfully' });
    } catch (error) {
        console.error('Delete finance record error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/finance/stats
// @desc    Get finance statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1);
        }

        const records = await Finance.find({
            userId: req.user._id,
            date: { $gte: startDate, $lte: now }
        });

        // Calculate totals
        const income = records
            .filter(r => r.type === 'income')
            .reduce((sum, r) => sum + r.amount, 0);

        const expenses = records
            .filter(r => r.type === 'expense')
            .reduce((sum, r) => sum + r.amount, 0);

        // Category breakdown
        const categoryBreakdown = records.reduce((acc, record) => {
            const key = `${record.type}_${record.category}`;
            acc[key] = (acc[key] || 0) + record.amount;
            return acc;
        }, {});

        // Monthly trend (last 6 months)
        const monthlyTrend = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date();
            monthStart.setMonth(monthStart.getMonth() - i);
            monthStart.setDate(1);
            monthStart.setHours(0, 0, 0, 0);

            const monthEnd = new Date(monthStart);
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0);
            monthEnd.setHours(23, 59, 59, 999);

            const monthRecords = await Finance.find({
                userId: req.user._id,
                date: { $gte: monthStart, $lte: monthEnd }
            });

            const monthIncome = monthRecords
                .filter(r => r.type === 'income')
                .reduce((sum, r) => sum + r.amount, 0);

            const monthExpenses = monthRecords
                .filter(r => r.type === 'expense')
                .reduce((sum, r) => sum + r.amount, 0);

            monthlyTrend.push({
                month: monthStart.toISOString().slice(0, 7), // YYYY-MM format
                income: monthIncome,
                expenses: monthExpenses,
                savings: monthIncome - monthExpenses
            });
        }

        const stats = {
            period,
            totalIncome: income,
            totalExpenses: expenses,
            netSavings: income - expenses,
            savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0,
            transactionCount: records.length,
            categoryBreakdown,
            monthlyTrend,
            topExpenseCategories: Object.entries(categoryBreakdown)
                .filter(([key]) => key.startsWith('expense_'))
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([key, amount]) => ({
                    category: key.replace('expense_', ''),
                    amount
                }))
        };

        res.json(stats);
    } catch (error) {
        console.error('Get finance stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/finance/categories
// @desc    Get expense categories with totals
// @access  Private
router.get('/categories', auth, async (req, res) => {
    try {
        const { period = 'month' } = req.query;

        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1);
        }

        const categories = await Finance.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: { $gte: startDate, $lte: now }
                }
            },
            {
                $group: {
                    _id: { type: '$type', category: '$category' },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        res.json(categories);
    } catch (error) {
        console.error('Get finance categories error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;