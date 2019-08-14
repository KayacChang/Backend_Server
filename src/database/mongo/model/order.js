// ================================
const mongoose = require('mongoose');

// ================================

const CheckoutSchema = new mongoose.Schema({
    totalBet: {
        type: Number,

        required: true,
        min: 0,
    },

    totalWin: {
        type: Number,

        required: true,
        min: 0,
    },
});

const ExchangeSchema = new mongoose.Schema({
    time: {
        type: Date,

        required: true,
    },

    currency: {
        type: Number,

        required: true,
    },

    amount: {
        type: Number,

        required: true,
        min: 0,
    },

    balance: {
        type: Number,

        required: true,
        min: 0,
    },
});

const OrderSchema = new mongoose.Schema({
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

    state: {
        type: String,

        required: true,

        trim: true,
        lowercase: true,
    },

    exchange: ExchangeSchema,

    checkout: CheckoutSchema,
});

// ================================
const Order = mongoose.model('Order', OrderSchema);

// ================================
module.exports = Order;
