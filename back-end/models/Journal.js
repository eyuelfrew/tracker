const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000
    },
    mood: {
        type: String,
        enum: ['amazing', 'great', 'good', 'okay', 'tired', 'stressed', 'sad', 'angry'],
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    gratitude: [{
        type: String,
        trim: true,
        maxlength: 200
    }],
    goals: [{
        type: String,
        trim: true,
        maxlength: 200
    }],
    isPrivate: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Journal', journalSchema);