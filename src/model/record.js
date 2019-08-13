// ================================
const moment = require('moment');

// ================================
function Round({scores, plate}) {
    //  type: Number
    scores = Number(scores);

    //  type: Number[]
    const result = plate.map(Number);

    return {scores, result};
}

function Record(data) {

    const {
        index, Account, Time, Msg, IValue1, IValue2, date
    } = data;

    //  type: String
    const uid = date + index;

    //  type: String
    const userID = Account.replace('ulg:', '');

    //  type: Date
    const time = moment.unix(Time).toDate();

    //  type: Number
    const totalScores = Number(IValue1);

    //  type: Number
    const bet = Number(IValue2);

    let {
        normalresult, respin, freegame
    } = JSON.parse(Msg);

    if (respin && !Array.isArray(respin)) respin = [respin];

    //  type: Round
    const normalGame = Round(normalresult);

    const featureGame = {
        //  type: Round
        respin: (respin) && respin.map(Round),

        //  type: Round[]
        freegame: (freegame) && freegame.map(Round)
    };

    return {
        uid,

        userID,

        date,
        time,

        bet,
        totalScores,

        normalGame,
        featureGame,
    };
}

module.exports = Record;
