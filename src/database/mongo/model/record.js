// ================================
const mongoose = require('mongoose');

// ================================
const RoundSchema = new mongoose.Schema({
    scores: {
        type: Number,
        min: 0,
    },
    result: [Number],
});

const RecordSchema = new mongoose.Schema({

    uid: {
        type: String,

        index: true,
        unique: true,
        required: true,

        trim: true,
        lowercase: true,
    },

    userID: {
        type: String,

        required: true,

        trim: true,
        lowercase: true,
    },

    date: {
        type: String,

        required: true,

        trim: true,
        lowercase: true,
    },

    time: {
        type: Date,
        required: true,
    },

    totalScores: {
        type: Number,
        required: true,
    },

    bet: {
        type: Number,
        required: true,
    },

    normalGame: RoundSchema,

    featureGame: {
        reSpin: [RoundSchema],
        freeGame: [RoundSchema]
    }
});

// ================================
const Record = mongoose.model('Record', RecordSchema);

// ================================
module.exports = Record;
