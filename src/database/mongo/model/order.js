// ================================
const mongoose = require('mongoose');

// ================================
function Order(data) {

    const exchange = {
        //	Type: Date
        time: moment.unix(Time).toDate(),

        //	Type: Number
        currency: Number(CoinType),

        //	Type: Number
        amount: Number(Amount),

        //	Type: Number
        balance: Number(NewGameMoney),
    };

    const checkout = {

        //	Type: Number
        totalBet: Number(TotalBet),

        //	Type: Number
        totalWin: Number(TotalWin),
    };


}

const ExchangeSchema = new mongoose.Schema({
    
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

    exchange,

    checkout,
});

// ================================
const Order = mongoose.model('Order', OrderSchema);

// ================================
module.exports = Order;
