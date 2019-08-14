// ================================
const moment = require('moment');

// ================================

function Order(data) {

    const {
        index, Account, CheckOut,
        Time, CoinType, Amount, NewGameMoney,
        TotalBet, TotalWin
    } = data;

    //	Type: String
    const uid = String(index);

    //	Type: String
    const userID = Account.replace('ulg:', '');

    //	Type: String
    const state = CheckOut ? 'checkout' : 'exchange';

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

    return {
        uid,
        userID,
        state,

        exchange,

        checkout,
    };
}

module.exports = Order;
