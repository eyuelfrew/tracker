const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 500
    },
    category: {
        type: String,
        enum: ['health', 'productivity', 'mindfulness', 'fitness', 'learning', 'discipline', 'other'],
        default: 'other'
    },
    icon: {
        type: String,
        default: '🎯'
    },
    color: {
        type: String,
        default: '#3B82F6'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily'
    },
    targetValue: {
        type: Number,
        default: 1
    },
    unit: {
        type: String,
        default: 'times'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    completedDates: [{
        date: {
            type: Date,
            required: true
        },
        value: {
            type: Number,
            default: 1
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Habit', habitSchema);